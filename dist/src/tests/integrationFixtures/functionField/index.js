"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.hello = void 0;
/** @gqlField */
function hello(_) {
    return "Hello World";
}
exports.hello = hello;
exports.query = "\n    query {\n      hello\n    }\n  ";
