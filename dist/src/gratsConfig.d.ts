import * as ts from "typescript";
export type ConfigOptions = {
    graphqlSchema: string;
    tsSchema: string;
    nullableByDefault: boolean;
    strictSemanticNullability: boolean;
    reportTypeScriptTypeErrors: boolean;
    schemaHeader: string | null;
    tsSchemaHeader: string | null;
};
export type ParsedCommandLineGrats = Omit<ts.ParsedCommandLine, "raw"> & {
    raw: {
        grats: ConfigOptions;
    };
};
export declare function validateGratsOptions(options: ts.ParsedCommandLine): ParsedCommandLineGrats;
