// Copyright 2018-2025 the Deno authors. MIT license.

import { assertEquals } from "@std/assert";
import { toText } from "@std/streams";
import { toBytes } from "@std/streams/unstable-to-bytes";
import { FixedChunkStream } from "@std/streams/unstable-fixed-chunk-stream";
import { open, readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { test } from "vitest";
import { encodeBase64 } from "./unstable_base64.ts";
import {
  Base64DecoderStream,
  Base64EncoderStream,
} from "./unstable_base64_stream.ts";

test("Base64EncoderStream() with normal format", async () => {
  for (const alphabet of ["base64", "base64url"] as const) {
    const fd = await open("./pnpm-lock.yaml");
    const readable = Readable.toWeb(fd.createReadStream())
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new FixedChunkStream(1021))
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new Base64EncoderStream({ alphabet, output: "string" }));

    assertEquals(
      await toText(readable),
      encodeBase64(
        new Uint8Array(await readFile("./pnpm-lock.yaml")),
        { alphabet },
      ),
      alphabet,
    );
  }
});

test("Base64EncoderStream() with raw format", async () => {
  for (const alphabet of ["base64", "base64url"] as const) {
    const fd = await open("./pnpm-lock.yaml");
    const readable = Readable.toWeb(fd.createReadStream())
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new FixedChunkStream(1021))
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new Base64EncoderStream({ alphabet, output: "bytes" }));

    assertEquals(
      // @ts-ignore: they are compatible at runtime
      await toBytes(readable),
      new TextEncoder().encode(
        encodeBase64(
          new Uint8Array(await readFile("./pnpm-lock.yaml")),
          { alphabet },
        ),
      ),
      alphabet,
    );
  }
});

test("Base64DecoderStream() with normal format", async () => {
  for (const alphabet of ["base64", "base64url"] as const) {
    const fd = await open("./pnpm-lock.yaml");
    const readable = Readable.toWeb(fd.createReadStream())
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new Base64EncoderStream({ alphabet, output: "string" }))
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new TextEncoderStream())
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new FixedChunkStream(1021))
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new TextDecoderStream())
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new Base64DecoderStream({ alphabet, input: "string" }));

    assertEquals(
      // @ts-ignore: they are compatible at runtime
      await toBytes(readable),
      new Uint8Array(await readFile("./pnpm-lock.yaml")),
    );
  }
});

test("Base64DecoderStream() with raw format", async () => {
  for (const alphabet of ["base64", "base64url"] as const) {
    const fd = await open("./pnpm-lock.yaml");
    const readable = Readable.toWeb(fd.createReadStream())
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new Base64EncoderStream({ alphabet, output: "bytes" }))
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new FixedChunkStream(1021))
      // @ts-ignore: they are compatible at runtime
      .pipeThrough(new Base64DecoderStream({ alphabet, input: "bytes" }));

    assertEquals(
      // @ts-ignore: they are compatible at runtime
      await toBytes(readable),
      new Uint8Array(await readFile("./pnpm-lock.yaml")),
    );
  }
});
