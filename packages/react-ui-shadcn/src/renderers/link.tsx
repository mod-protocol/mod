import React from "react";
import { Renderers } from "@mod-protocol/react";
import { Link } from "components/ui/link";

export const LinkRenderer = (
  props: React.ComponentProps<Renderers["Link"]>
) => {
  const { label, url, onClick, variant = "default" } = props;
  return (
    <Link
      variant={variant}
      href={url}
      onClick={(e) => {
        // prevent an anchor inside a parent with an onclick also triggering the parent onclick
        e.stopPropagation();
        return onClick();
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </Link>
  );
};
