/**
 * Returns a number indicating whether a reference string comes before, or after,
 * or is the same as the given string in natural sort order.
 *
 * See: https://en.wikipedia.org/wiki/Natural_sort_order
 *
 * ~~Stolen~~ Borrowed from:
 * https://github.com/graphql/graphql-js/blob/2aedf25e157d1d1c8fdfeaa4c0d2f3d9d3457dba/src/jsutils/naturalCompare.ts
 */
export declare function naturalCompare(aStr: string, bStr: string): number;
