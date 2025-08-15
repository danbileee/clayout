import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

/** @type {import('rollup').RollupOptions[]} */
export default [
  // JS builds (CJS + ESM)
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: "dist/index.mjs",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false, // handled in dts step
        outDir: "dist",
        rootDir: "src",
      }),
    ],
    external: ["zod"],
  },
  // Type declarations
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
