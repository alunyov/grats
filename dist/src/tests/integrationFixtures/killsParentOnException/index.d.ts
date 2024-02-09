/** @gqlType */
type Query = unknown;
/** @gqlField */
export declare function me(_: Query): User;
/** @gqlType */
declare class User {
    /**
     * @gqlField
     * @killsParentOnException
     */
    alwaysThrowsKillsParentOnException(): string;
}
export declare const query = "\n  query {\n    me {\n      alwaysThrowsKillsParentOnException\n    }\n  }\n";
export {};
