"use strict";
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
exports.parseExportedDirective = exports.parsePropertyNameDirective = exports.parseAsyncIterableTypeDirective = exports.makeKillsParentOnExceptionDirective = exports.makeAsyncIterableDirective = exports.makeExportedDirective = exports.makePropertyNameDirective = exports.addMetadataDirectives = exports.DIRECTIVES_AST = exports.METADATA_DIRECTIVE_NAMES = exports.KILLS_PARENT_ON_EXCEPTION_DIRECTIVE = exports.ASYNC_ITERABLE_TYPE_DIRECTIVE = exports.EXPORTED_DIRECTIVE = exports.FIELD_NAME_DIRECTIVE = void 0;
var graphql_1 = require("graphql");
exports.FIELD_NAME_DIRECTIVE = "propertyName";
var FIELD_NAME_ARG = "name";
var IS_METHOD_ARG = "isMethod";
exports.EXPORTED_DIRECTIVE = "exported";
var TS_MODULE_PATH_ARG = "tsModulePath";
var ARG_COUNT = "argCount";
var EXPORTED_FUNCTION_NAME_ARG = "functionName";
exports.ASYNC_ITERABLE_TYPE_DIRECTIVE = "asyncIterable";
exports.KILLS_PARENT_ON_EXCEPTION_DIRECTIVE = "killsParentOnException";
exports.METADATA_DIRECTIVE_NAMES = new Set([
    exports.FIELD_NAME_DIRECTIVE,
    exports.EXPORTED_DIRECTIVE,
    exports.ASYNC_ITERABLE_TYPE_DIRECTIVE,
    exports.KILLS_PARENT_ON_EXCEPTION_DIRECTIVE,
]);
exports.DIRECTIVES_AST = (0, graphql_1.parse)("\n    directive @".concat(exports.ASYNC_ITERABLE_TYPE_DIRECTIVE, " on FIELD_DEFINITION\n    directive @").concat(exports.FIELD_NAME_DIRECTIVE, "(").concat(FIELD_NAME_ARG, ": String!, ").concat(IS_METHOD_ARG, ": Boolean!) on FIELD_DEFINITION\n    directive @").concat(exports.EXPORTED_DIRECTIVE, "(\n      ").concat(TS_MODULE_PATH_ARG, ": String!,\n      ").concat(EXPORTED_FUNCTION_NAME_ARG, ": String!\n      ").concat(ARG_COUNT, ": Int!\n    ) on FIELD_DEFINITION\n    directive @").concat(exports.KILLS_PARENT_ON_EXCEPTION_DIRECTIVE, " on FIELD_DEFINITION\n"));
function addMetadataDirectives(definitions) {
    return __spreadArray(__spreadArray([], __read(exports.DIRECTIVES_AST.definitions), false), __read(definitions), false);
}
exports.addMetadataDirectives = addMetadataDirectives;
function makePropertyNameDirective(loc, propertyName) {
    return {
        kind: graphql_1.Kind.DIRECTIVE,
        loc: loc,
        name: { kind: graphql_1.Kind.NAME, loc: loc, value: exports.FIELD_NAME_DIRECTIVE },
        arguments: [
            makeStringArg(loc, FIELD_NAME_ARG, propertyName.name),
            makeBoolArg(loc, IS_METHOD_ARG, propertyName.isMethod),
        ],
    };
}
exports.makePropertyNameDirective = makePropertyNameDirective;
function makeExportedDirective(loc, exported) {
    return {
        kind: graphql_1.Kind.DIRECTIVE,
        loc: loc,
        name: { kind: graphql_1.Kind.NAME, loc: loc, value: exports.EXPORTED_DIRECTIVE },
        arguments: [
            makeStringArg(loc, TS_MODULE_PATH_ARG, exported.tsModulePath),
            makeStringArg(loc, EXPORTED_FUNCTION_NAME_ARG, exported.exportedFunctionName),
            makeIntArg(loc, ARG_COUNT, exported.argCount),
        ],
    };
}
exports.makeExportedDirective = makeExportedDirective;
function makeAsyncIterableDirective(loc) {
    return {
        kind: graphql_1.Kind.DIRECTIVE,
        loc: loc,
        name: { kind: graphql_1.Kind.NAME, loc: loc, value: exports.ASYNC_ITERABLE_TYPE_DIRECTIVE },
        arguments: [],
    };
}
exports.makeAsyncIterableDirective = makeAsyncIterableDirective;
function makeKillsParentOnExceptionDirective(loc) {
    return {
        kind: graphql_1.Kind.DIRECTIVE,
        loc: loc,
        name: { kind: graphql_1.Kind.NAME, loc: loc, value: exports.KILLS_PARENT_ON_EXCEPTION_DIRECTIVE },
        arguments: [],
    };
}
exports.makeKillsParentOnExceptionDirective = makeKillsParentOnExceptionDirective;
function parseAsyncIterableTypeDirective(directive) {
    if (directive.name.value !== exports.ASYNC_ITERABLE_TYPE_DIRECTIVE) {
        throw new Error("Expected directive to be ".concat(exports.ASYNC_ITERABLE_TYPE_DIRECTIVE));
    }
    return true;
}
exports.parseAsyncIterableTypeDirective = parseAsyncIterableTypeDirective;
function parsePropertyNameDirective(directive) {
    if (directive.name.value !== exports.FIELD_NAME_DIRECTIVE) {
        throw new Error("Expected directive to be ".concat(exports.FIELD_NAME_DIRECTIVE));
    }
    return {
        name: getStringArg(directive, FIELD_NAME_ARG),
        isMethod: getBoolArg(directive, IS_METHOD_ARG),
    };
}
exports.parsePropertyNameDirective = parsePropertyNameDirective;
function parseExportedDirective(directive) {
    if (directive.name.value !== exports.EXPORTED_DIRECTIVE) {
        throw new Error("Expected directive to be ".concat(exports.EXPORTED_DIRECTIVE));
    }
    return {
        tsModulePath: getStringArg(directive, TS_MODULE_PATH_ARG),
        exportedFunctionName: getStringArg(directive, EXPORTED_FUNCTION_NAME_ARG),
        argCount: getIntArg(directive, ARG_COUNT),
    };
}
exports.parseExportedDirective = parseExportedDirective;
function getStringArg(directive, argName) {
    var _a;
    var arg = (_a = directive.arguments) === null || _a === void 0 ? void 0 : _a.find(function (arg) { return arg.name.value === argName; });
    if (!arg) {
        throw new Error("Expected to find argument ".concat(argName));
    }
    if (arg.value.kind !== graphql_1.Kind.STRING) {
        throw new Error("Expected argument ".concat(argName, " to be a string"));
    }
    return arg.value.value;
}
function getIntArg(directive, argName) {
    var _a;
    var arg = (_a = directive.arguments) === null || _a === void 0 ? void 0 : _a.find(function (arg) { return arg.name.value === argName; });
    if (!arg) {
        throw new Error("Expected to find argument ".concat(argName));
    }
    if (arg.value.kind !== graphql_1.Kind.INT) {
        throw new Error("Expected argument ".concat(argName, " to be an int"));
    }
    return parseInt(arg.value.value, 10);
}
function getBoolArg(directive, argName) {
    var _a;
    var arg = (_a = directive.arguments) === null || _a === void 0 ? void 0 : _a.find(function (arg) { return arg.name.value === argName; });
    if (!arg) {
        throw new Error("Expected to find argument ".concat(argName));
    }
    if (arg.value.kind !== graphql_1.Kind.BOOLEAN) {
        throw new Error("Expected argument ".concat(argName, " to be a boolean"));
    }
    return arg.value.value;
}
function makeStringArg(loc, argName, value) {
    return {
        kind: graphql_1.Kind.ARGUMENT,
        loc: loc,
        name: { kind: graphql_1.Kind.NAME, loc: loc, value: argName },
        value: { kind: graphql_1.Kind.STRING, loc: loc, value: value },
    };
}
function makeBoolArg(loc, argName, value) {
    return {
        kind: graphql_1.Kind.ARGUMENT,
        loc: loc,
        name: { kind: graphql_1.Kind.NAME, loc: loc, value: argName },
        value: { kind: graphql_1.Kind.BOOLEAN, loc: loc, value: value },
    };
}
function makeIntArg(loc, argName, value) {
    return {
        kind: graphql_1.Kind.ARGUMENT,
        loc: loc,
        name: { kind: graphql_1.Kind.NAME, loc: loc, value: argName },
        value: { kind: graphql_1.Kind.INT, loc: loc, value: value.toString() },
    };
}
