"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.me = void 0;
/** @gqlField */
function me(_) {
    return new User();
}
exports.me = me;
/** @gqlType */
var User = /** @class */ (function () {
    function User(
    /** @gqlField hello */
    NOT_THIS) {
        if (NOT_THIS === void 0) { NOT_THIS = "world"; }
        this.NOT_THIS = NOT_THIS;
    }
    return User;
}());
exports.query = "\n  query {\n    me {\n      hello\n    }\n  }\n";
