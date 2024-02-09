import * as ts from "typescript";
export declare const ASSERT_NON_NULL_HELPER = "assertNonNull";
/**
 * async function assertNonNull<T>(value: T | Promise<T>): Promise<T> {
 *   const awaited = await value;
 *   if (awaited == null)
 *     throw new Error("Cannot return null for semantically non-nullable field.");
 *   return awaited;
 * }
 */
export declare function createAssertNonNullHelper(): ts.FunctionDeclaration;
