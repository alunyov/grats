import { GraphQLSchema } from "graphql";
import { DiagnosticsWithoutLocationResult } from "../utils/DiagnosticError";
import { ConfigOptions } from "../gratsConfig";
/**
 * Ensure that all semantically non-nullable fields on an interface are also
 * semantically non-nullable on all implementors.
 */
export declare function validateSemanticNullability(schema: GraphQLSchema, config: ConfigOptions): DiagnosticsWithoutLocationResult<GraphQLSchema>;
