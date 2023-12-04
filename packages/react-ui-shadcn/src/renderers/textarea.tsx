import React from "react";
import { Renderers } from "@mod-protocol/react";
import { Textarea } from "components/ui/textarea";

export const TextareaRenderer = (
  props: React.ComponentProps<Renderers["Textarea"]>
) => {
  const { placeholder, onChange, onSubmit } = props;
  const [value, setValue] = React.useState<string>("");
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  return (
    <div className="w-full flex flex-row items-center border rounded-md border-input">
      <Textarea
        ref={inputRef}
        placeholder={placeholder}
        className={"flex-1 border-none"}
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
    </div>
  );
};
