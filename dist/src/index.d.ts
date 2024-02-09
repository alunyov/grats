import { ParsedCommandLineGrats } from "./gratsConfig";
import { ReportableDiagnostics } from "./utils/DiagnosticError";
import { Result } from "./utils/Result";
export { printSDLWithoutMetadata } from "./printSchema";
export * from "./Types";
export * from "./lib";
export { extract } from "./Extractor";
export { codegen } from "./codegen";
export declare function getParsedTsConfig(configFile: string): Result<ParsedCommandLineGrats, ReportableDiagnostics>;
