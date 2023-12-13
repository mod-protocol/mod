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
import { Cross2Icon } from "@radix-ui/react-icons";

type Props = {
  modContentInput: string | { files: { blob: Blob }[] };
  mods: ModManifest[];
  onSelect: (value: ModManifest) => void;
  open?: boolean;
  setOpen?: (value: boolean) => void;
  removeInputAtIndex?: (index: number) => void;
};

export function ModsSearch(props: Props) {
  const {
    mods,
    modContentInput,
    onSelect,
    open: openOverride,
    setOpen: setOpenOverride,
    removeInputAtIndex,
  } = props;

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
    <Popover
      open={openOverride ? openOverride : open}
      onOpenChange={(op) => {
        setOpen(op);
        setOpenOverride?.(op);
      }}
    >
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
          {modContentInput && typeof modContentInput !== "string" && (
            <div className="flex gap-2 p-2">
              {modContentInput.files.map(({ blob }, i) => (
                <div key={i} className="h-8 w-8 rounded-md overflow-hidden">
                  {removeInputAtIndex && (
                    <button
                      className="absolute bg-black rounded-full -mt-2 -ml-2 p-1"
                      onClick={() => removeInputAtIndex(i)}
                    >
                      <Cross2Icon className="h-3 w-3" />
                    </button>
                  )}
                  {blob.type.startsWith("image/") && (
                    <img
                      className="h-8 w-8 "
                      src={URL.createObjectURL(blob)}
                    ></img>
                  )}
                </div>
              ))}
            </div>
          )}
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
