/** @gqlType */
type Query = unknown;
/** @gqlField */
export declare function actuallyReturnsNull(_: Query): string;
/** @gqlField */
export declare function actuallyReturnsAsyncNull(_: Query): Promise<string>;
/** @gqlField */
export declare function me(_: Query): User;
/** @gqlInterface */
interface IPerson {
    /** @gqlField */
    name: string;
}
/** @gqlType */
declare class User implements IPerson {
    __typename: string;
    constructor(name: string);
    /** @gqlField */
    name: string;
    /** @gqlField notName */
    alsoName: string;
}
/** @gqlType */
type Subscription = unknown;
/** @gqlField */
export declare function names(_: Subscription): AsyncIterable<string>;
export declare const query = "\n  query {\n    actuallyReturnsNull\n    actuallyReturnsAsyncNull\n    me {\n      name\n      notName\n    }\n  }\n";
export {};
