"use client";

import * as React from "react";
import { Button } from "components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { ModManifest } from "@mod-protocol/core";

type Props = {
  mods: ModManifest[];
  onSelect: (value: ModManifest) => void;
};

export function ModsSearch(props: Props) {
  const { mods, onSelect } = props;

  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (id: string) => {
      const mod = mods.find((m) => m.slug === id);
      if (mod) {
        setOpen(false);
        onSelect(mod);
      }
    },
    [onSelect, mods]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          type="button"
        >
          +
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search Mods..." />
          <CommandEmpty>No Mod found.</CommandEmpty>
          <CommandGroup>
            {mods.map((mod) => (
              <CommandItem
                key={mod.slug}
                value={mod.slug}
                className="cursor-pointer"
                onSelect={handleSelect}
              >
                <div className="bg-white rounded h-[28px] w-[28px] overflow-hidden items-center justify-center flex">
                  <img
                    height={16}
                    width={16}
                    alt={mod.name}
                    src={mod.logo}
                    className="object-contain"
                  />
                </div>
                <span className="ml-2">{mod.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
