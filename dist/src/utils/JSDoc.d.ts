import * as ts from "typescript";
export declare function traverseJSDocTags(node: ts.Node, cb: (parent: ts.Node, tag: ts.JSDocTag) => void): void;
