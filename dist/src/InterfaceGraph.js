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
exports.computeInterfaceMap = void 0;
var helpers_1 = require("./utils/helpers");
var graphql_1 = require("graphql");
/**
 * Compute a map of interfaces to the types and interfaces that implement them.
 */
function computeInterfaceMap(typeContext, docs) {
    var e_1, _a, e_2, _b, e_3, _c;
    var _d, _e;
    // For each interface definition, we need to know which types and interfaces implement it.
    var graph = new helpers_1.DefaultMap(function () { return new Set(); });
    var add = function (interfaceName, implementor) {
        graph.get(interfaceName).add(implementor);
    };
    try {
        for (var docs_1 = __values(docs), docs_1_1 = docs_1.next(); !docs_1_1.done; docs_1_1 = docs_1.next()) {
            var doc = docs_1_1.value;
            switch (doc.kind) {
                case graphql_1.Kind.INTERFACE_TYPE_DEFINITION:
                case graphql_1.Kind.INTERFACE_TYPE_EXTENSION:
                    try {
                        for (var _f = (e_2 = void 0, __values((_d = doc.interfaces) !== null && _d !== void 0 ? _d : [])), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var implementor = _g.value;
                            var resolved = typeContext.resolveNamedType(implementor.name);
                            if (resolved.kind === "ERROR") {
                                // We trust that these errors will be reported elsewhere.
                                continue;
                            }
                            add(resolved.value.value, {
                                kind: "INTERFACE",
                                name: doc.name.value,
                            });
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    break;
                case graphql_1.Kind.OBJECT_TYPE_DEFINITION:
                case graphql_1.Kind.OBJECT_TYPE_EXTENSION:
                    try {
                        for (var _h = (e_3 = void 0, __values((_e = doc.interfaces) !== null && _e !== void 0 ? _e : [])), _j = _h.next(); !_j.done; _j = _h.next()) {
                            var implementor = _j.value;
                            var resolved = typeContext.resolveNamedType(implementor.name);
                            if (resolved.kind === "ERROR") {
                                // We trust that these errors will be reported elsewhere.
                                continue;
                            }
                            add(resolved.value.value, { kind: "TYPE", name: doc.name.value });
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    break;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (docs_1_1 && !docs_1_1.done && (_a = docs_1.return)) _a.call(docs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return graph;
}
exports.computeInterfaceMap = computeInterfaceMap;
