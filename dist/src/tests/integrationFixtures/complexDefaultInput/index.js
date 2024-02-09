"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.hello = void 0;
/**
 * @gqlField
 */
function hello(_, _a) {
    var _b = _a.someObj, someObj = _b === void 0 ? { a: "Sup" } : _b;
    return someObj.a;
}
exports.hello = hello;
exports.query = "\n    query {\n      hello\n    }\n  ";
