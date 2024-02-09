"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.hello = void 0;
/** @gqlField */
function hello(_, _a) {
    var _b = _a.greeting, greeting = _b === void 0 ? "Hello" : _b;
    return "".concat(greeting, ", world!");
}
exports.hello = hello;
exports.query = "\n    query {\n      hello\n    }\n  ";
