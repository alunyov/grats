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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codegen = void 0;
var graphql_1 = require("graphql");
var ts = require("typescript");
var path = require("path");
var metadataDirectives_1 = require("./metadataDirectives");
var gratsRoot_1 = require("./gratsRoot");
var publicDirectives_1 = require("./publicDirectives");
var codegenHelpers_1 = require("./codegenHelpers");
var helpers_1 = require("./utils/helpers");
var RESOLVER_ARGS = ["source", "args", "context", "info"];
var F = ts.factory;
// Given a GraphQL SDL, returns the a string of TypeScript code that generates a
// GraphQLSchema implementing that schema.
function codegen(schema, destination) {
    var codegen = new Codegen(schema, destination);
    codegen.schemaDeclarationExport();
    return codegen.print();
}
exports.codegen = codegen;
var Codegen = /** @class */ (function () {
    function Codegen(schema, destination) {
        this._imports = [];
        this._helpers = new Map();
        this._typeDefinitions = new Set();
        this._graphQLImports = new Set();
        this._statements = [];
        this._schema = schema;
        this._destination = destination;
    }
    Codegen.prototype.createBlockWithScope = function (closure) {
        var initialStatements = this._statements;
        this._statements = [];
        closure();
        var block = F.createBlock(this._statements, true);
        this._statements = initialStatements;
        return block;
    };
    Codegen.prototype.graphQLImport = function (name) {
        this._graphQLImports.add(name);
        return F.createIdentifier(name);
    };
    Codegen.prototype.graphQLTypeImport = function (name) {
        this._graphQLImports.add(name);
        return F.createTypeReferenceNode(name);
    };
    Codegen.prototype.schemaDeclarationExport = function () {
        var _this = this;
        this.functionDeclaration("getSchema", [F.createModifier(ts.SyntaxKind.ExportKeyword)], this.graphQLTypeImport("GraphQLSchema"), this.createBlockWithScope(function () {
            _this._statements.push(F.createReturnStatement(F.createNewExpression(_this.graphQLImport("GraphQLSchema"), [], [_this.schemaConfig()])));
        }));
    };
    Codegen.prototype.schemaConfig = function () {
        return this.objectLiteral([
            this.description(this._schema.description),
            this.query(),
            this.mutation(),
            this.subscription(),
            this.types(),
        ]);
    };
    Codegen.prototype.types = function () {
        var _this = this;
        var types = Object.values(this._schema.getTypeMap())
            .filter(function (type) {
            return !(type.name.startsWith("__") ||
                type.name.startsWith("Introspection") ||
                type.name.startsWith("Schema") ||
                // Built in primitives
                type.name === "String" ||
                type.name === "Int" ||
                type.name === "Float" ||
                type.name === "Boolean" ||
                type.name === "ID");
        })
            .map(function (type) { return _this.typeReference(type); });
        return F.createPropertyAssignment("types", F.createArrayLiteralExpression(types));
    };
    Codegen.prototype.deprecated = function (obj) {
        if (!obj.deprecationReason)
            return null;
        return F.createPropertyAssignment("deprecationReason", F.createStringLiteral(obj.deprecationReason));
    };
    Codegen.prototype.description = function (description) {
        if (!description)
            return null;
        return F.createPropertyAssignment("description", F.createStringLiteral(description));
    };
    Codegen.prototype.query = function () {
        var query = this._schema.getQueryType();
        if (!query)
            return null;
        return F.createPropertyAssignment("query", this.objectType(query));
    };
    Codegen.prototype.mutation = function () {
        var mutation = this._schema.getMutationType();
        if (!mutation)
            return null;
        return F.createPropertyAssignment("mutation", this.objectType(mutation));
    };
    Codegen.prototype.subscription = function () {
        var subscription = this._schema.getSubscriptionType();
        if (!subscription)
            return null;
        return F.createPropertyAssignment("subscription", this.objectType(subscription));
    };
    Codegen.prototype.objectType = function (obj) {
        var varName = "".concat(obj.name, "Type");
        if (!this._typeDefinitions.has(varName)) {
            this._typeDefinitions.add(varName);
            this.constDeclaration(varName, F.createNewExpression(this.graphQLImport("GraphQLObjectType"), [], [this.objectTypeConfig(obj)]), 
            // We need to explicitly specify the type due to circular references in
            // the definition.
            F.createTypeReferenceNode("GraphQLObjectType"));
        }
        return F.createIdentifier(varName);
    };
    Codegen.prototype.objectTypeConfig = function (obj) {
        return this.objectLiteral([
            F.createPropertyAssignment("name", F.createStringLiteral(obj.name)),
            this.description(obj.description),
            this.fields(obj, false),
            this.interfaces(obj),
        ]);
    };
    Codegen.prototype.resolveMethod = function (field, methodName, parentTypeName) {
        var _this = this;
        var exported = fieldDirective(field, metadataDirectives_1.EXPORTED_DIRECTIVE);
        // Case, where resolver defined as a standalone function
        // #1 argument of the resolver is expected to be the parent type object
        // #2 argument of the resolver is the list of user-provided arguments
        // #3 `contextValue`
        // #4 `info` - GraphQLResolveInfo
        // #5 - something else?
        if (exported != null) {
            var exportedMetadata = (0, metadataDirectives_1.parseExportedDirective)(exported);
            var module_1 = exportedMetadata.tsModulePath;
            var funcName = exportedMetadata.exportedFunctionName;
            var argCount = exportedMetadata.argCount;
            var abs = (0, gratsRoot_1.resolveRelativePath)(module_1);
            var relative = stripExt(path.relative(path.dirname(this._destination), abs));
            var resolverName = formatResolverFunctionVarName(parentTypeName, funcName);
            this.import("./".concat(relative), [{ name: funcName, as: resolverName }]);
            var usedArgs = RESOLVER_ARGS.slice(0, argCount);
            var innerResolverCall = F.createArrowFunction(undefined, undefined, [], undefined, undefined, F.createBlock([
                F.createReturnStatement(F.createCallExpression(F.createIdentifier(resolverName), undefined, usedArgs.map(function (name) {
                    return F.createIdentifier(name);
                }))),
            ]));
            var returnStatement = F.createReturnStatement(
            // call `ctx.readFromCacheOrEvaluate` method with the following arguments:
            // args, info
            F.createCallExpression(F.createPropertyAccessExpression(F.createIdentifier("context"), F.createIdentifier("readFromCacheOrEvaluate")), undefined, [
                F.createIdentifier("source"),
                F.createIdentifier("args"),
                F.createIdentifier("info"),
                innerResolverCall,
            ]));
            return this.method(methodName, RESOLVER_ARGS.map(function (name) {
                return _this.param(name);
            }), [returnStatement]);
        }
        var propertyName = fieldDirective(field, metadataDirectives_1.FIELD_NAME_DIRECTIVE);
        if (propertyName != null) {
            var _a = (0, metadataDirectives_1.parsePropertyNameDirective)(propertyName), name = _a.name, isMethod = _a.isMethod;
            var prop = F.createPropertyAccessExpression(F.createIdentifier("source"), F.createIdentifier(name));
            var returnStatement = void 0;
            if (isMethod) {
                var callExpression = F.createCallExpression(prop, undefined, ["args", "context", "info"].map(function (name) {
                    return F.createIdentifier(name);
                }));
                var innerResolverCall = F.createArrowFunction(undefined, undefined, [], undefined, undefined, F.createBlock([F.createReturnStatement(callExpression)]));
                returnStatement = F.createReturnStatement(
                // call `ctx.readFromCacheOrEvaluate` method with the following arguments:
                // args, info
                F.createCallExpression(F.createPropertyAccessExpression(F.createIdentifier("context"), F.createIdentifier("readFromCacheOrEvaluate")), undefined, [
                    F.createIdentifier("source"),
                    F.createIdentifier("args"),
                    F.createIdentifier("info"),
                    innerResolverCall,
                ]));
            }
            else {
                returnStatement = F.createReturnStatement(prop);
            }
            return this.method(methodName, RESOLVER_ARGS.map(function (name) { return _this.param(name); }), [returnStatement]);
        }
        return null;
    };
    // If a field is semantically non-null, we need to wrap the resolver in a
    // runtime check to ensure that the resolver does not return null.
    Codegen.prototype.maybeApplySemanticNullRuntimeCheck = function (field, method_) {
        var _a;
        var semanticNonNull = fieldDirective(field, publicDirectives_1.SEMANTIC_NON_NULL_DIRECTIVE);
        if (semanticNonNull == null) {
            return method_;
        }
        if (!this._helpers.has(codegenHelpers_1.ASSERT_NON_NULL_HELPER)) {
            this._helpers.set(codegenHelpers_1.ASSERT_NON_NULL_HELPER, (0, codegenHelpers_1.createAssertNonNullHelper)());
        }
        var method = method_ !== null && method_ !== void 0 ? method_ : this.defaultResolverMethod();
        var bodyStatements = (_a = method.body) === null || _a === void 0 ? void 0 : _a.statements;
        if (bodyStatements == null || bodyStatements.length === 0) {
            throw new Error("Expected method to have a body");
        }
        var foundReturn = false;
        var newBodyStatements = bodyStatements.map(function (statement) {
            if (ts.isReturnStatement(statement)) {
                if (statement.expression == null) {
                    throw new Error("Expected return statement to have an expression");
                }
                foundReturn = true;
                // We need to wrap the return statement in a call to the runtime check
                return F.createReturnStatement(F.createCallExpression(F.createIdentifier(codegenHelpers_1.ASSERT_NON_NULL_HELPER), [], [statement.expression]));
            }
            return statement;
        });
        if (!foundReturn) {
            throw new Error("Expected method to have a return statement");
        }
        return __assign(__assign({}, method), { body: F.createBlock(newBodyStatements, true) });
    };
    Codegen.prototype.defaultResolverMethod = function () {
        var _this = this;
        return this.method("resolve", RESOLVER_ARGS.map(function (name) { return _this.param(name); }), [
            F.createReturnStatement(F.createCallExpression(this.graphQLImport("defaultFieldResolver"), undefined, RESOLVER_ARGS.map(function (name) { return F.createIdentifier(name); }))),
        ]);
    };
    Codegen.prototype.fields = function (obj, isInterface) {
        var _this = this;
        var fields = Object.entries(obj.getFields()).map(function (_a) {
            var _b = __read(_a, 2), name = _b[0], field = _b[1];
            return F.createPropertyAssignment(name, _this.fieldConfig(field, obj.name, isInterface));
        });
        return this.method("fields", [], [F.createReturnStatement(this.objectLiteral(fields))]);
    };
    Codegen.prototype.interfaces = function (obj) {
        var _this = this;
        var interfaces = obj.getInterfaces();
        if (!interfaces.length)
            return null;
        return this.method("interfaces", [], [
            F.createReturnStatement(F.createArrayLiteralExpression(interfaces.map(function (i) { return _this.interfaceType(i); }))),
        ]);
    };
    Codegen.prototype.interfaceType = function (obj) {
        var varName = "".concat(obj.name, "Type");
        if (!this._typeDefinitions.has(varName)) {
            this._typeDefinitions.add(varName);
            this.constDeclaration(varName, F.createNewExpression(this.graphQLImport("GraphQLInterfaceType"), [], [this.interfaceTypeConfig(obj)]), 
            // We need to explicitly specify the type due to circular references in
            // the definition.
            F.createTypeReferenceNode(this.graphQLImport("GraphQLInterfaceType")));
        }
        return F.createIdentifier(varName);
    };
    Codegen.prototype.interfaceTypeConfig = function (obj) {
        return this.objectLiteral([
            this.description(obj.description),
            F.createPropertyAssignment("name", F.createStringLiteral(obj.name)),
            this.fields(obj, true),
            this.interfaces(obj),
        ]);
    };
    Codegen.prototype.unionType = function (obj) {
        var varName = "".concat(obj.name, "Type");
        if (!this._typeDefinitions.has(varName)) {
            this._typeDefinitions.add(varName);
            this.constDeclaration(varName, F.createNewExpression(this.graphQLImport("GraphQLUnionType"), [], [this.unionTypeConfig(obj)]), 
            // We need to explicitly specify the type due to circular references in
            // the definition.
            F.createTypeReferenceNode(this.graphQLImport("GraphQLUnionType")));
        }
        return F.createIdentifier(varName);
    };
    Codegen.prototype.unionTypeConfig = function (obj) {
        var _this = this;
        return this.objectLiteral([
            F.createPropertyAssignment("name", F.createStringLiteral(obj.name)),
            this.description(obj.description),
            this.method("types", [], [
                F.createReturnStatement(F.createArrayLiteralExpression(obj.getTypes().map(function (t) { return _this.typeReference(t); }))),
            ]),
        ]);
    };
    Codegen.prototype.customScalarType = function (obj) {
        var varName = "".concat(obj.name, "Type");
        if (!this._typeDefinitions.has(varName)) {
            this._typeDefinitions.add(varName);
            this.constDeclaration(varName, F.createNewExpression(this.graphQLImport("GraphQLScalarType"), [], [this.customScalarTypeConfig(obj)]), 
            // We need to explicitly specify the type due to circular references in
            // the definition.
            F.createTypeReferenceNode(this.graphQLImport("GraphQLScalarType")));
        }
        return F.createIdentifier(varName);
    };
    Codegen.prototype.customScalarTypeConfig = function (obj) {
        return this.objectLiteral([
            this.description(obj.description),
            F.createPropertyAssignment("name", F.createStringLiteral(obj.name)),
        ]);
    };
    Codegen.prototype.inputType = function (obj) {
        var varName = "".concat(obj.name, "Type");
        if (!this._typeDefinitions.has(varName)) {
            this._typeDefinitions.add(varName);
            this.constDeclaration(varName, F.createNewExpression(this.graphQLImport("GraphQLInputObjectType"), [], [this.inputTypeConfig(obj)]), 
            // We need to explicitly specify the type due to circular references in
            // the definition.
            F.createTypeReferenceNode(this.graphQLImport("GraphQLInputObjectType")));
        }
        return F.createIdentifier(varName);
    };
    Codegen.prototype.inputTypeConfig = function (obj) {
        return this.objectLiteral([
            this.description(obj.description),
            F.createPropertyAssignment("name", F.createStringLiteral(obj.name)),
            this.inputFields(obj),
        ]);
    };
    Codegen.prototype.inputFields = function (obj) {
        var _this = this;
        var fields = Object.entries(obj.getFields()).map(function (_a) {
            var _b = __read(_a, 2), name = _b[0], field = _b[1];
            return F.createPropertyAssignment(name, _this.inputFieldConfig(field));
        });
        return this.method("fields", [], [F.createReturnStatement(this.objectLiteral(fields))]);
    };
    Codegen.prototype.inputFieldConfig = function (field) {
        return this.objectLiteral([
            this.description(field.description),
            this.deprecated(field),
            F.createPropertyAssignment("name", F.createStringLiteral(field.name)),
            F.createPropertyAssignment("type", this.typeReference(field.type)),
        ]);
    };
    Codegen.prototype.fieldConfig = function (field, parentTypeName, isInterface) {
        var props = [
            this.description(field.description),
            this.deprecated(field),
            F.createPropertyAssignment("name", F.createStringLiteral(field.name)),
            F.createPropertyAssignment("type", this.typeReference(field.type)),
            field.args.length
                ? F.createPropertyAssignment("args", this.argMap(field.args))
                : null,
        ];
        if (!isInterface) {
            (0, helpers_1.extend)(props, this.fieldMethods(field, parentTypeName));
        }
        return this.objectLiteral(props);
    };
    Codegen.prototype.fieldMethods = function (field, parentTypeName) {
        var asyncIterable = fieldDirective(field, metadataDirectives_1.ASYNC_ITERABLE_TYPE_DIRECTIVE);
        if (asyncIterable == null) {
            var resolve = this.resolveMethod(field, "resolve", parentTypeName);
            return [this.maybeApplySemanticNullRuntimeCheck(field, resolve)];
        }
        return [
            // TODO: Maybe avoid adding `assertNonNull` for subscription resolvers?
            this.resolveMethod(field, "subscribe", parentTypeName),
            // Identity function (method?)
            this.maybeApplySemanticNullRuntimeCheck(field, this.method("resolve", [this.param("payload")], [F.createReturnStatement(F.createIdentifier("payload"))])),
        ];
    };
    Codegen.prototype.argMap = function (args) {
        var _this = this;
        return this.objectLiteral(args.map(function (arg) {
            return F.createPropertyAssignment(arg.name, _this.argConfig(arg));
        }));
    };
    Codegen.prototype.argConfig = function (arg) {
        return this.objectLiteral([
            this.description(arg.description),
            this.deprecated(arg),
            F.createPropertyAssignment("name", F.createStringLiteral(arg.name)),
            F.createPropertyAssignment("type", this.typeReference(arg.type)),
            // TODO: arg.defaultValue seems to be missing for complex objects
            arg.defaultValue !== undefined
                ? F.createPropertyAssignment("defaultValue", this.defaultValue(arg.defaultValue))
                : null,
            // TODO: DefaultValue
            // TODO: Deprecated
        ]);
    };
    Codegen.prototype.enumType = function (obj) {
        var varName = "".concat(obj.name, "Type");
        if (!this._typeDefinitions.has(varName)) {
            this._typeDefinitions.add(varName);
            this.constDeclaration(varName, F.createNewExpression(this.graphQLImport("GraphQLEnumType"), [], [this.enumTypeConfig(obj)]), 
            // We need to explicitly specify the type due to circular references in
            // the definition.
            F.createTypeReferenceNode(this.graphQLImport("GraphQLEnumType")));
        }
        return F.createIdentifier(varName);
    };
    Codegen.prototype.enumTypeConfig = function (obj) {
        return this.objectLiteral([
            this.description(obj.description),
            F.createPropertyAssignment("name", F.createStringLiteral(obj.name)),
            this.enumValues(obj),
        ]);
    };
    Codegen.prototype.enumValues = function (obj) {
        var _this = this;
        var values = obj.getValues().map(function (value) {
            return F.createPropertyAssignment(value.name, _this.enumValue(value));
        });
        return F.createPropertyAssignment("values", this.objectLiteral(values));
    };
    Codegen.prototype.enumValue = function (obj) {
        return this.objectLiteral([
            this.description(obj.description),
            this.deprecated(obj),
            F.createPropertyAssignment("value", F.createStringLiteral(obj.name)),
        ]);
    };
    Codegen.prototype.defaultValue = function (value) {
        var _this = this;
        switch (typeof value) {
            case "string":
                return F.createStringLiteral(value);
            case "number":
                return F.createNumericLiteral(value);
            case "boolean":
                return value ? F.createTrue() : F.createFalse();
            case "object":
                if (value === null) {
                    return F.createNull();
                }
                else if (Array.isArray(value)) {
                    return F.createArrayLiteralExpression(value.map(function (v) { return _this.defaultValue(v); }));
                }
                else {
                    return this.objectLiteral(Object.entries(value).map(function (_a) {
                        var _b = __read(_a, 2), k = _b[0], v = _b[1];
                        return F.createPropertyAssignment(k, _this.defaultValue(v));
                    }));
                }
            default:
                throw new Error("TODO: unhandled default value ".concat(value));
        }
    };
    Codegen.prototype.typeReference = function (t) {
        if ((0, graphql_1.isNonNullType)(t)) {
            return F.createNewExpression(this.graphQLImport("GraphQLNonNull"), [], [this.typeReference(t.ofType)]);
        }
        else if ((0, graphql_1.isListType)(t)) {
            if (!((0, graphql_1.isInputType)(t.ofType) || (0, graphql_1.isOutputType)(t.ofType))) {
                // I think this is just a TS type and TS can't prove that this never happens.
                throw new Error("TODO: unhandled type ".concat(t));
            }
            return F.createNewExpression(this.graphQLImport("GraphQLList"), [], [this.typeReference(t.ofType)]);
        }
        else if ((0, graphql_1.isInterfaceType)(t)) {
            return this.interfaceType(t);
        }
        else if ((0, graphql_1.isObjectType)(t)) {
            return this.objectType(t);
        }
        else if ((0, graphql_1.isUnionType)(t)) {
            return this.unionType(t);
        }
        else if ((0, graphql_1.isInputObjectType)(t)) {
            return this.inputType(t);
        }
        else if ((0, graphql_1.isEnumType)(t)) {
            return this.enumType(t);
        }
        else if ((0, graphql_1.isScalarType)(t)) {
            switch (t.name) {
                case "String":
                    return this.graphQLImport("GraphQLString");
                case "Int":
                    return this.graphQLImport("GraphQLInt");
                case "Float":
                    return this.graphQLImport("GraphQLFloat");
                case "Boolean":
                    return this.graphQLImport("GraphQLBoolean");
                case "ID":
                    return this.graphQLImport("GraphQLID");
                default:
                    return this.customScalarType(t);
            }
        }
        else {
            throw new Error("TODO: unhandled type ".concat(t));
        }
    };
    Codegen.prototype.constDeclaration = function (name, initializer, type) {
        this._statements.push(F.createVariableStatement(undefined, F.createVariableDeclarationList([
            F.createVariableDeclaration(F.createIdentifier(name), undefined, type, initializer),
        ], ts.NodeFlags.Const)));
    };
    Codegen.prototype.functionDeclaration = function (name, modifiers, type, body) {
        this._statements.push(F.createFunctionDeclaration(modifiers, undefined, name, undefined, [], type, body));
    };
    // Helper to allow for nullable elements.
    Codegen.prototype.objectLiteral = function (properties) {
        return F.createObjectLiteralExpression(properties.filter(isNonNull), true);
    };
    // Helper for the common case.
    Codegen.prototype.method = function (name, params, statements) {
        return F.createMethodDeclaration(undefined, undefined, name, undefined, undefined, params, undefined, F.createBlock(statements, true));
    };
    // Helper for the common case of a single string argument.
    Codegen.prototype.param = function (name, type) {
        return F.createParameterDeclaration(undefined, undefined, name, undefined, type, undefined);
    };
    Codegen.prototype.import = function (from, names) {
        var namedImports = names.map(function (name) {
            if (name.as) {
                return F.createImportSpecifier(false, F.createIdentifier(name.name), F.createIdentifier(name.as));
            }
            else {
                return F.createImportSpecifier(false, undefined, F.createIdentifier(name.name));
            }
        });
        this._imports.push(F.createImportDeclaration(undefined, F.createImportClause(false, undefined, F.createNamedImports(namedImports)), F.createStringLiteral(from)));
    };
    Codegen.prototype.print = function () {
        var printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        var sourceFile = ts.createSourceFile("tempFile.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
        this.import("graphql", __spreadArray([], __read(this._graphQLImports), false).map(function (name) { return ({ name: name }); }));
        return printer.printList(ts.ListFormat.MultiLine, F.createNodeArray(__spreadArray(__spreadArray(__spreadArray([], __read(this._imports), false), __read(this._helpers.values()), false), __read(this._statements), false)), sourceFile);
    };
    return Codegen;
}());
function fieldDirective(field, name) {
    var _a, _b, _c;
    return (_c = (_b = (_a = field.astNode) === null || _a === void 0 ? void 0 : _a.directives) === null || _b === void 0 ? void 0 : _b.find(function (d) { return d.name.value === name; })) !== null && _c !== void 0 ? _c : null;
}
function stripExt(filePath) {
    var ext = path.extname(filePath);
    return filePath.slice(0, -ext.length);
}
// Predicate function for filtering out null values
// Includes TypeScript refinement for narrowing the type
function isNonNull(value) {
    return value != null;
}
function formatResolverFunctionVarName(parentTypeName, fieldName) {
    var parent = parentTypeName[0].toLowerCase() + parentTypeName.slice(1);
    var field = fieldName[0].toUpperCase() + fieldName.slice(1);
    return "".concat(parent).concat(field, "Resolver");
}
