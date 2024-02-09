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
exports.traverseJSDocTags = void 0;
var ts = require("typescript");
// Recursively search for all JSDoc tags calling `cb` on each one with its
// direct parent node.
function traverseJSDocTags(node, cb) {
    // Typescript only has an API to get the JSDoc tags for a node AND all of its
    // parents. So, we rely on the fact that we are recursing breadth-first and
    // only call the callback the first time we encounter a tag.  This should
    // ensure we only ever call the callback once per tag, and that we call it
    // with the tag's "true" parent node.
    var seenTags = new Set();
    // Inner function to avoid passing seenTags around
    function inner(node) {
        var e_1, _a;
        try {
            for (var _b = __values(ts.getJSDocTags(node)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tag = _c.value;
                if (seenTags.has(tag)) {
                    break;
                }
                seenTags.add(tag);
                cb(node, tag);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Recurse into children
        ts.forEachChild(node, inner);
    }
    inner(node);
}
exports.traverseJSDocTags = traverseJSDocTags;
