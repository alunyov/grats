import { Location } from "graphql";
export declare class DefaultMap<K, V> {
    private readonly getDefault;
    _map: Map<K, V>;
    constructor(getDefault: () => V);
    get(key: K): V;
}
export declare function extend<T>(a: T[], b: readonly T[]): void;
export declare function loc(item: {
    loc?: Location;
}): Location;
export declare function astNode<T>(item: {
    astNode?: T | undefined | null;
}): T;
