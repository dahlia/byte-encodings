// Test cases copied from https://github.com/LinusU/base32-encode/blob/master/test.js
// Copyright (c) 2016-2017 Linus Unnebäck. MIT license.
// Copyright 2018-2025 the Deno authors. MIT license.
import { assertEquals, assertExists, assertThrows } from "@std/assert";
import { test } from "vitest";
import { decodeBase32, encodeBase32 } from "./base32.ts";

// Test vectors from https://www.rfc-editor.org/rfc/rfc4648.html#section-10
const testCases = [
  ["", ""],
  ["f", "MY======"],
  ["fo", "MZXQ===="],
  ["foo", "MZXW6==="],
  ["foob", "MZXW6YQ="],
  ["fooba", "MZXW6YTB"],
  ["foobar", "MZXW6YTBOI======"],
] as const;

test(
  "encodeBase32()",
  () => {
    for (const [bin, b32] of testCases) {
      assertEquals(encodeBase32(bin), b32);
    }
  },
);

test(
  "decodeBase32()",
  () => {
    for (const [bin, b32] of testCases) {
      assertEquals(decodeBase32(b32), new TextEncoder().encode(bin));
    }
  },
);

test(
  "decodeBase32() throws on bad length",
  () => {
    assertThrows(
      () => decodeBase32("OOOO=="),
      Error,
      "Invalid base32 string: length (6) must be a multiple of 8",
    );
  },
);

test(
  "decodeBase32() throws on bad padding",
  () => {
    assertThrows(
      () => decodeBase32("5HXR334AQYAAAA=========="),
      Error,
      "Cannot decode input as base32: Invalid character (=)",
    );
  },
);

test(
  "encodeBase32() encodes very long text",
  () => {
    const data = "a".repeat(16400);
    assertExists(encodeBase32(data));
  },
);
