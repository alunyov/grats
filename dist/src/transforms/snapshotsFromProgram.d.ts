import * as ts from "typescript";
import { ParsedCommandLineGrats } from "../gratsConfig";
import { ExtractionSnapshot } from "../Extractor";
import { DiagnosticsWithoutLocationResult } from "../utils/DiagnosticError";
export declare function extractSnapshotsFromProgram(program: ts.Program, options: ParsedCommandLineGrats): DiagnosticsWithoutLocationResult<ExtractionSnapshot[]>;
