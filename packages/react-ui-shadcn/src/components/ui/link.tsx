import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "lib/utils";
import { buttonVariants } from "./button";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = "link", size, asChild = false, ...props }, ref) => {
    return (
      <a
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Link.displayName = "Link";

export { Link };
