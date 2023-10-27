import { useKeyPress } from "./use-key-press";
import { useEffect, FormEvent, useMemo, useState, useCallback } from "react";
import { Editor, useEditor as useTipTapEditor } from "@tiptap/react";
import { EditorConfig, createEditorConfig } from "./create-editor-config";
import { Link } from "@mod-protocol/tiptap-extension-link";
import {
  Channel,
  FARCASTER_MAX_EMBEDS,
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
  placeholderText?: string;
  initialText?: string;
  maxEmbeds?: number;
  onError: (errorType: ErrorType) => void;
  fetchUrlMetadata: (url: string) => Promise<UrlMetadata>;
  onSubmit: ({
    text,
    embeds,
    channel,
  }: {
    text: string;
    embeds: Embed[];
    channel: Channel;
  }) => Promise<boolean>;
} & Omit<EditorConfig, "onAddLink" | "placeholderText">;

export type useEditorReturn = {
  getText: () => string;
  handleSubmit: (e?: FormEvent<HTMLFormElement> | null) => Promise<boolean>;
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
  placeholderText = "What's on your mind?",
  fetchUrlMetadata,
  onSubmit,
  onError,
  linkClassName,
  renderMentionsSuggestionConfig,
  maxEmbeds = FARCASTER_MAX_EMBEDS,
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
    (newEmbed: Embed) => {
      if (maxEmbeds !== undefined && !Number.isNaN(maxEmbeds)) {
        setEmbeds((embedsState) => {
          // Max embeds reached
          if (embedsState.length >= maxEmbeds) {
            onError(MAX_EMBEDS_REACHED_ERROR);
            return embedsState;
          }

          // Embed not loaded yet
          if (isFarcasterUrlEmbed(newEmbed) && newEmbed.status !== "loaded") {
            // Fetch type (url or image) and OG data async

            fetchUrlMetadata(newEmbed.url)
              .then((urlMetadata: UrlMetadata) => {
                updateEmbedsWithLoadedData(newEmbed.url, urlMetadata);
              })
              .catch((err) => {
                onError(err);
              });

            return [
              ...embedsState,
              {
                url: newEmbed.url,
                metadata: newEmbed.metadata,
                status: "loading",
              },
            ];
          }

          // Embed already loaded
          if (
            !embedsState.find((embed) => {
              return (
                isFarcasterUrlEmbed(embed) &&
                isFarcasterUrlEmbed(newEmbed) &&
                embed.url === newEmbed.url
              );
            }) // Deduplication
          ) {
            return [...embedsState, newEmbed];
          } else {
            return embedsState;
          }
        });
      }
    },
    [
      setEmbeds,
      maxEmbeds,
      onError,
      fetchUrlMetadata,
      updateEmbedsWithLoadedData,
    ]
  );

  const onAddLink = useCallback(
    (link: Link) => {
      fetchUrlMetadata(link.href)
        .then((urlMetadata: UrlMetadata) => {
          addEmbed({
            url: link.href,
            metadata: urlMetadata,
            status: "loaded",
          });
        })
        .catch((err) => {
          onError(err);
        });
    },
    // Editor config isn't reactive
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
    const submission = await onSubmit({
      text: fullText,
      embeds: embeds,
      channel,
    });

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
    handleSubmit,
    getEmbeds,
    addEmbed,
    setEmbeds,
    getChannel,
    setChannel,
    setText,
    editor,
  };
}
