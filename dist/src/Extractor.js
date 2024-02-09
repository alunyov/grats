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
exports.extract = exports.ALL_TAGS = exports.KILLS_PARENT_ON_EXCEPTION_TAG = exports.IMPLEMENTS_TAG_DEPRECATED = exports.INPUT_TAG = exports.UNION_TAG = exports.ENUM_TAG = exports.INTERFACE_TAG = exports.SCALAR_TAG = exports.FIELD_TAG = exports.TYPE_TAG = exports.LIBRARY_NAME = exports.LIBRARY_IMPORT_NAME = void 0;
var graphql_1 = require("graphql");
var DiagnosticError_1 = require("./utils/DiagnosticError");
var Result_1 = require("./utils/Result");
var ts = require("typescript");
var TypeContext_1 = require("./TypeContext");
var E = require("./Errors");
var JSDoc_1 = require("./utils/JSDoc");
var GraphQLConstructor_1 = require("./GraphQLConstructor");
var gratsRoot_1 = require("./gratsRoot");
var Errors_1 = require("./Errors");
var comments_1 = require("./comments");
var helpers_1 = require("./utils/helpers");
exports.LIBRARY_IMPORT_NAME = "grats";
exports.LIBRARY_NAME = "Grats";
exports.TYPE_TAG = "gqlType";
exports.FIELD_TAG = "gqlField";
exports.SCALAR_TAG = "gqlScalar";
exports.INTERFACE_TAG = "gqlInterface";
exports.ENUM_TAG = "gqlEnum";
exports.UNION_TAG = "gqlUnion";
exports.INPUT_TAG = "gqlInput";
exports.IMPLEMENTS_TAG_DEPRECATED = "gqlImplements";
exports.KILLS_PARENT_ON_EXCEPTION_TAG = "killsParentOnException";
// All the tags that start with gql
exports.ALL_TAGS = [
    exports.TYPE_TAG,
    exports.FIELD_TAG,
    exports.SCALAR_TAG,
    exports.INTERFACE_TAG,
    exports.ENUM_TAG,
    exports.UNION_TAG,
    exports.INPUT_TAG,
];
var DEPRECATED_TAG = "deprecated";
var OPERATION_TYPES = new Set(["Query", "Mutation", "Subscription"]);
/**
 * Extracts GraphQL definitions from TypeScript source code.
 *
 * Note that we extract a GraphQL AST with the AST nodes' location information
 * populated with references to the TypeScript code from which the types were
 * derived.
 *
 * This ensures that we can apply GraphQL schema validation rules, and any reported
 * errors will point to the correct location in the TypeScript source code.
 */
