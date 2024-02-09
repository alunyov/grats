"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var path = require("path");
var TestRunner_1 = require("./TestRunner");
var lib_1 = require("../lib");
var ts = require("typescript");
var graphql_1 = require("graphql");
var commander_1 = require("commander");
var Locate_1 = require("../Locate");
var DiagnosticError_1 = require("../utils/DiagnosticError");
var fs_1 = require("fs");
var codegen_1 = require("../codegen");
var jest_diff_1 = require("jest-diff");
var metadataDirectives_1 = require("../metadataDirectives");
var semver = require("semver");
var gratsConfig_1 = require("../gratsConfig");
var publicDirectives_1 = require("../publicDirectives");
var TS_VERSION = ts.version;
var program = new commander_1.Command();
program
    .name("grats-tests")
    .description("Run Grats' internal tests")
    .option("-w, --write", "Write the actual output of the test to the expected output files. Useful for updating tests.")
    .option("-f, --filter <FILTER_REGEX>", "A regex to filter the tests to run. Only tests with a file path matching the regex will be run.")
    .action(function (_a) {
    var filter = _a.filter, write = _a.write;
    return __awaiter(void 0, void 0, void 0, function () {
        var filterRegex, failures, testDirs_1, testDirs_1_1, _b, fixturesDir_1, transformer, testFilePattern, ignoreFilePattern, runner, e_1_1;
        var e_1, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    filterRegex = filter !== null && filter !== void 0 ? filter : null;
                    failures = false;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 8]);
                    testDirs_1 = __values(testDirs), testDirs_1_1 = testDirs_1.next();
                    _d.label = 2;
                case 2:
                    if (!!testDirs_1_1.done) return [3 /*break*/, 5];
                    _b = testDirs_1_1.value, fixturesDir_1 = _b.fixturesDir, transformer = _b.transformer, testFilePattern = _b.testFilePattern, ignoreFilePattern = _b.ignoreFilePattern;
                    runner = new TestRunner_1.default(fixturesDir_1, !!write, filterRegex, testFilePattern, ignoreFilePattern, transformer);
                    return [4 /*yield*/, runner.run()];
                case 3:
                    failures = !(_d.sent()) || failures;
                    _d.label = 4;
                case 4:
                    testDirs_1_1 = testDirs_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (testDirs_1_1 && !testDirs_1_1.done && (_c = testDirs_1.return)) _c.call(testDirs_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8:
                    if (failures) {
                        process.exit(1);
                    }
                    return [2 /*return*/];
            }
        });
    });
});
var gratsDir = path.join(__dirname, "../..");
var fixturesDir = path.join(__dirname, "fixtures");
var integrationFixturesDir = path.join(__dirname, "integrationFixtures");
var testDirs = [
    {
        fixturesDir: fixturesDir,
        testFilePattern: /\.ts$/,
        ignoreFilePattern: null,
        transformer: function (code, fileName) {
            var firstLine = code.split("\n")[0];
            var options = {
                nullableByDefault: true,
                schemaHeader: null,
            };
            if (firstLine.startsWith("// {")) {
                var json = firstLine.slice(3);
                var _a = JSON.parse(json), tsVersion = _a.tsVersion, testOptions = __rest(_a, ["tsVersion"]);
                if (tsVersion != null && !semver.satisfies(TS_VERSION, tsVersion)) {
                    console.log("Skipping test because TS version doesn't match", tsVersion, "does not match", TS_VERSION);
                    return false;
                }
                options = __assign(__assign({}, options), testOptions);
            }
            var files = [
                "".concat(fixturesDir, "/").concat(fileName),
                path.join(__dirname, "../Types.ts"),
            ];
            var parsedOptions = (0, gratsConfig_1.validateGratsOptions)({
                options: {},
                raw: {
                    grats: options,
                },
                errors: [],
                fileNames: files,
            });
            // https://stackoverflow.com/a/66604532/1263117
            var compilerHost = ts.createCompilerHost(parsedOptions.options, 
            /* setParentNodes this is needed for finding jsDocs */
            true);
            var schemaResult = (0, lib_1.buildSchemaAndDocResultWithHost)(parsedOptions, compilerHost);
            if (schemaResult.kind === "ERROR") {
                return schemaResult.err.formatDiagnosticsWithContext();
            }
            var _b = schemaResult.value, schema = _b.schema, doc = _b.doc;
            // We run codegen here just ensure that it doesn't throw.
            var executableSchema = (0, codegen_1.codegen)(schema, "".concat(fixturesDir, "/").concat(fileName));
            var LOCATION_REGEX = /^\/\/ Locate: (.*)/;
            var locationMatch = code.match(LOCATION_REGEX);
            if (locationMatch != null) {
                var locResult = (0, Locate_1.locate)(schema, locationMatch[1].trim());
                if (locResult.kind === "ERROR") {
                    return locResult.err;
                }
                return new DiagnosticError_1.ReportableDiagnostics(compilerHost, [
                    (0, DiagnosticError_1.gqlErr)(locResult.value, "Located here"),
                ]).formatDiagnosticsWithContext();
            }
            else {
                var docSansDirectives = __assign(__assign({}, doc), { definitions: doc.definitions.filter(function (def) {
                        if (def.kind === "DirectiveDefinition") {
                            return !metadataDirectives_1.METADATA_DIRECTIVE_NAMES.has(def.name.value);
                        }
                        if (def.kind === "ScalarTypeDefinition") {
                            return !graphql_1.specifiedScalarTypes.some(function (scalar) { return scalar.name === def.name.value; });
                        }
                        return true;
                    }) });
                var sdl = (0, graphql_1.print)(docSansDirectives);
                return "-- SDL --\n".concat(sdl, "\n-- TypeScript --\n").concat(executableSchema);
            }
        },
    },
    {
        fixturesDir: integrationFixturesDir,
        testFilePattern: /index.ts$/,
        ignoreFilePattern: /schema.ts$/,
        transformer: function (code, fileName) { return __awaiter(void 0, void 0, void 0, function () {
            var firstLine, options, json, testOptions, filePath, schemaPath, files, parsedOptions, schemaResult, _a, schema, doc, tsSchema, server, schemaModule, actualSchema, schemaDiff, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        firstLine = code.split("\n")[0];
                        options = {
                            nullableByDefault: true,
                        };
                        if (firstLine.startsWith("// {")) {
                            json = firstLine.slice(3);
                            testOptions = JSON.parse(json);
                            options = __assign(__assign({}, options), testOptions);
                        }
                        filePath = "".concat(integrationFixturesDir, "/").concat(fileName);
                        schemaPath = path.join(path.dirname(filePath), "schema.ts");
                        files = [filePath, path.join(__dirname, "../Types.ts")];
                        parsedOptions = (0, gratsConfig_1.validateGratsOptions)({
                            options: {
                                // Required to enable ts-node to locate function exports
                                rootDir: gratsDir,
                                outDir: "dist",
                                configFilePath: "tsconfig.json",
                            },
                            raw: {
                                grats: options,
                            },
                            errors: [],
                            fileNames: files,
                        });
                        schemaResult = (0, lib_1.buildSchemaAndDocResult)(parsedOptions);
                        if (schemaResult.kind === "ERROR") {
                            throw new Error(schemaResult.err.formatDiagnosticsWithContext());
                        }
                        _a = schemaResult.value, schema = _a.schema, doc = _a.doc;
                        tsSchema = (0, codegen_1.codegen)(schema, schemaPath);
                        (0, fs_1.writeFileSync)(schemaPath, tsSchema);
                        return [4 /*yield*/, Promise.resolve("".concat(filePath)).then(function (s) { return require(s); })];
                    case 1:
                        server = _b.sent();
                        if (server.query == null || typeof server.query !== "string") {
                            throw new Error("Expected `".concat(filePath, "` to export a query text as `query`"));
                        }
                        return [4 /*yield*/, Promise.resolve("".concat(schemaPath)).then(function (s) { return require(s); })];
                    case 2:
                        schemaModule = _b.sent();
                        actualSchema = schemaModule.getSchema();
                        schemaDiff = compareSchemas(actualSchema, (0, graphql_1.buildASTSchema)(doc));
                        if (schemaDiff) {
                            console.log(schemaDiff);
                            // TODO: Make this an actual test failure, not an error
                            throw new Error("The codegen schema does not match the SDL schema.");
                        }
                        return [4 /*yield*/, (0, graphql_1.graphql)({
                                schema: actualSchema,
                                source: server.query,
                                variableValues: server.variables,
                            })];
                    case 3:
                        data = _b.sent();
                        return [2 /*return*/, JSON.stringify(data, null, 2)];
                }
            });
        }); },
    },
];
// Returns null if the schemas are equal, otherwise returns a string diff.
function compareSchemas(actual, expected) {
    var actualSDL = printSDLFromSchemaWithoutDirectives(actual);
    var expectedSDL = printSDLFromSchemaWithoutDirectives(expected);
    if (actualSDL === expectedSDL) {
        return null;
    }
    return (0, jest_diff_1.diff)(expectedSDL, actualSDL);
}
function printSDLFromSchemaWithoutDirectives(schema) {
    return (0, graphql_1.printSchema)(new graphql_1.GraphQLSchema(__assign(__assign({}, schema.toConfig()), { directives: schema.getDirectives().filter(function (directive) {
            return (!metadataDirectives_1.METADATA_DIRECTIVE_NAMES.has(directive.name) &&
                directive.name !== publicDirectives_1.SEMANTIC_NON_NULL_DIRECTIVE);
        }) })));
}
program.parse();
