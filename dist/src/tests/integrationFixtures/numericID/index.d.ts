import { ID } from "../../../Types";
/**
 * Validating that graphql-js will coerce a numeric ID to a string.
 * https://github.com/captbaritone/grats/issues/53
 */
/** @gqlType */
type Query = unknown;
/** @gqlField */
export declare function hello(_: Query, args: {
    someID: ID;
}): string;
export declare const query = "\n    query SomeQuery($someID: ID!) {\n      hello(someID: $someID)\n    }\n  ";
export declare const variables: {
    someID: number;
};
export {};
