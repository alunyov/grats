import * as ts from "typescript";
import { DiagnosticsWithoutLocationResult } from "../utils/DiagnosticError";
/**
 * Prevent using merged interfaces as GraphQL interfaces.
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
 */
export declare function validateMergedInterfaces(checker: ts.TypeChecker, interfaces: ts.InterfaceDeclaration[]): DiagnosticsWithoutLocationResult<void>;
