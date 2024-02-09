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
exports.validateTypenames = void 0;
var graphql_1 = require("graphql");
var DiagnosticError_1 = require("../utils/DiagnosticError");
var Result_1 = require("../utils/Result");
/**
 * Ensure that every type which implements an interface or is a member of a
 * union has a __typename field.
 */
function validateTypenames(schema, hasTypename) {
    var e_1, _a, e_2, _b;
    var _c, _d;
    var typenameDiagnostics = [];
    var abstractTypes = Object.values(schema.getTypeMap()).filter(graphql_1.isAbstractType);
    try {
        for (var abstractTypes_1 = __values(abstractTypes), abstractTypes_1_1 = abstractTypes_1.next(); !abstractTypes_1_1.done; abstractTypes_1_1 = abstractTypes_1.next()) {
            var type = abstractTypes_1_1.value;
            // TODO: If we already implement resolveType, we don't need to check implementors
            var typeImplementors = schema.getPossibleTypes(type).filter(graphql_1.isType);
            try {
                for (var typeImplementors_1 = (e_2 = void 0, __values(typeImplementors)), typeImplementors_1_1 = typeImplementors_1.next(); !typeImplementors_1_1.done; typeImplementors_1_1 = typeImplementors_1.next()) {
                    var implementor = typeImplementors_1_1.value;
                    if (!hasTypename.has(implementor.name)) {
                        var loc = (_d = (_c = implementor.astNode) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.loc;
                        if (loc == null) {
                            throw new Error("Grats expected the parsed type `".concat(implementor.name, "` to have location information. This is a bug in Grats. Please report it."));
                        }
                        typenameDiagnostics.push((0, DiagnosticError_1.gqlErr)(loc, "Missing __typename on `".concat(implementor.name, "`. The type `").concat(type.name, "` is used in a union or interface, so it must have a `__typename` field.")));
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (typeImplementors_1_1 && !typeImplementors_1_1.done && (_b = typeImplementors_1.return)) _b.call(typeImplementors_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (abstractTypes_1_1 && !abstractTypes_1_1.done && (_a = abstractTypes_1.return)) _a.call(abstractTypes_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (typenameDiagnostics.length > 0) {
        return (0, Result_1.err)(typenameDiagnostics);
    }
    return (0, Result_1.ok)(schema);
}
exports.validateTypenames = validateTypenames;
