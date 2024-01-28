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
import { useFarcasterIdentity } from "./use-farcaster-connect";

export function Embeds(props: {
  embeds: Array<Embed>;
  castHash: string;
  castFid: number;
}) {
  const experimentalMods = useExperimentalMods();
  const { farcasterUser } = useFarcasterIdentity();
  const { address } = useAccount();
  const fid = farcasterUser?.fid;

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
  }, [address, fid]);

  const onSendFcFrameAction = useMemo(() => {
    async function onSendFcFrameActionRes(
      { url, post_url, action }: SendFcFrameActionResolverInit,
      { onError, onSuccess }: SendFcFrameActionResolverEvents
    ) {
      try {
        const options = {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            cast_hash: props.castHash,
            signer_uuid: farcasterUser.signer_uuid,
            action: {
              button: { title: "abc", index: Number(action) },
              frames_url: url,
              post_url: post_url,
            },
          }),
        };

        const res = await fetch("/post-message/frame-action", options);
        const resJson = await res.json();

        onSuccess(resJson);
      } catch (err) {
        onError(err);
      }
    }

    return onSendFcFrameActionRes;
  }, [fid, farcasterUser?.signer_uuid, props.castHash]);

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
