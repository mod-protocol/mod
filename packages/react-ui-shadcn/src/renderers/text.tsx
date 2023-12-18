import React from "react";
import { Renderers } from "@mod-protocol/react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

const textVariants = cva("my-0 flex-1 text-sm break-words", {
  variants: {
    variant: {
      bold: "font-bold",
      regular: "",
      secondary: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "regular",
  },
});

export const TextRenderer = (
  props: React.ComponentProps<Renderers["Text"]>
) => {
  const { label, variant = "regular" } = props;

  return <p className={cn(textVariants({ variant }))}>{label}</p>;
};
