import { GraphQLError, Location, Source } from "graphql";
import * as ts from "typescript";
import { Result } from "./Result";
export type DiagnosticResult<T> = Result<T, ts.DiagnosticWithLocation>;
export type DiagnosticsResult<T> = Result<T, ts.DiagnosticWithLocation[]>;
export type DiagnosticsWithoutLocationResult<T> = Result<T, ts.Diagnostic[]>;
export declare class ReportableDiagnostics {
    _host: ts.FormatDiagnosticsHost;
    _diagnostics: ts.Diagnostic[];
    constructor(host: ts.FormatDiagnosticsHost, diagnostics: ts.Diagnostic[]);
    static fromDiagnostics(diagnostics: ts.Diagnostic[]): ReportableDiagnostics;
    formatDiagnosticsWithColorAndContext(): string;
    formatDiagnosticsWithContext(): string;
}
export declare const FAKE_ERROR_CODE = 349389149282;
export declare function graphQlErrorToDiagnostic(error: GraphQLError): ts.Diagnostic;
export declare function gqlErr(loc: Location, message: string, relatedInformation?: ts.DiagnosticRelatedInformation[]): ts.DiagnosticWithLocation;
export declare function gqlRelated(loc: Location, message: string): ts.DiagnosticRelatedInformation;
export declare function rangeErr(file: ts.SourceFile, commentRange: ts.CommentRange, message: string, relatedInformation?: ts.DiagnosticRelatedInformation[]): ts.DiagnosticWithLocation;
export declare function tsErr(node: ts.Node, message: string, relatedInformation?: ts.DiagnosticRelatedInformation[]): ts.DiagnosticWithLocation;
export declare function tsRelated(node: ts.Node, message: string): ts.DiagnosticRelatedInformation;
export declare function graphqlSourceToSourceFile(source: Source): ts.SourceFile;
