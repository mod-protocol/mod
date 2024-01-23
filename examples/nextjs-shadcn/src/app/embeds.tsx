"use client";

import {
  Embed,
  RichEmbedContext,
  SendEthTransactionActionResolverEvents,
  SendEthTransactionActionResolverInit,
} from "@mod-protocol/core";
import {
  defaultRichEmbedMod,
  richEmbedMods,
  richEmbedModsExperimental,
} from "@mod-protocol/mod-registry";
import { RichEmbed } from "@mod-protocol/react";
import "@mod-protocol/react-ui-shadcn/dist/public/video-js.css";
import { renderers } from "@mod-protocol/react-ui-shadcn/dist/renderers";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { API_URL } from "./constants";
import { useExperimentalMods } from "./use-experimental-mods";
import { sendEthTransaction } from "./utils";

export function Embeds(props: { embeds: Array<Embed> }) {
  const experimentalMods = useExperimentalMods();
  const { address } = useAccount();

  const onSendEthTransactionAction = useMemo(() => sendEthTransaction, []);

  const context = useMemo<Omit<RichEmbedContext, "embed">>(() => {
    return {
      api: API_URL,
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
