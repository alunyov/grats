import * as ts from "typescript";
export declare function detectInvalidComments(sourceFile: ts.SourceFile, validCommentPositions: Set<number>): ts.Diagnostic[];
/**
 * TypeScript does not provide a way to iterate over comments, so this function
 * provides a way to iterate over all comments in a source file.
 */
export declare function forEachComment(sourceFile: ts.SourceFile, callback: (fullText: string, comment: ts.CommentRange) => void): void;
