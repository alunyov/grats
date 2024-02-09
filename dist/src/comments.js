"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forEachComment = exports.detectInvalidComments = void 0;
var ts = require("typescript");
var DiagnosticError_1 = require("./utils/DiagnosticError");
var E = require("./Errors");
var Extractor_1 = require("./Extractor");
// A line that starts with optional *s followed by @gql or @killsParentOnException
var BLOCK_COMMENT_REGEX = /^(\s*\**\s*)(@((gql[a-z]*)|(killsParentOnException)))/i;
// Report helpful errors when tags are used in invalid positions
// such as non JSDoc block comments or line comments.
function detectInvalidComments(sourceFile, validCommentPositions) {
    var errors = [];
    forEachComment(sourceFile, function (fullText, comment) {
        var e_1, _a;
        if (validCommentPositions.has(comment.pos)) {
            return;
        }
        var isLine = comment.kind === ts.SyntaxKind.SingleLineCommentTrivia;
        var start = comment.pos + 2; // Skip the // or /*
        var end = comment.end - (isLine ? 0 : 2); // Maybe skip the */ at the end
        var textSlice = fullText.slice(start, end);
        var tags = getGratsAdjacentTags(textSlice, comment);
        if (tags.length === 0) {
            return;
        }
        try {
            for (var tags_1 = __values(tags), tags_1_1 = tags_1.next(); !tags_1_1.done; tags_1_1 = tags_1.next()) {
                var _b = tags_1_1.value, tagName = _b.tagName, range = _b.range;
                if (!isGratsDocblockTag(tagName)) {
                    errors.push((0, DiagnosticError_1.rangeErr)(sourceFile, range, E.invalidGratsTag(tagName)));
                }
                if (isLine) {
                    errors.push((0, DiagnosticError_1.rangeErr)(sourceFile, range, E.gqlTagInLineComment()));
                }
                else {
                    if (textSlice[0] !== "*") {
                        errors.push((0, DiagnosticError_1.rangeErr)(sourceFile, range, E.gqlTagInNonJSDocBlockComment()));
                    }
                    else {
                        errors.push((0, DiagnosticError_1.rangeErr)(sourceFile, range, E.gqlTagInDetachedJSDocBlockComment()));
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (tags_1_1 && !tags_1_1.done && (_a = tags_1.return)) _a.call(tags_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
    return errors;
}
exports.detectInvalidComments = detectInvalidComments;
// Extract @gql or @killsParentOnException tags from a JSDoc block comment.
// along with their positions.
function getGratsAdjacentTags(text, commentRange) {
    var e_2, _a;
    var offset = 0;
    var lines = text.split("\n");
    var tags = [];
    try {
        for (var lines_1 = __values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
            var line = lines_1_1.value;
            var match = BLOCK_COMMENT_REGEX.exec(line);
            if (match == null) {
                offset += line.length + 1;
                continue;
            }
            var _b = __read(match, 3), prefix = _b[1], tag = _b[2];
            var pos = commentRange.pos + 2 + offset + prefix.length;
            var end = pos + tag.length;
            var range = { kind: commentRange.kind, pos: pos, end: end };
            var tagName = tag.slice(1); // Trim the @
            tags.push({ tagName: tagName, range: range });
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return tags;
}
function isGratsDocblockTag(tag) {
    return Extractor_1.ALL_TAGS.includes(tag) || tag === Extractor_1.KILLS_PARENT_ON_EXCEPTION_TAG;
}
// Functions below this point were copied/modified from `ts-api-utils`. Thanks!
// https://github.com/JoshuaKGoldberg/ts-api-utils/blob/fcd3128b61dfb54978b30f07380ad1c87a5d093e/src/comments.ts
/**
 * TypeScript does not provide a way to iterate over comments, so this function
 * provides a way to iterate over all comments in a source file.
 */
function forEachComment(sourceFile, callback) {
    var fullText = sourceFile.text;
    var notJsx = sourceFile.languageVariant !== ts.LanguageVariant.JSX;
    return forEachToken(sourceFile, function (token) {
        var _a;
        if (token.pos === token.end) {
            return;
        }
        if (token.kind !== ts.SyntaxKind.JsxText) {
            ts.forEachLeadingCommentRange(fullText, 
            // skip shebang at position 0
            token.pos === 0 ? ((_a = ts.getShebang(fullText)) !== null && _a !== void 0 ? _a : "").length : token.pos, commentCallback);
        }
        if (notJsx || canHaveTrailingTrivia(token)) {
            return ts.forEachTrailingCommentRange(fullText, token.end, commentCallback);
        }
    });
    function commentCallback(pos, end, kind) {
        callback(fullText, { end: end, kind: kind, pos: pos });
    }
}
exports.forEachComment = forEachComment;
function forEachToken(sourceFile, callback) {
    var queue = [];
    var node = sourceFile;
    while (true) {
        if (ts.isTokenKind(node.kind)) {
            callback(node);
        }
        else if (node.kind === ts.SyntaxKind.JSDocComment) {
            // Ignore for support of TS < 4.7
        }
        else {
            var children = node.getChildren(sourceFile);
            if (children.length === 1) {
                node = children[0];
                continue;
            }
            // add children in reverse order, when we pop the next element from the queue, it's the first child
            for (var i = children.length - 1; i >= 0; --i) {
                queue.push(children[i]);
            }
        }
        var next = queue.pop();
        if (next == null) {
            break;
        }
        else {
            node = next;
        }
    }
}
function canHaveTrailingTrivia(token) {
    switch (token.kind) {
        case ts.SyntaxKind.CloseBraceToken:
            // after a JsxExpression inside a JsxElement's body can only be other JsxChild, but no trivia
            return (token.parent.kind !== ts.SyntaxKind.JsxExpression ||
                !isJsxElementOrFragment(token.parent.parent));
        case ts.SyntaxKind.GreaterThanToken:
            switch (token.parent.kind) {
                case ts.SyntaxKind.JsxOpeningElement:
                    // if end is not equal, this is part of the type arguments list. in all other cases it would be inside the element body
                    return token.end !== token.parent.end;
                case ts.SyntaxKind.JsxOpeningFragment:
                    return false; // would be inside the fragment
                case ts.SyntaxKind.JsxSelfClosingElement:
                    return (token.end !== token.parent.end || // if end is not equal, this is part of the type arguments list
                        !isJsxElementOrFragment(token.parent.parent)); // there's only trailing trivia if it's the end of the top element
                case ts.SyntaxKind.JsxClosingElement:
                case ts.SyntaxKind.JsxClosingFragment:
                    // there's only trailing trivia if it's the end of the top element
                    return !isJsxElementOrFragment(token.parent.parent.parent);
            }
    }
    return true;
}
function isJsxElementOrFragment(node) {
    return (node.kind === ts.SyntaxKind.JsxElement ||
        node.kind === ts.SyntaxKind.JsxFragment);
}
