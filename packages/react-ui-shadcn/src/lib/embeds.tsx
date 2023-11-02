import {
  Embed,
  hasFullSizedImage,
  isImageEmbed,
  isVideoEmbed,
} from "@mod-protocol/core";
import { isFarcasterUrlEmbed } from "@mod-protocol/farcaster";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import { VideoRenderer } from "../renderers/video";

function shorten(str?: string, maxLength = 64) {
  if (!str) return str;
  if (str.length > maxLength) return str.slice(0, maxLength - 3) + "...";
  return str;
}

export const EmbedsEditor = (props: {
  embeds: Embed[];
  setEmbeds: (e: Embed[]) => void;
}) => {
  return (
    <>
      {props.embeds.map((embed, i) => (
        <div key={i} className="relative">
          <Button
            className="rounded-full text-white hover:text-gray-300 absolute -top-4 -left-4 border-white border z-50"
            size="icon"
            type="button"
            onClick={() => {
              props.setEmbeds(props.embeds.filter((item, j) => j !== i));
            }}
          >
            <Cross1Icon />
          </Button>
          {isFarcasterUrlEmbed(embed) && isImageEmbed(embed) ? (
            <div className="border rounded mt-2" key={i}>
              <img
                src={embed.url}
                alt={embed.metadata?.alt}
                className="rounded"
                style={{ width: "100%" }}
                width={300}
                height={100}
              />
            </div>
          ) : isFarcasterUrlEmbed(embed) && isVideoEmbed(embed) ? (
            <VideoRenderer videoSrc={embed.url} />
          ) : embed.status === "loading" ? (
            <Skeleton className="h-[100px] w-full items-center flex justify-center">
              Loading...
            </Skeleton>
          ) : hasFullSizedImage(embed) ? (
            <div className="border rounded mt-2" key={i}>
              <div style={{ maxHeight: "200px", overflow: "hidden" }}>
                <img
                  src={embed.metadata?.image?.url}
                  alt={embed.metadata?.title}
                  className="rounded-t"
                  style={{ width: "100%" }}
                  width={300}
                  height={100}
                />
              </div>
              <div className="p-2">
                <div className="font-bold">
                  {shorten(embed.metadata?.title)}
                </div>
                <div className="text-muted-foreground">
                  {embed.metadata?.publisher}
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded mt-2" key={i}>
              <div className="p-2">
                <div className="flex flex-row">
                  <img
                    src={embed.metadata?.logo?.url}
                    alt={embed.metadata?.title}
                    className="w-6 rounded mr-1 flex-shrink-0 h-6"
                  />
                  <div className="font-bold">
                    {shorten(embed.metadata?.title)}
                  </div>
                </div>
                <div className="text-muted-foreground">
                  {embed.metadata?.publisher}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};
