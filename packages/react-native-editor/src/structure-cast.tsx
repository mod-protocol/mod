import {
  StructuredCastUnit,
  StructuredCastPlaintext,
  StructuredCastUrl,
  StructuredCastImageUrl,
  StructuredCastMention,
  StructuredCastTextcut,
  StructuredCastNewline,
  StructuredCastVideo,
} from "@packages/farcaster";
import { Text } from "react-native";

type StructuringOptions = { linkStyle?: string };

export const structuredCastToReactDOMComponentsConfig: Record<
  StructuredCastUnit["type"],
  (
    structuredCast: any,
    i: number,
    options: StructuringOptions
  ) => React.ReactElement
> = {
  plaintext: (structuredCast: StructuredCastPlaintext, i: number, options) => (
    <Text key={i}>{structuredCast.serializedContent}</Text>
  ),
  url: (structuredCast: StructuredCastUrl, i: number, options) => (
    <Text key={i} style={options.linkStyle}>
      {structuredCast.serializedContent}
    </Text>
  ),
  videourl: (structuredCast: StructuredCastVideo, i: number, options) => (
    <Text key={i} style={options.linkStyle}>
      {structuredCast.serializedContent}
    </Text>
  ),
  imageurl: (structuredCast: StructuredCastImageUrl, i: number, options) => (
    <Text key={i} style={options.linkStyle}>
      {structuredCast.serializedContent}
    </Text>
  ),
  mention: (structuredCast: StructuredCastMention, i: number, options) => (
    <Text key={i} style={options.linkStyle}>
      {structuredCast.serializedContent}
    </Text>
  ),
  textcut: (structuredCast: StructuredCastTextcut, i: number, options) => (
    <Text key={i} style={options.linkStyle}>
      {structuredCast.serializedContent}
    </Text>
  ),
  newline: (_: StructuredCastNewline, i: number, options) => (
    <Text key={i} style={options.linkStyle} style={{ maxWidth: 200 }}>
      {"\n"}
    </Text>
  ),
};

export function convertStructuredCastToReactDOMComponents(
  structuredCast: StructuredCastUnit[],
  options: StructuringOptions
): (React.ReactElement | string)[] {
  return structuredCast.map((structuredCastUnit, i) =>
    structuredCastToReactDOMComponentsConfig[structuredCastUnit.type](
      structuredCastUnit,
      i,
      options
    )
  );
}
