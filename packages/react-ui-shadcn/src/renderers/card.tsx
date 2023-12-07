import { Renderers } from "@mod-protocol/react";
import React from "react";
import { cn } from "lib/utils";
import { AspectRatio } from "components/ui/aspect-ratio";

export const CardRenderer = (
  props: React.ComponentProps<Renderers["Card"]>
) => {
  const {
    imageSrc,
    aspectRatio,
    topLeftBadge,
    topRightBadge,
    bottomLeftBadge,
    bottomRightBadge,
    children,
    onClick,
  } = props;
  return (
    <div
      className="flex flex-col -m-2"
      onClick={(e) => {
        // Prevent double event firing when clicking child components
        e.stopPropagation();
        onClick();
      }}
    >
      {imageSrc ? (
        <AspectRatio ratio={aspectRatio || 1}>
          <div className="w-full h-full bg-slate-900 relative">
            {topLeftBadge ? (
              <CardImageBadge position="topLeft">{topLeftBadge}</CardImageBadge>
            ) : null}
            {topRightBadge ? (
              <CardImageBadge position="topRight">
                {topRightBadge}
              </CardImageBadge>
            ) : null}
            {bottomLeftBadge ? (
              <CardImageBadge position="bottomLeft">
                {bottomLeftBadge}
              </CardImageBadge>
            ) : null}
            {bottomRightBadge ? (
              <CardImageBadge position="bottomRight">
                {bottomRightBadge}
              </CardImageBadge>
            ) : null}
            <img
              className="object-cover w-full h-full"
              alt="Image"
              src={imageSrc}
            />
          </div>
        </AspectRatio>
      ) : null}
      <div className="p-2">{children}</div>
    </div>
  );
};

export const CardImageBadge = (props: {
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  children: React.ReactNode;
}) => {
  const { children, position } = props;
  return (
    <div
      className={cn(
        "absolute rounded p-1 px-2 bg-[#1f162ae6]  text-slate-200",
        {
          "top-1 left-1": position === "topLeft",
          "top-1 right-1": position === "topRight",
          "bottom-1 left-1": position === "bottomLeft",
          "bottom-1 right-1": position === "bottomLeft",
        }
      )}
    >
      {children}
    </div>
  );
};
