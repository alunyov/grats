/** @gqlType */
type Query = unknown;
/** @gqlField */
export declare function someList(_: Query): string[];
/** @gqlField */
export declare function someListOfLists(_: Query): string[][];
export declare const query = "\n  query {\n    someList\n    someListOfLists\n  }\n";
export {};
