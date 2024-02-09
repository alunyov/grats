import { DiagnosticsResult } from "./DiagnosticError";
export type Result<T, E> = Ok<T> | Err<E>;
type Ok<T> = {
    kind: "OK";
    value: T;
};
type Err<E> = {
    kind: "ERROR";
    err: E;
};
export declare function ok<T>(value: T): Ok<T>;
export declare function err<E>(err: E): Err<E>;
/**
 * Helper class for chaining together a series of `Result` operations.
 */
export declare class ResultPipe<T, E> {
    private readonly _result;
    constructor(_result: Result<T, E>);
    map<T2>(fn: (value: T) => T2): ResultPipe<T2, E>;
    mapErr<E2>(fn: (e: E) => E2): ResultPipe<T, E2>;
    andThen<U>(fn: (value: T) => Result<U, E>): ResultPipe<U, E>;
    result(): Result<T, E>;
}
export declare function collectResults<T>(results: DiagnosticsResult<T>[]): DiagnosticsResult<T[]>;
export declare function concatResults<T, U, E>(result1: Result<T, E[]>, result2: Result<U, E[]>): Result<[T, U], E[]>;
export {};
