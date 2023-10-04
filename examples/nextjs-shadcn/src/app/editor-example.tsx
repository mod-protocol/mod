"use client";

import * as React from "react";
import { Button } from "@mod-protocol/react-ui-shadcn/src/@/components/ui/button";
import { CreationMiniApp } from "@mod-protocol/react";
import { useEditor, EditorContent } from "@mod-protocol/react-editor";
import { creationMiniApps } from "@mod-protocol/miniapp-registry";
import {
  Manifest,
  AddEmbedActionResolverEventsType,
  AddEmbedActionResolverInitType,
  OpenFileActionResolverEventsType,
  OpenFileActionResolverInitType,
  SetInputActionResolverEventsType,
  SetInputActionResolverInitType,
} from "@mod-protocol/core";
import { createRenderMentionsSuggestionConfig } from "@mod-protocol/react-ui-shadcn/src/@/lib/create-render-mentions-suggestion-config";
import { CreationMiniAppsSearch } from "@mod-protocol/react-ui-shadcn/src/@/components/creation-miniapps-search";
import { CastLengthUIIndicator } from "@mod-protocol/react-ui-shadcn/src/@/components/cast-length-ui-indicator";
import { ChannelPicker } from "@mod-protocol/react-ui-shadcn/src/@/components/channel-picker";
import { FARCASTER_MAX_EMBEDS } from "@mod-protocol/farcaster";
import { EmbedsEditor } from "@mod-protocol/react-ui-shadcn/src/@/lib/embeds";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mod-protocol/react-ui-shadcn/src/@/components/ui/popover";
import { renderers } from "@mod-protocol/react-ui-shadcn/src/renderers";

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error(
    "Please provide the NEXT_PUBLIC_API_URL environment variable"
  );
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function onSubmit() {
  return true;
}

export default function EditorExample() {
  const getMentions = React.useCallback(async (query: string) => {
    const req = await fetch(
      `${API_URL}/farcaster/mentions?q=${encodeURIComponent(query)}`
    );

    const reqJson = await req.json();

    return reqJson.data;
  }, []);

  const fetchUrlMetadata = React.useCallback(async (url: string) => {
    const req = await fetch(
      `${API_URL}/open-graph?url=${encodeURIComponent(url)}`
    );

    const reqJson = await req.json();

    return reqJson;
  }, []);

  const {
    editor,
    getText,
    setText,
    getEmbeds,
    addEmbed,
    setEmbeds,
    setChannel,
    getChannel,
  } = useEditor({
    fetchUrlMetadata: fetchUrlMetadata,
    placeholderText: "Whats on your mind",
    onError: (err) => {
      window.alert(err.message);
    },
    onSubmit: onSubmit,
    maxEmbeds: FARCASTER_MAX_EMBEDS,
    linkClassName: "text-blue-600",
    renderMentionsSuggestionConfig: createRenderMentionsSuggestionConfig({
      getResults: getMentions,
    }),
  });

  const handleSetInput = React.useCallback(
    (
      init: SetInputActionResolverInitType,
      events: SetInputActionResolverEventsType
    ) => {
      setText(init.input);
      events.onSuccess(init.input);
    },
    [setText]
  );

  const handleAddEmbed = React.useCallback(
    (
      init: AddEmbedActionResolverInitType,
      events: AddEmbedActionResolverEventsType
    ) => {
      addEmbed({ url: init.url, status: "loading" });
      events.onSuccess();
    },
    [addEmbed]
  );

  const handleOpenFile = React.useCallback(
    (
      init: OpenFileActionResolverInitType,
      events: OpenFileActionResolverEventsType
    ) => {
      const inputElement = document.createElement("input");

      inputElement.style.display = "none";
      document.body.appendChild(inputElement);

      inputElement.type = "file";
      inputElement.accept = init.accept.join(",");
      inputElement.multiple = init.maxFiles > 1;

      inputElement.addEventListener("change", (arg) => {
        const inputElement = arg.target as HTMLInputElement;
        const files = inputElement.files ? Array.from(inputElement.files) : [];

        events.onSuccess(
          files.map((file) => ({
            name: file.name,
            mimeType: file.type,
            blob: file,
          }))
        );

        document.body.removeChild(inputElement);
      });

      inputElement.dispatchEvent(new MouseEvent("click"));
    },
    []
  );

  const [currentMiniapp, setCurrentMiniapp] = React.useState<Manifest | null>(
    null
  );

  const handleMiniappExit = React.useCallback(
    () => setCurrentMiniapp(null),
    []
  );

  const getChannels = React.useCallback(async (query) => {
    const results = await fetch(
      `${API_URL}/farcaster/channels?q=${encodeURIComponent(query)}`
    );

    const body = await results.json();

    return body.channels;
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <div className="p-2 border-slate-200 rounded-md border">
        <EditorContent
          editor={editor}
          autoFocus
          style={{ width: "100%", height: "100%", minHeight: "200px" }}
        />
        <EmbedsEditor embeds={getEmbeds()} setEmbeds={setEmbeds} />
      </div>
      <div className="flex flex-row pt-2 gap-1">
        <ChannelPicker
          getChannels={getChannels}
          onSelect={setChannel}
          value={getChannel()}
        />
        <Popover
          open={!!currentMiniapp}
          onOpenChange={(op) => (!op ? setCurrentMiniapp(null) : undefined)}
        >
          <PopoverTrigger></PopoverTrigger>
          <CreationMiniAppsSearch
            miniapps={creationMiniApps}
            onSelect={setCurrentMiniapp}
          />
          <PopoverContent className="w-[400px] ml-2" align="start">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">
                {currentMiniapp?.name}
              </h4>
              <hr />
              <CreationMiniApp
                input={getText()}
                embeds={getEmbeds()}
                api={API_URL}
                variant="creation"
                manifest={currentMiniapp}
                renderers={renderers}
                onOpenFileAction={handleOpenFile}
                onExitAction={handleMiniappExit}
                onSetInputAction={handleSetInput}
                onAddEmbedAction={handleAddEmbed}
              />
            </div>
          </PopoverContent>
        </Popover>

        <CastLengthUIIndicator getText={getText} />
        <div className="grow"></div>
        <Button
          type="submit"
          onClick={() =>
            window.alert(
              `This is a demo, and doesn't do anything.\n\nCast text:\n${getText()}\nEmbeds:\n${getEmbeds()
                .map((embed) => (embed as any).url)
                .join(", ")}`
            )
          }
        >
          Cast
        </Button>
      </div>
    </form>
  );
}
