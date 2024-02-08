import { replaceInlineContext } from "./renderer"; // Adjust the import path as needed

describe("replaceInlineContext", () => {
  it("replaces simple path without operation", () => {
    const context = { user: { name: "Jane Doe" } };
    const template = "Hello {{user.name}}";
    expect(replaceInlineContext(template, context)).toBe("Hello Jane Doe");
  });

  it("applies split and index operations to extract part of a string", () => {
    const context = { refs: { example: { url: "ipfs://exampleCID" } } };
    const template = "{{refs.example.url | split ipfs:// | index 1}}";
    expect(replaceInlineContext(template, context)).toBe("exampleCID");
  });
});
