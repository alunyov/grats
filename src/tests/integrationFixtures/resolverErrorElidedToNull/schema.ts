import { alwaysThrows as queryAlwaysThrowsResolver } from "./index";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
export function getSchema(): GraphQLSchema {
    const QueryType: GraphQLObjectType = new GraphQLObjectType({
        name: "Query",
        fields() {
            return {
                alwaysThrows: {
                    name: "alwaysThrows",
                    type: GraphQLString,
                    resolve(source, args, ctx, info) {
                        return ctx.readFromCacheOrEvaluate(source => { return queryAlwaysThrowsResolver(source); });
                    }
                }
            };
        }
    });
    return new GraphQLSchema({
        query: QueryType,
        types: [QueryType]
    });
}
