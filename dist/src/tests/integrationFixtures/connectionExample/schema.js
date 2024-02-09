"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchema = void 0;
var index_1 = require("./index");
var graphql_1 = require("graphql");
function getSchema() {
    var FirstHundredIntegersEdgeType = new graphql_1.GraphQLObjectType({
        name: "FirstHundredIntegersEdge",
        fields: function () {
            return {
                cursor: {
                    name: "cursor",
                    type: graphql_1.GraphQLString
                },
                node: {
                    name: "node",
                    type: graphql_1.GraphQLInt
                }
            };
        }
    });
    var FirstHundredIntegersPageInfoType = new graphql_1.GraphQLObjectType({
        name: "FirstHundredIntegersPageInfo",
        fields: function () {
            return {
                endCursor: {
                    name: "endCursor",
                    type: graphql_1.GraphQLString
                },
                hasNextPage: {
                    name: "hasNextPage",
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
                },
                hasPreviousPage: {
                    name: "hasPreviousPage",
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean)
                },
                startCursor: {
                    name: "startCursor",
                    type: graphql_1.GraphQLString
                }
            };
        }
    });
    var FirstHundredIntegersConnectionType = new graphql_1.GraphQLObjectType({
        name: "FirstHundredIntegersConnection",
        fields: function () {
            return {
                edges: {
                    name: "edges",
                    type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(FirstHundredIntegersEdgeType))
                },
                pageInfo: {
                    name: "pageInfo",
                    type: FirstHundredIntegersPageInfoType
                }
            };
        }
    });
    var QueryType = new graphql_1.GraphQLObjectType({
        name: "Query",
        fields: function () {
            return {
                firstHundredIntegers: {
                    name: "firstHundredIntegers",
                    type: FirstHundredIntegersConnectionType,
                    args: {
                        after: {
                            name: "after",
                            type: graphql_1.GraphQLString
                        },
                        first: {
                            name: "first",
                            type: graphql_1.GraphQLInt
                        }
                    },
                    resolve: function (source, args, context, info) {
                        return context.readFromCacheOrEvaluate(args, info, function () { return (0, index_1.firstHundredIntegers)(source, args); });
                    }
                }
            };
        }
    });
    return new graphql_1.GraphQLSchema({
        query: QueryType,
        types: [FirstHundredIntegersConnectionType, FirstHundredIntegersEdgeType, FirstHundredIntegersPageInfoType, QueryType]
    });
}
exports.getSchema = getSchema;
