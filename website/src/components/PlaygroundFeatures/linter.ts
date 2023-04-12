import { createSystem, createVirtualCompilerHost } from "@typescript/vfs";
import * as ts from "typescript";
import { buildSchemaResultWithHost } from "grats/src/lib";
import { linter } from "@codemirror/lint";
import { printSchema } from "graphql";
import { printSchemaWithDirectives } from "@graphql-tools/utils";
import GRATS_TYPE_DECLARATIONS from "!!raw-loader!grats/src/Types.ts";

import store from "./store";

const GRATS_PATH = "node_modules/grats/src/index.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.process = {
  // Grats depends upon calling path.resolver and path.relative
  // which depend upon process.cwd() being set.
  // Here we supply a fake cwd() function that returns the root
  cwd() {
    return "/";
  },
};

function buildSchemaResultWithFsMap(fsMap, text, config) {
  fsMap.set("index.ts", text);
  fsMap.set(GRATS_PATH, GRATS_TYPE_DECLARATIONS);
  // TODO: Don't recreate the system each time!
  const system = createSystem(fsMap);

  const compilerOpts = {
    allowJs: true,
    baseUrl: "./",
    paths: { grats: [GRATS_PATH] },
    // lib: ["es2021"],
  };
  const host = createVirtualCompilerHost(system, compilerOpts, ts);

  const parsedOptions = {
    raw: {
      grats: config,
    },
    options: compilerOpts,
    fileNames: ["index.ts"],
    errors: [],
  };

  try {
    return buildSchemaResultWithHost(parsedOptions, host.compilerHost);
  } catch (e) {
    const message = `Grats playground bug encountered. Please report this error:\n\n ${e.stack}`;
    return {
      kind: "ERROR",
      err: { formatDiagnosticsWithContext: () => message, _diagnostics: [] },
    };
  }
}

export function createLinter(fsMap, view, config) {
  return linter((codeMirrorView) => {
    const text = codeMirrorView.viewState.state.doc.toString();

    const result = buildSchemaResultWithFsMap(fsMap, text, config);

    store.dispatch({ type: "NEW_DOCUMENT_TEXT", value: text });

    const output = computeOutput(result, view);

    store.dispatch({ type: "GRATS_EMITTED_NEW_RESULT", value: output });
    const diagnostics = [];

    if (result.kind === "ERROR") {
      for (const diagnostic of result.err._diagnostics) {
        diagnostics.push({
          from: diagnostic.start,
          to: diagnostic.start + diagnostic.length,
          severity: "error",
          message: diagnostic.messageText,
          actions: [],
        });
      }
    }

    return diagnostics;
  });
}

function computeOutput(schemaResult, view) {
  if (schemaResult.kind === "ERROR") {
    const errorText = schemaResult.err.formatDiagnosticsWithContext();
    return `# ERROR MESSAGE\n# =============\n\n${commentLines(errorText)}`;
  }

  const schema = schemaResult.value;
  if (!view.showGratsDirectives) {
    // HACK!
    schema._directives = schema._directives.filter(
      (directive) =>
        directive.name !== "exported" && directive.name !== "methodName",
    );
    return printSchema(schema);
  }
  return printSchemaWithDirectives(schema, { assumeValid: true });
}

function commentLines(text: string): string {
  return text
    .split("\n")
    .map((line) => `# ${line}`)
    .join("\n");
}
