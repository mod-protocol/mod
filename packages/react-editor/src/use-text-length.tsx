export function useTextLength({
  getText,
  maxByteLength,
}: {
  getText: () => string;
  maxByteLength: number;
}) {
  const text = getText();
  const lengthInBytes = new TextEncoder().encode(text).length;

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
