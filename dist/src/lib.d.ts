import { DocumentNode, GraphQLSchema } from "graphql";
import { DiagnosticsWithoutLocationResult, ReportableDiagnostics } from "./utils/DiagnosticError";
import { Result } from "./utils/Result";
import * as ts from "typescript";
import { ParsedCommandLineGrats } from "./gratsConfig";
export type SchemaAndDoc = {
    schema: GraphQLSchema;
    doc: DocumentNode;
};
export declare function buildSchemaAndDocResult(options: ParsedCommandLineGrats): Result<SchemaAndDoc, ReportableDiagnostics>;
export declare function buildSchemaAndDocResultWithHost(options: ParsedCommandLineGrats, compilerHost: ts.CompilerHost): Result<SchemaAndDoc, ReportableDiagnostics>;
/**
 * The core transformation pipeline of Grats.
 */
export declare function extractSchemaAndDoc(options: ParsedCommandLineGrats, program: ts.Program): DiagnosticsWithoutLocationResult<SchemaAndDoc>;
