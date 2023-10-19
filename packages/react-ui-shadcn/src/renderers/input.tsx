import React from "react";
import { Renderers } from "@mod-protocol/react";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { cn } from "lib/utils";

export const InputRenderer = (
  props: React.ComponentProps<Renderers["Input"]>
) => {
  const { isClearable, placeholder, onChange, onSubmit } = props;
  const [value, setValue] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  return (
    <div className="w-full flex flex-row items-center border rounded-md border-input">
      <Input
        ref={inputRef}
        placeholder={placeholder}
        className={cn("flex-1 border-none", isClearable && value ? "pr-1" : "")}
        onChange={(ev) => {
          onChange(ev.currentTarget.value);
          setValue(ev.currentTarget.value);
        }}
        onSubmit={(ev) => {
          onSubmit(ev.currentTarget.value);
          setValue(ev.currentTarget.value);
        }}
        value={value}
      />
      {isClearable && value ? (
        <Button
          type="button"
          className="rounded-l-none text-gray-400 hover:bg-transparent"
          variant="ghost"
          size="icon"
          onClick={() => {
            onChange("");
            setValue("");
            inputRef.current?.focus();
          }}
        >
          <Cross1Icon />
        </Button>
      ) : null}
    </div>
  );
};
