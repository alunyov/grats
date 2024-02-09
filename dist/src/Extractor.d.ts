import { NameNode } from "graphql";
import { DiagnosticsResult } from "./utils/DiagnosticError";
import * as ts from "typescript";
import { NameDefinition } from "./TypeContext";
import { GratsDefinitionNode } from "./GraphQLConstructor";
export declare const LIBRARY_IMPORT_NAME = "grats";
export declare const LIBRARY_NAME = "Grats";
export declare const TYPE_TAG = "gqlType";
export declare const FIELD_TAG = "gqlField";
export declare const SCALAR_TAG = "gqlScalar";
export declare const INTERFACE_TAG = "gqlInterface";
export declare const ENUM_TAG = "gqlEnum";
export declare const UNION_TAG = "gqlUnion";
export declare const INPUT_TAG = "gqlInput";
export declare const IMPLEMENTS_TAG_DEPRECATED = "gqlImplements";
export declare const KILLS_PARENT_ON_EXCEPTION_TAG = "killsParentOnException";
export declare const ALL_TAGS: string[];
export type ExtractionSnapshot = {
    readonly definitions: GratsDefinitionNode[];
    readonly unresolvedNames: Map<ts.Node, NameNode>;
    readonly nameDefinitions: Map<ts.Node, NameDefinition>;
    readonly contextReferences: Array<ts.Node>;
    readonly typesWithTypename: Set<string>;
    readonly interfaceDeclarations: Array<ts.InterfaceDeclaration>;
};
/**
 * Extracts GraphQL definitions from TypeScript source code.
 *
 * Note that we extract a GraphQL AST with the AST nodes' location information
 * populated with references to the TypeScript code from which the types were
 * derived.
 *
 * This ensures that we can apply GraphQL schema validation rules, and any reported
 * errors will point to the correct location in the TypeScript source code.
 */
export declare function extract(sourceFile: ts.SourceFile): DiagnosticsResult<ExtractionSnapshot>;
