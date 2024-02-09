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
exports.applyDefaultNullability = void 0;
var graphql_1 = require("graphql");
var DiagnosticError_1 = require("../utils/DiagnosticError");
var Result_1 = require("../utils/Result");
var E = require("../Errors");
var metadataDirectives_1 = require("../metadataDirectives");
var publicDirectives_1 = require("../publicDirectives");
var GraphQLConstructor_1 = require("../GraphQLConstructor");
var helpers_1 = require("../utils/helpers");
/**
 * Grats has options to make all fields nullable by default to conform to
 * GraphQL best practices. This transform applies this option to the schema.
 */
function applyDefaultNullability(doc, _a) {
    var _b;
    var nullableByDefault = _a.nullableByDefault, strictSemanticNullability = _a.strictSemanticNullability;
    var gql = new GraphQLConstructor_1.GraphQLConstructor();
    var errors = [];
    var newDoc = (0, graphql_1.visit)(doc, (_b = {},
        _b[graphql_1.Kind.FIELD_DEFINITION] = function (t) {
            var _a, _b;
            var killsParent = (_a = t.directives) === null || _a === void 0 ? void 0 : _a.find(function (d) { return d.name.value === metadataDirectives_1.KILLS_PARENT_ON_EXCEPTION_DIRECTIVE; });
            if (killsParent) {
                // You can only use @killsParentOnException if nullableByDefault is on.
                if (!nullableByDefault) {
                    errors.push((0, DiagnosticError_1.gqlErr)((0, helpers_1.loc)(killsParent), E.killsParentOnExceptionWithWrongConfig()));
                }
                // You can't use @killsParentOnException if it's been typed as nullable
                if (t.type.kind !== graphql_1.Kind.NON_NULL_TYPE) {
                    errors.push((0, DiagnosticError_1.gqlErr)((0, helpers_1.loc)(killsParent), E.killsParentOnExceptionOnNullable()));
                }
                // Set the location of the NON_NULL_TYPE wrapper to the location of the
                // `@killsParentOnException` directive so that type errors created by graphql-js
                // are reported at the correct location.
                return __assign(__assign({}, t), { type: __assign(__assign({}, t.type), { loc: killsParent.loc }) });
            }
            if (nullableByDefault && t.type.kind === graphql_1.Kind.NON_NULL_TYPE) {
                var type = gql.nullableType(t.type);
                var directives = (_b = t.directives) !== null && _b !== void 0 ? _b : [];
                if (strictSemanticNullability) {
                    var semanticNullability = (0, publicDirectives_1.makeSemanticNonNullDirective)((0, helpers_1.loc)(t.type));
                    directives = __spreadArray(__spreadArray([], __read(directives), false), [semanticNullability], false);
                }
                return __assign(__assign({}, t), { directives: directives, type: type });
            }
            return t;
        },
        _b));
    if (errors.length > 0) {
        return (0, Result_1.err)(errors);
    }
    if (strictSemanticNullability) {
        return (0, Result_1.ok)(__assign(__assign({}, newDoc), { definitions: (0, publicDirectives_1.addSemanticNonNullDirective)(newDoc.definitions) }));
    }
    return (0, Result_1.ok)(newDoc);
}
exports.applyDefaultNullability = applyDefaultNullability;
