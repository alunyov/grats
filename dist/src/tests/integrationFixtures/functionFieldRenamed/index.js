"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.notHello = void 0;
/** @gqlField hello */
function notHello(_) {
    return "Hello World";
}
exports.notHello = notHello;
exports.query = "\n    query {\n      hello\n    }\n  ";
