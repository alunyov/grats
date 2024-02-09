"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.TypeContext = exports.UNRESOLVED_REFERENCE_NAME = void 0;
var ts = require("typescript");
var DiagnosticError_1 = require("./utils/DiagnosticError");
var Result_1 = require("./utils/Result");
var E = require("./Errors");
var helpers_1 = require("./utils/helpers");
exports.UNRESOLVED_REFERENCE_NAME = "__UNRESOLVED_REFERENCE__";
/**
 * Used to track TypeScript references.
 *
 * If a TS method is typed as returning `MyType`, we need to look at that type's
 * GQLType annotation to find out its name. However, we may not have seen that
 * class yet.
 *
 * So, we employ a two pass approach. When we encounter a reference to a type
 * we model it as a dummy type reference in the GraphQL AST. Then, after we've
 * parsed all the files, we traverse the GraphQL schema, resolving all the dummy
 * type references.
 */
var TypeContext = /** @class */ (function () {
    function TypeContext(checker) {
        this._symbolToName = new Map();
        this._unresolvedTypes = new Map();
        this.checker = checker;
    }
    TypeContext.fromSnapshot = function (checker, snapshot) {
        var e_1, _a, e_2, _b;
        var self = new TypeContext(checker);
        try {
            for (var _c = __values(snapshot.unresolvedNames), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), node = _e[0], typeName = _e[1];
                self._markUnresolvedType(node, typeName);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _f = __values(snapshot.nameDefinitions), _g = _f.next(); !_g.done; _g = _f.next()) {
                var _h = __read(_g.value, 2), node = _h[0], definition = _h[1];
                self._recordTypeName(node, definition.name, definition.kind);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return self;
    };
    // Record that a GraphQL construct of type `kind` with the name `name` is
    // declared at `node`.
    TypeContext.prototype._recordTypeName = function (node, name, kind) {
        var symbol = this.checker.getSymbolAtLocation(node);
        if (symbol == null) {
            // FIXME: Make this a diagnostic
            throw new Error("Could not resolve type reference. You probably have a TypeScript error.");
        }
        if (this._symbolToName.has(symbol)) {
            // Ensure we never try to record the same name twice.
            throw new Error("Unexpected double recording of typename.");
        }
        this._symbolToName.set(symbol, { name: name, kind: kind });
    };
    // Record that a type reference `node`
    TypeContext.prototype._markUnresolvedType = function (node, name) {
        var symbol = this.checker.getSymbolAtLocation(node);
        if (symbol == null) {
            //
            throw new Error("Could not resolve type reference. You probably have a TypeScript error.");
        }
        this._unresolvedTypes.set(name, this.resolveSymbol(symbol));
    };
    TypeContext.prototype.findSymbolDeclaration = function (startSymbol) {
        var _a;
        var symbol = this.resolveSymbol(startSymbol);
        var declaration = (_a = symbol.declarations) === null || _a === void 0 ? void 0 : _a[0];
        return declaration !== null && declaration !== void 0 ? declaration : null;
    };
    // Follow symbol aliases until we find the original symbol. Accounts for
    // cyclical aliases.
    TypeContext.prototype.resolveSymbol = function (startSymbol) {
        var symbol = startSymbol;
        var visitedSymbols = new Set();
        while (ts.SymbolFlags.Alias & symbol.flags) {
            if (visitedSymbols.has(symbol)) {
                throw new Error("Cyclical alias detected. Breaking resolution.");
            }
            visitedSymbols.add(symbol);
            symbol = this.checker.getAliasedSymbol(symbol);
        }
        return symbol;
    };
    TypeContext.prototype.resolveNamedType = function (unresolved) {
        var symbol = this._unresolvedTypes.get(unresolved);
        if (symbol == null) {
            if (unresolved.value === exports.UNRESOLVED_REFERENCE_NAME) {
                // This is a logic error on our side.
                throw new Error("Unexpected unresolved reference name.");
            }
            return (0, Result_1.ok)(unresolved);
        }
        var nameDefinition = this._symbolToName.get(symbol);
        if (nameDefinition == null) {
            return (0, Result_1.err)((0, DiagnosticError_1.gqlErr)((0, helpers_1.loc)(unresolved), E.unresolvedTypeReference()));
        }
        return (0, Result_1.ok)(__assign(__assign({}, unresolved), { value: nameDefinition.name.value }));
    };
    TypeContext.prototype.unresolvedNameIsGraphQL = function (unresolved) {
        var symbol = this._unresolvedTypes.get(unresolved);
        return symbol != null && this._symbolToName.has(symbol);
    };
    // TODO: Merge this with resolveNamedType
    TypeContext.prototype.getNameDefinition = function (nameNode) {
        var typeNameResult = this.resolveNamedType(nameNode);
        if (typeNameResult.kind === "ERROR") {
            return (0, Result_1.err)([typeNameResult.err]);
        }
        var symbol = this._unresolvedTypes.get(nameNode);
        if (symbol == null) {
            // This should have already been handled by resolveNamedType
            throw new Error("Expected to find unresolved type.");
        }
        var nameDefinition = this._symbolToName.get(symbol);
        if (nameDefinition == null) {
            // This should have already been handled by resolveNamedType
            throw new Error("Expected to find name definition.");
        }
        return (0, Result_1.ok)(nameDefinition);
    };
    return TypeContext;
}());
exports.TypeContext = TypeContext;
