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
var fs = require("fs");
var path = require("path");
var jest_diff_1 = require("jest-diff");
/**
 * Looks in a fixtures dir for .ts files, transforms them according to the
 * passed transformer, and compares the output to the expected output in the
 * `.expected` file.
 */
var TestRunner = /** @class */ (function () {
    function TestRunner(fixturesDir, write, filter, testFilePattern, ignoreFilePattern, transformer) {
        var e_1, _a;
        this._testFixtures = [];
        this._otherFiles = new Set();
        this._skip = new Set();
        this._failureCount = 0;
        this._write = write;
        this._fixturesDir = fixturesDir;
        this._transformer = transformer;
        var filterRegex = filter != null ? new RegExp(filter) : null;
        try {
            for (var _b = __values(readdirSyncRecursive(fixturesDir)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var fileName = _c.value;
                if (testFilePattern.test(fileName)) {
                    this._testFixtures.push(fileName);
                    var filePath = path.join(fixturesDir, fileName);
                    if (filterRegex != null && !filePath.match(filterRegex)) {
                        this._skip.add(fileName);
                    }
                }
                else if (!ignoreFilePattern || !ignoreFilePattern.test(fileName)) {
                    this._otherFiles.add(fileName);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    // Returns true if the test passed
    TestRunner.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, fixture, e_2_1, _c, _d, fileName, _e, _f, fileName;
            var e_2, _g, e_3, _h, e_4, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 5, 6, 7]);
                        _a = __values(this._testFixtures), _b = _a.next();
                        _k.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        fixture = _b.value;
                        return [4 /*yield*/, this._testFixture(fixture)];
                    case 2:
                        _k.sent();
                        _k.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_2_1 = _k.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 7:
                        console.log("");
                        if (this._failureCount > 0) {
                            console.log("".concat(this._failureCount, " failures found. Run with --write to update fixtures"));
                            return [2 /*return*/, false];
                        }
                        else {
                            console.log("All tests passed!");
                        }
                        if (this._otherFiles.size > 0) {
                            if (this._write) {
                                try {
                                    for (_c = __values(this._otherFiles), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        fileName = _d.value;
                                        console.log("DELETED: " + fileName);
                                        fs.unlinkSync(path.join(this._fixturesDir, fileName));
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_h = _c.return)) _h.call(_c);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                            }
                            else {
                                console.log("Unexpected files found:");
                                try {
                                    for (_e = __values(this._otherFiles), _f = _e.next(); !_f.done; _f = _e.next()) {
                                        fileName = _f.value;
                                        console.log(" - " + fileName);
                                    }
                                }
                                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                finally {
                                    try {
                                        if (_f && !_f.done && (_j = _e.return)) _j.call(_e);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                }
                                console.log("Run with --write to deleted unexpected files");
                                return [2 /*return*/, false];
                            }
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    TestRunner.prototype._testFixture = function (fixture) {
        return __awaiter(this, void 0, void 0, function () {
            var expectedFileName, expectedFilePath, fixturePath, displayName, expectedContent, fixtureContent, actual, actualOutput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedFileName = fixture + ".expected";
                        expectedFilePath = path.join(this._fixturesDir, expectedFileName);
                        if (this._otherFiles.has(expectedFileName)) {
                            this._otherFiles.delete(expectedFileName);
                        }
                        else {
                            fs.writeFileSync(expectedFilePath, "", "utf-8");
                        }
                        if (this._skip.has(fixture)) {
                            return [2 /*return*/];
                        }
                        fixturePath = path.join(this._fixturesDir, fixture);
                        displayName = path.relative(this._fixturesDir, fixturePath);
                        expectedContent = fs.readFileSync(expectedFilePath, "utf-8");
                        fixtureContent = fs.readFileSync(fixturePath, "utf-8");
                        return [4 /*yield*/, this.transform(fixtureContent, fixture)];
                    case 1:
                        actual = _a.sent();
                        if (actual === false) {
                            console.error("SKIPPING: " + displayName);
                            this._skip.add(fixture);
                            return [2 /*return*/];
                        }
                        actualOutput = "-----------------\nINPUT\n----------------- \n".concat(fixtureContent, "\n-----------------\nOUTPUT\n-----------------\n").concat(actual);
                        if (actualOutput !== expectedContent) {
                            if (this._write) {
                                console.error("UPDATED: " + displayName);
                                fs.writeFileSync(expectedFilePath, actualOutput, "utf-8");
                            }
                            else {
                                this._failureCount++;
                                console.error("FAILURE: " + displayName);
                                console.log((0, jest_diff_1.diff)(expectedContent, actualOutput));
                            }
                        }
                        else {
                            console.log("OK: " + displayName);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    TestRunner.prototype.transform = function (code, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._transformer(code, filename)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_5 = _a.sent();
                        console.error(e_5);
                        return [2 /*return*/, e_5.message];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TestRunner;
}());
exports.default = TestRunner;
function readdirSyncRecursive(dir) {
    var e_6, _a, e_7, _b;
    var files = [];
    try {
        for (var _c = __values(fs.readdirSync(dir)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var file = _d.value;
            var filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                try {
                    for (var _e = (e_7 = void 0, __values(readdirSyncRecursive(filePath))), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var f = _f.value;
                        files.push(path.join(file, f));
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
            else {
                files.push(file);
            }
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return files;
}
