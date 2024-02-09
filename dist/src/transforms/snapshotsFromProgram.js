"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSnapshotsFromProgram = void 0;
var ts = require("typescript");
var Extractor_1 = require("../Extractor");
var Result_1 = require("../utils/Result");
var Result_2 = require("../utils/Result");
var helpers_1 = require("../utils/helpers");
var TAG_REGEX = /@(gql)|(killsParentOnException)/i;
// Given a ts.Program, extract a set of ExtractionSnapshots from it.
// In the future this part might be able to be incremental, were we only run extraction
// on changed files.
function extractSnapshotsFromProgram(program, options) {
    var errors = [];
    var gratsSourceFiles = program.getSourceFiles().filter(function (sourceFile) {
        // If the file doesn't contain any GraphQL definitions, skip it.
        if (!TAG_REGEX.test(sourceFile.text)) {
            return false;
        }
        if (options.raw.grats.reportTypeScriptTypeErrors) {
            // If the user asked for us to report TypeScript errors, then we'll report them.
            var typeErrors = ts.getPreEmitDiagnostics(program, sourceFile);
            if (typeErrors.length > 0) {
                (0, helpers_1.extend)(errors, typeErrors);
                return false;
            }
        }
        else {
            // Otherwise, we will only report syntax errors, since they will prevent us from
            // extracting any GraphQL definitions.
            var syntaxErrors = program.getSyntacticDiagnostics(sourceFile);
            if (syntaxErrors.length > 0) {
                // It's not very helpful to report multiple syntax errors, so just report
                // the first one.
                errors.push(syntaxErrors[0]);
                return false;
            }
        }
        return true;
    });
    if (errors.length > 0) {
        return (0, Result_2.err)(errors);
    }
    var extractResults = gratsSourceFiles.map(function (sourceFile) {
        return (0, Extractor_1.extract)(sourceFile);
    });
    return (0, Result_1.collectResults)(extractResults);
}
exports.extractSnapshotsFromProgram = extractSnapshotsFromProgram;
