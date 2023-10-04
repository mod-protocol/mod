import React from "react";
import { Renderers } from "@mod-protocol/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const DialogRenderer = (
  props: React.ComponentProps<Renderers["Dialog"]>
) => {
  const { children, onClose } = props;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="flex sm:max-w-[420px] mb-4 max-h-[calc(100%-theme(space.8))] pt-12">
        {children}
      </DialogContent>
    </Dialog>
  );
};
