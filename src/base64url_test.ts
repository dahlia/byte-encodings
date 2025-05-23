// Copyright 2018-2025 the Deno authors. MIT license.

import { assertEquals, assertThrows } from "@std/assert";
import { test } from "vitest";
import { decodeBase64Url, encodeBase64Url } from "./base64url.ts";

const testsetString = [
  ["", ""],
  ["ß", "w58"],
  ["f", "Zg"],
  ["fo", "Zm8"],
  ["foo", "Zm9v"],
  ["foob", "Zm9vYg"],
  ["fooba", "Zm9vYmE"],
  ["foobar", "Zm9vYmFy"],
  [">?>d?ß", "Pj8-ZD_Dnw"],
];

const testsetBinary = testsetString.map(([str, b64]) => [
  new TextEncoder().encode(str),
  b64,
]) as Array<[Uint8Array, string]>;

const testsetInvalid = [
  "Pj8/ZD+Dnw",
  "PDw/Pz8+Pg",
  "Pj8/ZD+Dnw==",
  "PDw/Pz8+Pg==",
];

test("encodeBase64Url() encodes string", () => {
  for (const [input, output] of testsetString) {
    assertEquals(encodeBase64Url(input!), output);
  }
});

test("encodeBase64Url() encodes binary", () => {
  for (const [input, output] of testsetBinary) {
    assertEquals(encodeBase64Url(input), output);
  }
});

test("decodeBase64Url() decodes binary", () => {
  for (const [input, output] of testsetBinary) {
    assertEquals(decodeBase64Url(output), input);
  }
});

test("decodeBase64Url() throws on invalid input", () => {
  for (const invalidb64url of testsetInvalid) {
    assertThrows(
      () => decodeBase64Url(invalidb64url),
      TypeError,
      "Cannot decode input as base64: Invalid character",
    );
  }
});

test("decodeBase64Url() throws on illegal base64url string", () => {
  const testsetIllegalBase64url = [
    "w58De",
    "Zm9vYmFyy",
    "DPj8-ZD_DnwEg",
    "SGVsbG8gV29ybGQ-_",
  ];

  for (const illegalBase64url of testsetIllegalBase64url) {
    assertThrows(
      () => decodeBase64Url(illegalBase64url),
      RangeError,
      `Length (${illegalBase64url.length}), excluding padding, must not have a remainder of 1 when divided by 4`,
    );
  }
});
