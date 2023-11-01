import tippy from "tippy.js";
import { ReactRenderer } from "@tiptap/react";
import { MentionList } from "components/mention-list";
import { FarcasterMention } from "@mod-protocol/farcaster";

type MentionListRef = {
  onKeyDown: (props: { event: Event }) => boolean;
};

export const createRenderMentionsSuggestionConfig = ({
  getResults,
}: {
  getResults: (query: string) => Promise<Array<FarcasterMention | null>>;
}) => ({
  suggestion: {
    items: async ({
      query,
    }: {
      query: string;
    }): Promise<Array<FarcasterMention | null>> => {
      const data = await getResults(query);

      if (!data?.length) {
        // Hacky, but results UI library needs an item to render
        return [null];
      }

      return data as any;
    },

    render: () => {
      let reactRenderer: ReactRenderer<MentionListRef>;
      let popup: any;

      return {
        onStart: (props: any) => {
          reactRenderer = new ReactRenderer(MentionList, {
            props: props,
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: reactRenderer.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },

        onUpdate(props: any) {
          reactRenderer?.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any) {
          if (props.event.key === "Escape") {
            popup[0].hide();

            return true;
          }

          return reactRenderer?.ref?.onKeyDown(props) || false;
        },

        onExit() {
          popup?.[0]?.destroy();
          reactRenderer?.destroy();
        },
      };
    },
  },
});
