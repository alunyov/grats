"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTypes = void 0;
var graphql_1 = require("graphql");
var Result_1 = require("../utils/Result");
/**
 * During the extraction process when we observe a type reference in a GraphQL
 * position we don't actually resolve that to its GraphQL type name during
 * extraction. Instead we rely on this transform to resolve those references and
 * ensure that they point to `@gql` types.
 */
function resolveTypes(ctx, doc) {
    var _a;
    var errors = [];
    var newDoc = (0, graphql_1.visit)(doc, (_a = {},
        _a[graphql_1.Kind.NAME] = function (t) {
            var namedTypeResult = ctx.resolveNamedType(t);
            if (namedTypeResult.kind === "ERROR") {
                errors.push(namedTypeResult.err);
                return t;
            }
            return namedTypeResult.value;
        },
        _a));
    if (errors.length > 0) {
        return (0, Result_1.err)(errors);
    }
    return (0, Result_1.ok)(newDoc);
}
exports.resolveTypes = resolveTypes;
