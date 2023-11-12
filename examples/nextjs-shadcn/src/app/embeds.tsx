"use client";

import { Embed } from "@mod-protocol/core";
import {
  contentMiniApps,
  defaultContentMiniApp,
} from "@mod-protocol/miniapp-registry";
import { RenderEmbed } from "@mod-protocol/react";
import { renderers } from "@mod-protocol/react-ui-shadcn/dist/renderers";
import { sendTransaction, switchNetwork } from "@wagmi/core";
import { useAccount } from "wagmi";

export function Embeds(props: { embeds: Array<Embed> }) {
  const { address } = useAccount();

  return (
    <div>
      {props.embeds.map((embed, i) => (
        <RenderEmbed
          api={process.env.NEXT_PUBLIC_API_URL}
          embed={embed}
          key={i}
          renderers={renderers}
          defaultContentMiniApp={defaultContentMiniApp}
          contentMiniApps={contentMiniApps}
          user={{
            wallet: {
              address,
            },
          }}
          resolvers={{
            onSendEthTransactionAction: async (
              { data, chainId },
              { onSuccess, onError }
            ) => {
              try {
                await switchNetwork({ chainId: parseInt(chainId) });

                const { hash } = await sendTransaction({
                  ...data,
                  chainId: parseInt(chainId),
                });
                onSuccess(hash);
              } catch (e) {
                onError(e);
              }
            },
          }}
        />
      ))}
    </div>
  );
}
