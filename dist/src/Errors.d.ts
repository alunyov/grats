export declare const ISSUE_URL = "https://github.com/captbaritone/grats/issues";
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
export declare function fieldTagOnWrongNode(): string;
export declare function killsParentOnExceptionOnWrongNode(): string;
export declare function wrongCasingForGratsTag(actual: string, expected: string): string;
export declare function invalidGratsTag(actual: string): string;
export declare function invalidTypeTagUsage(): string;
export declare function invalidScalarTagUsage(): string;
export declare function invalidInterfaceTagUsage(): string;
export declare function invalidEnumTagUsage(): string;
export declare function invalidInputTagUsage(): string;
export declare function invalidUnionTagUsage(): string;
export declare function expectedUnionTypeNode(): string;
export declare function expectedUnionTypeReference(): string;
export declare function invalidParentArgForFunctionField(): string;
export declare function invalidReturnTypeForFunctionField(): string;
export declare function functionFieldNotTopLevel(): string;
export declare function functionFieldParentTypeMissing(): string;
export declare function functionFieldParentTypeNotValid(): string;
export declare function functionFieldNotNamed(): string;
export declare function functionFieldDefaultExport(): string;
export declare function functionFieldNotNamedExport(): string;
export declare function inputTypeNotLiteral(): string;
export declare function inputTypeFieldNotProperty(): string;
export declare function inputFieldUntyped(): string;
export declare function typeTagOnUnnamedClass(): string;
export declare function typeTagOnAliasOfNonObjectOrUnknown(): string;
export declare function typeNameNotDeclaration(): string;
export declare function typeNameMissingInitializer(): string;
export declare function typeNameInitializeNotString(): string;
export declare function typeNameInitializerWrong(expected: string, actual: string): string;
export declare function typeNameMissingTypeAnnotation(expected: string): string;
export declare function typeNameTypeNotStringLiteral(expected: string): string;
export declare function typeNameDoesNotMatchExpected(expected: string): string;
export declare function argumentParamIsMissingType(): string;
export declare function argumentParamIsNotObject(): string;
export declare function argIsNotProperty(): string;
export declare function argNameNotLiteral(): string;
export declare function argNotTyped(): string;
export declare function enumTagOnInvalidNode(): string;
export declare function enumVariantNotStringLiteral(): string;
export declare function enumVariantMissingInitializer(): string;
export declare function gqlEntityMissingName(): string;
export declare function methodMissingType(): string;
export declare function wrapperMissingTypeArg(): string;
export declare function cannotResolveSymbolForDescription(): string;
export declare function propertyFieldMissingType(): string;
export declare function expectedOneNonNullishType(): string;
export declare function ambiguousNumberType(): string;
export declare function defaultValueIsNotLiteral(): string;
export declare function defaultArgElementIsNotAssignment(): string;
export declare function defaultArgPropertyMissingName(): string;
export declare function defaultArgPropertyMissingInitializer(): string;
export declare function unsupportedTypeLiteral(): string;
export declare function unknownGraphQLType(): string;
export declare function pluralTypeMissingParameter(): string;
export declare function expectedNameIdentifier(): string;
export declare function killsParentOnExceptionWithWrongConfig(): string;
export declare function killsParentOnExceptionOnNullable(): string;
export declare function nonNullTypeCannotBeOptional(): string;
export declare function mergedInterfaces(): string;
export declare function implementsTagOnClass(): string;
export declare function implementsTagOnInterface(): string;
export declare function implementsTagOnTypeAlias(): string;
export declare function duplicateTag(tagName: string): string;
export declare function duplicateInterfaceTag(): string;
export declare function parameterWithoutModifiers(): string;
export declare function parameterPropertyNotPublic(): string;
export declare function parameterPropertyMissingType(): string;
export declare function invalidTypePassedToFieldFunction(): string;
export declare function unresolvedTypeReference(): string;
export declare function expectedTypeAnnotationOnContext(): string;
export declare function expectedTypeAnnotationOfReferenceOnContext(): string;
export declare function expectedTypeAnnotationOnContextToBeResolvable(): string;
export declare function expectedTypeAnnotationOnContextToHaveDeclaration(): string;
export declare function unexpectedParamSpreadForContextParam(): string;
export declare function multipleContextTypes(): string;
export declare function graphQLNameHasLeadingNewlines(name: string, tagName: string): string;
export declare function graphQLTagNameHasWhitespace(tagName: string): string;
export declare function subscriptionFieldNotAsyncIterable(): string;
export declare function nonSubscriptionFieldAsyncIterable(): string;
export declare function operationTypeNotUnknown(): string;
export declare function expectedNullableArgumentToBeOptional(): string;
export declare function gqlTagInLineComment(): string;
export declare function gqlTagInNonJSDocBlockComment(): string;
export declare function gqlTagInDetachedJSDocBlockComment(): string;
