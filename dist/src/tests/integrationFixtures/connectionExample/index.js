"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.firstHundredIntegers = void 0;
/** @gqlField */
function firstHundredIntegers(_, args) {
    return new FirstHundredIntegersConnection(args.first, args.after);
}
exports.firstHundredIntegers = firstHundredIntegers;
/** @gqlType */
var FirstHundredIntegersConnection = /** @class */ (function () {
    function FirstHundredIntegersConnection(first, after) {
        this.first = first;
        this.after = after;
        this._max = 100;
        var start = parseInt(after || "0", 10);
        var end = first ? start + first : this._max;
        this.edges = [];
        for (var i = start; i < end; i++) {
            this.edges.push(new FirstHundredIntegersEdge(i));
        }
        // TODO: What about empty connections
        this.pageInfo = new FirstHundredIntegersPageInfo({
            hasNext: end < this._max,
            hasPrevious: start > 0,
            startCursor: this.edges[0].cursor,
            endCursor: this.edges[this.edges.length - 1].cursor,
        });
    }
    return FirstHundredIntegersConnection;
}());
/** @gqlType */
var FirstHundredIntegersPageInfo = /** @class */ (function () {
    function FirstHundredIntegersPageInfo(_a) {
        var hasNext = _a.hasNext, hasPrevious = _a.hasPrevious, startCursor = _a.startCursor, endCursor = _a.endCursor;
        this.hasNextPage = hasNext;
        this.hasPreviousPage = hasPrevious;
        this.startCursor = startCursor;
        this.endCursor = endCursor;
    }
    return FirstHundredIntegersPageInfo;
}());
/** @gqlType */
var FirstHundredIntegersEdge = /** @class */ (function () {
    function FirstHundredIntegersEdge(node) {
        this.node = node;
        this.cursor = node.toString();
    }
    return FirstHundredIntegersEdge;
}());
function gql(strings) {
    return strings[0];
}
exports.query = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query {\n    firstTwo: firstHundredIntegers(first: 2) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node\n      }\n    }\n    secondTwo: firstHundredIntegers(first: 2, after: \"2\") {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node\n      }\n    }\n    lastTwo: firstHundredIntegers(first: 2, after: \"98\") {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node\n      }\n    }\n  }\n"], ["\n  query {\n    firstTwo: firstHundredIntegers(first: 2) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node\n      }\n    }\n    secondTwo: firstHundredIntegers(first: 2, after: \"2\") {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node\n      }\n    }\n    lastTwo: firstHundredIntegers(first: 2, after: \"98\") {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node\n      }\n    }\n  }\n"])));
var templateObject_1;
