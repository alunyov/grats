/**
 * Validating what graphql-js does when an explicit null is passed to an argument
 * with a default value.
 *
 * Spoiler alert: it passes the explicit null.
 */
/** @gqlType */
type Query = unknown;
/**
 * @gqlField
 */
export declare function hello(_: Query, { someArg }: {
    someArg?: string | null;
}): string;
export declare const query = "\n    query {\n      hello(someArg: null)\n    }\n  ";
export {};
