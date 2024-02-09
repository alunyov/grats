import { GraphQLSchema } from "graphql";
import { DiagnosticsWithoutLocationResult } from "../utils/DiagnosticError";
/**
 * Ensure that every type which implements an interface or is a member of a
 * union has a __typename field.
 */
export declare function validateTypenames(schema: GraphQLSchema, hasTypename: Set<string>): DiagnosticsWithoutLocationResult<GraphQLSchema>;
