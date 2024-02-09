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
exports.validateSemanticNullability = void 0;
var graphql_1 = require("graphql");
var DiagnosticError_1 = require("../utils/DiagnosticError");
var Result_1 = require("../utils/Result");
var publicDirectives_1 = require("../publicDirectives");
var helpers_1 = require("../utils/helpers");
/**
 * Ensure that all semantically non-nullable fields on an interface are also
 * semantically non-nullable on all implementors.
 */
function validateSemanticNullability(schema, config) {
    var e_1, _a, e_2, _b, e_3, _c;
    if (!config.strictSemanticNullability) {
        return (0, Result_1.ok)(schema);
    }
    var errors = [];
    var interfaces = Object.values(schema.getTypeMap()).filter(graphql_1.isInterfaceType);
    try {
        for (var interfaces_1 = __values(interfaces), interfaces_1_1 = interfaces_1.next(); !interfaces_1_1.done; interfaces_1_1 = interfaces_1.next()) {
            var interfaceType = interfaces_1_1.value;
            var typeImplementors = schema.getPossibleTypes(interfaceType);
            try {
                // For every field on the interface...
                for (var _d = (e_2 = void 0, __values(Object.values(interfaceType.getFields()))), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var interfaceField = _e.value;
                    if ((0, helpers_1.astNode)(interfaceField).type.kind === "NonNullType") {
                        // Type checking of non-null types is handled by graphql-js. If this field is non-null,
                        // then validation has already asserted that all implementors are non-null meaning no
                        // "semantic" non-null types can be present.
                        continue;
                    }
                    var interfaceSemanticNonNull = findSemanticNonNull(interfaceField);
                    if (interfaceSemanticNonNull == null) {
                        // It's fine for implementors to be more strict, since they are still
                        // covariant with the less strict interface.
                        continue;
                    }
                    try {
                        for (var typeImplementors_1 = (e_3 = void 0, __values(typeImplementors)), typeImplementors_1_1 = typeImplementors_1.next(); !typeImplementors_1_1.done; typeImplementors_1_1 = typeImplementors_1.next()) {
                            var implementor = typeImplementors_1_1.value;
                            var implementorField = implementor.getFields()[interfaceField.name];
                            if (implementorField == null) {
                                throw new Error("Expected implementorField to be defined. We expected this to be caught by graphql-js validation. This is a bug in Grats. Please report it.");
                            }
                            var typeSemanticNonNull = findSemanticNonNull(implementorField);
                            if (typeSemanticNonNull == null) {
                                errors.push((0, DiagnosticError_1.gqlErr)((0, helpers_1.loc)(interfaceSemanticNonNull), "Interface field `".concat(implementor.name, ".").concat(implementorField.name, "` expects a non-nullable type but `").concat(interfaceType.name, ".").concat(interfaceField.name, "` is nullable."), [
                                    (0, DiagnosticError_1.gqlRelated)((0, helpers_1.loc)((0, helpers_1.astNode)(implementorField).type), "Related location"),
                                ]));
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (typeImplementors_1_1 && !typeImplementors_1_1.done && (_c = typeImplementors_1.return)) _c.call(typeImplementors_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
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
    return (0, Result_1.ok)(schema);
}
exports.validateSemanticNullability = validateSemanticNullability;
function findSemanticNonNull(field) {
    var _a, _b;
    return ((_b = (_a = (0, helpers_1.astNode)(field).directives) === null || _a === void 0 ? void 0 : _a.find(function (d) { return d.name.value === publicDirectives_1.SEMANTIC_NON_NULL_DIRECTIVE; })) !== null && _b !== void 0 ? _b : null);
}
