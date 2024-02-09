"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchema = void 0;
var index_1 = require("./index");
var index_2 = require("./index");
var graphql_1 = require("graphql");
function getSchema() {
    var QueryType = new graphql_1.GraphQLObjectType({
        name: "Query",
        fields: function () {
            return {
                goodBye: {
                    deprecationReason: "No longer supported",
                    name: "goodBye",
                    type: graphql_1.GraphQLString,
                    resolve: function (source, args, context, info) {
                        return context.readFromCacheOrEvaluate(args, info, function () { return (0, index_1.goodBye)(source); });
                    }
                },
                hello: {
                    deprecationReason: "For reasons",
                    name: "hello",
                    type: graphql_1.GraphQLString,
                    resolve: function (source, args, context, info) {
                        return context.readFromCacheOrEvaluate(args, info, function () { return (0, index_2.hello)(source); });
                    }
                }
            };
        }
    });
    return new graphql_1.GraphQLSchema({
        query: QueryType,
        types: [QueryType]
    });
}
exports.getSchema = getSchema;