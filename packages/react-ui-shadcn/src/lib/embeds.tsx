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

export const EmbedsEditor = ({
  embeds,
  setEmbeds,
  RichEmbed,
}: {
  embeds: Embed[];
  setEmbeds: (e: Embed[]) => void;
  RichEmbed: (props: { embed: Embed }) => JSX.Element;
}) => {
  return (
    <>
      {embeds.map((embed, i) => (
        <div key={i} className="relative">
          <Button
            className="rounded-full text-white dark:text-black hover:text-gray-300 absolute -top-4 -left-4 border-white border z-50"
            size="icon"
            type="button"
            onClick={() => {
              setEmbeds(embeds.filter((item, j) => j !== i));
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
          ) : (
            <RichEmbed embed={embed} />
          )}
        </div>
      ))}
    </>
  );
};
