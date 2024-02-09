"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.alwaysThrows = void 0;
/** @gqlField */
function alwaysThrows(_) {
    throw new Error("This should null out the field");
}
exports.alwaysThrows = alwaysThrows;
exports.query = "\n  query {\n    alwaysThrows\n  }\n";
