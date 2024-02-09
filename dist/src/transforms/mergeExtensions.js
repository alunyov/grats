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
exports.mergeExtensions = void 0;
var graphql_1 = require("graphql");
var helpers_1 = require("../utils/helpers");
/**
 * Takes every example of `extend type Foo` and `extend interface Foo` and
 * merges them into the original type/interface definition.
 */
function mergeExtensions(doc) {
    var fields = new MultiMap();
    // Collect all the fields from the extensions and trim them from the AST.
    var sansExtensions = (0, graphql_1.visit)(doc, {
        ObjectTypeExtension: function (t) {
            if (t.directives != null || t.interfaces != null) {
                throw new Error("Unexpected directives or interfaces on Extension");
            }
            fields.extend(t.name.value, t.fields);
            return null;
        },
        InterfaceTypeExtension: function (t) {
            if (t.directives != null || t.interfaces != null) {
                throw new Error("Unexpected directives or interfaces on Extension");
            }
            fields.extend(t.name.value, t.fields);
            return null;
        },
        // Grats does not create these extension types
        ScalarTypeExtension: function (_) {
            throw new Error("Unexpected ScalarTypeExtension");
        },
        EnumTypeExtension: function (_) {
            throw new Error("Unexpected EnumTypeExtension");
        },
        SchemaExtension: function (_) {
            throw new Error("Unexpected SchemaExtension");
        },
    });
    // Merge collected extension fields into the original type/interface definition.
    return (0, graphql_1.visit)(sansExtensions, {
        ObjectTypeDefinition: function (t) {
            var extensions = fields.get(t.name.value);
            if (t.fields == null) {
                return __assign(__assign({}, t), { fields: extensions });
            }
            return __assign(__assign({}, t), { fields: __spreadArray(__spreadArray([], __read(t.fields), false), __read(extensions), false) });
        },
        InterfaceTypeDefinition: function (t) {
            var extensions = fields.get(t.name.value);
            if (t.fields == null) {
                return __assign(__assign({}, t), { fields: extensions });
            }
            return __assign(__assign({}, t), { fields: __spreadArray(__spreadArray([], __read(t.fields), false), __read(extensions), false) });
        },
    });
}
exports.mergeExtensions = mergeExtensions;
// Map a key to an array of values.
var MultiMap = /** @class */ (function () {
    function MultiMap() {
        this.map = new Map();
    }
    MultiMap.prototype.push = function (key, value) {
        var existing = this.map.get(key);
        if (existing == null) {
            existing = [];
            this.map.set(key, existing);
        }
        existing.push(value);
    };
    MultiMap.prototype.extend = function (key, values) {
        if (values == null) {
            return;
        }
        var existing = this.map.get(key);
        if (existing == null) {
            existing = [];
            this.map.set(key, existing);
        }
        (0, helpers_1.extend)(existing, values);
    };
    MultiMap.prototype.get = function (key) {
        var _a;
        return (_a = this.map.get(key)) !== null && _a !== void 0 ? _a : [];
    };
    return MultiMap;
}());
