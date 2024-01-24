import { Embed, ModManifest, handleOpenFile } from "@mod-protocol/core";
import { actionMods, actionModsExperimental } from "@mod-protocol/mod-registry";
import { ActionMod } from "@mod-protocol/react";
import { ModsSearch } from "@mod-protocol/react-ui-shadcn/dist/components/creation-mods-search";
import { Button } from "@mod-protocol/react-ui-shadcn/dist/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mod-protocol/react-ui-shadcn/dist/components/ui/popover";
import { renderers } from "@mod-protocol/react-ui-shadcn/dist/renderers";
import { KebabHorizontalIcon } from "@primer/octicons-react";
import React, { useMemo } from "react";
import { getAddress } from "viem";
import { useAccount } from "wagmi";
import { API_URL } from "./constants";
import { useExperimentalMods } from "./use-experimental-mods";
import { sendEthTransaction } from "./utils";

export function Actions({
  author,
  post,
}: {
  author: {
    farcaster: {
      fid: string;
    };
  };
  post: {
    id: string;
    text: string;
    embeds: Embed[];
  };
}) {
  const experimentalMods = useExperimentalMods();
  const [currentMod, setCurrentMod] = React.useState<ModManifest | null>(null);

  const { address: unchecksummedAddress } = useAccount();
  const checksummedAddress = React.useMemo(() => {
    if (!unchecksummedAddress) return null;
    return getAddress(unchecksummedAddress);
  }, [unchecksummedAddress]);
  const user = React.useMemo(() => {
    return {
      wallet: {
        address: checksummedAddress,
      },
    };
  }, [checksummedAddress]);

  const onSendEthTransactionAction = useMemo(() => sendEthTransaction, []);

  return (
    <Popover
      open={!!currentMod}
      onOpenChange={(op: boolean) => {
        if (!op) setCurrentMod(null);
      }}
    >
      <PopoverTrigger></PopoverTrigger>
      <ModsSearch
        mods={experimentalMods ? actionModsExperimental : actionMods}
        onSelect={setCurrentMod}
      >
        <Button variant="ghost" role="combobox" type="button">
          <KebabHorizontalIcon></KebabHorizontalIcon>
        </Button>
      </ModsSearch>
      <PopoverContent className="w-[400px] ml-2" align="start">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">{currentMod?.name}</h4>
          <hr />
          <ActionMod
            api={API_URL}
            user={user}
            variant="action"
            manifest={currentMod}
            renderers={renderers}
            onOpenFileAction={handleOpenFile}
            onExitAction={() => setCurrentMod(null)}
            onSendEthTransactionAction={onSendEthTransactionAction}
            author={author}
            post={post}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
