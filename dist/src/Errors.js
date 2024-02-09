"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultArgElementIsNotAssignment = exports.defaultValueIsNotLiteral = exports.ambiguousNumberType = exports.expectedOneNonNullishType = exports.propertyFieldMissingType = exports.cannotResolveSymbolForDescription = exports.wrapperMissingTypeArg = exports.methodMissingType = exports.gqlEntityMissingName = exports.enumVariantMissingInitializer = exports.enumVariantNotStringLiteral = exports.enumTagOnInvalidNode = exports.argNotTyped = exports.argNameNotLiteral = exports.argIsNotProperty = exports.argumentParamIsNotObject = exports.argumentParamIsMissingType = exports.typeNameDoesNotMatchExpected = exports.typeNameTypeNotStringLiteral = exports.typeNameMissingTypeAnnotation = exports.typeNameInitializerWrong = exports.typeNameInitializeNotString = exports.typeNameMissingInitializer = exports.typeNameNotDeclaration = exports.typeTagOnAliasOfNonObjectOrUnknown = exports.typeTagOnUnnamedClass = exports.inputFieldUntyped = exports.inputTypeFieldNotProperty = exports.inputTypeNotLiteral = exports.functionFieldNotNamedExport = exports.functionFieldDefaultExport = exports.functionFieldNotNamed = exports.functionFieldParentTypeNotValid = exports.functionFieldParentTypeMissing = exports.functionFieldNotTopLevel = exports.invalidReturnTypeForFunctionField = exports.invalidParentArgForFunctionField = exports.expectedUnionTypeReference = exports.expectedUnionTypeNode = exports.invalidUnionTagUsage = exports.invalidInputTagUsage = exports.invalidEnumTagUsage = exports.invalidInterfaceTagUsage = exports.invalidScalarTagUsage = exports.invalidTypeTagUsage = exports.invalidGratsTag = exports.wrongCasingForGratsTag = exports.killsParentOnExceptionOnWrongNode = exports.fieldTagOnWrongNode = exports.ISSUE_URL = void 0;
exports.gqlTagInDetachedJSDocBlockComment = exports.gqlTagInNonJSDocBlockComment = exports.gqlTagInLineComment = exports.expectedNullableArgumentToBeOptional = exports.operationTypeNotUnknown = exports.nonSubscriptionFieldAsyncIterable = exports.subscriptionFieldNotAsyncIterable = exports.graphQLTagNameHasWhitespace = exports.graphQLNameHasLeadingNewlines = exports.multipleContextTypes = exports.unexpectedParamSpreadForContextParam = exports.expectedTypeAnnotationOnContextToHaveDeclaration = exports.expectedTypeAnnotationOnContextToBeResolvable = exports.expectedTypeAnnotationOfReferenceOnContext = exports.expectedTypeAnnotationOnContext = exports.unresolvedTypeReference = exports.invalidTypePassedToFieldFunction = exports.parameterPropertyMissingType = exports.parameterPropertyNotPublic = exports.parameterWithoutModifiers = exports.duplicateInterfaceTag = exports.duplicateTag = exports.implementsTagOnTypeAlias = exports.implementsTagOnInterface = exports.implementsTagOnClass = exports.mergedInterfaces = exports.nonNullTypeCannotBeOptional = exports.killsParentOnExceptionOnNullable = exports.killsParentOnExceptionWithWrongConfig = exports.expectedNameIdentifier = exports.pluralTypeMissingParameter = exports.unknownGraphQLType = exports.unsupportedTypeLiteral = exports.defaultArgPropertyMissingInitializer = exports.defaultArgPropertyMissingName = void 0;
var Extractor_1 = require("./Extractor");
exports.ISSUE_URL = "https://github.com/captbaritone/grats/issues";
// TODO: Move these to short URLS that are easier to keep from breaking.
var DOC_URLS = {
    mergedInterfaces: "https://grats.capt.dev/docs/docblock-tags/interfaces/#merged-interfaces",
    parameterProperties: "https://grats.capt.dev/docs/docblock-tags/fields#class-based-fields",
    commentSyntax: "https://grats.capt.dev/docs/getting-started/comment-syntax",
};
/**
 * Error messages for Grats
 *
 * Ideally each error message conveys all of the following:
 * - What went wrong
 * - What Grats expected with an example
 * - Why Grats expected that
 * - A suggestion for how to fix the error
 * - A link to the Grats documentation
 */
