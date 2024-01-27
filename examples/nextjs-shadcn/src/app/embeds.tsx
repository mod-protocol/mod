"use client";

import {
  ContextType,
  Embed,
  SendEthTransactionActionResolverEvents,
  SendEthTransactionActionResolverInit,
  SendFcFrameActionResolverEvents,
  SendFcFrameActionResolverInit,
} from "@mod-protocol/core";
import {
  richEmbedMods,
  defaultRichEmbedMod,
  richEmbedModsExperimental,
} from "@mod-protocol/mod-registry";
import { RichEmbed } from "@mod-protocol/react";
import { renderers } from "@mod-protocol/react-ui-shadcn/dist/renderers";
import {
  sendTransaction,
  switchNetwork,
  waitForTransaction,
} from "@wagmi/core";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { useExperimentalMods } from "./use-experimental-mods";
import "@mod-protocol/react-ui-shadcn/dist/public/video-js.css";
import {
  FarcasterNetwork,
  FrameActionData,
  MessageType,
  getFarcasterTime,
} from "@farcaster/core";
import { makeMessage } from "./make-message";

export function Embeds(props: {
  embeds: Array<Embed>;
  castHash: string;
  castFid: number;
}) {
  const experimentalMods = useExperimentalMods();
  const { address } = useAccount();
  // todo: Add Warpcast connect to example?
  const fid = 1214;

  const context = useMemo<Omit<ContextType, "embed">>(() => {
    return {
      api: process.env.NEXT_PUBLIC_API_URL,
      user: {
        id: fid,
        wallet: {
          address,
        },
      },
    };
  }, [address]);

  const onSendFcFrameAction = useMemo(() => {
    async function onSendFcFrameActionRes(
      { url, action }: SendFcFrameActionResolverInit,
      { onError, onSuccess }: SendFcFrameActionResolverEvents
    ) {
      const messageJSON: FrameActionData = {
        type: MessageType.FRAME_ACTION,
        fid: fid,
        timestamp: getFarcasterTime()._unsafeUnwrap(),
        network: FarcasterNetwork.MAINNET,
        frameActionBody: {
          url: Buffer.from(url),
          buttonIndex: Number(action) - 1,
          castId: {
            fid: props.castFid,
            hash: Buffer.from(props.castHash),
          },
        },
      };

      const message = await makeMessage(messageJSON);

      fetch(`${url}`, {
        method: "POST",
        body: JSON.stringify({
          untrustedData: {
            fid: fid,
            url: url,
            messageHash: Buffer.from(message.hash).toString("hex"),
            timestamp: message.data.timestamp,
            network: 1,
            buttonIndex: Number(action) - 1,
            castId: {
              fid: props.castFid,
              hash: props.castHash,
            },
          },
          trustedData: {
            messageBytes: Buffer.from(message.dataBytes).toString("hex"),
          },
        } as {
          untrustedData: {
            fid: number;
            url: string;
            messageHash: string;
            timestamp: number;
            network: number;
            buttonIndex: number;
            castId: { fid: number; hash: string };
          };
          trustedData: {
            messageBytes: string;
          };
        }),
      })
        .then((res) => res.text())
        .then((res) => {
          // parse OG from htmlString
          const doc = new DOMParser().parseFromString(res, "text/html");
          const nextFrame = {
            "fc:frame": doc
              .querySelector('meta[property="fc:frame"]')
              ?.getAttribute("content"),
            "fc:frame:image": doc
              .querySelector('meta[property="fc:frame:image"]')
              ?.getAttribute("content"),
            "fc:frame:post_url": doc
              .querySelector('meta[property="fc:frame:post_url"]')
              ?.getAttribute("content"),
            "fc:frame:button:1": doc
              .querySelector('meta[property="fc:frame:button:1"]')
              ?.getAttribute("content"),
            "fc:frame:button:2": doc
              .querySelector('meta[property="fc:frame:button:2"]')
              ?.getAttribute("content"),
            "fc:frame:button:3": doc
              .querySelector('meta[property="fc:frame:button:3"]')
              ?.getAttribute("content"),
            "fc:frame:button:4": doc
              .querySelector('meta[property="fc:frame:button:4"]')
              ?.getAttribute("content"),
          };

          return onSuccess(nextFrame, res);
        })
        .catch(({ message }) => {
          return onError({ message });
        });
    }

    return onSendFcFrameActionRes;
  }, [fid]);

  const onSendEthTransactionAction = useMemo(
    () =>
      async (
        { data, chainId }: SendEthTransactionActionResolverInit,
        {
          onConfirmed,
          onError,
          onSubmitted,
        }: SendEthTransactionActionResolverEvents
      ) => {
        try {
          const parsedChainId = parseInt(chainId);

          // Switch chains if the user is not on the right one
          await switchNetwork({ chainId: parsedChainId });

          // Send the transaction
          const { hash } = await sendTransaction({
            ...data,
            chainId: parsedChainId,
          });
          onSubmitted(hash);

          // Wait for the transaction to be confirmed
          const { status } = await waitForTransaction({
            hash,
            chainId: parsedChainId,
          });

          onConfirmed(hash, status === "success");
        } catch (e) {
          onError(e);
        }
      },
    []
  );

  return (
    <div>
      {props.embeds.map((embed, i) => (
        <RichEmbed
          embed={embed}
          {...context}
          key={i}
          renderers={renderers}
          defaultRichEmbedMod={defaultRichEmbedMod}
          mods={experimentalMods ? richEmbedModsExperimental : richEmbedMods}
          resolvers={{
            onSendEthTransactionAction,
            onSendFcFrameAction,
          }}
        />
      ))}
    </div>
  );
}
