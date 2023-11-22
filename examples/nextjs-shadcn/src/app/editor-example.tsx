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
import { CreationMiniApp } from "@mod-protocol/react";
import { useEditor, EditorContent } from "@mod-protocol/react-editor";
import { creationMiniApps } from "@mod-protocol/miniapp-registry";
import {
  Embed,
  EthPersonalSignActionResolverEvents,
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
import { CreationMiniAppsSearch } from "@mod-protocol/react-ui-shadcn/dist/components/creation-miniapps-search";
import { CastLengthUIIndicator } from "@mod-protocol/react-ui-shadcn/dist/components/cast-length-ui-indicator";
import { ChannelPicker } from "@mod-protocol/react-ui-shadcn/dist/components/channel-picker";
import { EmbedsEditor } from "@mod-protocol/react-ui-shadcn/dist/lib/embeds";
import { Button } from "@mod-protocol/react-ui-shadcn/dist/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mod-protocol/react-ui-shadcn/dist/components/ui/popover";
import { renderers } from "@mod-protocol/react-ui-shadcn/dist/renderers";

// Optionally replace with your API_URL here
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.modprotocol.org";

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
      getResults: getMentions,
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
        data: { domain, address, statement, uri, version, chainId },
      }: EthPersonalSignActionResolverInit,
      { onSuccess, onError }
    ): Promise<void> => {
      try {
        const siweMessage = new SiweMessage({
          domain,
          address: address,
          statement,
          uri,
          version,
          chainId: Number(chainId),
          // nonce: "22342342342342342334",
        });
        const messageToSign = siweMessage.prepareMessage();

        // Sign the message and format the authSig
        const signature = await signMessageAsync({ message: messageToSign });
        const authSig = {
          signature,
          // derivedVia: "web3.eth.personal.sign",
          signedMessage: messageToSign,
          address: address,
        };

        onSuccess(authSig);
      } catch (err) {
        onError(err);
      }
    },
    [signMessageAsync]
  );

  const [currentMiniapp, setCurrentMiniapp] =
    React.useState<ModManifest | null>(null);

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
                user={user}
                variant="creation"
                manifest={currentMiniapp}
                renderers={renderers}
                onOpenFileAction={handleOpenFile}
                onExitAction={() => setCurrentMiniapp(null)}
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
