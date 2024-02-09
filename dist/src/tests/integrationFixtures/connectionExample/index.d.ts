import { Int } from "../../../Types";
/** @gqlType */
type Query = unknown;
/** @gqlField */
export declare function firstHundredIntegers(_: Query, args: {
    first?: Int | null;
    after?: string | null;
}): FirstHundredIntegersConnection;
/** @gqlType */
declare class FirstHundredIntegersConnection {
    first?: number | null | undefined;
    after?: string | null | undefined;
    _max: number;
    /** @gqlField */
    pageInfo: FirstHundredIntegersPageInfo;
    /** @gqlField */
    edges: FirstHundredIntegersEdge[];
    constructor(first?: number | null | undefined, after?: string | null | undefined);
}
/** @gqlType */
declare class FirstHundredIntegersPageInfo {
    constructor({ hasNext, hasPrevious, startCursor, endCursor, }: {
        hasNext: boolean;
        hasPrevious: boolean;
        startCursor: string;
        endCursor: string;
    });
    /**
     * @gqlField
     * @killsParentOnException
     */
    hasNextPage: boolean;
    /**
     * @gqlField
     * @killsParentOnException
     */
    hasPreviousPage: boolean;
    /** @gqlField */
    startCursor: string;
    /** @gqlField */
    endCursor: string;
}
/** @gqlType */
declare class FirstHundredIntegersEdge {
    constructor(node: number);
    /** @gqlField */
    node: Int;
    /** @gqlField */
    cursor: string;
}
export declare const query: string;
export {};
