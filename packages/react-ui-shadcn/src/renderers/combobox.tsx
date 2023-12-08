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
import { ChevronDownIcon } from "@radix-ui/react-icons";

type ResultType<T> = { value: T; label: string };

type Props<T> = {
  options: Array<ResultType<T>> | null;
  onPick: (value: T) => void;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function ComboboxRenderer<T extends number | string = any>(
  props: Props<T>
) {
  const { options, onChange, onPick } = props;
  const [value, setValue] = React.useState<ResultType<T> | null>(null);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    onChange("");
  }, [onChange]);

  const handlePick = React.useCallback(
    (newValue: ResultType<T>) => {
      setOpen(false);
      setValue(newValue);
      onPick(newValue.value);
    },
    [onChange, setOpen, setValue, onPick]
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? value.label : props.placeholder}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search" />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {!options ? "...loading" : null}
            {options?.map((option) => (
              <CommandItem
                key={option.label}
                value={String(option.label)}
                className="cursor-pointer"
                onSelect={() => handlePick(option)}
              >
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
