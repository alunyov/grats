/** @gqlType */
type Query = unknown;
/** @gqlField */
export declare function me(_: Query): User;
/** @gqlType */
declare class User {
    /** @gqlField hello */
    NOT_THIS: string;
    constructor(
    /** @gqlField hello */
    NOT_THIS?: string);
}
export declare const query = "\n  query {\n    me {\n      hello\n    }\n  }\n";
export {};
