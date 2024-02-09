"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.someListOfLists = exports.someList = void 0;
/** @gqlField */
function someList(_) {
    // @ts-ignore
    return ["a", null, "b"];
}
exports.someList = someList;
/** @gqlField */
function someListOfLists(_) {
    // @ts-ignore
    return [["a"], ["b", null, "c"]];
}
exports.someListOfLists = someListOfLists;
exports.query = "\n  query {\n    someList\n    someListOfLists\n  }\n";
