import React from "react";
import { Renderers } from "@mod-protocol/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Button } from "components/ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";

export const SelectRenderer = (
  props: React.ComponentProps<Renderers["Select"]>
) => {
  const { isClearable, placeholder, onChange, options } = props;
  const [value, setValue] = React.useState<string>("");
  const selectRef = React.useRef<HTMLSelectElement | null>(null);
  return (
    <div className="w-full flex flex-row items-center rounded-md flex-grow">
      <Select
        onValueChange={(value: string) => {
          onChange(value);
          setValue(value);
        }}
        value={value}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} ref={selectRef} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, i) => {
            return (
              <SelectItem
                value={option.value}
                // items are stable
                key={i}
              >
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
        {isClearable && value ? (
          <Button
            type="button"
            className="rounded-l-none text-gray-400 hover:bg-transparent"
            variant="ghost"
            size="icon"
            onClick={() => {
              onChange("");
              setValue("");
              selectRef.current?.focus();
            }}
          >
            <Cross1Icon />
          </Button>
        ) : null}
      </Select>
    </div>
  );
};
