/** @gqlType */
type Query = unknown;
/**
 * @gqlInput
 */
type SomeObj = {
    /** @gqlField */
    a: string;
};
/**
 * @gqlField
 */
export declare function hello(_: Query, { someObj, }: {
    someObj: SomeObj;
}): string;
export declare const query = "\n    query {\n      hello\n    }\n  ";
export {};
