import { DocumentNode } from "graphql";
import { DiagnosticsResult } from "../utils/DiagnosticError";
import { TypeContext } from "../TypeContext";
/**
 * During the extraction process when we observe a type reference in a GraphQL
 * position we don't actually resolve that to its GraphQL type name during
 * extraction. Instead we rely on this transform to resolve those references and
 * ensure that they point to `@gql` types.
 */
export declare function resolveTypes(ctx: TypeContext, doc: DocumentNode): DiagnosticsResult<DocumentNode>;
