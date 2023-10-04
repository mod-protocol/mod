import { Renderers } from "@packages/react";
import React from "react";

export const ImageRenderer = (
  props: React.ComponentProps<Renderers["Image"]>
) => {
  const { imageSrc } = props;
  return (
    <div className="rounded">
      <img
        src={imageSrc}
        className="rounded"
        style={{ width: "100%" }}
        width={300}
        height={100}
      />
    </div>
  );
};
