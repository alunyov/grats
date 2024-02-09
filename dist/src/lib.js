"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSchemaAndDoc = exports.buildSchemaAndDocResultWithHost = exports.buildSchemaAndDocResult = void 0;
var graphql_1 = require("graphql");
var DiagnosticError_1 = require("./utils/DiagnosticError");
var Result_1 = require("./utils/Result");
var Result_2 = require("./utils/Result");
var ts = require("typescript");
var TypeContext_1 = require("./TypeContext");
var validate_1 = require("graphql/validation/validate");
var validateTypenames_1 = require("./validations/validateTypenames");
var snapshotsFromProgram_1 = require("./transforms/snapshotsFromProgram");
var validateMergedInterfaces_1 = require("./validations/validateMergedInterfaces");
var validateContextReferences_1 = require("./validations/validateContextReferences");
var metadataDirectives_1 = require("./metadataDirectives");
var addInterfaceFields_1 = require("./transforms/addInterfaceFields");
var filterNonGqlInterfaces_1 = require("./transforms/filterNonGqlInterfaces");
var resolveTypes_1 = require("./transforms/resolveTypes");
var validateAsyncIterable_1 = require("./validations/validateAsyncIterable");
var applyDefaultNullability_1 = require("./transforms/applyDefaultNullability");
var mergeExtensions_1 = require("./transforms/mergeExtensions");
var sortSchemaAst_1 = require("./transforms/sortSchemaAst");
var validateSemanticNullability_1 = require("./validations/validateSemanticNullability");
// Construct a schema, using GraphQL schema language
// Exported for tests that want to intercept diagnostic errors.
function buildSchemaAndDocResult(options) {
    // https://stackoverflow.com/a/66604532/1263117
    var compilerHost = ts.createCompilerHost(options.options, 
    /* setParentNodes this is needed for finding jsDocs */
    true);
    return buildSchemaAndDocResultWithHost(options, compilerHost);
}
exports.buildSchemaAndDocResult = buildSchemaAndDocResult;
function buildSchemaAndDocResultWithHost(options, compilerHost) {
    var program = ts.createProgram(options.fileNames, options.options, compilerHost);
    return new Result_1.ResultPipe(extractSchemaAndDoc(options, program))
        .mapErr(function (e) { return new DiagnosticError_1.ReportableDiagnostics(compilerHost, e); })
        .result();
}
exports.buildSchemaAndDocResultWithHost = buildSchemaAndDocResultWithHost;
/**
 * The core transformation pipeline of Grats.
 */