function extract(sourceFile) {
    var extractor = new Extractor();
    return extractor.extract(sourceFile);
}
exports.extract = extract;
var Extractor = /** @class */ (function () {
    function Extractor() {
        this.definitions = [];
        // Snapshot data
        this.unresolvedNames = new Map();
        this.nameDefinitions = new Map();
        this.contextReferences = [];
        this.typesWithTypename = new Set();
        this.interfaceDeclarations = [];
        this.errors = [];
        this.gql = new GraphQLConstructor_1.GraphQLConstructor();
    }
    Extractor.prototype.markUnresolvedType = function (node, name) {
        this.unresolvedNames.set(node, name);
    };
    Extractor.prototype.recordTypeName = function (node, name, kind) {
        this.nameDefinitions.set(node, { name: name, kind: kind });
    };
    // Traverse all nodes, checking each one for its JSDoc tags.
    // If we find a tag we recognize, we extract the relevant information,
    // reporting an error if it is attached to a node where that tag is not
    // supported.
    Extractor.prototype.extract = function (sourceFile) {
        var _this = this;
        var seenCommentPositions = new Set();
        (0, JSDoc_1.traverseJSDocTags)(sourceFile, function (node, tag) {
            var e_1, _a;
            seenCommentPositions.add(tag.parent.pos);
            switch (tag.tagName.text) {
                case exports.TYPE_TAG:
                    _this.extractType(node, tag);
                    break;
                case exports.SCALAR_TAG:
                    _this.extractScalar(node, tag);
                    break;
                case exports.INTERFACE_TAG:
                    _this.extractInterface(node, tag);
                    break;
                case exports.ENUM_TAG:
                    _this.extractEnum(node, tag);
                    break;
                case exports.INPUT_TAG:
                    _this.extractInput(node, tag);
                    break;
                case exports.UNION_TAG:
                    _this.extractUnion(node, tag);
                    break;
                case exports.FIELD_TAG:
                    if (ts.isFunctionDeclaration(node)) {
                        _this.functionDeclarationExtendType(node, tag);
                    }
                    else if (!(ts.isParameter(node) ||
                        ts.isMethodDeclaration(node) ||
                        ts.isGetAccessorDeclaration(node) ||
                        ts.isPropertyDeclaration(node) ||
                        ts.isMethodSignature(node) ||
                        ts.isPropertySignature(node))) {
                        // Right now this happens via deep traversal
                        // Note: Keep this in sync with `collectFields`
                        _this.reportUnhandled(node, "field", E.fieldTagOnWrongNode());
                    }
                    break;
                case exports.KILLS_PARENT_ON_EXCEPTION_TAG: {
                    var hasFieldTag = ts.getJSDocTags(node).some(function (t) {
                        return t.tagName.text === exports.FIELD_TAG;
                    });
                    if (!hasFieldTag) {
                        _this.report(tag.tagName, E.killsParentOnExceptionOnWrongNode());
                    }
                    // TODO: Report invalid location as well
                    break;
                }
                default:
                    {
                        var lowerCaseTag = tag.tagName.text.toLowerCase();
                        if (lowerCaseTag.startsWith("gql")) {
                            try {
                                for (var ALL_TAGS_1 = __values(exports.ALL_TAGS), ALL_TAGS_1_1 = ALL_TAGS_1.next(); !ALL_TAGS_1_1.done; ALL_TAGS_1_1 = ALL_TAGS_1.next()) {
                                    var t = ALL_TAGS_1_1.value;
                                    if (t.toLowerCase() === lowerCaseTag) {
                                        _this.report(tag.tagName, E.wrongCasingForGratsTag(tag.tagName.text, t));
                                        break;
                                    }
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (ALL_TAGS_1_1 && !ALL_TAGS_1_1.done && (_a = ALL_TAGS_1.return)) _a.call(ALL_TAGS_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            _this.report(tag.tagName, E.invalidGratsTag(tag.tagName.text));
                        }
                    }
                    break;
            }
        });
        var errors = (0, comments_1.detectInvalidComments)(sourceFile, seenCommentPositions);
        (0, helpers_1.extend)(this.errors, errors);
        if (this.errors.length > 0) {
            return (0, Result_1.err)(this.errors);
        }
        return (0, Result_1.ok)({
            definitions: this.definitions,
            unresolvedNames: this.unresolvedNames,
            nameDefinitions: this.nameDefinitions,
            contextReferences: this.contextReferences,
            typesWithTypename: this.typesWithTypename,
            interfaceDeclarations: this.interfaceDeclarations,
        });
    };
    Extractor.prototype.extractType = function (node, tag) {
        if (ts.isClassDeclaration(node)) {
            this.typeClassDeclaration(node, tag);
        }
        else if (ts.isInterfaceDeclaration(node)) {
            this.typeInterfaceDeclaration(node, tag);
        }
        else if (ts.isTypeAliasDeclaration(node)) {
            this.typeTypeAliasDeclaration(node, tag);
        }
        else {
            this.report(tag, E.invalidTypeTagUsage());
        }
    };
    Extractor.prototype.extractScalar = function (node, tag) {
        if (ts.isTypeAliasDeclaration(node)) {
            this.scalarTypeAliasDeclaration(node, tag);
        }
        else {
            this.report(tag, E.invalidScalarTagUsage());
        }
    };
    Extractor.prototype.extractInterface = function (node, tag) {
        if (ts.isInterfaceDeclaration(node)) {
            this.interfaceInterfaceDeclaration(node, tag);
        }
        else {
            this.report(tag, E.invalidInterfaceTagUsage());
        }
    };
    Extractor.prototype.extractEnum = function (node, tag) {
        if (ts.isEnumDeclaration(node)) {
            this.enumEnumDeclaration(node, tag);
        }
        else if (ts.isTypeAliasDeclaration(node)) {
            this.enumTypeAliasDeclaration(node, tag);
        }
        else {
            this.report(tag, E.invalidEnumTagUsage());
        }
    };
    Extractor.prototype.extractInput = function (node, tag) {
        if (ts.isTypeAliasDeclaration(node)) {
            this.inputTypeAliasDeclaration(node, tag);
            // TODO: Could we support interfaces?
        }
        else {
            this.report(tag, E.invalidInputTagUsage());
        }
    };
    Extractor.prototype.extractUnion = function (node, tag) {
        if (ts.isTypeAliasDeclaration(node)) {
            this.unionTypeAliasDeclaration(node, tag);
        }
        else {
            this.report(tag, E.invalidUnionTagUsage());
        }
    };
    /** Error handling and location juggling */
    Extractor.prototype.report = function (node, message, relatedInformation) {
        this.errors.push((0, DiagnosticError_1.tsErr)(node, message, relatedInformation));
        return null;
    };
    // Report an error that we don't know how to infer a type, but it's possible that we should.
    // Gives the user a path forward if they think we should be able to infer this type.
    Extractor.prototype.reportUnhandled = function (node, positionKind, message, relatedInformation) {
        var suggestion = "If you think ".concat(exports.LIBRARY_NAME, " should be able to infer this ").concat(positionKind, ", please report an issue at ").concat(Errors_1.ISSUE_URL, ".");
        var completedMessage = "".concat(message, "\n\n").concat(suggestion);
        return this.report(node, completedMessage, relatedInformation);
    };
    /** TypeScript traversals */
    Extractor.prototype.unionTypeAliasDeclaration = function (node, tag) {
        var e_2, _a;
        var name = this.entityName(node, tag);
        if (name == null)
            return null;
        if (!ts.isUnionTypeNode(node.type)) {
            return this.report(node, E.expectedUnionTypeNode());
        }
        var description = this.collectDescription(node);
        var types = [];
        try {
            for (var _b = __values(node.type.types), _c = _b.next(); !_c.done; _c = _b.next()) {
                var member = _c.value;
                if (!ts.isTypeReferenceNode(member)) {
                    return this.reportUnhandled(member, "union member", E.expectedUnionTypeReference());
                }
                var namedType = this.gql.namedType(member.typeName, TypeContext_1.UNRESOLVED_REFERENCE_NAME);
                this.markUnresolvedType(member.typeName, namedType.name);
                types.push(namedType);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.recordTypeName(node.name, name, "UNION");
        this.definitions.push(this.gql.unionTypeDefinition(node, name, types, description));
    };
    Extractor.prototype.functionDeclarationExtendType = function (node, tag) {
        var funcName = this.namedFunctionExportName(node);
        if (funcName == null)
            return null;
        var typeParam = node.parameters[0];
        if (typeParam == null) {
            return this.report(funcName, E.invalidParentArgForFunctionField());
        }
        var typeName = this.typeReferenceFromParam(typeParam);
        if (typeName == null)
            return null;
        var name = this.entityName(node, tag);
        if (name == null)
            return null;
        if (node.type == null) {
            return this.report(funcName, E.invalidReturnTypeForFunctionField());
        }
        var returnType = this.collectReturnType(node.type);
        if (returnType == null)
            return null;
        var type = returnType.type, isStream = returnType.isStream;
        var args = null;
        var argsParam = node.parameters[1];
        if (argsParam != null) {
            args = this.collectArgs(argsParam);
        }
        var context = node.parameters[2];
        if (context != null) {
            this.validateContextParameter(context);
        }
        var description = this.collectDescription(node);
        if (!ts.isSourceFile(node.parent)) {
            return this.report(node, E.functionFieldNotTopLevel());
        }
        // TODO: Does this work in the browser?
        var tsModulePath = (0, gratsRoot_1.relativePath)(node.getSourceFile().fileName);
        var directives = [
            this.gql.exportedDirective(funcName, {
                tsModulePath: tsModulePath,
                exportedFunctionName: funcName.text,
                argCount: node.parameters.length,
            }),
        ];
        if (isStream) {
            directives.push(this.gql.asyncIterableDirective(node.type));
        }
        var deprecated = this.collectDeprecated(node);
        if (deprecated != null) {
            directives.push(deprecated);
        }
        var killsParentOnExceptionDirective = this.killsParentOnExceptionDirective(node);
        if (killsParentOnExceptionDirective != null) {
            directives.push(killsParentOnExceptionDirective);
        }
        var field = this.gql.fieldDefinition(node, name, type, args, directives, description);
        this.definitions.push(this.gql.abstractFieldDefinition(node, typeName, field));
    };
    Extractor.prototype.typeReferenceFromParam = function (typeParam) {
        if (typeParam.type == null) {
            return this.report(typeParam, E.functionFieldParentTypeMissing());
        }
        if (!ts.isTypeReferenceNode(typeParam.type)) {
            return this.report(typeParam.type, E.functionFieldParentTypeNotValid());
        }
        var nameNode = typeParam.type.typeName;
        var typeName = this.gql.name(nameNode, TypeContext_1.UNRESOLVED_REFERENCE_NAME);
        this.markUnresolvedType(nameNode, typeName);
        return typeName;
    };
    Extractor.prototype.namedFunctionExportName = function (node) {
        var _a, _b;
        if (node.name == null) {
            return this.report(node, E.functionFieldNotNamed());
        }
        var exportKeyword = (_a = node.modifiers) === null || _a === void 0 ? void 0 : _a.some(function (modifier) {
            return modifier.kind === ts.SyntaxKind.ExportKeyword;
        });
        var defaultKeyword = (_b = node.modifiers) === null || _b === void 0 ? void 0 : _b.find(function (modifier) {
            return modifier.kind === ts.SyntaxKind.DefaultKeyword;
        });
        if (defaultKeyword != null) {
            // TODO: We could support this
            return this.report(defaultKeyword, E.functionFieldDefaultExport());
        }
        if (exportKeyword == null) {
            return this.report(node.name, E.functionFieldNotNamedExport());
        }
        return node.name;
    };
    Extractor.prototype.scalarTypeAliasDeclaration = function (node, tag) {
        var name = this.entityName(node, tag);
        if (name == null)
            return null;
        var description = this.collectDescription(node);
        this.recordTypeName(node.name, name, "SCALAR");
        this.definitions.push(this.gql.scalarTypeDefinition(node, name, description));
    };
    Extractor.prototype.inputTypeAliasDeclaration = function (node, tag) {
        var name = this.entityName(node, tag);
        if (name == null)
            return null;
        var description = this.collectDescription(node);
        this.recordTypeName(node.name, name, "INPUT_OBJECT");
        var fields = this.collectInputFields(node);
        var deprecatedDirective = this.collectDeprecated(node);
        this.definitions.push(this.gql.inputObjectTypeDefinition(node, name, fields, deprecatedDirective == null ? null : [deprecatedDirective], description));
    };
    Extractor.prototype.collectInputFields = function (node) {
        var e_3, _a;
        var fields = [];
        if (!ts.isTypeLiteralNode(node.type)) {
            return this.reportUnhandled(node, "input", E.inputTypeNotLiteral());
        }
        try {
            for (var _b = __values(node.type.members), _c = _b.next(); !_c.done; _c = _b.next()) {
                var member = _c.value;
                if (!ts.isPropertySignature(member)) {
                    this.reportUnhandled(member, "input field", E.inputTypeFieldNotProperty());
                    continue;
                }
                var field = this.collectInputField(member);
                if (field != null)
                    fields.push(field);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return fields.length === 0 ? null : fields;
    };
    Extractor.prototype.collectInputField = function (node) {
        var id = this.expectNameIdentifier(node.name);
        if (id == null)
            return null;
        if (node.type == null) {
            return this.report(node, E.inputFieldUntyped());
        }
        var inner = this.collectType(node.type);
        if (inner == null)
            return null;
        var type = node.questionToken == null ? inner : this.gql.nullableType(inner);
        var description = this.collectDescription(node);
        var deprecatedDirective = this.collectDeprecated(node);
        return this.gql.inputValueDefinition(node, this.gql.name(id, id.text), type, deprecatedDirective == null ? null : [deprecatedDirective], null, description);
    };
    Extractor.prototype.typeClassDeclaration = function (node, tag) {
        if (node.name == null) {
            return this.report(node, E.typeTagOnUnnamedClass());
        }
        var name = this.entityName(node, tag);
        if (name == null)
            return null;
        this.validateOperationTypes(node.name, name.value);
        var description = this.collectDescription(node);
        var fields = this.collectFields(node);
        var interfaces = this.collectInterfaces(node);
        this.recordTypeName(node.name, name, "TYPE");
        this.checkForTypenameProperty(node, name.value);
        this.definitions.push(this.gql.objectTypeDefinition(node, name, fields, interfaces, description));
    };
    Extractor.prototype.validateOperationTypes = function (node, name) {
        // TODO: If we start supporting defining operation types using
        // non-standard names, we will need to update this logic.
        if (OPERATION_TYPES.has(name)) {
            this.report(node, E.operationTypeNotUnknown());
        }
    };
    Extractor.prototype.typeInterfaceDeclaration = function (node, tag) {
        var name = this.entityName(node, tag);
        if (name == null)
            return null;
        this.validateOperationTypes(node.name, name.value);
        var description = this.collectDescription(node);
        var fields = this.collectFields(node);
        var interfaces = this.collectInterfaces(node);
        this.recordTypeName(node.name, name, "TYPE");
        this.checkForTypenameProperty(node, name.value);
        this.definitions.push(this.gql.objectTypeDefinition(node, name, fields, interfaces, description));
    };
    Extractor.prototype.typeTypeAliasDeclaration = function (node, tag) {
        var name = this.entityName(node, tag);
        if (name == null)
            return null;
        var fields = [];
        var interfaces = null;
        if (ts.isTypeLiteralNode(node.type)) {
            this.validateOperationTypes(node.type, name.value);
            fields = this.collectFields(node.type);
            interfaces = this.collectInterfaces(node);
            this.checkForTypenameProperty(node.type, name.value);
        }
        else if (node.type.kind === ts.SyntaxKind.UnknownKeyword) {
            // This is fine, we just don't know what it is. This should be the expected
            // case for operation types such as `Query`, `Mutation`, and `Subscription`
            // where there is not strong convention around.
        }
        else {
            return this.report(node.type, E.typeTagOnAliasOfNonObjectOrUnknown());
        }
        var description = this.collectDescription(node);
        this.recordTypeName(node.name, name, "TYPE");
        this.definitions.push(this.gql.objectTypeDefinition(node, name, fields, interfaces, description));
    };
    Extractor.prototype.checkForTypenameProperty = function (node, expectedName) {
        var _this = this;
        var hasTypename = node.members.some(function (member) {
            return _this.isValidTypeNameProperty(member, expectedName);
        });
        if (hasTypename) {
            this.typesWithTypename.add(expectedName);
        }
    };
    Extractor.prototype.isValidTypeNameProperty = function (member, expectedName) {
        if (member.name == null ||
            !ts.isIdentifier(member.name) ||
            member.name.text !== "__typename") {
            return false;
        }
        if (ts.isPropertyDeclaration(member)) {
            return this.isValidTypenamePropertyDeclaration(member, expectedName);
        }
        if (ts.isPropertySignature(member)) {
            return this.isValidTypenamePropertySignature(member, expectedName);
        }
        // TODO: Could show what kind we found, but TS AST does not have node names.
        this.report(member.name, E.typeNameNotDeclaration());
        return false;
    };
    Extractor.prototype.isValidTypenamePropertyDeclaration = function (node, expectedName) {
        // If we have a type annotation, we ask that it be a string literal.
        // That means, that if we have one, _and_ it's valid, we're done.
        // Otherwise we fall through to the initializer check.
        if (node.type != null) {
            return this.isValidTypenamePropertyType(node.type, expectedName);
        }
        if (node.initializer == null) {
            this.report(node.name, E.typeNameMissingInitializer());
            return false;
        }
        if (!ts.isStringLiteral(node.initializer)) {
            this.report(node.initializer, E.typeNameInitializeNotString());
            return false;
        }
        if (node.initializer.text !== expectedName) {
            this.report(node.initializer, E.typeNameInitializerWrong(expectedName, node.initializer.text));
            return false;
        }
        return true;
    };
    Extractor.prototype.isValidTypenamePropertySignature = function (node, expectedName) {
        if (node.type == null) {
            this.report(node, E.typeNameMissingTypeAnnotation(expectedName));
            return false;
        }
        return this.isValidTypenamePropertyType(node.type, expectedName);
    };
    Extractor.prototype.isValidTypenamePropertyType = function (node, expectedName) {
        if (!ts.isLiteralTypeNode(node) || !ts.isStringLiteral(node.literal)) {
            this.report(node, E.typeNameTypeNotStringLiteral(expectedName));
            return false;
        }
        if (node.literal.text !== expectedName) {
            this.report(node, E.typeNameDoesNotMatchExpected(expectedName));
            return false;
        }
        return true;
    };
    Extractor.prototype.collectInterfaces = function (node) {
        this.reportTagInterfaces(node);
        return ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)
            ? this.collectHeritageInterfaces(node)
            : null;
    };
    Extractor.prototype.reportTagInterfaces = function (node) {
        var tag = this.findTag(node, exports.IMPLEMENTS_TAG_DEPRECATED);
        if (tag == null)
            return null;
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            this.report(tag, E.implementsTagOnClass());
        }
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            this.report(tag, E.implementsTagOnInterface());
        }
        if (node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
            this.report(tag, E.implementsTagOnTypeAlias());
        }
    };
    Extractor.prototype.collectHeritageInterfaces = function (node) {
        var _this = this;
        if (node.heritageClauses == null)
            return null;
        var maybeInterfaces = node.heritageClauses
            .filter(function (clause) {
            if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                return clause.token === ts.SyntaxKind.ImplementsKeyword;
            }
            // Interfaces can only have extends clauses, and those are allowed.
            return true;
        })
            .flatMap(function (clause) {
            return clause.types
                .map(function (type) { return type.expression; })
                .filter(function (expression) { return ts.isIdentifier(expression); })
                .map(function (expression) {
                var namedType = _this.gql.namedType(expression, TypeContext_1.UNRESOLVED_REFERENCE_NAME);
                _this.markUnresolvedType(expression, namedType.name);
                return namedType;
            });
        });
        var interfaces = maybeInterfaces.filter(function (i) { return i != null; });
        if (interfaces.length === 0) {
            return null;
        }
        return interfaces;
    };
    Extractor.prototype.hasGqlTag = function (node) {
        return ts.getJSDocTags(node).some(function (tag) {
            return exports.ALL_TAGS.includes(tag.tagName.text);
        });
    };
    Extractor.prototype.interfaceInterfaceDeclaration = function (node, tag) {
        var name = this.entityName(node, tag);
        if (name == null || name.value == null) {
            return;
        }
        this.interfaceDeclarations.push(node);
        var description = this.collectDescription(node);
        var interfaces = this.collectInterfaces(node);
        var fields = this.collectFields(node);
        this.recordTypeName(node.name, name, "INTERFACE");
        this.definitions.push(this.gql.interfaceTypeDefinition(node, name, fields, interfaces, description));
    };
    Extractor.prototype.collectFields = function (node) {
        var _this = this;
        var fields = [];
        ts.forEachChild(node, function (node) {
            var e_4, _a;
            if (ts.isConstructorDeclaration(node)) {
                try {
                    // Handle parameter properties
                    // https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties
                    for (var _b = __values(node.parameters), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var param = _c.value;
                        var field = _this.constructorParam(param);
                        if (field != null) {
                            fields.push(field);
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
            if (ts.isMethodDeclaration(node) ||
                ts.isMethodSignature(node) ||
                ts.isGetAccessorDeclaration(node)) {
                var field = _this.methodDeclaration(node);
                if (field != null) {
                    fields.push(field);
                }
            }
            else if (ts.isPropertyDeclaration(node) ||
                ts.isPropertySignature(node)) {
                var field = _this.property(node);
                if (field) {
                    fields.push(field);
                }
            }
        });
        return fields;
    };
    Extractor.prototype.constructorParam = function (node) {
        var tag = this.findTag(node, exports.FIELD_TAG);
        if (tag == null)
            return null;
        if (node.modifiers == null) {
            return this.report(node, E.parameterWithoutModifiers());
        }
        var isParameterProperty = node.modifiers.some(function (modifier) {
            return modifier.kind === ts.SyntaxKind.PublicKeyword ||
                modifier.kind === ts.SyntaxKind.PrivateKeyword ||
                modifier.kind === ts.SyntaxKind.ProtectedKeyword ||
                modifier.kind === ts.SyntaxKind.ReadonlyKeyword;
        });
        if (!isParameterProperty) {
            return this.report(node, E.parameterWithoutModifiers());
        }
        var notPublic = node.modifiers.find(function (modifier) {
            return modifier.kind === ts.SyntaxKind.PrivateKeyword ||
                modifier.kind === ts.SyntaxKind.ProtectedKeyword;
        });
        if (notPublic != null) {
            return this.report(notPublic, E.parameterPropertyNotPublic());
        }
        var name = this.entityName(node, tag);
        if (name == null)
            return null;
        if (node.type == null) {
            return this.report(node, E.parameterPropertyMissingType());
        }
        var id = node.name;
        if (ts.isArrayBindingPattern(id) || ts.isObjectBindingPattern(id)) {
            // TypeScript triggers an error if a binding pattern is used for a
            // parameter property, so we don't need to report them.
            // https://www.typescriptlang.org/play?#code/MYGwhgzhAEBiD29oG8BQ1rHgOwgFwCcBXYPeAgCgAciAjEAS2BQDNEBfAShXdXaA
            return null;
        }
        var directives = [];
        if (id.text !== name.value) {
            directives = [
                this.gql.propertyNameDirective(node.name, {
                    name: id.text,
                    isMethod: false,
                }),
            ];
        }
        var type = this.collectType(node.type);
        if (type == null)
            return null;
        var deprecated = this.collectDeprecated(node);
        if (deprecated != null) {
            directives.push(deprecated);
        }
        var description = this.collectDescription(node);
        var killsParentOnExceptionDirective = this.killsParentOnExceptionDirective(node);
        if (killsParentOnExceptionDirective != null) {
            directives.push(killsParentOnExceptionDirective);
        }
        return this.gql.fieldDefinition(node, name, type, null, directives, description);
    };
    Extractor.prototype.collectArgs = function (argsParam) {
        var e_5, _a;
        var args = [];
        var argsType = argsParam.type;
        if (argsType == null) {
            return this.report(argsParam, E.argumentParamIsMissingType());
        }
        if (argsType.kind === ts.SyntaxKind.UnknownKeyword) {
            return [];
        }
        if (!ts.isTypeLiteralNode(argsType)) {
            return this.report(argsType, E.argumentParamIsNotObject());
        }
        var defaults = null;
        if (ts.isObjectBindingPattern(argsParam.name)) {
            defaults = this.collectArgDefaults(argsParam.name);
        }
        try {
            for (var _b = __values(argsType.members), _c = _b.next(); !_c.done; _c = _b.next()) {
                var member = _c.value;
                var arg = this.collectArg(member, defaults);
                if (arg != null) {
                    args.push(arg);
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return args;
    };
    Extractor.prototype.collectArgDefaults = function (node) {
        var e_6, _a;
        var defaults = new Map();
        try {
            for (var _b = __values(node.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var element = _c.value;
                if (ts.isBindingElement(element) &&
                    element.initializer &&
                    ts.isIdentifier(element.name)) {
                    defaults.set(element.name.text, element.initializer);
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return defaults;
    };
    Extractor.prototype.collectConstValue = function (node) {
        if (ts.isStringLiteral(node)) {
            return this.gql.string(node, node.text);
        }
        else if (ts.isNumericLiteral(node)) {
            return node.text.includes(".")
                ? this.gql.float(node, node.text)
                : this.gql.int(node, node.text);
        }
        else if (this.isNullish(node)) {
            return this.gql.null(node);
        }
        else if (node.kind === ts.SyntaxKind.TrueKeyword) {
            return this.gql.boolean(node, true);
        }
        else if (node.kind === ts.SyntaxKind.FalseKeyword) {
            return this.gql.boolean(node, false);
        }
        else if (ts.isObjectLiteralExpression(node)) {
            return this.collectObjectLiteral(node);
        }
        else if (ts.isArrayLiteralExpression(node)) {
            return this.collectArrayLiteral(node);
        }
        return this.reportUnhandled(node, "constant value", E.defaultValueIsNotLiteral());
    };
    Extractor.prototype.collectArrayLiteral = function (node) {
        var e_7, _a;
        var values = [];
        var errors = false;
        try {
            for (var _b = __values(node.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var element = _c.value;
                var value = this.collectConstValue(element);
                if (value == null) {
                    errors = true;
                }
                else {
                    values.push(value);
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        if (errors) {
            return null;
        }
        return this.gql.list(node, values);
    };
    Extractor.prototype.collectObjectLiteral = function (node) {
        var e_8, _a;
        var fields = [];
        var errors = false;
        try {
            for (var _b = __values(node.properties), _c = _b.next(); !_c.done; _c = _b.next()) {
                var property = _c.value;
                var field = this.collectObjectField(property);
                if (field == null) {
                    errors = true;
                }
                else {
                    fields.push(field);
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
        if (errors) {
            return null;
        }
        return this.gql.object(node, fields);
    };
    Extractor.prototype.collectObjectField = function (node) {
        if (!ts.isPropertyAssignment(node)) {
            return this.reportUnhandled(node, "constant value", E.defaultArgElementIsNotAssignment());
        }
        if (node.name == null) {
            return this.reportUnhandled(node, "field", E.defaultArgPropertyMissingName());
        }
        var name = this.expectNameIdentifier(node.name);
        if (name == null)
            return null;
        var initialize = node.initializer;
        if (initialize == null) {
            return this.report(node, E.defaultArgPropertyMissingInitializer());
        }
        var value = this.collectConstValue(initialize);
        if (value == null)
            return null;
        return this.gql.constObjectField(node, this.gql.name(node.name, name.text), value);
    };
    Extractor.prototype.collectArg = function (node, defaults) {
        if (!ts.isPropertySignature(node)) {
            // TODO: How can I create this error?
            return this.report(node, E.argIsNotProperty());
        }
        if (!ts.isIdentifier(node.name)) {
            // TODO: How can I create this error?
            return this.report(node.name, E.argNameNotLiteral());
        }
        if (node.type == null) {
            return this.report(node.name, E.argNotTyped());
        }
        var type = this.collectType(node.type);
        if (type == null)
            return null;
        if (type.kind !== graphql_1.Kind.NON_NULL_TYPE && !node.questionToken) {
            // If a field is passed an argument value, and that argument is not defined in the request,
            // `graphql-js` will not define the argument property. Therefore we must ensure the argument
            // is not just nullable, but optional.
            return this.report(node.name, E.expectedNullableArgumentToBeOptional());
        }
        if (node.questionToken) {
            // Question mark means we can handle the argument being undefined in the
            // object literal, but if we are going to type the GraphQL arg as
            // optional, the code must also be able to handle an explicit null.
            //
            // TODO: This will catch { a?: string } but not { a?: string | undefined }.
            if (type.kind === graphql_1.Kind.NON_NULL_TYPE) {
                return this.report(node.questionToken, E.nonNullTypeCannotBeOptional());
            }
            type = this.gql.nullableType(type);
        }
        var description = this.collectDescription(node);
        var defaultValue = null;
        if (defaults != null) {
            var def = defaults.get(node.name.text);
            if (def != null) {
                defaultValue = this.collectConstValue(def);
            }
        }
        var deprecatedDirective = this.collectDeprecated(node);
        return this.gql.inputValueDefinition(node, this.gql.name(node.name, node.name.text), type, deprecatedDirective == null ? null : [deprecatedDirective], defaultValue, description);
    };
    Extractor.prototype.enumEnumDeclaration = function (node, tag) {
        var name = this.entityName(node, tag);
        if (name == null || name.value == null) {
            return;
        }
        var description = this.collectDescription(node);
        var values = this.collectEnumValues(node);
        this.recordTypeName(node.name, name, "ENUM");
        this.definitions.push(this.gql.enumTypeDefinition(node, name, values, description));
    };
    Extractor.prototype.enumTypeAliasDeclaration = function (node, tag) {
        var name = this.entityName(node, tag);
        if (name == null || name.value == null) {
            return;
        }
        var values = this.enumTypeAliasVariants(node);
        if (values == null)
            return;
        var description = this.collectDescription(node);
        this.recordTypeName(node.name, name, "ENUM");
        this.definitions.push(this.gql.enumTypeDefinition(node, name, values, description));
    };
    Extractor.prototype.enumTypeAliasVariants = function (node) {
        var e_9, _a;
        // Semantically we only support deriving enums from type aliases that
        // are unions of string literals. However, in the edge case of a union
        // of one item, there is no way to construct a union type of one item in
        // TypeScript. So, we also support deriving enums from type aliases of a single
        // string literal.
        if (ts.isLiteralTypeNode(node.type) &&
            ts.isStringLiteral(node.type.literal)) {
            return [
                this.gql.enumValueDefinition(node, this.gql.name(node.type.literal, node.type.literal.text), undefined, null),
            ];
        }
        if (!ts.isUnionTypeNode(node.type)) {
            this.reportUnhandled(node.type, "union", E.enumTagOnInvalidNode());
            return null;
        }
        var values = [];
        try {
            for (var _b = __values(node.type.types), _c = _b.next(); !_c.done; _c = _b.next()) {
                var member = _c.value;
                if (!ts.isLiteralTypeNode(member) ||
                    !ts.isStringLiteral(member.literal)) {
                    this.reportUnhandled(member, "union member", E.enumVariantNotStringLiteral());
                    continue;
                }
                // TODO: Support descriptions on enum members. As it stands, TypeScript
                // does not allow comments attached to string literal types.
                values.push(this.gql.enumValueDefinition(node, this.gql.name(member.literal, member.literal.text), undefined, null));
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return values;
    };
    Extractor.prototype.collectEnumValues = function (node) {
        var e_10, _a;
        var values = [];
        try {
            for (var _b = __values(node.members), _c = _b.next(); !_c.done; _c = _b.next()) {
                var member = _c.value;
                if (member.initializer == null ||
                    !ts.isStringLiteral(member.initializer)) {
                    this.reportUnhandled(member, "enum value", E.enumVariantMissingInitializer());
                    continue;
                }
                var description = this.collectDescription(member);
                var deprecated = this.collectDeprecated(member);
                values.push(this.gql.enumValueDefinition(member, this.gql.name(member.initializer, member.initializer.text), deprecated ? [deprecated] : undefined, description));
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return values;
    };
    Extractor.prototype.entityName = function (node, tag) {
        if (tag.comment != null) {
            var commentName = ts.getTextOfJSDocComment(tag.comment);
            if (commentName != null) {
                // FIXME: Use the _value_'s location not the tag's
                var locNode = tag;
                // Test for leading newlines using the raw text
                var hasLeadingNewlines = /\n/.test(trimTrailingCommentLines(tag.getText()));
                var hasInternalWhitespace = /\s/.test(commentName);
                var validationMessage = graphQLNameValidationMessage(commentName);
                if (hasLeadingNewlines && validationMessage == null) {
                    // TODO: Offer quick fix.
                    return this.report(locNode, E.graphQLNameHasLeadingNewlines(commentName, tag.tagName.text));
                }
                if (hasLeadingNewlines || hasInternalWhitespace) {
                    return this.report(locNode, E.graphQLTagNameHasWhitespace(tag.tagName.text));
                }
                // No whitespace, but still invalid. We will assume they meant this to
                // be a GraphQL name but didn't provide a valid identifier.
                //
                // NOTE: We can't let GraphQL validation handle this, because it throws rather
                // than returning a validation message. Presumably because it expects token
                // validation to be done during lexing/parsing.
                if (validationMessage !== null) {
                    return this.report(locNode, validationMessage);
                }
                return this.gql.name(locNode, commentName);
            }
        }
        if (node.name == null) {
            return this.report(node, E.gqlEntityMissingName());
        }
        var id = this.expectNameIdentifier(node.name);
        if (id == null)
            return null;
        return this.gql.name(id, id.text);
    };
    // Ensure the type of the ctx param resolves to the declaration
    // annotated with `@gqlContext`.
    Extractor.prototype.validateContextParameter = function (node) {
        if (node.type == null) {
            return this.report(node, E.expectedTypeAnnotationOnContext());
        }
        if (node.type.kind === ts.SyntaxKind.UnknownKeyword) {
            // If the user just needs to define the argument to get to a later parameter,
            // they can use `ctx: unknown` to safely avoid triggering a Grats error.
            return;
        }
        if (!ts.isTypeReferenceNode(node.type)) {
            return this.report(node.type, E.expectedTypeAnnotationOfReferenceOnContext());
        }
        // Check for ...
        if (node.dotDotDotToken != null) {
            return this.report(node.dotDotDotToken, E.unexpectedParamSpreadForContextParam());
        }
        this.contextReferences.push(node.type.typeName);
    };
    Extractor.prototype.methodDeclaration = function (node) {
        var tag = this.findTag(node, exports.FIELD_TAG);
        if (tag == null)
            return null;
        var name = this.entityName(node, tag);
        if (name == null)
            return null;
        if (node.type == null) {
            return this.report(node.name, E.methodMissingType());
        }
        var returnType = this.collectReturnType(node.type);
        if (returnType == null)
            return null;
        var type = returnType.type, isStream = returnType.isStream;
        // We already reported an error
        if (type == null)
            return null;
        var args = null;
        var argsParam = node.parameters[0];
        if (argsParam != null) {
            args = this.collectArgs(argsParam);
        }
        var context = node.parameters[1];
        if (context != null) {
            this.validateContextParameter(context);
        }
        var description = this.collectDescription(node);
        var id = this.expectNameIdentifier(node.name);
        if (id == null)
            return null;
        var directives = [];
        directives = [
            this.gql.propertyNameDirective(node.name, {
                name: id.text,
                isMethod: isCallable(node),
            }),
        ];
        if (isStream) {
            directives.push(this.gql.asyncIterableDirective(node.type));
        }
        var deprecated = this.collectDeprecated(node);
        if (deprecated != null) {
            directives.push(deprecated);
        }
        var killsParentOnExceptionDirective = this.killsParentOnExceptionDirective(node);
        if (killsParentOnExceptionDirective != null) {
            directives.push(killsParentOnExceptionDirective);
        }
        return this.gql.fieldDefinition(node, name, type, args, directives, description);
    };
    Extractor.prototype.collectReturnType = function (node) {
        if (ts.isTypeReferenceNode(node)) {
            var identifier = this.expectNameIdentifier(node.typeName);
            if (identifier == null)
                return null;
            if (identifier.text == "AsyncIterable") {
                if (node.typeArguments == null || node.typeArguments.length === 0) {
                    // TODO: Better error?
                    return this.report(node, E.wrapperMissingTypeArg());
                }
                var t_1 = this.collectType(node.typeArguments[0]);
                if (t_1 == null)
                    return null;
                return { type: t_1, isStream: true };
            }
        }
        var inner = this.maybeUnwrapWrapper(node);
        if (inner == null)
            return null;
        var t = this.collectType(inner);
        if (t == null)
            return null;
        return { type: t, isStream: false };
    };
    Extractor.prototype.collectPropertyType = function (node) {
        // TODO: Handle function types here.
        var inner = this.maybeUnwrapWrapper(node);
        if (inner == null)
            return null;
        return this.collectType(inner);
    };
    Extractor.prototype.maybeUnwrapWrapper = function (node) {
        var supportedWrappers = new Set(["Promise", "Observable"]);
        if (ts.isTypeReferenceNode(node)) {
            var identifier = this.expectNameIdentifier(node.typeName);
            if (identifier == null)
                return null;
            if (supportedWrappers.has(identifier.text)) {
                if (node.typeArguments == null || node.typeArguments.length === 0) {
                    return this.report(node, E.wrapperMissingTypeArg());
                }
                return node.typeArguments[0];
            }
        }
        return node;
    };
    Extractor.prototype.collectDescription = function (node) {
        var docs = 
        // @ts-ignore Exposed as stable in https://github.com/microsoft/TypeScript/pull/53627
        ts.getJSDocCommentsAndTags(node);
        var comment = docs
            .filter(function (doc) { return doc.kind === ts.SyntaxKind.JSDoc; })
            .map(function (doc) { return doc.comment; })
            .join("");
        if (comment) {
            return this.gql.string(node, comment.trim(), true);
        }
        return null;
    };
    Extractor.prototype.collectDeprecated = function (node) {
        var tag = this.findTag(node, DEPRECATED_TAG);
        if (tag == null)
            return null;
        var reason = null;
        if (tag.comment != null) {
            var reasonComment = ts.getTextOfJSDocComment(tag.comment);
            if (reasonComment != null) {
                // FIXME: Use the _value_'s location not the tag's
                reason = this.gql.constArgument(tag, this.gql.name(tag, "reason"), this.gql.string(tag, reasonComment));
            }
        }
        return this.gql.constDirective(tag.tagName, this.gql.name(node, DEPRECATED_TAG), reason == null ? null : [reason]);
    };
    Extractor.prototype.property = function (node) {
        var tag = this.findTag(node, exports.FIELD_TAG);
        if (tag == null)
            return null;
        var name = this.entityName(node, tag);
        if (name == null)
            return null;
        if (node.type == null) {
            this.report(node.name, E.propertyFieldMissingType());
            return null;
        }
        var inner = this.collectPropertyType(node.type);
        // We already reported an error
        if (inner == null)
            return null;
        var type = node.questionToken == null ? inner : this.gql.nullableType(inner);
        var description = this.collectDescription(node);
        var directives = [];
        var id = this.expectNameIdentifier(node.name);
        if (id == null)
            return null;
        var deprecated = this.collectDeprecated(node);
        if (deprecated != null) {
            directives.push(deprecated);
        }
        if (id.text !== name.value) {
            directives = [
                this.gql.propertyNameDirective(node.name, {
                    name: id.text,
                    isMethod: false,
                }),
            ];
        }
        var killsParentOnExceptionDirective = this.killsParentOnExceptionDirective(node);
        if (killsParentOnExceptionDirective != null) {
            directives.push(killsParentOnExceptionDirective);
        }
        return this.gql.fieldDefinition(node, name, type, null, directives, description);
    };
    // TODO: Support separate modes for input and output types
    // For input nodes and field may only be optional if `null` is a valid value.
    Extractor.prototype.collectType = function (node) {
        var _this = this;
        if (ts.isTypeReferenceNode(node)) {
            var type = this.typeReference(node);
            if (type == null)
                return null;
            return type;
        }
        else if (ts.isArrayTypeNode(node)) {
            var element = this.collectType(node.elementType);
            if (element == null)
                return null;
            return this.gql.nonNullType(node, this.gql.listType(node, element));
        }
        else if (ts.isUnionTypeNode(node)) {
            var types = node.types.filter(function (type) { return !_this.isNullish(type); });
            if (types.length === 0) {
                return this.report(node, E.expectedOneNonNullishType());
            }
            var type = this.collectType(types[0]);
            if (type == null)
                return null;
            if (types.length > 1) {
                var _a = __read(types), first = _a[0], rest = _a.slice(1);
                // FIXME: If each of `rest` matches `first` this should be okay.
                var incompatibleVariants = rest.map(function (tsType) {
                    return (0, DiagnosticError_1.tsRelated)(tsType, "Other non-nullish type");
                });
                this.report(first, E.expectedOneNonNullishType(), incompatibleVariants);
                return null;
            }
            if (node.types.length > 1) {
                return this.gql.withLocation(node, this.gql.nullableType(type));
            }
            return this.gql.nonNullType(node, type);
        }
        else if (ts.isParenthesizedTypeNode(node)) {
            return this.collectType(node.type);
        }
        else if (node.kind === ts.SyntaxKind.StringKeyword) {
            return this.gql.nonNullType(node, this.gql.namedType(node, "String"));
        }
        else if (node.kind === ts.SyntaxKind.BooleanKeyword) {
            return this.gql.nonNullType(node, this.gql.namedType(node, "Boolean"));
        }
        else if (node.kind === ts.SyntaxKind.NumberKeyword) {
            return this.report(node, E.ambiguousNumberType());
        }
        else if (ts.isTypeLiteralNode(node)) {
            return this.report(node, E.unsupportedTypeLiteral());
        }
        // TODO: Better error message. This is okay if it's a type reference, but everything else is not.
        this.reportUnhandled(node, "type", E.unknownGraphQLType());
        return null;
    };
    Extractor.prototype.typeReference = function (node) {
        var identifier = this.expectNameIdentifier(node.typeName);
        if (identifier == null)
            return null;
        var typeName = identifier.text;
        switch (typeName) {
            case "Array":
            case "Iterator":
            case "ReadonlyArray": {
                if (node.typeArguments == null) {
                    return this.report(node, E.pluralTypeMissingParameter());
                }
                var element = this.collectType(node.typeArguments[0]);
                if (element == null)
                    return null;
                return this.gql.nonNullType(node, this.gql.listType(node, element));
            }
            default: {
                // We may not have encountered the definition of this type yet. So, we
                // mark it as unresolved and return a placeholder type.
                //
                // A later pass will resolve the type.
                var namedType = this.gql.namedType(node, TypeContext_1.UNRESOLVED_REFERENCE_NAME);
                this.markUnresolvedType(node.typeName, namedType.name);
                return this.gql.nonNullType(node, namedType);
            }
        }
    };
    Extractor.prototype.isNullish = function (node) {
        if (ts.isIdentifier(node)) {
            return node.escapedText === "undefined";
        }
        if (ts.isLiteralTypeNode(node)) {
            return (node.literal.kind === ts.SyntaxKind.NullKeyword ||
                node.literal.kind === ts.SyntaxKind.UndefinedKeyword);
        }
        return (node.kind === ts.SyntaxKind.NullKeyword ||
            node.kind === ts.SyntaxKind.UndefinedKeyword ||
            node.kind === ts.SyntaxKind.VoidKeyword);
    };
    Extractor.prototype.expectNameIdentifier = function (node) {
        if (ts.isIdentifier(node)) {
            return node;
        }
        return this.report(node, E.expectedNameIdentifier());
    };
    Extractor.prototype.findTag = function (node, tagName) {
        var tags = ts
            .getJSDocTags(node)
            .filter(function (tag) { return tag.tagName.escapedText === tagName; });
        if (tags.length === 0) {
            return null;
        }
        if (tags.length > 1) {
            var additionalTags = tags.slice(1).map(function (tag) {
                return (0, DiagnosticError_1.tsRelated)(tag, "Additional tag");
            });
            return this.report(tags[0], E.duplicateTag(tagName), additionalTags);
        }
        return tags[0];
    };
    // It is a GraphQL best practice to model all fields as nullable. This allows
    // the server to handle field level executions by simply returning null for
    // that field.
    // https://graphql.org/learn/best-practices/#nullability
    Extractor.prototype.killsParentOnExceptionDirective = function (parentNode) {
        var tags = ts.getJSDocTags(parentNode);
        var killsParentOnExceptions = tags.find(function (tag) { return tag.tagName.text === exports.KILLS_PARENT_ON_EXCEPTION_TAG; });
        if (killsParentOnExceptions) {
            return this.gql.killsParentOnExceptionDirective(killsParentOnExceptions.tagName);
        }
        return null;
    };
    return Extractor;
}());
function graphQLNameValidationMessage(name) {
    try {
        (0, graphql_1.assertName)(name);
        return null;
    }
    catch (e) {
        return e.message;
    }
}
// Trims any number of whitespace-only lines including any lines that simply
// contain a `*` surrounded by whitespace.
function trimTrailingCommentLines(text) {
    return text.replace(/(\s*\n\s*\*?\s*)+$/, "");
}
function isCallable(node) {
    return ts.isMethodDeclaration(node) || ts.isMethodSignature(node);
}
