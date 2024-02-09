"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssertNonNullHelper = exports.ASSERT_NON_NULL_HELPER = void 0;
var ts = require("typescript");
exports.ASSERT_NON_NULL_HELPER = "assertNonNull";
var F = ts.factory;
/**
 * async function assertNonNull<T>(value: T | Promise<T>): Promise<T> {
 *   const awaited = await value;
 *   if (awaited == null)
 *     throw new Error("Cannot return null for semantically non-nullable field.");
 *   return awaited;
 * }
 */
function createAssertNonNullHelper() {
    var argName = "value";
    var awaited = "awaited";
    var t = "T";
    var tReference = F.createTypeReferenceNode("T");
    var promiseT = F.createTypeReferenceNode("Promise", [tReference]);
    var typeParam = F.createUnionTypeNode([tReference, promiseT]);
    return F.createFunctionDeclaration([F.createModifier(ts.SyntaxKind.AsyncKeyword)], undefined, exports.ASSERT_NON_NULL_HELPER, [F.createTypeParameterDeclaration(undefined, t)], [
        F.createParameterDeclaration(undefined, undefined, argName, undefined, typeParam, undefined),
    ], promiseT, F.createBlock([
        F.createVariableStatement(undefined, F.createVariableDeclarationList([
            F.createVariableDeclaration(awaited, undefined, undefined, F.createAwaitExpression(F.createIdentifier(argName))),
        ], ts.NodeFlags.Const)),
        F.createIfStatement(F.createEquality(F.createIdentifier(awaited), F.createNull()), F.createThrowStatement(F.createNewExpression(F.createIdentifier("Error"), undefined, [
            F.createStringLiteral("Cannot return null for semantically non-nullable field."),
        ]))),
        F.createReturnStatement(F.createIdentifier(awaited)),
    ], true));
}
exports.createAssertNonNullHelper = createAssertNonNullHelper;
