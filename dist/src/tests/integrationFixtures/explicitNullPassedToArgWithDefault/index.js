"use strict";
/**
 * Validating what graphql-js does when an explicit null is passed to an argument
 * with a default value.
 *
 * Spoiler alert: it passes the explicit null.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.hello = void 0;
/**
 * @gqlField
 */
function hello(_, _a) {
    var _b = _a.someArg, someArg = _b === void 0 ? "Hello" : _b;
    if (someArg === null) {
        return "got null";
    }
    return "".concat(someArg, " World");
}
exports.hello = hello;
exports.query = "\n    query {\n      hello(someArg: null)\n    }\n  ";
