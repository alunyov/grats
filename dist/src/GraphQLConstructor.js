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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLConstructor = void 0;
var graphql_1 = require("graphql");
var metadataDirectives_1 = require("./metadataDirectives");
var GraphQLConstructor = /** @class */ (function () {
    function GraphQLConstructor() {
    }
    /* Metadata Directives */
    GraphQLConstructor.prototype.exportedDirective = function (node, exported) {
        return (0, metadataDirectives_1.makeExportedDirective)(this._loc(node), exported);
    };
    GraphQLConstructor.prototype.propertyNameDirective = function (node, propertyName) {
        return (0, metadataDirectives_1.makePropertyNameDirective)(this._loc(node), propertyName);
    };
    GraphQLConstructor.prototype.asyncIterableDirective = function (node) {
        return (0, metadataDirectives_1.makeAsyncIterableDirective)(this._loc(node));
    };
    GraphQLConstructor.prototype.killsParentOnExceptionDirective = function (node) {
        return (0, metadataDirectives_1.makeKillsParentOnExceptionDirective)(this._loc(node));
    };
    /* Top Level Types */
    GraphQLConstructor.prototype.unionTypeDefinition = function (node, name, types, description) {
        return {
            kind: graphql_1.Kind.UNION_TYPE_DEFINITION,
            loc: this._loc(node),
            description: description !== null && description !== void 0 ? description : undefined,
            name: name,
            types: types,
        };
    };
    GraphQLConstructor.prototype.objectTypeDefinition = function (node, name, fields, interfaces, description) {
        return {
            kind: graphql_1.Kind.OBJECT_TYPE_DEFINITION,
            loc: this._loc(node),
            description: description !== null && description !== void 0 ? description : undefined,
            directives: undefined,
            name: name,
            fields: fields,
            interfaces: interfaces !== null && interfaces !== void 0 ? interfaces : undefined,
        };
    };
    GraphQLConstructor.prototype.interfaceTypeDefinition = function (node, name, fields, interfaces, description) {
        return {
            kind: graphql_1.Kind.INTERFACE_TYPE_DEFINITION,
            loc: this._loc(node),
            description: description !== null && description !== void 0 ? description : undefined,
            directives: undefined,
            name: name,
            fields: fields,
            interfaces: interfaces !== null && interfaces !== void 0 ? interfaces : undefined,
        };
    };
    GraphQLConstructor.prototype.enumTypeDefinition = function (node, name, values, description) {
        return {
            kind: graphql_1.Kind.ENUM_TYPE_DEFINITION,
            loc: this._loc(node),
            description: description !== null && description !== void 0 ? description : undefined,
            name: name,
            values: values,
        };
    };
    /* Top Level Extensions */
    GraphQLConstructor.prototype.abstractFieldDefinition = function (node, onType, field) {
        return {
            kind: "AbstractFieldDefinition",
            loc: this._loc(node),
            onType: onType,
            field: field,
        };
    };
    /* Field Definitions */
    GraphQLConstructor.prototype.fieldDefinition = function (node, name, type, args, directives, description) {
        return {
            kind: graphql_1.Kind.FIELD_DEFINITION,
            loc: this._loc(node),
            description: description !== null && description !== void 0 ? description : undefined,
            name: name,
            type: type,
            arguments: args !== null && args !== void 0 ? args : undefined,
            directives: this._optionalList(directives),
        };
    };
    GraphQLConstructor.prototype.constObjectField = function (node, name, value) {
        return { kind: graphql_1.Kind.OBJECT_FIELD, loc: this._loc(node), name: name, value: value };
    };
    GraphQLConstructor.prototype.inputValueDefinition = function (node, name, type, directives, defaultValue, description) {
        return {
            kind: graphql_1.Kind.INPUT_VALUE_DEFINITION,
            loc: this._loc(node),
            description: description !== null && description !== void 0 ? description : undefined,
            name: name,
            type: type,
            defaultValue: defaultValue !== null && defaultValue !== void 0 ? defaultValue : undefined,
            directives: this._optionalList(directives),
        };
    };
    GraphQLConstructor.prototype.enumValueDefinition = function (node, name, directives, description) {
        return {
            kind: graphql_1.Kind.ENUM_VALUE_DEFINITION,
            loc: this._loc(node),
            description: description !== null && description !== void 0 ? description : undefined,
            name: name,
            directives: directives,
        };
    };
    GraphQLConstructor.prototype.scalarTypeDefinition = function (node, name, description) {
        return {
            kind: graphql_1.Kind.SCALAR_TYPE_DEFINITION,
            loc: this._loc(node),
            description: description !== null && description !== void 0 ? description : undefined,
            name: name,
            directives: undefined,
        };
    };
    GraphQLConstructor.prototype.inputObjectTypeDefinition = function (node, name, fields, directives, description) {
        return {
            kind: graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION,
            loc: this._loc(node),
            description: description !== null && description !== void 0 ? description : undefined,
            name: name,
            fields: fields !== null && fields !== void 0 ? fields : undefined,
            directives: this._optionalList(directives),
        };
    };
    /* Primitives */
    GraphQLConstructor.prototype.name = function (node, value) {
        return { kind: graphql_1.Kind.NAME, loc: this._loc(node), value: value };
    };
    GraphQLConstructor.prototype.namedType = function (node, value) {
        return {
            kind: graphql_1.Kind.NAMED_TYPE,
            loc: this._loc(node),
            name: this.name(node, value),
        };
    };
    GraphQLConstructor.prototype.object = function (node, fields) {
        return { kind: graphql_1.Kind.OBJECT, loc: this._loc(node), fields: fields };
    };
    /* Helpers */
    GraphQLConstructor.prototype.nonNullType = function (node, type) {
        if (type.kind === graphql_1.Kind.NON_NULL_TYPE) {
            return type;
        }
        return { kind: graphql_1.Kind.NON_NULL_TYPE, loc: this._loc(node), type: type };
    };
    GraphQLConstructor.prototype.nullableType = function (type) {
        var inner = type;
        while (inner.kind === graphql_1.Kind.NON_NULL_TYPE) {
            inner = inner.type;
        }
        return inner;
    };
    GraphQLConstructor.prototype.listType = function (node, type) {
        return { kind: graphql_1.Kind.LIST_TYPE, loc: this._loc(node), type: type };
    };
    GraphQLConstructor.prototype.list = function (node, values) {
        return { kind: graphql_1.Kind.LIST, loc: this._loc(node), values: values };
    };
    GraphQLConstructor.prototype.withLocation = function (node, value) {
        return __assign(__assign({}, value), { loc: this._loc(node) });
    };
    GraphQLConstructor.prototype.constArgument = function (node, name, value) {
        return { kind: graphql_1.Kind.ARGUMENT, loc: this._loc(node), name: name, value: value };
    };
    GraphQLConstructor.prototype.constDirective = function (node, name, args) {
        return {
            kind: graphql_1.Kind.DIRECTIVE,
            loc: this._loc(node),
            name: name,
            arguments: this._optionalList(args),
        };
    };
    GraphQLConstructor.prototype.string = function (node, value, block) {
        return { kind: graphql_1.Kind.STRING, loc: this._loc(node), value: value, block: block };
    };
    GraphQLConstructor.prototype.float = function (node, value) {
        return { kind: graphql_1.Kind.FLOAT, loc: this._loc(node), value: value };
    };
    GraphQLConstructor.prototype.int = function (node, value) {
        return { kind: graphql_1.Kind.INT, loc: this._loc(node), value: value };
    };
    GraphQLConstructor.prototype.null = function (node) {
        return { kind: graphql_1.Kind.NULL, loc: this._loc(node) };
    };
    GraphQLConstructor.prototype.boolean = function (node, value) {
        return { kind: graphql_1.Kind.BOOLEAN, loc: this._loc(node), value: value };
    };
    GraphQLConstructor.prototype._optionalList = function (input) {
        if (input == null || input.length === 0) {
            return undefined;
        }
        return input;
    };
    // TODO: This is potentially quite expensive, and we only need it if we report
    // an error at one of these locations. We could consider some trick to return a
    // proxy object that would lazily compute the line/column info.
    GraphQLConstructor.prototype._loc = function (node) {
        var sourceFile = node.getSourceFile();
        var source = new graphql_1.Source(sourceFile.text, sourceFile.fileName);
        var startToken = this._dummyToken(sourceFile, node.getStart());
        var endToken = this._dummyToken(sourceFile, node.getEnd());
        return new graphql_1.Location(startToken, endToken, source);
    };
    GraphQLConstructor.prototype._dummyToken = function (sourceFile, pos) {
        var _a = sourceFile.getLineAndCharacterOfPosition(pos), line = _a.line, character = _a.character;
        return new graphql_1.Token(graphql_1.TokenKind.SOF, pos, pos, line, character, undefined);
    };
    return GraphQLConstructor;
}());
exports.GraphQLConstructor = GraphQLConstructor;
