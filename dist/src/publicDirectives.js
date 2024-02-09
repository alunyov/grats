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
exports.makeSemanticNonNullDirective = exports.addSemanticNonNullDirective = exports.DIRECTIVES_AST = exports.SEMANTIC_NON_NULL_DIRECTIVE = void 0;
var graphql_1 = require("graphql");
/**
 * Grats supports some additional, non-spec server directives in order to
 * support experimental GraphQL features. This module contains the definition(s)
 * of those directives.
 */
exports.SEMANTIC_NON_NULL_DIRECTIVE = "semanticNonNull";
// Copied from https://github.com/apollographql/specs/blob/ec27a720e588a8531315c37eda85b668fd612199/nullability/v0.1/nullability-v0.1.graphql#L11
exports.DIRECTIVES_AST = (0, graphql_1.parse)("\n\"\"\"\nIndicates that a field is only null if there is a matching error in the `errors` array.\nIn all other cases, the field is non-null.\n\nTools doing code generation may use this information to generate the field as non-null.\n\nThis directive can be applied on field definitions:\n\n```graphql\ntype User {\n    email: String @semanticNonNull\n}\n```\n\nIt can also be applied on object type extensions for use in client applications that do\nnot own the base schema:\n\n```graphql\nextend type User @semanticNonNull(field: \"email\")\n```\n\nControl over list items is done using the `level` argument:\n\n```graphql\ntype User {\n    # friends is nullable but friends[0] is null only on errors\n    friends: [User] @semanticNonNull(level: 1)\n}\n```\n\nThe `field` argument is the name of the field if `@semanticNonNull` is applied to an object definition.\nIf `@semanticNonNull` is applied to a field definition, `field` must be null.\n\nThe `level` argument can be used to indicate what level is semantically non null in case of lists.\n`level` starts at 0 if there is no list. If `level` is null, all levels are semantically non null.\n\"\"\"\ndirective @semanticNonNull(field: String = null, level: Int = null) repeatable on FIELD_DEFINITION | OBJECT\n");
function addSemanticNonNullDirective(definitions) {
    return __spreadArray(__spreadArray([], __read(exports.DIRECTIVES_AST.definitions), false), __read(definitions), false);
}
exports.addSemanticNonNullDirective = addSemanticNonNullDirective;
function makeSemanticNonNullDirective(loc) {
    return {
        kind: graphql_1.Kind.DIRECTIVE,
        loc: loc,
        name: { kind: graphql_1.Kind.NAME, loc: loc, value: exports.SEMANTIC_NON_NULL_DIRECTIVE },
    };
}
exports.makeSemanticNonNullDirective = makeSemanticNonNullDirective;
