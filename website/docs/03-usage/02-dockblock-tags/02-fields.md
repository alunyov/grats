# Fields

You can define GraphQL fields by placing a `@gqlField` directly before a:

* Method declaration
* Method signature
* Property declaration
* Property signature
* Function declaration (with named export)

```ts
/** @gqlType */
class User {
  /**
   * A description of some field.
   * @gqlField <optional name of the field, if different from property name>
   */
  someField: string;

  /** @gqlField */
  myField(): string {
    return "Hello World";
  }
}
```

## Functional style fields

Sometimes you want to add a computed field to a non-class type, or extend base
types like `Query` or `Mutation` from another file. Both of these usecases are
enabled by placing a `@gqlField` before an exported function declaration.

In this case, the function should expect an instance of the base type as the
first argument, and an object representing the GraphQL field arguments as the
second argument. The function should return the value of the field.

Extending Query:

```ts
/** @gqlField */
export function userById(_: Query, args: {id: string}): User {
  return DB.getUserById(args.id);
}
```

Extending Mutation:

```ts
/** @gqlField */
export function deleteUser(_: Mutation, args: {id: string}): boolean {
  return DB.deleteUser(args.id);
}
```

Note that Grats will use the type of the first argument to determine which type
is being extended. So, as seen in the previous examples, even if you don't need
access to the instance you should still define a typed first argument.