function fieldTagOnWrongNode() {
    return "`@".concat(Extractor_1.FIELD_TAG, "` can only be used on method/property declarations or signatures.");
}
exports.fieldTagOnWrongNode = fieldTagOnWrongNode;
function killsParentOnExceptionOnWrongNode() {
    return "Unexpected `@".concat(Extractor_1.KILLS_PARENT_ON_EXCEPTION_TAG, "`. `@").concat(Extractor_1.KILLS_PARENT_ON_EXCEPTION_TAG, "` can only be used in field annotation docblocks. Perhaps you are missing a `@").concat(Extractor_1.FIELD_TAG, "` tag?");
}
exports.killsParentOnExceptionOnWrongNode = killsParentOnExceptionOnWrongNode;
function wrongCasingForGratsTag(actual, expected) {
    return "Incorrect casing for Grats tag `@".concat(actual, "`. Use `@").concat(expected, "` instead.");
}
exports.wrongCasingForGratsTag = wrongCasingForGratsTag;
function invalidGratsTag(actual) {
    var validTagList = Extractor_1.ALL_TAGS.map(function (t) { return "`@".concat(t, "`"); }).join(", ");
    return "`@".concat(actual, "` is not a valid Grats tag. Valid tags are: ").concat(validTagList, ".");
}
exports.invalidGratsTag = invalidGratsTag;
function invalidTypeTagUsage() {
    return "`@".concat(Extractor_1.TYPE_TAG, "` can only be used on class, interface or type declarations. e.g. `class MyType {}`");
}
exports.invalidTypeTagUsage = invalidTypeTagUsage;
function invalidScalarTagUsage() {
    return "`@".concat(Extractor_1.SCALAR_TAG, "` can only be used on type alias declarations. e.g. `type MyScalar = string`");
}
exports.invalidScalarTagUsage = invalidScalarTagUsage;
function invalidInterfaceTagUsage() {
    return "`@".concat(Extractor_1.INTERFACE_TAG, "` can only be used on interface declarations. e.g. `interface MyInterface {}`");
}
exports.invalidInterfaceTagUsage = invalidInterfaceTagUsage;
function invalidEnumTagUsage() {
    return "`@".concat(Extractor_1.ENUM_TAG, "` can only be used on enum declarations or TypeScript unions. e.g. `enum MyEnum {}` or `type MyEnum = \"foo\" | \"bar\"`");
}
exports.invalidEnumTagUsage = invalidEnumTagUsage;
function invalidInputTagUsage() {
    return "`@".concat(Extractor_1.INPUT_TAG, "` can only be used on type alias declarations. e.g. `type MyInput = { foo: string }`");
}
exports.invalidInputTagUsage = invalidInputTagUsage;
function invalidUnionTagUsage() {
    return "`@".concat(Extractor_1.UNION_TAG, "` can only be used on type alias declarations. e.g. `type MyUnion = TypeA | TypeB`");
}
exports.invalidUnionTagUsage = invalidUnionTagUsage;
function expectedUnionTypeNode() {
    return "Expected a TypeScript union. `@".concat(Extractor_1.UNION_TAG, "` can only be used on TypeScript unions. e.g. `type MyUnion = TypeA | TypeB`");
}
exports.expectedUnionTypeNode = expectedUnionTypeNode;
function expectedUnionTypeReference() {
    return "Expected `@".concat(Extractor_1.UNION_TAG, "` union members to be type references. Grats expects union members to be references to something annotated with `@gqlType`.");
}
exports.expectedUnionTypeReference = expectedUnionTypeReference;
function invalidParentArgForFunctionField() {
    return "Expected `@".concat(Extractor_1.FIELD_TAG, "` function to have a first argument representing the type to extend. If you don't need access to the parent object in the function, you can name the variable `_` to indicate that it is unused. e.g. `function myField(_: ParentType) {}`");
}
exports.invalidParentArgForFunctionField = invalidParentArgForFunctionField;
function invalidReturnTypeForFunctionField() {
    return 'Expected GraphQL field to have an explicit return type. This is needed to allow Grats to "see" the type of the field.';
}
exports.invalidReturnTypeForFunctionField = invalidReturnTypeForFunctionField;
function functionFieldNotTopLevel() {
    return "Expected `@".concat(Extractor_1.FIELD_TAG, "` function to be a top-level declaration. Grats needs to import resolver functions into it's generated schema module, so the resolver function must be an exported.");
}
exports.functionFieldNotTopLevel = functionFieldNotTopLevel;
var FUNCTION_PARENT_TYPE_CONTEXT = "Grats treats the first argument as the parent object of the field. Therefore Grats needs to see the _type_ of the first argument in order to know to which type/interface this field should be added.";
function functionFieldParentTypeMissing() {
    return "Expected first argument of a `@".concat(Extractor_1.FIELD_TAG, "` function to have an explicit type annotation. ").concat(FUNCTION_PARENT_TYPE_CONTEXT);
}
exports.functionFieldParentTypeMissing = functionFieldParentTypeMissing;
function functionFieldParentTypeNotValid() {
    return "Expected first argument of a `@".concat(Extractor_1.FIELD_TAG, "` function to be typed as a type reference. ").concat(FUNCTION_PARENT_TYPE_CONTEXT);
}
exports.functionFieldParentTypeNotValid = functionFieldParentTypeNotValid;
function functionFieldNotNamed() {
    return "Expected `@".concat(Extractor_1.FIELD_TAG, "` function to be named. Grats uses the name of the function to derive the name of the GraphQL field. Additionally, Grats needs to import resolver functions into it's generated schema module, so the resolver function must be a named export.");
}
exports.functionFieldNotNamed = functionFieldNotNamed;
function functionFieldDefaultExport() {
    return "Expected a `@".concat(Extractor_1.FIELD_TAG, "` function to be a named export, not a default export. Grats needs to import resolver functions into it's generated schema module, so the resolver function must be a named export.");
}
exports.functionFieldDefaultExport = functionFieldDefaultExport;
function functionFieldNotNamedExport() {
    return "Expected a `@".concat(Extractor_1.FIELD_TAG, "` function to be a named export. Grats needs to import resolver functions into it's generated schema module, so the resolver function must be a named export.");
}
exports.functionFieldNotNamedExport = functionFieldNotNamedExport;
function inputTypeNotLiteral() {
    return "`@".concat(Extractor_1.INPUT_TAG, "` can only be used on type literals. e.g. `type MyInput = { foo: string }`");
}
exports.inputTypeNotLiteral = inputTypeNotLiteral;
function inputTypeFieldNotProperty() {
    return "`@".concat(Extractor_1.INPUT_TAG, "` types only support property signature members. e.g. `type MyInput = { foo: string }`");
}
exports.inputTypeFieldNotProperty = inputTypeFieldNotProperty;
function inputFieldUntyped() {
    return 'Input field must have an explicit type annotation. Grats uses the type annotation to determine the type of the field, so it must be explicit in order for Grats to "see" the type.';
}
exports.inputFieldUntyped = inputFieldUntyped;
function typeTagOnUnnamedClass() {
    return "Unexpected `@".concat(Extractor_1.TYPE_TAG, "` annotation on unnamed class declaration. Grats uses the name of the class to derive the name of the GraphQL type. Consider naming the class.");
}
exports.typeTagOnUnnamedClass = typeTagOnUnnamedClass;
function typeTagOnAliasOfNonObjectOrUnknown() {
    return "Expected `@".concat(Extractor_1.TYPE_TAG, "` type to be an object type literal (`{ }`) or `unknown`. For example: `type Foo = { bar: string }` or `type Query = unknown`.");
}
exports.typeTagOnAliasOfNonObjectOrUnknown = typeTagOnAliasOfNonObjectOrUnknown;
function typeNameNotDeclaration() {
    return "Expected `__typename` to be a property declaration. For example: `__typename: \"MyType\"`.";
}
exports.typeNameNotDeclaration = typeNameNotDeclaration;
var TYPENAME_CONTEXT = "This lets Grats know that the GraphQL executor will be able to derive the type of the object at runtime.";
function typeNameMissingInitializer() {
    return "Expected `__typename` property to have an initializer or a string literal type. For example: `__typename = \"MyType\"` or `__typename: \"MyType\";`. ".concat(TYPENAME_CONTEXT);
}
exports.typeNameMissingInitializer = typeNameMissingInitializer;
function typeNameInitializeNotString() {
    return "Expected `__typename` property initializer to be a string literal. For example: `__typename = \"MyType\"` or `__typename: \"MyType\";`. ".concat(TYPENAME_CONTEXT);
}
exports.typeNameInitializeNotString = typeNameInitializeNotString;
function typeNameInitializerWrong(expected, actual) {
    return "Expected `__typename` property initializer to be `\"".concat(expected, "\"`, found `\"").concat(actual, "\"`. ").concat(TYPENAME_CONTEXT);
}
exports.typeNameInitializerWrong = typeNameInitializerWrong;
function typeNameMissingTypeAnnotation(expected) {
    return "Expected `__typename` property signature to specify the typename as a string literal string type. For example `__typename: \"".concat(expected, "\";`. ").concat(TYPENAME_CONTEXT);
}
exports.typeNameMissingTypeAnnotation = typeNameMissingTypeAnnotation;
function typeNameTypeNotStringLiteral(expected) {
    return "Expected `__typename` property signature to specify the typename as a string literal string type. For example `__typename: \"".concat(expected, "\";`. ").concat(TYPENAME_CONTEXT);
}
exports.typeNameTypeNotStringLiteral = typeNameTypeNotStringLiteral;
function typeNameDoesNotMatchExpected(expected) {
    return "Expected `__typename` property to be `\"".concat(expected, "\"`. ").concat(TYPENAME_CONTEXT);
}
exports.typeNameDoesNotMatchExpected = typeNameDoesNotMatchExpected;
function argumentParamIsMissingType() {
    return "Expected GraphQL field arguments to have an explicit type annotation. If there are no arguments, you can use `args: unknown`. Grats needs to be able to see the type of the arguments to generate a GraphQL schema.";
}
exports.argumentParamIsMissingType = argumentParamIsMissingType;
function argumentParamIsNotObject() {
    return "Expected GraphQL field arguments to be typed using an inline literal object: `{someField: string}`. If there are no arguments, you can use `args: unknown`. Grats needs to be able to see the type of the arguments to generate a GraphQL schema.";
}
exports.argumentParamIsNotObject = argumentParamIsNotObject;
function argIsNotProperty() {
    return "Expected GraphQL field argument type to be a property signature. For example: `{ someField: string }`. Grats needs to be able to see the type of the arguments to generate a GraphQL schema.";
}
exports.argIsNotProperty = argIsNotProperty;
function argNameNotLiteral() {
    return "Expected GraphQL field argument names to be a literal. For example: `{ someField: string }`. Grats needs to be able to see the type of the arguments to generate a GraphQL schema.";
}
exports.argNameNotLiteral = argNameNotLiteral;
function argNotTyped() {
    return "Expected GraphQL field argument to have an explicit type annotation. For example: `{ someField: string }`. Grats needs to be able to see the type of the arguments to generate a GraphQL schema.";
}
exports.argNotTyped = argNotTyped;
function enumTagOnInvalidNode() {
    return "Expected `@".concat(Extractor_1.ENUM_TAG, "` to be a union type, or a string literal in the edge case of a single value enum. For example: `type MyEnum = \"foo\" | \"bar\"` or `type MyEnum = \"foo\"`.");
}
exports.enumTagOnInvalidNode = enumTagOnInvalidNode;
function enumVariantNotStringLiteral() {
    return "Expected `@".concat(Extractor_1.ENUM_TAG, "` enum members to be string literal types. For example: `'foo'`. Grats needs to be able to see the concrete value of the enum member to generate the GraphQL schema.");
}
exports.enumVariantNotStringLiteral = enumVariantNotStringLiteral;
function enumVariantMissingInitializer() {
    return "Expected `@".concat(Extractor_1.ENUM_TAG, "` enum members to have string literal initializers. For example: `FOO = 'foo'`. In GraphQL enum values are strings, and Grats needs to be able to see the concrete value of the enum member to generate the GraphQL schema.");
}
exports.enumVariantMissingInitializer = enumVariantMissingInitializer;
function gqlEntityMissingName() {
    return "Expected GraphQL entity to have a name. Grats uses the name of the entity to derive the name of the GraphQL construct.";
}
exports.gqlEntityMissingName = gqlEntityMissingName;
function methodMissingType() {
    return "Expected GraphQL field methods to have an explicitly defined return type. Grats needs to be able to see the type of the field to generate its type in the GraphQL schema.";
}
exports.methodMissingType = methodMissingType;
function wrapperMissingTypeArg() {
    return "Expected wrapper type reference to have type arguments. Grats needs to be able to see the return type in order to generate a GraphQL schema.";
}
exports.wrapperMissingTypeArg = wrapperMissingTypeArg;
function cannotResolveSymbolForDescription() {
    return "Expected TypeScript to be able to resolve this GraphQL entity to a symbol. Is it possible that this type is not defined in this file? Grats needs to follow type references to their declaration in order to determine which GraphQL name is being referenced.";
}
exports.cannotResolveSymbolForDescription = cannotResolveSymbolForDescription;
function propertyFieldMissingType() {
    return "Expected GraphQL field to have an explicitly defined type annotation. Grats needs to be able to see the type of the field to generate a field's type in the GraphQL schema.";
}
exports.propertyFieldMissingType = propertyFieldMissingType;
function expectedOneNonNullishType() {
    return "Expected exactly one non-nullish type. GraphQL does not support fields returning an arbitrary union of types. Consider defining an explicit `@".concat(Extractor_1.UNION_TAG, "` union type and returning that.");
}
exports.expectedOneNonNullishType = expectedOneNonNullishType;
function ambiguousNumberType() {
    return "Unexpected number type. GraphQL supports both Int and Float, making `number` ambiguous. Instead, import the `Int` or `Float` type from `".concat(Extractor_1.LIBRARY_IMPORT_NAME, "` and use that. e.g. `import { Int, Float } from \"").concat(Extractor_1.LIBRARY_IMPORT_NAME, "\";`.");
}
exports.ambiguousNumberType = ambiguousNumberType;
function defaultValueIsNotLiteral() {
    return 'Expected GraphQL field argument default values to be a literal. Grats interprets argument defaults as GraphQL default values, which must be literals. For example: `10` or `"foo"`.';
}
exports.defaultValueIsNotLiteral = defaultValueIsNotLiteral;
function defaultArgElementIsNotAssignment() {
    return "Expected property to be a default assignment. For example: `{ first = 10}`. Grats needs to extract a literal GraphQL value here, and that requires Grats being able to see the literal value in the source code.";
}
exports.defaultArgElementIsNotAssignment = defaultArgElementIsNotAssignment;
function defaultArgPropertyMissingName() {
    return "Expected object literal property to have a name. Grats needs to extract a literal value here, and that requires Grats being able to see the literal value and its field name in the source code.";
}
exports.defaultArgPropertyMissingName = defaultArgPropertyMissingName;
function defaultArgPropertyMissingInitializer() {
    return "Expected object literal property to have an initializer. For example: `{ offset = 10}`. Grats needs to extract a literal GraphQL value here, and that requires Grats being able to see the literal value in the source code.";
}
exports.defaultArgPropertyMissingInitializer = defaultArgPropertyMissingInitializer;
function unsupportedTypeLiteral() {
    return "Unexpected type literal. Grats expects types in GraphQL positions to be scalar types, or reference a named GraphQL type directly. You may want to define a named GraphQL type elsewhere and reference it here.";
}
exports.unsupportedTypeLiteral = unsupportedTypeLiteral;
function unknownGraphQLType() {
    return "Unknown GraphQL type. Grats doe not know how to map this type to a GraphQL type. You may want to define a named GraphQL type elsewhere and reference it here. If you think Grats should be able to infer a GraphQL type from this type, please file an issue.";
}
exports.unknownGraphQLType = unknownGraphQLType;
function pluralTypeMissingParameter() {
    return "Expected wrapper type reference to have type arguments. Grats needs to be able to see the return type in order to generate a GraphQL schema.";
}
exports.pluralTypeMissingParameter = pluralTypeMissingParameter;
function expectedNameIdentifier() {
    return "Expected an name identifier. Grats expected to find a name here which it could use to derive the GraphQL name.";
}
exports.expectedNameIdentifier = expectedNameIdentifier;
function killsParentOnExceptionWithWrongConfig() {
    return "Unexpected `@".concat(Extractor_1.KILLS_PARENT_ON_EXCEPTION_TAG, "` tag. `@").concat(Extractor_1.KILLS_PARENT_ON_EXCEPTION_TAG, "` is only supported when the Grats config option `nullableByDefault` is enabled in your `tsconfig.json`.");
}
exports.killsParentOnExceptionWithWrongConfig = killsParentOnExceptionWithWrongConfig;
function killsParentOnExceptionOnNullable() {
    return "Unexpected `@".concat(Extractor_1.KILLS_PARENT_ON_EXCEPTION_TAG, "` tag on field typed as nullable. `@").concat(Extractor_1.KILLS_PARENT_ON_EXCEPTION_TAG, "` will force a field to appear as non-nullable in the schema, so it's implementation must also be non-nullable. .");
}
exports.killsParentOnExceptionOnNullable = killsParentOnExceptionOnNullable;
function nonNullTypeCannotBeOptional() {
    return "Unexpected optional argument that does not also accept `null`. Optional arguments in GraphQL may get passed an explicit `null` value by the GraphQL executor. This means optional arguments must be typed to also accept `null`. Consider adding `| null` to the end of the argument type.";
}
exports.nonNullTypeCannotBeOptional = nonNullTypeCannotBeOptional;
function mergedInterfaces() {
    return [
        "Unexpected merged interface.",
        "If an interface is declared multiple times in a scope, TypeScript merges them.",
        "To avoid ambiguity Grats does not support using merged interfaces as GraphQL interfaces.",
        "Consider using a unique name for your TypeScript interface and renaming it.\n\n",
        "Learn more: ".concat(DOC_URLS.mergedInterfaces),
    ].join(" ");
}
exports.mergedInterfaces = mergedInterfaces;
function implementsTagOnClass() {
    return "`@".concat(Extractor_1.IMPLEMENTS_TAG_DEPRECATED, "` has been deprecated. Instead use `class MyType implements MyInterface`.");
}
exports.implementsTagOnClass = implementsTagOnClass;
function implementsTagOnInterface() {
    return "`@".concat(Extractor_1.IMPLEMENTS_TAG_DEPRECATED, "` has been deprecated. Instead use `interface MyType extends MyInterface`.");
}
exports.implementsTagOnInterface = implementsTagOnInterface;
function implementsTagOnTypeAlias() {
    return "`@".concat(Extractor_1.IMPLEMENTS_TAG_DEPRECATED, "` has been deprecated. Types which implement GraphQL interfaces should be defined using TypeScript class or interface declarations.");
}
exports.implementsTagOnTypeAlias = implementsTagOnTypeAlias;
function duplicateTag(tagName) {
    return "Unexpected duplicate `@".concat(tagName, "` tag. Grats does not accept multiple instances of the same tag.");
}
exports.duplicateTag = duplicateTag;
function duplicateInterfaceTag() {
    return "Unexpected duplicate `@".concat(Extractor_1.IMPLEMENTS_TAG_DEPRECATED, "` tag. To declare that a type or interface implements multiple interfaces list them as comma separated values: `@").concat(Extractor_1.IMPLEMENTS_TAG_DEPRECATED, " interfaceA, interfaceB`.");
}
exports.duplicateInterfaceTag = duplicateInterfaceTag;
function parameterWithoutModifiers() {
    return [
        "Expected `@".concat(Extractor_1.FIELD_TAG, "` constructor parameter to be a parameter property. This requires a modifier such as `public` or `readonly` before the parameter name.\n\n"),
        "Learn more: ".concat(DOC_URLS.parameterProperties),
    ].join("");
}
exports.parameterWithoutModifiers = parameterWithoutModifiers;
function parameterPropertyNotPublic() {
    return [
        "Expected `@".concat(Extractor_1.FIELD_TAG, "` parameter property to be public. Valid modifiers for `@").concat(Extractor_1.FIELD_TAG, "` parameter properties are  `public` and `readonly`.\n\n"),
        "Learn more: ".concat(DOC_URLS.parameterProperties),
    ].join("");
}
exports.parameterPropertyNotPublic = parameterPropertyNotPublic;
function parameterPropertyMissingType() {
    return "Expected `@".concat(Extractor_1.FIELD_TAG, "` parameter property to have an explicit type annotation. Grats needs to be able to see the type of the parameter property to generate a GraphQL schema.");
}
exports.parameterPropertyMissingType = parameterPropertyMissingType;
function invalidTypePassedToFieldFunction() {
    return "Unexpected type passed to `@".concat(Extractor_1.FIELD_TAG, "` function. `@").concat(Extractor_1.FIELD_TAG, "` functions can only be used to extend `@").concat(Extractor_1.TYPE_TAG, "` and `@").concat(Extractor_1.INTERFACE_TAG, "` types.");
}
exports.invalidTypePassedToFieldFunction = invalidTypePassedToFieldFunction;
function unresolvedTypeReference() {
    return "Unable to resolve type reference. In order to generate a GraphQL schema, Grats needs to determine which GraphQL type is being referenced. This requires being able to resolve type references to their `@gql` annotated declaration. However this reference could not be resolved. Is it possible that this type is not defined in this file?";
}
exports.unresolvedTypeReference = unresolvedTypeReference;
function expectedTypeAnnotationOnContext() {
    return "Expected context parameter to have an explicit type annotation. Grats validates that your context parameter is type-safe by checking that all context values reference the same type declaration.";
}
exports.expectedTypeAnnotationOnContext = expectedTypeAnnotationOnContext;
function expectedTypeAnnotationOfReferenceOnContext() {
    return "Expected context parameter's type to be a type reference. Grats validates that your context parameter is type-safe by checking that all context values reference the same type declaration.";
}
exports.expectedTypeAnnotationOfReferenceOnContext = expectedTypeAnnotationOfReferenceOnContext;
function expectedTypeAnnotationOnContextToBeResolvable() {
    // TODO: Provide guidance?
    // TODO: I don't think we have a test case that triggers this error.
    return "Unable to resolve context parameter type. Grats validates that your context parameter is type-safe by checking that all context values reference the same type declaration.";
}
exports.expectedTypeAnnotationOnContextToBeResolvable = expectedTypeAnnotationOnContextToBeResolvable;
function expectedTypeAnnotationOnContextToHaveDeclaration() {
    return "Unable to locate the declaration of the context parameter's type. Grats validates that your context parameter is type-safe by checking all context values reference the same type declaration. Did you forget to import or define this type?";
}
exports.expectedTypeAnnotationOnContextToHaveDeclaration = expectedTypeAnnotationOnContextToHaveDeclaration;
function unexpectedParamSpreadForContextParam() {
    return "Unexpected spread parameter in context parameter position. Grats expects the context parameter to be a single, explicitly-typed argument.";
}
exports.unexpectedParamSpreadForContextParam = unexpectedParamSpreadForContextParam;
function multipleContextTypes() {
    return "Context argument's type does not match. Grats expects all resolvers that read the context argument to use the same type for that argument. Did you use the incorrect type in one of your resolvers?";
}
exports.multipleContextTypes = multipleContextTypes;
function graphQLNameHasLeadingNewlines(name, tagName) {
    return "Expected the GraphQL name `".concat(name, "` to be on the same line as it's `@").concat(tagName, "` tag.");
}
exports.graphQLNameHasLeadingNewlines = graphQLNameHasLeadingNewlines;
function graphQLTagNameHasWhitespace(tagName) {
    return "Expected text following a `@".concat(tagName, "` tag to be a GraphQL name. If you intended this text to be a description, place it at the top of the docblock before any `@tags`.");
}
exports.graphQLTagNameHasWhitespace = graphQLTagNameHasWhitespace;
function subscriptionFieldNotAsyncIterable() {
    return "Expected fields on `Subscription` to return an `AsyncIterable`. Fields on `Subscription` model a subscription, which is a stream of events. Grats expects fields on `Subscription` to return an `AsyncIterable` which can be used to model this stream.";
}
exports.subscriptionFieldNotAsyncIterable = subscriptionFieldNotAsyncIterable;
function nonSubscriptionFieldAsyncIterable() {
    return "Unexpected AsyncIterable. Only fields on `Subscription` should return an `AsyncIterable`. Non-subscription fields are only expected to return a single value.";
}
exports.nonSubscriptionFieldAsyncIterable = nonSubscriptionFieldAsyncIterable;
function operationTypeNotUnknown() {
    return "Operation types `Query`, `Mutation`, and `Subscription` must be defined as type aliases of `unknown`. E.g. `type Query = unknown`. This is because GraphQL servers do not have an agreed upon way to produce root values, and Grats errs on the side of safety. If you are trying to implement dependency injection, consider using the `context` argument passed to each resolver instead. If you have a strong use case for a concrete root value, please file an issue.";
}
exports.operationTypeNotUnknown = operationTypeNotUnknown;
function expectedNullableArgumentToBeOptional() {
    return "Expected nullable argument to _also_ be optional (`?`). graphql-js may omit properties on the argument object where an undefined GraphQL variable is passed, or if the argument is omitted in the operation text. To ensure your resolver is capable of handing this scenario, add a `?` to the end of the argument name to make it optional. e.g. `{greeting?: string | null}`";
}
exports.expectedNullableArgumentToBeOptional = expectedNullableArgumentToBeOptional;
function gqlTagInLineComment() {
    return "Unexpected Grats tag in line (`//`) comment. Grats looks for tags in JSDoc-style block comments. e.g. `/** @gqlType */`. For more information see: ".concat(DOC_URLS.commentSyntax);
}
exports.gqlTagInLineComment = gqlTagInLineComment;
function gqlTagInNonJSDocBlockComment() {
    return "Unexpected Grats tag in non-JSDoc-style block comment. Grats only looks for tags in JSDoc-style block comments which start with `/**`. For more information see: ".concat(DOC_URLS.commentSyntax);
}
exports.gqlTagInNonJSDocBlockComment = gqlTagInNonJSDocBlockComment;
function gqlTagInDetachedJSDocBlockComment() {
    return "Unexpected Grats tag in detached docblock. Grats was unable to determine which TypeScript declaration this docblock is associated with. Moving the docblock to a position with is unambiguously \"above\" the relevant declaration may help. For more information see: ".concat(DOC_URLS.commentSyntax);
}
exports.gqlTagInDetachedJSDocBlockComment = gqlTagInDetachedJSDocBlockComment;
