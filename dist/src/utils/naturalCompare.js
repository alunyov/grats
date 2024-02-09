"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.naturalCompare = void 0;
/**
 * Returns a number indicating whether a reference string comes before, or after,
 * or is the same as the given string in natural sort order.
 *
 * See: https://en.wikipedia.org/wiki/Natural_sort_order
 *
 * ~~Stolen~~ Borrowed from:
 * https://github.com/graphql/graphql-js/blob/2aedf25e157d1d1c8fdfeaa4c0d2f3d9d3457dba/src/jsutils/naturalCompare.ts
 */
function naturalCompare(aStr, bStr) {
    var aIndex = 0;
    var bIndex = 0;
    while (aIndex < aStr.length && bIndex < bStr.length) {
        var aChar = aStr.charCodeAt(aIndex);
        var bChar = bStr.charCodeAt(bIndex);
        if (isDigit(aChar) && isDigit(bChar)) {
            var aNum = 0;
            do {
                ++aIndex;
                aNum = aNum * 10 + aChar - DIGIT_0;
                aChar = aStr.charCodeAt(aIndex);
            } while (isDigit(aChar) && aNum > 0);
            var bNum = 0;
            do {
                ++bIndex;
                bNum = bNum * 10 + bChar - DIGIT_0;
                bChar = bStr.charCodeAt(bIndex);
            } while (isDigit(bChar) && bNum > 0);
            if (aNum < bNum) {
                return -1;
            }
            if (aNum > bNum) {
                return 1;
            }
        }
        else {
            if (aChar < bChar) {
                return -1;
            }
            if (aChar > bChar) {
                return 1;
            }
            ++aIndex;
            ++bIndex;
        }
    }
    return aStr.length - bStr.length;
}
exports.naturalCompare = naturalCompare;
var DIGIT_0 = 48;
var DIGIT_9 = 57;
function isDigit(code) {
    return !isNaN(code) && DIGIT_0 <= code && code <= DIGIT_9;
}