function extractSchemaAndDoc(options, program) {
    return new Result_1.ResultPipe((0, snapshotsFromProgram_1.extractSnapshotsFromProgram)(program, options))
        .map(function (snapshots) { return combineSnapshots(snapshots); })
        .andThen(function (snapshot) {
        var typesWithTypename = snapshot.typesWithTypename;
        var config = options.raw.grats;
        var checker = program.getTypeChecker();
        var ctx = TypeContext_1.TypeContext.fromSnapshot(checker, snapshot);
        // Collect validation errors
        var validationResult = (0, Result_1.concatResults)((0, validateMergedInterfaces_1.validateMergedInterfaces)(checker, snapshot.interfaceDeclarations), (0, validateContextReferences_1.validateContextReferences)(ctx, snapshot.contextReferences));
        var docResult = new Result_1.ResultPipe(validationResult)
            // Add the metadata directive definitions to definitions
            // found in the snapshot.
            .map(function () { return (0, metadataDirectives_1.addMetadataDirectives)(snapshot.definitions); })
            // If you define a field on an interface using the functional style, we need to add
            // that field to each concrete type as well. This must be done after all types are created,
            // but before we validate the schema.
            .andThen(function (definitions) { return (0, addInterfaceFields_1.addInterfaceFields)(ctx, definitions); })
            // Convert the definitions into a DocumentNode
            .map(function (definitions) { return ({ kind: graphql_1.Kind.DOCUMENT, definitions: definitions }); })
            // Filter out any `implements` clauses that are not GraphQL interfaces.
            .map(function (doc) { return (0, filterNonGqlInterfaces_1.filterNonGqlInterfaces)(ctx, doc); })
            // Apply default nullability to fields and arguments, and detect any misuse of
            // `@killsParentOnException`.
            .andThen(function (doc) { return (0, applyDefaultNullability_1.applyDefaultNullability)(doc, config); })
            // Resolve TypeScript type references to the GraphQL types they represent (or error).
            .andThen(function (doc) { return (0, resolveTypes_1.resolveTypes)(ctx, doc); })
            // Ensure all subscription fields, and _only_ subscription fields, return an AsyncIterable.
            .andThen(function (doc) { return (0, validateAsyncIterable_1.validateAsyncIterable)(doc); })
            // Merge any `extend` definitions into their base definitions.
            .map(function (doc) { return (0, mergeExtensions_1.mergeExtensions)(doc); })
            // Sort the definitions in the document to ensure a stable output.
            .map(function (doc) { return (0, sortSchemaAst_1.sortSchemaAst)(doc); })
            .result();
        if (docResult.kind === "ERROR") {
            return docResult;
        }
        var doc = docResult.value;
        // Build and validate the schema with regards to the GraphQL spec.
        return (new Result_1.ResultPipe(buildSchemaFromDoc(doc))
            // Ensure that every type which implements an interface or is a member of a
            // union has a __typename field.
            .andThen(function (schema) { return (0, validateTypenames_1.validateTypenames)(schema, typesWithTypename); })
            .andThen(function (schema) { return (0, validateSemanticNullability_1.validateSemanticNullability)(schema, config); })
            // Combine the schema and document into a single result.
            .map(function (schema) { return ({ schema: schema, doc: doc }); })
            .result());
    })
        .result();
}
exports.extractSchemaAndDoc = extractSchemaAndDoc;
// Given a SDL AST, build and validate a GraphQLSchema.
function buildSchemaFromDoc(doc) {
    // TODO: Currently this does not detect definitions that shadow builtins
    // (`String`, `Int`, etc). However, if we pass a second param (extending an
    // existing schema) we do! So, we should find a way to validate that we don't
    // shadow builtins.
    var validationErrors = (0, validate_1.validateSDL)(doc);
    if (validationErrors.length > 0) {
        return (0, Result_2.err)(validationErrors.map(DiagnosticError_1.graphQlErrorToDiagnostic));
    }
    var schema = (0, graphql_1.buildASTSchema)(doc, { assumeValidSDL: true });
    var diagnostics = (0, graphql_1.validateSchema)(schema)
        // FIXME: Handle case where query is not defined (no location)
        .filter(function (e) { return e.source && e.locations && e.positions; });
    if (diagnostics.length > 0) {
        return (0, Result_2.err)(diagnostics.map(DiagnosticError_1.graphQlErrorToDiagnostic));
    }
    return (0, Result_2.ok)(schema);
}
// Given a list of snapshots, merge them into a single snapshot.
function combineSnapshots(snapshots) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f, e_7, _g;
    var result = {
        definitions: [],
        nameDefinitions: new Map(),
        unresolvedNames: new Map(),
        contextReferences: [],
        typesWithTypename: new Set(),
        interfaceDeclarations: [],
    };
    try {
        for (var snapshots_1 = __values(snapshots), snapshots_1_1 = snapshots_1.next(); !snapshots_1_1.done; snapshots_1_1 = snapshots_1.next()) {
            var snapshot = snapshots_1_1.value;
            try {
                for (var _h = (e_2 = void 0, __values(snapshot.definitions)), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var definition = _j.value;
                    result.definitions.push(definition);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                for (var _k = (e_3 = void 0, __values(snapshot.nameDefinitions)), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var _m = __read(_l.value, 2), node = _m[0], definition = _m[1];
                    result.nameDefinitions.set(node, definition);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var _o = (e_4 = void 0, __values(snapshot.unresolvedNames)), _p = _o.next(); !_p.done; _p = _o.next()) {
                    var _q = __read(_p.value, 2), node = _q[0], typeName = _q[1];
                    result.unresolvedNames.set(node, typeName);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_p && !_p.done && (_d = _o.return)) _d.call(_o);
                }
                finally { if (e_4) throw e_4.error; }
            }
            try {
                for (var _r = (e_5 = void 0, __values(snapshot.contextReferences)), _s = _r.next(); !_s.done; _s = _r.next()) {
                    var contextReference = _s.value;
                    result.contextReferences.push(contextReference);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_s && !_s.done && (_e = _r.return)) _e.call(_r);
                }
                finally { if (e_5) throw e_5.error; }
            }
            try {
                for (var _t = (e_6 = void 0, __values(snapshot.typesWithTypename)), _u = _t.next(); !_u.done; _u = _t.next()) {
                    var typeName = _u.value;
                    result.typesWithTypename.add(typeName);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_u && !_u.done && (_f = _t.return)) _f.call(_t);
                }
                finally { if (e_6) throw e_6.error; }
            }
            try {
                for (var _v = (e_7 = void 0, __values(snapshot.interfaceDeclarations)), _w = _v.next(); !_w.done; _w = _v.next()) {
                    var interfaceDeclaration = _w.value;
                    result.interfaceDeclarations.push(interfaceDeclaration);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_w && !_w.done && (_g = _v.return)) _g.call(_v);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (snapshots_1_1 && !snapshots_1_1.done && (_a = snapshots_1.return)) _a.call(snapshots_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
