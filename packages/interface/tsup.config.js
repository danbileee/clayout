"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsup_1 = require("tsup");
exports.default = (0, tsup_1.defineConfig)({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: false, // disable dts generation in tsup
    sourcemap: true,
    clean: true,
    target: "es2020",
});
