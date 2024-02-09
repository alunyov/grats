"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locate = void 0;
var graphql_1 = require("graphql");
var Result_1 = require("./utils/Result");
var helpers_1 = require("./utils/helpers");
/**
 * Given an entity name of the format `ParentType` or `ParentType.fieldName`,
 * locate the entity in the schema and return its location.
 */
function locate(schema, entityName) {
    var entityResult = parseEntityName(entityName);
    if (entityResult.kind === "ERROR") {
        return entityResult;
    }
    var entity = entityResult.value;
    var type = schema.getType(entity.parent);
    if (type == null) {
        return (0, Result_1.err)("Cannot locate type `".concat(entity.parent, "`."));
    }
    if (entity.field == null) {
        if (type.astNode == null) {
            throw new Error("Grats bug: Cannot find location of type `".concat(entity.parent, "`."));
        }
        return (0, Result_1.ok)((0, helpers_1.loc)(type.astNode.name));
    }
    if (!(type instanceof graphql_1.GraphQLObjectType ||
        type instanceof graphql_1.GraphQLInterfaceType ||
        type instanceof graphql_1.GraphQLInputObjectType)) {
        return (0, Result_1.err)("Cannot locate field `".concat(entity.field, "` on type `").concat(entity.parent, "`. Only object types, interfaces, and input objects have fields."));
    }
    var field = type.getFields()[entity.field];
    if (field == null) {
        return (0, Result_1.err)("Cannot locate field `".concat(entity.field, "` on type `").concat(entity.parent, "`."));
    }
    if (field.astNode == null) {
        throw new Error("Grats bug: Cannot find location of field `".concat(entity.field, "` on type `").concat(entity.parent, "`."));
    }
    return (0, Result_1.ok)((0, helpers_1.loc)(field.astNode.name));
}
exports.locate = locate;
var ENTITY_NAME_REGEX = /^([A-Za-z0-9_]+)(?:\.([A-Za-z0-9_]+))?$/;
function parseEntityName(entityName) {
    var match = ENTITY_NAME_REGEX.exec(entityName);
    if (match == null) {
        return (0, Result_1.err)("Invalid entity name: `".concat(entityName, "`. Expected `ParentType` or `ParentType.fieldName`."));
    }
    var parent = match[1];
    var field = match[2] || null;
    return (0, Result_1.ok)({ parent: parent, field: field });
}
