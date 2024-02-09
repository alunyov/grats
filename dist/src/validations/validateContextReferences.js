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
exports.validateContextReferences = void 0;
var E = require("../Errors");
var DiagnosticError_1 = require("../utils/DiagnosticError");
var Result_1 = require("../utils/Result");
/**
 * Ensure that all context type references resolve to the same
 * type declaration.
 */
function validateContextReferences(ctx, references) {
    var e_1, _a;
    var gqlContext = null;
    try {
        for (var references_1 = __values(references), references_1_1 = references_1.next(); !references_1_1.done; references_1_1 = references_1.next()) {
            var typeName = references_1_1.value;
            var symbol = ctx.checker.getSymbolAtLocation(typeName);
            if (symbol == null) {
                return (0, Result_1.err)([
                    (0, DiagnosticError_1.tsErr)(typeName, E.expectedTypeAnnotationOnContextToBeResolvable()),
                ]);
            }
            var declaration = ctx.findSymbolDeclaration(symbol);
            if (declaration == null) {
                return (0, Result_1.err)([
                    (0, DiagnosticError_1.tsErr)(typeName, E.expectedTypeAnnotationOnContextToHaveDeclaration()),
                ]);
            }
            if (gqlContext == null) {
                // This is the first typed context value we've seen...
                gqlContext = {
                    declaration: declaration,
                    firstReference: typeName,
                };
            }
            else if (gqlContext.declaration !== declaration) {
                return (0, Result_1.err)([
                    (0, DiagnosticError_1.tsErr)(typeName, E.multipleContextTypes(), [
                        (0, DiagnosticError_1.tsRelated)(gqlContext.firstReference, "A different type reference was used here"),
                    ]),
                ]);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (references_1_1 && !references_1_1.done && (_a = references_1.return)) _a.call(references_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return (0, Result_1.ok)(undefined);
}
exports.validateContextReferences = validateContextReferences;
