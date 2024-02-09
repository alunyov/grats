/** @gqlType */
export type Query = unknown;
/** @gqlField */
export declare function me(_: Query): User;
/** @gqlType */
declare class User {
    /** @gqlField */
    get hello(): string;
}
export declare const query = "\n  query {\n    me {\n      hello\n    }\n  }";
export {};
