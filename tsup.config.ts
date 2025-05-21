import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: [
    "src/mod.ts",
    "src/ascii85.ts",
    "src/base32.ts",
    "src/unstable_base32.ts",
    "src/unstable_base32_stream.ts",
    "src/base58.ts",
    "src/base64.ts",
    "src/unstable_base64.ts",
    "src/unstable_base64_stream.ts",
    "src/base64url.ts",
    "src/hex.ts",
    "src/unstable_hex.ts",
    "src/unstable_hex_stream.ts",
    "src/varint.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  minify: !options.watch,
}));
