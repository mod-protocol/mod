"use client";

import { Embed } from "@mod-protocol/core";
import {
  contentMiniApps,
  defaultContentMiniApp,
} from "@mod-protocol/miniapp-registry";
import { RenderEmbed } from "@mod-protocol/react";
import { renderers } from "@mod-protocol/react-ui-shadcn/dist/renderers";
import {
  sendTransaction,
  switchNetwork,
  waitForTransaction,
} from "@wagmi/core";
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
              { onConfirmed, onError, onSubmitted }
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
          }}
        />
      ))}
    </div>
  );
}
