import { notHello as queryNotHelloResolver } from "./index";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
export function getSchema(): GraphQLSchema {
    const QueryType: GraphQLObjectType = new GraphQLObjectType({
        name: "Query",
        fields() {
            return {
                hello: {
                    name: "hello",
                    type: GraphQLString,
                    resolve(source, args, context, info) {
                        return context.readFromCacheOrEvaluate(args, info, () => { return queryNotHelloResolver(source); });
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
