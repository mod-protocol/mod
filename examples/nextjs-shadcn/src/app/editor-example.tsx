"use client";

import * as React from "react";

// Core
import {
  Channel,
  getFarcasterChannels,
  getFarcasterMentions,
} from "@mod-protocol/farcaster";
import { CreationMiniApp } from "@mod-protocol/react";
import { useEditor, EditorContent } from "@mod-protocol/react-editor";
import { creationMiniApps } from "@mod-protocol/miniapp-registry";
import {
  Embed,
  ModManifest,
  fetchUrlMetadata,
  handleAddEmbed,
  handleOpenFile,
  handleSetInput,
} from "@mod-protocol/core";

// UI implementation
import { createRenderMentionsSuggestionConfig } from "@mod-protocol/react-ui-shadcn/src/@/lib/create-render-mentions-suggestion-config";
import { CreationMiniAppsSearch } from "@mod-protocol/react-ui-shadcn/src/@/components/creation-miniapps-search";
import { CastLengthUIIndicator } from "@mod-protocol/react-ui-shadcn/src/@/components/cast-length-ui-indicator";
import { ChannelPicker } from "@mod-protocol/react-ui-shadcn/src/@/components/channel-picker";
import { EmbedsEditor } from "@mod-protocol/react-ui-shadcn/src/@/lib/embeds";
import { Button } from "@mod-protocol/react-ui-shadcn/src/@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mod-protocol/react-ui-shadcn/src/@/components/ui/popover";
import { renderers } from "@mod-protocol/react-ui-shadcn/src/renderers";

// Optionally replace with your API_URL here
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.modprotocol.org";

const getResults = getFarcasterMentions(API_URL);
const getChannels = getFarcasterChannels(API_URL);
const getUrlMetadata = fetchUrlMetadata(API_URL);
const onError = (err) => window.alert(err.message);
const onSubmit = async ({
  text,
  embeds,
  channel,
}: {
  text: string;
  embeds: Embed[];
  channel: Channel;
}) => {
  window.alert(
    `This is a demo, and doesn't do anything.\n\nCast text:\n${text}\nEmbeds:\n${embeds
      .map((embed) => (embed as any).url)
      .join(", ")}\nChannel:\n${channel.name}`
  );

  return true;
};

export default function EditorExample() {
  const {
    editor,
    getText,
    getEmbeds,
    setEmbeds,
    setText,
    setChannel,
    getChannel,
    addEmbed,
    handleSubmit,
  } = useEditor({
    fetchUrlMetadata: getUrlMetadata,
    onError,
    onSubmit,
    linkClassName: "text-blue-600",
    renderMentionsSuggestionConfig: createRenderMentionsSuggestionConfig({
      getResults: getResults,
    }),
  });

  const [currentMiniapp, setCurrentMiniapp] =
    React.useState<ModManifest | null>(null);

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-2 border-slate-200 rounded-md border">
        <EditorContent
          editor={editor}
          autoFocus
          className="w-full h-full min-h-[200px]"
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
          onOpenChange={(op: boolean) => {
            if (!op) setCurrentMiniapp(null);
          }}
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
                onExitAction={() => setCurrentMiniapp(null)}
                onSetInputAction={handleSetInput(setText)}
                onAddEmbedAction={handleAddEmbed(addEmbed)}
              />
            </div>
          </PopoverContent>
        </Popover>
        <CastLengthUIIndicator getText={getText} />
        <div className="grow"></div>
        <Button type="submit">Cast</Button>
      </div>
    </form>
  );
}
