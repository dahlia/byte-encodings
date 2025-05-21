// Copyright 2018-2025 the Deno authors. MIT license.

import { assertEquals } from "@std/assert";
import { toText } from "@std/streams";
import { toBytes } from "@std/streams/unstable-to-bytes";
import { FixedChunkStream } from "@std/streams/unstable-fixed-chunk-stream";
import { open, readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { test } from "vitest";
import { encodeHex } from "./unstable_hex.ts";
import { HexDecoderStream, HexEncoderStream } from "./unstable_hex_stream.ts";

test("HexEncoderStream() with normal format", async () => {
  const fd = await open("./pnpm-lock.yaml");
  const readable = Readable.toWeb(fd.createReadStream())
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new FixedChunkStream(1021))
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new HexEncoderStream({ output: "string" }));

  assertEquals(
    await toText(readable),
    encodeHex(new Uint8Array(await readFile("./pnpm-lock.yaml"))),
  );
});

test("HexEncoderStream() with raw format", async () => {
  const fd = await open("./pnpm-lock.yaml");
  const readable = Readable.toWeb(fd.createReadStream())
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new FixedChunkStream(1021))
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new HexEncoderStream({ output: "bytes" }));

  assertEquals(
    // @ts-ignore: they are compatible at runtime
    await toBytes(readable),
    new TextEncoder().encode(
      encodeHex(new Uint8Array(await readFile("./pnpm-lock.yaml"))),
    ),
  );
});

test("HexDecoderStream() with normal format", async () => {
  const fd = await open("./pnpm-lock.yaml");
  const readable = Readable.toWeb(fd.createReadStream())
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new HexEncoderStream({ output: "string" }))
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new TextEncoderStream())
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new FixedChunkStream(1021))
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new TextDecoderStream())
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new HexDecoderStream({ input: "string" }));

  assertEquals(
    // @ts-ignore: they are compatible at runtime
    await toBytes(readable),
    new Uint8Array(await readFile("./pnpm-lock.yaml")),
  );
});

test("HexDecoderStream() with raw format", async () => {
  const fd = await open("./pnpm-lock.yaml");
  const readable = Readable.toWeb(fd.createReadStream())
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new HexEncoderStream({ output: "bytes" }))
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new FixedChunkStream(1021))
    // @ts-ignore: they are compatible at runtime
    .pipeThrough(new HexDecoderStream({ input: "bytes" }));

  // @ts-ignore: they are compatible at runtime
  assertEquals(
    // @ts-ignore: they are compatible at runtime
    await toBytes(readable),
    new Uint8Array(await readFile("./pnpm-lock.yaml")),
  );
});
