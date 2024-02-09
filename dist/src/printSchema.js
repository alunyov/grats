"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printSDLWithoutMetadata = exports.printGratsSDL = exports.printExecutableSchema = void 0;
var graphql_1 = require("graphql");
var codegen_1 = require("./codegen");
var metadataDirectives_1 = require("./metadataDirectives");
/**
 * Prints code for a TypeScript module that exports a GraphQLSchema.
 * Includes the user-defined (or default) header comment if provided.
 */
function printExecutableSchema(schema, config, destination) {
    var code = (0, codegen_1.codegen)(schema, destination);
    if (config.tsSchemaHeader) {
        return "".concat(config.tsSchemaHeader, "\n").concat(code);
    }
    return code;
}
exports.printExecutableSchema = printExecutableSchema;
/**
 * Prints SDL, potentially omitting directives depending upon the config.
 * Includes the user-defined (or default) header comment if provided.
 */
function printGratsSDL(doc, config) {
    var sdl = printSDLWithoutMetadata(doc);
    if (config.schemaHeader) {
        sdl = "".concat(config.schemaHeader, "\n").concat(sdl);
    }
    return sdl + "\n";
}
exports.printGratsSDL = printGratsSDL;
function printSDLWithoutMetadata(doc) {
    var trimmed = (0, graphql_1.visit)(doc, {
        DirectiveDefinition: function (t) {
            return metadataDirectives_1.METADATA_DIRECTIVE_NAMES.has(t.name.value) ? null : t;
        },
        Directive: function (t) {
            return metadataDirectives_1.METADATA_DIRECTIVE_NAMES.has(t.name.value) ? null : t;
        },
        ScalarTypeDefinition: function (t) {
            return graphql_1.specifiedScalarTypes.some(function (scalar) { return scalar.name === t.name.value; })
                ? null
                : t;
        },
    });
    return (0, graphql_1.print)(trimmed);
}
exports.printSDLWithoutMetadata = printSDLWithoutMetadata;
