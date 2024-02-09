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
    function User() {
    }
    Object.defineProperty(User.prototype, "hello", {
        /** @gqlField */
        get: function () {
            return "Hello world!";
        },
        enumerable: false,
        configurable: true
    });
    return User;
}());
exports.query = "\n  query {\n    me {\n      hello\n    }\n  }";
