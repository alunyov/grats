import { DocumentNode } from "graphql";
import { TypeContext } from "../TypeContext";
/**
 * Filter out `implements` declarations that don't refer to a GraphQL interface.
 * Note: We depend upon traversal order here to ensure that we remove all
 * non-GraphQL interfaces before we try to resolve the names of the GraphQL
 * interfaces.
 */
export declare function filterNonGqlInterfaces(ctx: TypeContext, doc: DocumentNode): DocumentNode;
