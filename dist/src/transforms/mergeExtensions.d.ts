import { DocumentNode } from "graphql";
/**
 * Takes every example of `extend type Foo` and `extend interface Foo` and
 * merges them into the original type/interface definition.
 */
export declare function mergeExtensions(doc: DocumentNode): DocumentNode;
