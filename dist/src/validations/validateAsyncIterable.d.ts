import { DocumentNode } from "graphql";
import { DiagnosticsResult } from "../utils/DiagnosticError";
/**
 * Ensure that all fields on `Subscription` return an AsyncIterable, and that no other
 * fields do.
 */
export declare function validateAsyncIterable(doc: DocumentNode): DiagnosticsResult<DocumentNode>;
