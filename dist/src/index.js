"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParsedTsConfig = exports.codegen = exports.extract = exports.printSDLWithoutMetadata = void 0;
var ts = require("typescript");
var gratsConfig_1 = require("./gratsConfig");
var DiagnosticError_1 = require("./utils/DiagnosticError");
var Result_1 = require("./utils/Result");
var printSchema_1 = require("./printSchema");
Object.defineProperty(exports, "printSDLWithoutMetadata", { enumerable: true, get: function () { return printSchema_1.printSDLWithoutMetadata; } });
__exportStar(require("./Types"), exports);
__exportStar(require("./lib"), exports);
// Used by the experimental TypeScript plugin
var Extractor_1 = require("./Extractor");
Object.defineProperty(exports, "extract", { enumerable: true, get: function () { return Extractor_1.extract; } });
var codegen_1 = require("./codegen");
Object.defineProperty(exports, "codegen", { enumerable: true, get: function () { return codegen_1.codegen; } });
// #FIXME: Report diagnostics instead of throwing!
function getParsedTsConfig(configFile) {
    if (!configFile) {
        throw new Error("Grats: Could not find tsconfig.json");
    }
    // https://github.com/microsoft/TypeScript/blob/46d70d79cd0dd00d19e4c617d6ebb25e9f3fc7de/src/compiler/watch.ts#L216
    var configFileHost = ts.sys;
    var parsed = ts.getParsedCommandLineOfConfigFile(configFile, undefined, configFileHost);
    if (!parsed) {
        throw new Error("Grats: Could not locate tsconfig.json");
    }
    if (parsed.errors.length > 0) {
        return (0, Result_1.err)(DiagnosticError_1.ReportableDiagnostics.fromDiagnostics(parsed.errors));
    }
    return (0, Result_1.ok)((0, gratsConfig_1.validateGratsOptions)(parsed));
}
exports.getParsedTsConfig = getParsedTsConfig;
