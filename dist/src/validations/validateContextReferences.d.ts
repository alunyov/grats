import * as ts from "typescript";
import { DiagnosticsWithoutLocationResult } from "../utils/DiagnosticError";
import { TypeContext } from "../TypeContext";
/**
 * Ensure that all context type references resolve to the same
 * type declaration.
 */
export declare function validateContextReferences(ctx: TypeContext, references: ts.Node[]): DiagnosticsWithoutLocationResult<void>;
