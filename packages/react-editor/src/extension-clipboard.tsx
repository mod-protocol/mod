import { Slice, Fragment, Node as ProseMirrorNode } from "prosemirror-model";

// https://github.com/ueberdosis/tiptap/issues/775
export function clipboardTextParser(text: any, context: any, plain: any): any {
  const blocks = text.replace().split(/(?:\r\n?|\n)/);
  const nodes = [];
  //  console.log(blocks, text, context)
  let content: any[] = [];
  blocks.forEach((line: any, i: number) => {
    if (i !== 0) content.push({ type: "hardBreak" });
    if (line.length > 0) content.push({ type: "text", text: line });
  });

  let node = ProseMirrorNode.fromJSON(context.doc.type.schema, {
    type: "paragraph",
    content,
  });
  nodes.push(node);

  const fragment = Fragment.fromArray(nodes);
  return Slice.maxOpen(fragment);
}

export function transformPastedHTML(str: string): string {
  const transformed = str
    // replace <p class="p2"><br></p> with <br/> since the previous will falsely double new line.
    .replace(/<p[^>]*>\s*<br[^>]*>\s*<\/p>/gi, "<p></p>")
    // replace <p> with <br/> and </p> with empty
    .replace(/<\/p>\s*<p[^>]*>/gi, "<br/>");
  return transformed;
}
