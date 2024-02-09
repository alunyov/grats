import { GraphQLSchema, Location } from "graphql";
import { Result } from "./utils/Result";
/**
 * Given an entity name of the format `ParentType` or `ParentType.fieldName`,
 * locate the entity in the schema and return its location.
 */
export declare function locate(schema: GraphQLSchema, entityName: string): Result<Location, string>;
