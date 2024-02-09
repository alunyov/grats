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
    /**
     * @gqlField
     * @killsParentOnException
     */
    User.prototype.alwaysThrowsKillsParentOnException = function () {
        throw new Error("This error should kill User");
    };
    return User;
}());
exports.query = "\n  query {\n    me {\n      alwaysThrowsKillsParentOnException\n    }\n  }\n";
