import { build } from "esbuild";

build({
  entryPoints: [
    "./src/sampleFunction/sampleFunction.ts",
    // add more as needed
  ],
  entryNames: "[dir]/[name]/index",
  outdir: "dist",
  bundle: true,
  platform: "node",
  target: "node22",
  sourcemap: false,
  minify: true,
  logLevel: "info",
}).catch(() => process.exit(1));
