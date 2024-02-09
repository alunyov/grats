"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRelativePath = exports.relativePath = void 0;
var path_1 = require("path");
// Grats parses TypeScript files and finds resolvers. If the field resolver is a
// named export, Grats needs to be able to import that file during execution.
//
// To achieve this, Grats annotates the field with a directive that includes
// the path to the module that contains the resolver. In order to allow those
// paths to be relative, they must be relative to something that both the build
// step and the runtime can agree on. This path is that thing.
var gratsRoot = (0, path_1.join)(__dirname, "../..");
function relativePath(absolute) {
    return (0, path_1.relative)(gratsRoot, absolute);
}
exports.relativePath = relativePath;
function resolveRelativePath(relativePath) {
    return (0, path_1.resolve)(gratsRoot, relativePath);
}
exports.resolveRelativePath = resolveRelativePath;
