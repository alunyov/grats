"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variables = exports.query = exports.hello = void 0;
/** @gqlField */
function hello(_, args) {
    if (typeof args.someID !== "string") {
        throw new Error("Expected someID to be a string, but it was ".concat(typeof args.someID));
    }
    return args.someID;
}
exports.hello = hello;
exports.query = "\n    query SomeQuery($someID: ID!) {\n      hello(someID: $someID)\n    }\n  ";
exports.variables = {
    someID: 123,
};
