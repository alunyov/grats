import { NameNode } from "graphql";
import * as ts from "typescript";
import { DiagnosticResult, DiagnosticsResult } from "./utils/DiagnosticError";
import { ExtractionSnapshot } from "./Extractor";
export declare const UNRESOLVED_REFERENCE_NAME = "__UNRESOLVED_REFERENCE__";
export type NameDefinition = {
    name: NameNode;
    kind: "TYPE" | "INTERFACE" | "UNION" | "SCALAR" | "INPUT_OBJECT" | "ENUM";
};
/**
 * Used to track TypeScript references.
 *
 * If a TS method is typed as returning `MyType`, we need to look at that type's
 * GQLType annotation to find out its name. However, we may not have seen that
 * class yet.
 *
 * So, we employ a two pass approach. When we encounter a reference to a type
 * we model it as a dummy type reference in the GraphQL AST. Then, after we've
 * parsed all the files, we traverse the GraphQL schema, resolving all the dummy
 * type references.
 */
export declare class TypeContext {
    checker: ts.TypeChecker;
    _symbolToName: Map<ts.Symbol, NameDefinition>;
    _unresolvedTypes: Map<NameNode, ts.Symbol>;
    static fromSnapshot(checker: ts.TypeChecker, snapshot: ExtractionSnapshot): TypeContext;
    constructor(checker: ts.TypeChecker);
    _recordTypeName(node: ts.Node, name: NameNode, kind: NameDefinition["kind"]): void;
    _markUnresolvedType(node: ts.Node, name: NameNode): void;
    findSymbolDeclaration(startSymbol: ts.Symbol): ts.Declaration | null;
    resolveSymbol(startSymbol: ts.Symbol): ts.Symbol;
    resolveNamedType(unresolved: NameNode): DiagnosticResult<NameNode>;
    unresolvedNameIsGraphQL(unresolved: NameNode): boolean;
    getNameDefinition(nameNode: NameNode): DiagnosticsResult<NameDefinition>;
}
