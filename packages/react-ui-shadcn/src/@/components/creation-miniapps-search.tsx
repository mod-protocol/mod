"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Manifest } from "@mod-protocol/core";
import Image from "next/image";

type Props = {
  miniapps: Manifest[];
  onSelect: (value: Manifest) => void;
};

export function CreationMiniAppsSearch(props: Props) {
  const { miniapps, onSelect } = props;

  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (id: string) => {
      const miniapp = miniapps.find((m) => m.slug === id);
      if (miniapp) {
        setOpen(false);
        onSelect(miniapp);
      }
    },
    [onSelect, miniapps]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}>
          +
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search Mini-apps..." />
          <CommandEmpty>No Mini-app found.</CommandEmpty>
          <CommandGroup>
            {miniapps.map((miniApp) => (
              <CommandItem
                key={miniApp.slug}
                value={miniApp.slug}
                className="cursor-pointer"
                onSelect={handleSelect}
              >
                <Image
                  height={24}
                  width={24}
                  alt={miniApp.name}
                  src={miniApp.logo}
                />
                <span className="ml-2">{miniApp.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
