"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.hello = exports.alwaysThrowsKillsParentOnException = void 0;
/**
 * @gqlField
 * @killsParentOnException
 */
function alwaysThrowsKillsParentOnException(_) {
    throw new Error("This error should kill Query");
}
exports.alwaysThrowsKillsParentOnException = alwaysThrowsKillsParentOnException;
/** @gqlField */
function hello(_) {
    return "Hello Worl";
}
exports.hello = hello;
exports.query = "\n  query {\n    alwaysThrowsKillsParentOnException\n    hello\n  }\n";
