"use client";

import {
  ContextType,
  Embed,
  SendEthTransactionActionResolverEvents,
  SendEthTransactionActionResolverInit,
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

export function Embeds(props: { embeds: Array<Embed> }) {
  const experimentalMods = useExperimentalMods();
  const { address } = useAccount();

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

  const context = useMemo<Omit<ContextType, "embed">>(() => {
    return {
      api: process.env.NEXT_PUBLIC_API_URL,
      user: {
        wallet: {
          address,
        },
      },
    };
  }, [address]);

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
          }}
        />
      ))}
    </div>
  );
}
