import { convertCastPlainTextToStructured } from "@mod-protocol/farcaster";

export function useTextLength({
  getText,
  maxByteLength,
}: {
  getText: () => string;
  maxByteLength: number;
}) {
  const text = getText();

  // Mentions don't occupy space in the cast, so we need to ignore them for our length calculation
  const structuredTextUnits = convertCastPlainTextToStructured({ text });
  const textWithoutMentions = structuredTextUnits.reduce((acc, unit) => {
    if (unit.type !== "mention") acc += unit.serializedContent;
    return acc;
  }, "");

  const lengthInBytes = new TextEncoder().encode(textWithoutMentions).length;

  const eightyFivePercentComplete = maxByteLength * 0.85;

  return {
    length: lengthInBytes,
    isValid: lengthInBytes <= maxByteLength,
    tailwindColor:
      lengthInBytes > maxByteLength
        ? "red"
        : lengthInBytes > eightyFivePercentComplete
        ? `orange.${
            2 + Math.floor((lengthInBytes - eightyFivePercentComplete) / 10)
          }00`
        : "gray",
    label:
      lengthInBytes > maxByteLength
        ? `-${lengthInBytes - maxByteLength} characters left`
        : lengthInBytes > eightyFivePercentComplete
        ? `${maxByteLength - lengthInBytes} characters left`
        : ``,
  };
}
