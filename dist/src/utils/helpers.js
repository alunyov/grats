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
exports.astNode = exports.loc = exports.extend = exports.DefaultMap = void 0;
var DefaultMap = /** @class */ (function () {
    function DefaultMap(getDefault) {
        this.getDefault = getDefault;
        this._map = new Map();
    }
    DefaultMap.prototype.get = function (key) {
        if (!this._map.has(key)) {
            this._map.set(key, this.getDefault());
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this._map.get(key);
    };
    return DefaultMap;
}());
exports.DefaultMap = DefaultMap;
// Similar to a.push(...b), but avoids potential stack overflows.
function extend(a, b) {
    var e_1, _a;
    try {
        for (var b_1 = __values(b), b_1_1 = b_1.next(); !b_1_1.done; b_1_1 = b_1.next()) {
            var item = b_1_1.value;
            a.push(item);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (b_1_1 && !b_1_1.done && (_a = b_1.return)) _a.call(b_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
exports.extend = extend;
function loc(item) {
    if (item.loc == null) {
        throw new Error("Expected item to have loc");
    }
    return item.loc;
}
exports.loc = loc;
function astNode(item) {
    if (item.astNode == null) {
        throw new Error("Expected item to have astNode");
    }
    return item.astNode;
}
exports.astNode = astNode;
