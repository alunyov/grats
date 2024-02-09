import { DocumentNode } from "graphql";
import { DiagnosticsResult } from "../utils/DiagnosticError";
import { ConfigOptions } from "../gratsConfig";
/**
 * Grats has options to make all fields nullable by default to conform to
 * GraphQL best practices. This transform applies this option to the schema.
 */
export declare function applyDefaultNullability(doc: DocumentNode, { nullableByDefault, strictSemanticNullability }: ConfigOptions): DiagnosticsResult<DocumentNode>;
