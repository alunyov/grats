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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatResults = exports.collectResults = exports.ResultPipe = exports.err = exports.ok = void 0;
// Create a new `Result` in an OK state.
function ok(value) {
    return { kind: "OK", value: value };
}
exports.ok = ok;
// Create a new `Result` in an ERROR state.
function err(err) {
    return { kind: "ERROR", err: err };
}
exports.err = err;
/**
 * Helper class for chaining together a series of `Result` operations.
 */
var ResultPipe = /** @class */ (function () {
    function ResultPipe(_result) {
        this._result = _result;
    }
    // Transform the value if OK, otherwise return the error.
    ResultPipe.prototype.map = function (fn) {
        if (this._result.kind === "OK") {
            return new ResultPipe(ok(fn(this._result.value)));
        }
        return new ResultPipe(this._result);
    };
    // Transform the error if ERROR, otherwise return the value.
    ResultPipe.prototype.mapErr = function (fn) {
        if (this._result.kind === "ERROR") {
            return new ResultPipe(err(fn(this._result.err)));
        }
        return new ResultPipe(this._result);
    };
    // Transform the value into a new result if OK, otherwise return the error.
    // The new result may have a new value type, but must have the same error
    // type.
    ResultPipe.prototype.andThen = function (fn) {
        if (this._result.kind === "OK") {
            return new ResultPipe(fn(this._result.value));
        }
        return new ResultPipe(this._result);
    };
    // Return the result
    ResultPipe.prototype.result = function () {
        return this._result;
    };
    return ResultPipe;
}());
exports.ResultPipe = ResultPipe;
function collectResults(results) {
    var e_1, _a;
    var errors = [];
    var values = [];
    try {
        for (var results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
            var result = results_1_1.value;
            if (result.kind === "ERROR") {
                errors.push.apply(errors, __spreadArray([], __read(result.err), false));
            }
            else {
                values.push(result.value);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (results_1_1 && !results_1_1.done && (_a = results_1.return)) _a.call(results_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (errors.length > 0) {
        return err(errors);
    }
    return ok(values);
}
exports.collectResults = collectResults;
function concatResults(result1, result2) {
    if (result1.kind === "ERROR" && result2.kind === "ERROR") {
        return err(__spreadArray(__spreadArray([], __read(result1.err), false), __read(result2.err), false));
    }
    if (result1.kind === "ERROR") {
        return result1;
    }
    if (result2.kind === "ERROR") {
        return result2;
    }
    return ok([result1.value, result2.value]);
}
exports.concatResults = concatResults;
