/** @gqlType */
type Query = unknown;
/** @gqlField */
export declare function hello(_: Query, { greeting }: {
    greeting: string;
}): string;
export declare const query = "\n    query {\n      hello\n    }\n  ";
export {};
