import { useRelativeDate } from "./relative-date";
import React from "react";
import Octicons from "@expo/vector-icons/Octicons";

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
} from "@packages/farcaster";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

export const structuredCastToReactDOMComponentsConfig: Record<
  StructuredCastUnit["type"],
  (structuredCast: any, i: number, options: {}) => React.ReactElement
> = {
  plaintext: (structuredCast: StructuredCastPlaintext, i: number, options) => (
    <Text key={i}>{structuredCast.serializedContent}</Text>
  ),
  url: (structuredCast: StructuredCastUrl, i: number, options) => (
    <Text key={i} className="text-indigo-600">
      {structuredCast.serializedContent}
    </Text>
  ),
  videourl: (structuredCast: StructuredCastVideo, i: number, options) => (
    <Text key={i} className="text-indigo-600">
      {structuredCast.serializedContent}
    </Text>
  ),
  imageurl: (structuredCast: StructuredCastImageUrl, i: number, options) => (
    <Text key={i} className="text-indigo-600">
      {structuredCast.serializedContent}
    </Text>
  ),
  mention: (structuredCast: StructuredCastMention, i: number, options) => (
    <Text key={i} className="text-indigo-600">
      {structuredCast.serializedContent}
    </Text>
  ),
  textcut: (structuredCast: StructuredCastTextcut, i: number, options) => (
    <Text key={i} className="text-indigo-600">
      {structuredCast.serializedContent}
    </Text>
  ),
  newline: (_: StructuredCastNewline, i: number, options) => (
    <Text className="w-full" key={i} />
  ),
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

type Embed =
  | { alt: string; sourceUrl: string; type: "image"; url: string }
  | {
      type: "url";
      openGraph: {
        url: string;
        image: string;
        title: string;
        domain: string;
      };
    };

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
    <View className="relative border-t rounded pb-2 border-slate-200">
      <View>
        <View className="px-4 py-3 pb-0 cursor-pointer break-words">
          <View className="flex gap-3 flex-row">
            <View style={{ minWidth: 48 }} className="relative">
              <View>
                <View className="pt-1">
                  <Image
                    style={{ width: 48, height: 48 }}
                    className="rounded-full"
                    source={{
                      uri: props.cast.avatar_url,
                      width: 48,
                      height: 48,
                    }}
                    contentFit={"cover"}
                  />
                </View>
              </View>
            </View>
            <View className="flex-grow flex-shrink">
              <View className="flex flex-row">
                <Text className="font-bold flex">
                  {props.cast.display_name}
                </Text>
                <Text className="text-slate-500"> @{props.cast.username}</Text>
                <Text className="text-slate-500"> · {publishedAt}</Text>
              </View>
              <View className="cursor-pointer mt-1">
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    {convertStructuredCastToReactDOMComponents(
                      structuredCast,
                      {}
                    )}
                  </Text>
                </View>
                <RenderCastEmbeds embeds={props.cast.embeds} />
              </View>
              <View className="flex justify-between mt-2 flex-row">
                <Pressable className="text-slate-500 flex flex-row">
                  <Octicons name="comment" size={16} color="#ccc" />
                  <Text className="ml-2 text-slate-500">69</Text>
                </Pressable>
                <Pressable className="text-slate-500 flex flex-row">
                  <Octicons name="sync" size={16} color="#ccc" />
                  <Text className="ml-2 text-slate-500">3</Text>
                </Pressable>
                <Pressable className="text-slate-500 flex flex-row">
                  <Octicons name="heart" size={16} color="#ccc" />
                  <Text className="ml-2 text-slate-500">420</Text>
                </Pressable>
                <Pressable className="text-slate-500 flex flex-row">
                  <Octicons name="share" size={16} color="#ccc" />
                  <Text className="ml-2 text-slate-500"></Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function RenderCastEmbeds(props: { embeds: Array<Embed> }) {
  return (
    <View>
      {props.embeds.map((embed, i) => {
        if (embed.type === "url") {
          return (
            <View className="border rounded mt-2 border-slate-200" key={i}>
              <Image
                style={{ width: "100%", height: 180 }}
                source={{
                  uri: embed.openGraph.image,
                  width: 300,
                  height: 180,
                }}
                className="rounded-t"
                contentFit={"cover"}
              />
              <View className="p-2">
                <Text className="font-bold">{embed.openGraph.title}</Text>
                <Text className="text-slate-600">{embed.openGraph.domain}</Text>
              </View>
            </View>
          );
        }
        if (embed.type === "image") {
          return (
            <View className="border rounded mt-2 border-slate-200" key={i}>
              <Image
                style={{ width: "100%", height: 180 }}
                source={{
                  uri: embed.url,
                  width: 300,
                  height: 180,
                }}
                className="rounded"
                contentFit={"cover"}
              />
            </View>
          );
        }
        return null;
      })}
    </View>
  );
}
