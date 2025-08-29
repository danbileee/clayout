import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false, // disable dts generation in tsup
  sourcemap: true,
  clean: true,
  target: "es2020",
});
