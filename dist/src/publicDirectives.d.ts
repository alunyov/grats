import { ConstDirectiveNode, DefinitionNode, DocumentNode, Location } from "graphql";
/**
 * Grats supports some additional, non-spec server directives in order to
 * support experimental GraphQL features. This module contains the definition(s)
 * of those directives.
 */
export declare const SEMANTIC_NON_NULL_DIRECTIVE = "semanticNonNull";
export declare const DIRECTIVES_AST: DocumentNode;
export declare function addSemanticNonNullDirective(definitions: readonly DefinitionNode[]): Array<DefinitionNode>;
export declare function makeSemanticNonNullDirective(loc: Location): ConstDirectiveNode;
