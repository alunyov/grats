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
exports.sortSchemaAst = void 0;
var graphql_1 = require("graphql");
var naturalCompare_1 = require("../utils/naturalCompare");
/*
 * Similar to lexicographicSortSchema from graphql-js but applied against an AST
 * instead of a `GraphQLSchema`. Note that this creates some subtle differences,
 * such as the presence of schema directives, which are not preserved in a
 * `GraphQLSchema`.
 */
function sortSchemaAst(doc) {
    return (0, graphql_1.visit)(doc, {
        ScalarTypeDefinition: function (t) {
            return __assign(__assign({}, t), { directives: sortNamed(t.directives) });
        },
        ObjectTypeDefinition: function (t) {
            return __assign(__assign({}, t), { directives: sortNamed(t.directives), interfaces: sortNamed(t.interfaces), fields: sortNamed(t.fields) });
        },
        InterfaceTypeDefinition: function (t) {
            return __assign(__assign({}, t), { directives: sortNamed(t.directives), interfaces: sortNamed(t.interfaces), fields: sortNamed(t.fields) });
        },
        UnionTypeDefinition: function (t) {
            return __assign(__assign({}, t), { directives: sortNamed(t.directives), types: sortNamed(t.types) });
        },
        EnumTypeDefinition: function (t) {
            return __assign(__assign({}, t), { directives: sortNamed(t.directives), values: sortNamed(t.values) });
        },
        InputObjectTypeDefinition: function (t) {
            return __assign(__assign({}, t), { directives: sortNamed(t.directives), fields: sortNamed(t.fields) });
        },
        Document: function (t) {
            var definitions = Array.from(t.definitions).sort(function (a, b) {
                var kindOrder = kindSortOrder(a) - kindSortOrder(b);
                if (kindOrder !== 0) {
                    return kindOrder;
                }
                return compareByName(a, b);
            });
            return __assign(__assign({}, t), { definitions: definitions });
        },
        FieldDefinition: function (t) {
            return __assign(__assign({}, t), { directives: sortNamed(t.directives), arguments: sortNamed(t.arguments) });
        },
        InputValueDefinition: function (t) {
            return __assign(__assign({}, t), { directives: sortNamed(t.directives) });
        },
        Directive: function (t) {
            return __assign(__assign({}, t), { arguments: sortNamed(t.arguments) });
        },
    });
}
exports.sortSchemaAst = sortSchemaAst;
// Given an optional array of AST nodes, sort them by name or kind.
function sortNamed(arr) {
    if (arr == null) {
        return arr;
    }
    return Array.from(arr).sort(compareByName);
}
// Note that we use `naturalCompare` here instead of `localeCompare`. This has
// three motivations:
//
// * It matches the behavior of `lexicographicSortSchema` from graphql-js.
// * It's stable across locales so users in different locales won't generate
//   different outputs from the same input resulting in unnecessary diffs.
// * It's likely a more user-friendly sort order than simple > or <.
function compareByName(a, b) {
    // If both are unnamed, sort by kind
    if (a.name == null && b.name == null) {
        return (0, naturalCompare_1.naturalCompare)(a.kind, b.kind);
    }
    // Unnamed things go first
    if (a.name == null) {
        return -1;
    }
    if (b.name == null) {
        return 1;
    }
    return (0, naturalCompare_1.naturalCompare)(a.name.value, b.name.value);
}
function kindSortOrder(def) {
    switch (def.kind) {
        case graphql_1.Kind.DIRECTIVE_DEFINITION:
            return 1;
        case graphql_1.Kind.SCHEMA_DEFINITION:
            return 2;
        case graphql_1.Kind.SCALAR_TYPE_DEFINITION:
            return 3;
        case graphql_1.Kind.SCALAR_TYPE_EXTENSION:
            return 3.5;
        case graphql_1.Kind.ENUM_TYPE_DEFINITION:
            return 4;
        case graphql_1.Kind.ENUM_TYPE_EXTENSION:
            return 4.5;
        case graphql_1.Kind.UNION_TYPE_DEFINITION:
            return 5;
        case graphql_1.Kind.UNION_TYPE_EXTENSION:
            return 5.5;
        case graphql_1.Kind.INTERFACE_TYPE_DEFINITION:
            return 6;
        case graphql_1.Kind.INTERFACE_TYPE_EXTENSION:
            return 6.5;
        case graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION:
            return 7;
        case graphql_1.Kind.INPUT_OBJECT_TYPE_EXTENSION:
            return 7.5;
        case graphql_1.Kind.OBJECT_TYPE_DEFINITION:
            return 8;
        case graphql_1.Kind.OBJECT_TYPE_EXTENSION:
            return 8.5;
        default: {
            return 9;
        }
    }
}
