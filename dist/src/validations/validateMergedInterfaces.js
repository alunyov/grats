"use strict";
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
exports.validateMergedInterfaces = void 0;
var ts = require("typescript");
var E = require("../Errors");
var DiagnosticError_1 = require("../utils/DiagnosticError");
var Result_1 = require("../utils/Result");
/**
 * Prevent using merged interfaces as GraphQL interfaces.
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
 */
function validateMergedInterfaces(checker, interfaces) {
    var e_1, _a;
    var errors = [];
    var _loop_1 = function (node) {
        var symbol = checker.getSymbolAtLocation(node.name);
        if (symbol == null) {
            return "continue";
        }
        // @ts-ignore Exposed as public in https://github.com/microsoft/TypeScript/pull/56193
        var mergedSymbol = checker.getMergedSymbol(symbol);
        if (mergedSymbol.declarations == null ||
            mergedSymbol.declarations.length < 2) {
            return "continue";
        }
        var otherLocations = mergedSymbol.declarations
            .filter(function (d) {
            return d !== node &&
                (ts.isInterfaceDeclaration(d) || ts.isClassDeclaration(d));
        })
            .map(function (d) {
            var _a;
            var locNode = (_a = ts.getNameOfDeclaration(d)) !== null && _a !== void 0 ? _a : d;
            return (0, DiagnosticError_1.tsRelated)(locNode, "Other declaration");
        });
        if (otherLocations.length > 0) {
            errors.push((0, DiagnosticError_1.tsErr)(node.name, E.mergedInterfaces(), otherLocations));
        }
    };
    try {
        for (var interfaces_1 = __values(interfaces), interfaces_1_1 = interfaces_1.next(); !interfaces_1_1.done; interfaces_1_1 = interfaces_1.next()) {
            var node = interfaces_1_1.value;
            _loop_1(node);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (interfaces_1_1 && !interfaces_1_1.done && (_a = interfaces_1.return)) _a.call(interfaces_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (errors.length > 0) {
        return (0, Result_1.err)(errors);
    }
    return (0, Result_1.ok)(undefined);
}
exports.validateMergedInterfaces = validateMergedInterfaces;
