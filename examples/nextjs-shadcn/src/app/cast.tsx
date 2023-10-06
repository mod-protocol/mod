import { useRelativeDate } from "./relative-date";
import Image from "next/image";
import React from "react";
import {
  CommentIcon,
  HeartIcon,
  ShareIcon,
  SyncIcon,
  BookmarkIcon,
} from "@primer/octicons-react";
import {
  StructuredCastImageUrl,
  StructuredCastMention,
  StructuredCastNewline,
  StructuredCastPlaintext,
  StructuredCastTextcut,
  StructuredCastUnit,
  StructuredCastUrl,
  StructuredCastVideo,
  convertCastPlainTextToStructured,
} from "@mod-protocol/farcaster";
import { Embed } from "@mod-protocol/core";
import { Embeds } from "./embeds";

export const structuredCastToReactDOMComponentsConfig: Record<
  StructuredCastUnit["type"],
  (structuredCast: any, i: number, options: {}) => React.ReactElement
> = {
  plaintext: (structuredCast: StructuredCastPlaintext, i: number, options) => (
    <span key={i}>{structuredCast.serializedContent}</span>
  ),
  url: (structuredCast: StructuredCastUrl, i: number, options) => (
    <a
      key={i}
      href={structuredCast.serializedContent}
      className="text-indigo-600"
    >
      {structuredCast.serializedContent}
    </a>
  ),
  videourl: (structuredCast: StructuredCastVideo, i: number, options) => (
    <a
      key={i}
      href={structuredCast.serializedContent}
      className="text-indigo-600"
    >
      {structuredCast.serializedContent}
    </a>
  ),
  imageurl: (structuredCast: StructuredCastImageUrl, i: number, options) => (
    <a
      key={i}
      href={structuredCast.serializedContent}
      className="text-indigo-600"
    >
      {structuredCast.serializedContent}
    </a>
  ),
  mention: (structuredCast: StructuredCastMention, i: number, options) => (
    <a
      key={i}
      href={structuredCast.serializedContent}
      className="text-indigo-600"
    >
      {structuredCast.serializedContent}
    </a>
  ),
  textcut: (structuredCast: StructuredCastTextcut, i: number, options) => (
    <a
      key={i}
      href={structuredCast.serializedContent}
      className="text-indigo-600"
    >
      {structuredCast.serializedContent}
    </a>
  ),
  newline: (_: StructuredCastNewline, i: number, options) => <br key={i} />,
};

export function convertStructuredCastToReactDOMComponents(
  structuredCast: StructuredCastUnit[],
  options: {}
): (React.ReactElement | string)[] {
  return structuredCast.map((structuredCastUnit, i) =>
    structuredCastToReactDOMComponentsConfig[structuredCastUnit.type](
      structuredCastUnit,
      i,
      options
    )
  );
}

export function Cast(props: {
  cast: {
    avatar_url: string;
    display_name: string;
    username: string;
    timestamp: string;
    text: string;
    embeds: Array<Embed>;
  };
}) {
  const publishedAt = useRelativeDate(new Date(props.cast.timestamp));

  let structuredCast = convertCastPlainTextToStructured({
    text: props.cast.text,
  });

  return (
    <div className="relative border rounded pb-2">
      <div>
        <div className="px-4 py-3 pb-0 cursor-pointer break-words">
          <div className="flex gap-3 flex-row">
            <div style={{ minWidth: "48px" }} className="relative">
              <div>
                <div className="pt-1">
                  <Image
                    alt=""
                    style={{
                      width: "48px",
                      height: "48px",
                    }}
                    className="rounded-full"
                    src={
                      props.cast.avatar_url ||
                      "https://www.discove.xyz/black.png"
                    }
                    width={48}
                    height={48}
                  />
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <span>
                <b>{props.cast.display_name}</b>
              </span>{" "}
              <span>@{props.cast.username}</span> <span>· {publishedAt}</span>
              <div
                className="cursor-pointer mt-1"
                style={{
                  maxWidth: "600px",
                }}
              >
                {convertStructuredCastToReactDOMComponents(structuredCast, {})}
                <Embeds embeds={props.cast.embeds} />
              </div>
              <div
                className="flex justify-between mt-2"
                style={{ maxWidth: "400px", marginLeft: "-14px" }}
              >
                <button className="text-slate-500">
                  <CommentIcon />
                  <span className="ml-2">69</span>
                </button>
                <button className="text-slate-500">
                  <SyncIcon />
                  <span className="ml-2">3</span>
                </button>
                <button className="text-slate-500">
                  <HeartIcon /> <span className="ml-2">420</span>
                </button>
                <button className="text-slate-500">
                  <BookmarkIcon />
                  <span className="ml-2"></span>
                </button>
                <button className="text-slate-500">
                  <ShareIcon />
                  <span className="ml-2"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
