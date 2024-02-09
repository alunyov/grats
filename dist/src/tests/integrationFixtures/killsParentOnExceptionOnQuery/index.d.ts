/** @gqlType */
type Query = unknown;
/**
 * @gqlField
 * @killsParentOnException
 */
export declare function alwaysThrowsKillsParentOnException(_: Query): string;
/** @gqlField */
export declare function hello(_: Query): string;
export declare const query = "\n  query {\n    alwaysThrowsKillsParentOnException\n    hello\n  }\n";
export {};
