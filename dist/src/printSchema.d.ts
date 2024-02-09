import { DocumentNode, GraphQLSchema } from "graphql";
import { ConfigOptions } from "./gratsConfig";
/**
 * Prints code for a TypeScript module that exports a GraphQLSchema.
 * Includes the user-defined (or default) header comment if provided.
 */
export declare function printExecutableSchema(schema: GraphQLSchema, config: ConfigOptions, destination: string): string;
/**
 * Prints SDL, potentially omitting directives depending upon the config.
 * Includes the user-defined (or default) header comment if provided.
 */
export declare function printGratsSDL(doc: DocumentNode, config: ConfigOptions): string;
export declare function printSDLWithoutMetadata(doc: DocumentNode): string;
