import { useKeyPress } from "./use-key-press";
import { useEffect, FormEvent, useMemo, useState, useCallback } from "react";
import { Editor, useEditor as useTipTapEditor } from "@tiptap/react";
import { EditorConfig, createEditorConfig } from "./create-editor-config";
import {
  Channel,
  isFarcasterCastIdEmbed,
  isFarcasterUrlEmbed,
} from "@mod-protocol/farcaster";
import { UrlMetadata, Embed } from "@mod-protocol/core";
import { ErrorType, MAX_EMBEDS_REACHED_ERROR } from "./errors";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
      }) => ReturnType;
    };
  }
}

export type useEditorParameter = {
  initialText?: string;
  maxEmbeds?: number;
  onError: (errorType: ErrorType) => void;
  fetchUrlMetadata: (url: string) => Promise<UrlMetadata>;
  onSubmit: ({ text }: { text: string }) => Promise<boolean>;
} & Omit<EditorConfig, "onAddLink">;

export type useEditorReturn = {
  getText: () => string;
  setChannel: (c: Channel) => void;
  getChannel: () => Channel;
  addEmbed: (e: Embed) => void;
  getEmbeds: () => Embed[];
  /** embeds set using this method with status: 'loading' won't be automatically loaded **/
  setEmbeds: (embeds: Embed[]) => void;
  setText: (t: string) => void;
  editor: Editor | null;
};

export function useEditor({
  initialText,
  placeholderText,
  fetchUrlMetadata,
  onSubmit,
  onError,
  linkClassName,
  renderMentionsSuggestionConfig,
  maxEmbeds,
}: useEditorParameter): useEditorReturn {
  const [embeds, setEmbeds] = useState<Embed[]>([]);

  const [channel, setChannel] = useState<Channel>({
    name: "Home",
    parent_url: null,
    image: "https://warpcast.com/~/channel-images/home.png",
    channel_id: "home",
  });

  const updateEmbedsWithLoadedData = useCallback(
    (url: string, urlMetadata: object) => {
      setEmbeds((embedsState) =>
        embedsState.map((embed) => {
          if (isFarcasterCastIdEmbed(embed)) return embed;
          if (embed.url === url)
            return {
              status: "loaded",
              url: embed.url,
              metadata: urlMetadata,
            };
          return embed;
        })
      );
    },
    [setEmbeds]
  );

  const addEmbed = useCallback(
    (embed: Embed) => {
      if (maxEmbeds !== undefined && !Number.isNaN(maxEmbeds)) {
        setEmbeds((embedsState) => {
          if (embedsState.length < maxEmbeds) {
            if (isFarcasterUrlEmbed(embed)) {
              // Fetch type (url or image) and OG data async
              fetchUrlMetadata(embed.url)
                .then((urlMetadata: UrlMetadata) => {
                  updateEmbedsWithLoadedData(embed.url, urlMetadata);
                })
                .catch((err) => {
                  onError(err);
                });

              return [...embedsState, { url: embed.url, status: "loading" }];
            } else {
              return [...embedsState, embed];
            }
          } else {
            onError(MAX_EMBEDS_REACHED_ERROR);
            return embedsState;
          }
        });
      }
    },
    [
      setEmbeds,
      maxEmbeds,
      fetchUrlMetadata,
      updateEmbedsWithLoadedData,
      onError,
    ]
  );

  const onAddLink = useCallback(
    (link: {
      from: number;
      to: number;
      type: string;
      value: string;
      isLink: boolean;
      href: string;
      start: number;
      end: number;
    }) => {
      if (
        !embeds.find(
          (embed) => isFarcasterUrlEmbed(embed) && embed.url === link.href
        )
      ) {
        addEmbed({ url: link.href, status: "loading" });
      }
    },
    [embeds, addEmbed]
  );

  const editorConfig = useMemo(
    () =>
      createEditorConfig({
        linkClassName,
        placeholderText,
        onAddLink,
        renderMentionsSuggestionConfig,
      }),
    [linkClassName, placeholderText, renderMentionsSuggestionConfig, onAddLink]
  );
  const editor: Editor | null = useTipTapEditor(editorConfig);
  useEffect(() => {
    if (initialText) editor?.commands.setContent(initialText);
  }, [editor, initialText]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useKeyPress({
    metaKey: true,
    keys: ["Enter"],
    callback: (e: KeyboardEvent) => {
      if (!editor?.isEmpty) handleSubmit(null);
    },
  });

  useEffect(() => {
    // prevent hot reloading bugs
    if (editor && editor.commands && (editor?.view as any)?.pluginViews?.length)
      editor?.commands?.focus();
  }, [editor]);

  async function handleSubmit(e?: FormEvent<HTMLFormElement> | null) {
    e?.preventDefault();
    setIsSubmitting(true);

    editor?.commands.blur();
    const fullText = getText();
    const submission = await onSubmit({ text: fullText });

    // if success
    if (submission) {
      editor?.commands.setContent("");
    }

    setIsSubmitting(false);

    return submission;
  }

  function getText() {
    let base = editor?.getText({ blockSeparator: "\n" }) || "";

    return base;
  }

  function setText(text: string) {
    editor?.commands.setContent(text);
  }

  const getEmbeds = useCallback(() => {
    return embeds;
  }, [embeds]);

  const getChannel = useCallback(() => {
    return channel;
  }, [channel]);

  return {
    getText,
    getEmbeds,
    addEmbed,
    setEmbeds,
    getChannel,
    setChannel,
    setText,
    editor,
  };
}
