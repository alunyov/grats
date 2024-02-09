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
exports.validateAsyncIterable = void 0;
var graphql_1 = require("graphql");
var DiagnosticError_1 = require("../utils/DiagnosticError");
var Result_1 = require("../utils/Result");
var E = require("../Errors");
var metadataDirectives_1 = require("../metadataDirectives");
var helpers_1 = require("../utils/helpers");
/**
 * Ensure that all fields on `Subscription` return an AsyncIterable, and that no other
 * fields do.
 */
function validateAsyncIterable(doc) {
    var _a;
    var errors = [];
    var visitNode = function (t) {
        var validateFieldsResult = validateField(t);
        if (validateFieldsResult != null) {
            errors.push(validateFieldsResult);
        }
    };
    (0, graphql_1.visit)(doc, (_a = {},
        _a[graphql_1.Kind.INTERFACE_TYPE_DEFINITION] = visitNode,
        _a[graphql_1.Kind.INTERFACE_TYPE_EXTENSION] = visitNode,
        _a[graphql_1.Kind.OBJECT_TYPE_DEFINITION] = visitNode,
        _a[graphql_1.Kind.OBJECT_TYPE_EXTENSION] = visitNode,
        _a));
    if (errors.length > 0) {
        return (0, Result_1.err)(errors);
    }
    return (0, Result_1.ok)(doc);
}
exports.validateAsyncIterable = validateAsyncIterable;
function validateField(t) {
    var e_1, _a;
    var _b;
    if (t.fields == null)
        return;
    // Note: We assume the default name is used here. When custom operation types are supported
    // we'll need to update this.
    var isSubscription = t.name.value === "Subscription" &&
        (t.kind === graphql_1.Kind.OBJECT_TYPE_DEFINITION ||
            t.kind === graphql_1.Kind.OBJECT_TYPE_EXTENSION);
    try {
        for (var _c = __values(t.fields), _d = _c.next(); !_d.done; _d = _c.next()) {
            var field = _d.value;
            var asyncDirective = (_b = field.directives) === null || _b === void 0 ? void 0 : _b.find(function (directive) { return directive.name.value === metadataDirectives_1.ASYNC_ITERABLE_TYPE_DIRECTIVE; });
            if (isSubscription && asyncDirective == null) {
                return (0, DiagnosticError_1.gqlErr)((0, helpers_1.loc)(field.type), E.subscriptionFieldNotAsyncIterable());
            }
            if (!isSubscription && asyncDirective != null) {
                return (0, DiagnosticError_1.gqlErr)((0, helpers_1.loc)(asyncDirective), // Directive location is the AsyncIterable type.
                E.nonSubscriptionFieldAsyncIterable());
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
