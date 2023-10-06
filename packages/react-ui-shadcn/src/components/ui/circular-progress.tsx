import * as React from "react";
import { cn } from "lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const circularProgressVariants = cva(
  "inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        default: "h-8 w-8 border-4",
        sm: "h-4 w-4 border-2",
        lg: "h-12 w-12 border-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof circularProgressVariants>
>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    role="status"
    className={cn(circularProgressVariants({ size, className }))}
    {...props}
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
));

CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
