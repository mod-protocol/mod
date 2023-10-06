import React from "react";
import { Renderers } from "@mod-protocol/react";
import { ScrollArea } from "components/ui/scroll-area";
import { AspectRatio } from "components/ui/aspect-ratio";
import { Skeleton } from "components/ui/skeleton";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export const ImageGridListRenderer = (
  props: React.ComponentProps<Renderers["ImageGridList"]>
) => {
  const { images, isLoading, onPick } = props;

  return (
    <ScrollArea className="h-96 w-full">
      <div className="grid w-full grid-cols-3 gap-2">
        {isLoading ? (
          Array.from(Array(24).keys()).map((item) => (
            <AspectRatio key={item} ratio={1}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          ))
        ) : images && images.length ? (
          images.map((item) => (
            <AspectRatio key={item} ratio={1}>
              <button
                className="w-full h-full active:opacity-50 rounded-md"
                onClick={() => onPick(item)}
              >
                <img
                  className="object-cover w-full h-full bg-slate-900 rounded-md"
                  alt="Gify"
                  src={item}
                />
              </button>
            </AspectRatio>
          ))
        ) : (
          <div className="text-base flex justify-center items-center w-full col-span-3 py-2 text-gray-400">
            <MagnifyingGlassIcon className="mr-2" />
            No images to display.
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
