"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInterfaceFields = void 0;
var E = require("../Errors");
var graphql_1 = require("graphql");
var DiagnosticError_1 = require("../utils/DiagnosticError");
var Result_1 = require("../utils/Result");
var InterfaceGraph_1 = require("../InterfaceGraph");
var helpers_1 = require("../utils/helpers");
var metadataDirectives_1 = require("../metadataDirectives");
var Extractor_1 = require("../Extractor");
/**
 * Grats allows you to define GraphQL fields on TypeScript interfaces using
 * function syntax. This allows you to define a shared implementation for
 * all types that implement the interface.
 *
 * This transform takes those abstract field definitions, and adds them to
 * the concrete types that implement the interface.
 */
function addInterfaceFields(ctx, docs) {
    var e_1, _a;
    var newDocs = [];
    var errors = [];
    var interfaceGraph = (0, InterfaceGraph_1.computeInterfaceMap)(ctx, docs);
    try {
        for (var docs_1 = __values(docs), docs_1_1 = docs_1.next(); !docs_1_1.done; docs_1_1 = docs_1.next()) {
            var doc = docs_1_1.value;
            if (doc.kind === "AbstractFieldDefinition") {
                var abstractDocResults = addAbstractFieldDefinition(ctx, doc, interfaceGraph);
                if (abstractDocResults.kind === "ERROR") {
                    (0, helpers_1.extend)(errors, abstractDocResults.err);
                }
                else {
                    (0, helpers_1.extend)(newDocs, abstractDocResults.value);
                }
            }
            else {
                newDocs.push(doc);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (docs_1_1 && !docs_1_1.done && (_a = docs_1.return)) _a.call(docs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (errors.length > 0) {
        return (0, Result_1.err)(errors);
    }
    return (0, Result_1.ok)(newDocs);
}
exports.addInterfaceFields = addInterfaceFields;
// A field definition may be on a concrete type, or on an interface. If it's on an interface,
// we need to add it to each concrete type that implements the interface.
function addAbstractFieldDefinition(ctx, doc, interfaceGraph) {
    var e_2, _a;
    var _b;
    var newDocs = [];
    var definitionResult = ctx.getNameDefinition(doc.onType);
    if (definitionResult.kind === "ERROR") {
        return definitionResult;
    }
    var nameDefinition = definitionResult.value;
    switch (nameDefinition.kind) {
        case "TYPE":
            // Extending a type, is just adding a field to it.
            newDocs.push({
                kind: graphql_1.Kind.OBJECT_TYPE_EXTENSION,
                name: doc.onType,
                fields: [doc.field],
                loc: doc.loc,
            });
            break;
        case "INTERFACE": {
            // Extending an interface is a bit more complicated. We need to add the field
            // to the interface, and to each type that implements the interface.
            // The interface field definition is not executable, so we don't
            // need to annotate it with the details of the implementation.
            var directives = (_b = doc.field.directives) === null || _b === void 0 ? void 0 : _b.filter(function (directive) {
                return directive.name.value !== metadataDirectives_1.EXPORTED_DIRECTIVE;
            });
            newDocs.push({
                kind: graphql_1.Kind.INTERFACE_TYPE_EXTENSION,
                name: doc.onType,
                fields: [__assign(__assign({}, doc.field), { directives: directives })],
            });
            try {
                for (var _c = __values(interfaceGraph.get(nameDefinition.name.value)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var implementor = _d.value;
                    var name = {
                        kind: graphql_1.Kind.NAME,
                        value: implementor.name,
                        loc: doc.loc, // Bit of a lie, but I don't see a better option.
                    };
                    switch (implementor.kind) {
                        case "TYPE":
                            newDocs.push({
                                kind: graphql_1.Kind.OBJECT_TYPE_EXTENSION,
                                name: name,
                                fields: [doc.field],
                                loc: doc.loc,
                            });
                            break;
                        case "INTERFACE":
                            newDocs.push({
                                kind: graphql_1.Kind.INTERFACE_TYPE_EXTENSION,
                                name: name,
                                fields: [__assign(__assign({}, doc.field), { directives: directives })],
                                loc: doc.loc,
                            });
                            break;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            break;
        }
        default: {
            // Extending any other type of definition is not supported.
            var loc = doc.onType.loc;
            if (loc == null) {
                throw new Error("Expected onType to have a location.");
            }
            var relatedLoc = nameDefinition.name.loc;
            if (relatedLoc == null) {
                throw new Error("Expected nameDefinition to have a location.");
            }
            return (0, Result_1.err)([
                (0, DiagnosticError_1.gqlErr)(loc, E.invalidTypePassedToFieldFunction(), [
                    (0, DiagnosticError_1.gqlRelated)(relatedLoc, "This is the type that was passed to `@".concat(Extractor_1.FIELD_TAG, "`.")),
                ]),
            ]);
        }
    }
    return (0, Result_1.ok)(newDocs);
}
