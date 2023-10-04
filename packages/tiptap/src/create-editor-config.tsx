import TipTapDocument from "@tiptap/extension-document";
import TipTapHardBreak from "@tiptap/extension-hard-break";
import TipTapText from "@tiptap/extension-text";
import TipTapParagraph from "@tiptap/extension-paragraph";
import TipTapLink from "@packages/tiptap-extension-link";
import TipTapPlaceholder from "@tiptap/extension-placeholder";
import TipTapHistory from "@tiptap/extension-history";
import TipTapMention, { MentionOptions } from "@tiptap/extension-mention";
import {
  clipboardTextParser,
  transformPastedHTML,
} from "./extension-clipboard";

export type EditorConfig = {
  placeholderText: string;

  onAddLink: (link: {
    from: number;
    to: number;
    type: string;
    value: string;
    isLink: boolean;
    href: string;
    start: number;
    end: number;
  }) => void;
  renderMentionsSuggestionConfig: Pick<MentionOptions, "suggestion">;
  linkClassName: string;
};

export function createEditorConfig({
  placeholderText,
  renderMentionsSuggestionConfig,
  linkClassName,
  onAddLink,
}: EditorConfig) {
  return {
    editorProps: {
      attributes: {
        // min-height allows clicking in the box and creating focus on the input
        // FIXME: configurable/options
        style: "outline: 0;  min-height: 200px;",
      },
      // attributes: {
      //   class: styles.castEditorForm,
      // },
      // Prevents weird paste new line inconsistencies when coming from grammarly, vscode, ... (HTML)
      transformPastedHTML: transformPastedHTML,
      // Prevents weird paste new line inconsistencies when coming from textedit, plaintext, ...
      clipboardTextParser: clipboardTextParser,
    },
    extensions: [
      // you can find pro extensions at https://embed-pro.tiptap.dev/preview/Nodes/Emoji?inline=false&hideSource=true

      // Required plugins
      TipTapDocument,
      TipTapText,
      TipTapParagraph,
      TipTapPlaceholder.configure({
        placeholder: placeholderText,
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
