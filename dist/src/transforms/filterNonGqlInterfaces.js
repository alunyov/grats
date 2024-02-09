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
exports.filterNonGqlInterfaces = void 0;
var graphql_1 = require("graphql");
/**
 * Filter out `implements` declarations that don't refer to a GraphQL interface.
 * Note: We depend upon traversal order here to ensure that we remove all
 * non-GraphQL interfaces before we try to resolve the names of the GraphQL
 * interfaces.
 */
function filterNonGqlInterfaces(ctx, doc) {
    var _a;
    return (0, graphql_1.visit)(doc, (_a = {},
        _a[graphql_1.Kind.INTERFACE_TYPE_DEFINITION] = function (t) { return filterInterfaces(ctx, t); },
        _a[graphql_1.Kind.OBJECT_TYPE_DEFINITION] = function (t) { return filterInterfaces(ctx, t); },
        _a[graphql_1.Kind.OBJECT_TYPE_EXTENSION] = function (t) { return filterInterfaces(ctx, t); },
        _a[graphql_1.Kind.INTERFACE_TYPE_EXTENSION] = function (t) { return filterInterfaces(ctx, t); },
        _a));
}
exports.filterNonGqlInterfaces = filterNonGqlInterfaces;
function filterInterfaces(ctx, t) {
    if (t.interfaces == null || t.interfaces.length === 0) {
        return t;
    }
    var gqlInterfaces = t.interfaces.filter(function (i) {
        return ctx.unresolvedNameIsGraphQL(i.name);
    });
    if (t.interfaces.length === gqlInterfaces.length) {
        return t;
    }
    return __assign(__assign({}, t), { interfaces: gqlInterfaces });
}
