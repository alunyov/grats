#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLoc = void 0;
var _1 = require("./");
var lib_1 = require("./lib");
var commander_1 = require("commander");
var fs_1 = require("fs");
var path_1 = require("path");
var package_json_1 = require("../package.json");
var Locate_1 = require("./Locate");
var printSchema_1 = require("./printSchema");
var ts = require("typescript");
var DiagnosticError_1 = require("./utils/DiagnosticError");
var program = new commander_1.Command();
program
    .name("grats")
    .description("Extract GraphQL schema from your TypeScript project")
    .version(package_json_1.version)
    .option("--tsconfig <TSCONFIG>", "Path to tsconfig.json. Defaults to auto-detecting based on the current working directory")
    .option("--watch", "Watch for changes and rebuild schema files as needed")
    .action(function (_a) {
    var tsconfig = _a.tsconfig, watch = _a.watch;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            if (watch) {
                startWatchMode(tsconfig);
            }
            else {
                runBuild(tsconfig);
            }
            return [2 /*return*/];
        });
    });
});
program
    .command("locate")
    .argument("<ENTITY>", "GraphQL entity to locate. E.g. `User` or `User.id`")
    .option("--tsconfig <TSCONFIG>", "Path to tsconfig.json. Defaults to auto-detecting based on the current working directory")
    .action(function (entity, _a) {
    var tsconfig = _a.tsconfig;
    var config = getTsConfigOrReportAndExit(tsconfig).config;
    var schemaAndDocResult = (0, lib_1.buildSchemaAndDocResult)(config);
    if (schemaAndDocResult.kind === "ERROR") {
        console.error(schemaAndDocResult.err.formatDiagnosticsWithColorAndContext());
        process.exit(1);
    }
    var schema = schemaAndDocResult.value.schema;
    var loc = (0, Locate_1.locate)(schema, entity);
    if (loc.kind === "ERROR") {
        console.error(loc.err);
        process.exit(1);
    }
    console.log(formatLoc(loc.value));
});
program.parse();
/**
 * Run the compiler in watch mode.
 */
function startWatchMode(tsconfig) {
    var _a = getTsConfigOrReportAndExit(tsconfig), config = _a.config, configPath = _a.configPath;
    var watchHost = ts.createWatchCompilerHost(configPath, {}, ts.sys, ts.createSemanticDiagnosticsBuilderProgram, function (diagnostic) { return reportDiagnostics([diagnostic]); }, function (diagnostic) { return reportDiagnostics([diagnostic]); });
    watchHost.afterProgramCreate = function (program) {
        // For now we just rebuild the schema on every change.
        var schemaResult = (0, lib_1.extractSchemaAndDoc)(config, program.getProgram());
        if (schemaResult.kind === "ERROR") {
            reportDiagnostics(schemaResult.err);
            return;
        }
        writeSchemaFilesAndReport(schemaResult.value, config, configPath);
    };
    ts.createWatchProgram(watchHost);
}
/**
 * Run the compiler performing a single build.
 */
function runBuild(tsconfig) {
    var _a = getTsConfigOrReportAndExit(tsconfig), config = _a.config, configPath = _a.configPath;
    var schemaAndDocResult = (0, lib_1.buildSchemaAndDocResult)(config);
    if (schemaAndDocResult.kind === "ERROR") {
        console.error(schemaAndDocResult.err.formatDiagnosticsWithColorAndContext());
        process.exit(1);
    }
    writeSchemaFilesAndReport(schemaAndDocResult.value, config, configPath);
}
/**
 * Serializes the SDL and TypeScript schema to disk and reports to the console.
 */
function writeSchemaFilesAndReport(schemaAndDoc, config, configPath) {
    var schema = schemaAndDoc.schema, doc = schemaAndDoc.doc;
    var gratsOptions = config.raw.grats;
    var dest = (0, path_1.resolve)((0, path_1.dirname)(configPath), gratsOptions.tsSchema);
    var code = (0, printSchema_1.printExecutableSchema)(schema, gratsOptions, dest);
    (0, fs_1.writeFileSync)(dest, code);
    console.error("Grats: Wrote TypeScript schema to `".concat(dest, "`."));
    var schemaStr = (0, printSchema_1.printGratsSDL)(doc, gratsOptions);
    var absOutput = (0, path_1.resolve)((0, path_1.dirname)(configPath), gratsOptions.graphqlSchema);
    (0, fs_1.writeFileSync)(absOutput, schemaStr);
    console.error("Grats: Wrote schema to `".concat(absOutput, "`."));
}
/**
 * Utility function to report diagnostics to the console.
 */
function reportDiagnostics(diagnostics) {
    var reportable = DiagnosticError_1.ReportableDiagnostics.fromDiagnostics(diagnostics);
    console.error(reportable.formatDiagnosticsWithColorAndContext());
}
// Locate and read the tsconfig.json file
function getTsConfigOrReportAndExit(tsconfig) {
    var configPath = tsconfig || ts.findConfigFile(process.cwd(), ts.sys.fileExists);
    if (configPath == null) {
        throw new Error("Grats: Could not find tsconfig.json");
    }
    var optionsResult = (0, _1.getParsedTsConfig)(configPath);
    if (optionsResult.kind === "ERROR") {
        console.error(optionsResult.err.formatDiagnosticsWithColorAndContext());
        process.exit(1);
    }
    return { configPath: configPath, config: optionsResult.value };
}
// Format a location for printing to the console. Tools like VS Code and iTerm
// will automatically turn this into a clickable link.
function formatLoc(loc) {
    return "".concat(loc.source.name, ":").concat(loc.startToken.line + 1, ":").concat(loc.startToken.column + 1);
}
exports.formatLoc = formatLoc;
