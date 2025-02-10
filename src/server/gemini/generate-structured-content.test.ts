import { describe, expect, test } from "vitest";
import { extractValidJson } from "./generate-structured-content";

describe("removeNotJson", () => {
  test("正常なJSON", async () => {
    const content = `{"a":1}`;
    expect(await extractValidJson(content)).toEqual({ a: 1 });
  });

  test("Markdownの一部", async () => {
    const content = "```json\n{\"a\":1}\n```";
    expect(await extractValidJson(content)).toEqual({ a: 1 });
  });
});
