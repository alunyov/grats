import { GratsDefinitionNode } from "./GraphQLConstructor";
import { TypeContext } from "./TypeContext";
import { DefaultMap } from "./utils/helpers";
export type InterfaceImplementor = {
    kind: "TYPE" | "INTERFACE";
    name: string;
};
export type InterfaceMap = DefaultMap<string, Set<InterfaceImplementor>>;
/**
 * Compute a map of interfaces to the types and interfaces that implement them.
 */
export declare function computeInterfaceMap(typeContext: TypeContext, docs: GratsDefinitionNode[]): InterfaceMap;
