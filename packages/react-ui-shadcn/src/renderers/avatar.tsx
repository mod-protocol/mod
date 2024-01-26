import React from "react";
import { Renderers } from "@mod-protocol/react";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";

export const AvatarRenderer = (
  props: React.ComponentProps<Renderers["Avatar"]>
) => {
  return (
    <Avatar>
      {props.href ? (
        <a href={props.href} target="_blank">
          <AvatarImage src={props.src}></AvatarImage>
        </a>
      ) : (
        <AvatarImage src={props.src}></AvatarImage>
      )}

      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
};
