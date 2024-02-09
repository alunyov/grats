import { ConstDirectiveNode, DocumentNode, Location } from "graphql";
import { GratsDefinitionNode } from "./GraphQLConstructor";
export declare const FIELD_NAME_DIRECTIVE = "propertyName";
export declare const EXPORTED_DIRECTIVE = "exported";
export declare const ASYNC_ITERABLE_TYPE_DIRECTIVE = "asyncIterable";
export declare const KILLS_PARENT_ON_EXCEPTION_DIRECTIVE = "killsParentOnException";
export declare const METADATA_DIRECTIVE_NAMES: Set<string>;
export declare const DIRECTIVES_AST: DocumentNode;
export declare function addMetadataDirectives(definitions: Array<GratsDefinitionNode>): Array<GratsDefinitionNode>;
export type AsyncIterableTypeMetadata = true;
export type PropertyNameMetadata = {
    name: string;
    isMethod: boolean;
};
export type ExportedMetadata = {
    tsModulePath: string;
    exportedFunctionName: string;
    argCount: number;
};
export declare function makePropertyNameDirective(loc: Location, propertyName: PropertyNameMetadata): ConstDirectiveNode;
export declare function makeExportedDirective(loc: Location, exported: ExportedMetadata): ConstDirectiveNode;
export declare function makeAsyncIterableDirective(loc: Location): ConstDirectiveNode;
export declare function makeKillsParentOnExceptionDirective(loc: Location): ConstDirectiveNode;
export declare function parseAsyncIterableTypeDirective(directive: ConstDirectiveNode): AsyncIterableTypeMetadata;
export declare function parsePropertyNameDirective(directive: ConstDirectiveNode): PropertyNameMetadata;
export declare function parseExportedDirective(directive: ConstDirectiveNode): ExportedMetadata;
