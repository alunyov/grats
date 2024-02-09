import { DefinitionNode } from "graphql";
import { TypeContext } from "../TypeContext";
import { DiagnosticsResult } from "../utils/DiagnosticError";
import { GratsDefinitionNode } from "../GraphQLConstructor";
/**
 * Grats allows you to define GraphQL fields on TypeScript interfaces using
 * function syntax. This allows you to define a shared implementation for
 * all types that implement the interface.
 *
 * This transform takes those abstract field definitions, and adds them to
 * the concrete types that implement the interface.
 */
export declare function addInterfaceFields(ctx: TypeContext, docs: GratsDefinitionNode[]): DiagnosticsResult<DefinitionNode[]>;
