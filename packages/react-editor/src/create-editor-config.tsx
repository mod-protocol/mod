import TipTapDocument from "@tiptap/extension-document";
import TipTapHardBreak from "@tiptap/extension-hard-break";
import TipTapText from "@tiptap/extension-text";
import TipTapParagraph from "@tiptap/extension-paragraph";
import TipTapLink, { Link } from "@mod-protocol/tiptap-extension-link";
import TipTapPlaceholder from "@tiptap/extension-placeholder";
import TipTapHistory from "@tiptap/extension-history";
import TipTapMention, { MentionOptions } from "@tiptap/extension-mention";
import {
  clipboardTextParser,
  transformPastedHTML,
} from "./extension-clipboard";
import { EditorOptions } from "@tiptap/core";

export type EditorConfig = {
  placeholderText: string;
  onAddLink: (link: Link) => void;
  renderMentionsSuggestionConfig: Pick<MentionOptions, "suggestion">;
  linkClassName: string;
  editorOptions?: Partial<EditorOptions>;
};

export function createEditorConfig({
  placeholderText,
  renderMentionsSuggestionConfig,
  linkClassName,
  onAddLink,
  editorOptions = {},
}: EditorConfig): Partial<EditorOptions> {
  return {
    editorProps: {
      attributes: {
        // min-height allows clicking in the box and creating focus on the input
        style: "outline: 0;  min-height: 200px;",
      },
      // attributes: {
      //   class: styles.castEditorForm,
      // },
      // Prevents weird paste new line inconsistencies when coming from grammarly, vscode, ... (HTML)
      transformPastedHTML: transformPastedHTML,
      // Prevents weird paste new line inconsistencies when coming from textedit, plaintext, ...
      clipboardTextParser: clipboardTextParser,
      ...editorOptions.editorProps,
    },
    extensions: [
      // you can find pro extensions at https://embed-pro.tiptap.dev/preview/Nodes/Emoji?inline=false&hideSource=true

      // Required plugins
      TipTapDocument,
      TipTapText,
      TipTapParagraph,
      TipTapPlaceholder.configure({
        placeholder: placeholderText,
        // https://github.com/ueberdosis/tiptap/issues/2659#issuecomment-1230954941
        emptyEditorClass:
          "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-foreground-secondary before:opacity-50 before-pointer-events-none",
      }),

      // TipTapCustomImagePlugin,
      // Used to prevent new <p> which causes double line breaks where we want just one.
      TipTapHardBreak.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.setHardBreak(),
            "Mod-Enter": () => {
              // bubble up to the useKeypress
              return true;
            },
          };
        },
      }),
      TipTapHistory,
      TipTapLink.extend({ inclusive: false }).configure({
        autolink: true,
        onAddLink: onAddLink,
        openOnClick: false,
        HTMLAttributes: {
          class: linkClassName,
          style: "cursor: text;",
        },
      }),
      /**
       * Known issues:
       * - paste doesn't automatically highlight
       * - not selecting a user doesnt automatically highlight
       *
       */
      // EmojiMention.configure({
      //   suggestion: emojiSuggestion,
      // }),
      TipTapMention.configure({
        HTMLAttributes: {
          class: linkClassName,
        },
        ...renderMentionsSuggestionConfig,
      }),
    ],
    content: ``,
  };
}
