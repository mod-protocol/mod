import React from "react";
import { Renderers } from "@mod-protocol/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AvatarRenderer = (
  props: React.ComponentProps<Renderers["Avatar"]>
) => {
  return (
    <Avatar>
      <AvatarImage src={props.src}></AvatarImage>
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
};
