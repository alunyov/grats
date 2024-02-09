"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.goodBye = exports.hello = void 0;
/**
 * @gqlField
 * @deprecated For reasons
 */
function hello(_) {
    return "Hello World";
}
exports.hello = hello;
/**
 * @gqlField
 * @deprecated
 */
function goodBye(_) {
    return "Farewell World";
}
exports.goodBye = goodBye;
exports.query = "\n    query {\n      hello\n    }\n  ";
