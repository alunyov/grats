"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlSourceToSourceFile = exports.tsRelated = exports.tsErr = exports.rangeErr = exports.gqlRelated = exports.gqlErr = exports.graphQlErrorToDiagnostic = exports.FAKE_ERROR_CODE = exports.ReportableDiagnostics = void 0;
var ts = require("typescript");
var ReportableDiagnostics = /** @class */ (function () {
    function ReportableDiagnostics(host, diagnostics) {
        this._host = host;
        this._diagnostics = diagnostics;
    }
    // If you don't have a host, for example if you error while parsing the
    // tsconfig, you can use this method and one will be created for you.
    ReportableDiagnostics.fromDiagnostics = function (diagnostics) {
        var formatHost = {
            getCanonicalFileName: function (path) { return path; },
            getCurrentDirectory: ts.sys.getCurrentDirectory,
            getNewLine: function () { return ts.sys.newLine; },
        };
        return new ReportableDiagnostics(formatHost, diagnostics);
    };
    ReportableDiagnostics.prototype.formatDiagnosticsWithColorAndContext = function () {
        var formatted = ts.formatDiagnosticsWithColorAndContext(this._diagnostics, this._host);
        // TypeScript requires having an error code, but we are not a real TS error,
        // so we don't have an error code. This little hack here is a sin, but it
        // lets us leverage all of TypeScript's error reporting logic.
        return formatted.replace(new RegExp(" TS".concat(exports.FAKE_ERROR_CODE, ": "), "g"), ": ");
    };
    ReportableDiagnostics.prototype.formatDiagnosticsWithContext = function () {
        return stripColor(this.formatDiagnosticsWithColorAndContext());
    };
    return ReportableDiagnostics;
}());
exports.ReportableDiagnostics = ReportableDiagnostics;
// A made-up error code that we use to fake a TypeScript error code.
// We pick a very random number to avoid collisions with real error messages.
exports.FAKE_ERROR_CODE = 349389149282;
function stripColor(str) {
    // eslint-disable-next-line no-control-regex
    return str.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, "");
}
// TODO: This is just a hack. Improve handling of multiple locations.
// TODO: Turn this back on
/* eslint-disable @typescript-eslint/no-non-null-assertion */
function graphQlErrorToDiagnostic(error) {
    var e_1, _a;
    var position = error.positions[0];
    if (position == null) {
        throw new Error("Expected error to have a position");
    }
    // Start with baseline location information
    var start = position;
    var length = 1;
    var relatedInformation;
    // Nodes have actual ranges (not just a single position), so we we have one
    // (or more!) use that instead.
    if (error.nodes != null && error.nodes.length > 0) {
        var _b = __read(error.nodes), node = _b[0], rest = _b.slice(1);
        if (node.loc != null) {
            start = node.loc.start;
            length = node.loc.end - node.loc.start;
            if (rest.length > 0) {
                relatedInformation = [];
                try {
                    for (var rest_1 = __values(rest), rest_1_1 = rest_1.next(); !rest_1_1.done; rest_1_1 = rest_1.next()) {
                        var relatedNode = rest_1_1.value;
                        if (relatedNode.loc == null) {
                            continue;
                        }
                        relatedInformation.push(gqlRelated(relatedNode.loc, "Related location"));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (rest_1_1 && !rest_1_1.done && (_a = rest_1.return)) _a.call(rest_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        }
    }
    var sourceFile;
    if (error.source != null) {
        sourceFile = graphqlSourceToSourceFile(error.source);
    }
    return {
        messageText: error.message,
        file: sourceFile,
        code: exports.FAKE_ERROR_CODE,
        category: ts.DiagnosticCategory.Error,
        start: start,
        length: length,
        relatedInformation: relatedInformation,
        source: "Grats",
    };
}
exports.graphQlErrorToDiagnostic = graphQlErrorToDiagnostic;
function gqlErr(loc, message, relatedInformation) {
    return {
        messageText: message,
        file: graphqlSourceToSourceFile(loc.source),
        code: exports.FAKE_ERROR_CODE,
        category: ts.DiagnosticCategory.Error,
        start: loc.start,
        length: loc.end - loc.start,
        relatedInformation: relatedInformation,
        source: "Grats",
    };
}
exports.gqlErr = gqlErr;
function gqlRelated(loc, message) {
    return {
        category: ts.DiagnosticCategory.Message,
        code: exports.FAKE_ERROR_CODE,
        messageText: message,
        file: graphqlSourceToSourceFile(loc.source),
        start: loc.start,
        length: loc.end - loc.start,
    };
}
exports.gqlRelated = gqlRelated;
function rangeErr(file, commentRange, message, relatedInformation) {
    var start = commentRange.pos;
    var length = commentRange.end - commentRange.pos;
    return {
        messageText: message,
        file: file,
        code: exports.FAKE_ERROR_CODE,
        category: ts.DiagnosticCategory.Error,
        start: start,
        length: length,
        relatedInformation: relatedInformation,
        source: "Grats",
    };
}
exports.rangeErr = rangeErr;
function tsErr(node, message, relatedInformation) {
    var start = node.getStart();
    var length = node.getEnd() - start;
    var sourceFile = node.getSourceFile();
    return {
        messageText: message,
        file: sourceFile,
        code: exports.FAKE_ERROR_CODE,
        category: ts.DiagnosticCategory.Error,
        start: start,
        length: length,
        relatedInformation: relatedInformation,
        source: "Grats",
    };
}
exports.tsErr = tsErr;
function tsRelated(node, message) {
    return {
        category: ts.DiagnosticCategory.Message,
        code: 0,
        file: node.getSourceFile(),
        start: node.getStart(),
        length: node.getWidth(),
        messageText: message,
    };
}
exports.tsRelated = tsRelated;
function graphqlSourceToSourceFile(source) {
    return ts.createSourceFile(source.name, source.body, ts.ScriptTarget.Latest);
}
exports.graphqlSourceToSourceFile = graphqlSourceToSourceFile;
