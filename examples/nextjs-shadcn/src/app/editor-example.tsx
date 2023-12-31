"use client";

import * as React from "react";
import { getAddress } from "viem";

// Core
import {
  Channel,
  formatPlaintextToHubCastMessage,
  getFarcasterChannels,
  getFarcasterMentions,
  getMentionFidsByUsernames,
} from "@mod-protocol/farcaster";
import { CreationMod, RichEmbed } from "@mod-protocol/react";
import { useEditor, EditorContent } from "@mod-protocol/react-editor";
import {
  creationMods,
  defaultRichEmbedMod,
  creationModsExperimental,
} from "@mod-protocol/mod-registry";
import {
  Embed,
  EthPersonalSignActionResolverInit,
  ModManifest,
  fetchUrlMetadata,
  handleAddEmbed,
  handleOpenFile,
  handleSetInput,
} from "@mod-protocol/core";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";

// UI implementation
import { createRenderMentionsSuggestionConfig } from "@mod-protocol/react-ui-shadcn/dist/lib/mentions";
import { ModsSearch } from "@mod-protocol/react-ui-shadcn/dist/components/creation-mods-search";
import { CastLengthUIIndicator } from "@mod-protocol/react-ui-shadcn/dist/components/cast-length-ui-indicator";
import { ChannelPicker } from "@mod-protocol/react-ui-shadcn/dist/components/channel-picker";
import { EmbedsEditor } from "@mod-protocol/react-ui-shadcn/dist/lib/embeds";
import { MentionList } from "@mod-protocol/react-ui-shadcn/dist/components/mention-list";
import { ChannelList } from "@mod-protocol/react-ui-shadcn/dist/components/channel-list";

import { Button } from "@mod-protocol/react-ui-shadcn/dist/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mod-protocol/react-ui-shadcn/dist/components/ui/popover";
import { renderers } from "@mod-protocol/react-ui-shadcn/dist/renderers";
import { useExperimentalMods } from "./use-experimental-mods";

// Optionally replace with your API_URL here
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.modprotocol.org/api";

const getMentions = getFarcasterMentions(API_URL);
const getChannels = getFarcasterChannels(API_URL);
const getMentionFids = getMentionFidsByUsernames(API_URL);
const getUrlMetadata = fetchUrlMetadata(API_URL);
const onError = (err) => console.error(err.message);
const onSubmit = async ({
  text,
  embeds,
  channel,
}: {
  text: string;
  embeds: Embed[];
  channel: Channel;
}) => {
  const formattedCast = await formatPlaintextToHubCastMessage({
    text,
    embeds,
    parentUrl: channel.parent_url,
    getMentionFidsByUsernames: getMentionFids,
  });
  window.alert(
    `This is a demo, and doesn't do anything.\n\nCast text:\n${text}\nEmbeds:\n${embeds
      .map((embed) => (embed as any).url)
      .join(", ")}\nChannel:\n${channel.name}`
  );

  console.log(formattedCast);

  // submit the cast to a hub

  return true;
};

export default function EditorExample() {
  const experimentalMods = useExperimentalMods();
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
    renderChannelsSuggestionConfig: createRenderMentionsSuggestionConfig({
      getResults: (query) => getChannels(query, true),
      RenderList: ChannelList,
    }),
    renderMentionsSuggestionConfig: createRenderMentionsSuggestionConfig({
      getResults: getMentions,
      RenderList: MentionList,
    }),
  });

  const { address: unchecksummedAddress } = useAccount();
  const checksummedAddress = React.useMemo(() => {
    if (!unchecksummedAddress) return null;
    return getAddress(unchecksummedAddress);
  }, [unchecksummedAddress]);

  const { signMessageAsync } = useSignMessage();

  const getAuthSig = React.useCallback(
    async (
      {
        data: { statement, version, chainId },
      }: EthPersonalSignActionResolverInit,
      { onSuccess, onError }
    ): Promise<void> => {
      if (!checksummedAddress) {
        window.alert("please connect your wallet");
        return;
      }
      try {
        const siweMessage = new SiweMessage({
          domain: process.env.NEXT_PUBLIC_HOST,
          address: checksummedAddress,
          statement,
          uri: process.env.NEXT_PUBLIC_URL,
          version,
          chainId: Number(chainId),
        });
        const messageToSign = siweMessage.prepareMessage();

        // Sign the message and format the authSig
        const signature = await signMessageAsync({ message: messageToSign });
        const authSig = {
          signature,
          // derivedVia: "web3.eth.personal.sign",
          signedMessage: messageToSign,
          address: checksummedAddress,
        };

        onSuccess(authSig);
      } catch (err) {
        console.error(err);
        onError(err);
      }
    },
    [signMessageAsync, checksummedAddress]
  );

  const [currentMod, setCurrentMod] = React.useState<ModManifest | null>(null);

  const user = React.useMemo(() => {
    return {
      wallet: {
        address: checksummedAddress,
      },
    };
  }, [checksummedAddress]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-2 border border-input rounded-md">
        <EditorContent
          editor={editor}
          autoFocus
          className="w-full h-full min-h-[200px]"
        />
        <EmbedsEditor
          embeds={getEmbeds()}
          setEmbeds={setEmbeds}
          RichEmbed={({ embed }) => (
            <RichEmbed
              api={API_URL}
              defaultRichEmbedMod={defaultRichEmbedMod}
              mods={[defaultRichEmbedMod]}
              embed={embed}
              renderers={renderers}
            />
          )}
        />
      </div>
      <div className="flex flex-row pt-2 gap-1">
        <ChannelPicker
          getChannels={getChannels}
          onSelect={setChannel}
          value={getChannel()}
        />
        <Popover
          open={!!currentMod}
          onOpenChange={(op: boolean) => {
            if (!op) setCurrentMod(null);
          }}
        >
          <PopoverTrigger></PopoverTrigger>
          <ModsSearch
            mods={experimentalMods ? creationModsExperimental : creationMods}
            onSelect={setCurrentMod}
          />
          <PopoverContent className="w-[400px] ml-2" align="start">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">{currentMod?.name}</h4>
              <hr />
              <CreationMod
                input={getText()}
                embeds={getEmbeds()}
                api={API_URL}
                user={user}
                variant="creation"
                manifest={currentMod}
                renderers={renderers}
                onOpenFileAction={handleOpenFile}
                onExitAction={() => setCurrentMod(null)}
                onSetInputAction={handleSetInput(setText)}
                onAddEmbedAction={handleAddEmbed(addEmbed)}
                onEthPersonalSignAction={getAuthSig}
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
