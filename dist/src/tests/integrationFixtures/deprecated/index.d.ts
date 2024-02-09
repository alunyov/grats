/** @gqlType */
type Query = unknown;
/**
 * @gqlField
 * @deprecated For reasons
 */
export declare function hello(_: Query): string;
/**
 * @gqlField
 * @deprecated
 */
export declare function goodBye(_: Query): string;
export declare const query = "\n    query {\n      hello\n    }\n  ";
export {};
