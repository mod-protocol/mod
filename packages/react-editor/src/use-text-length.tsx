export function useTextLength({
  getText,
  maxCharacterLength,
}: {
  getText: () => string;
  maxCharacterLength: number;
}) {
  const len = getText().length;
  const eightyFivePercentComplete = maxCharacterLength * 0.85;

  return {
    length: len,
    isValid: len <= maxCharacterLength,
    tailwindColor:
      len > maxCharacterLength
        ? "red"
        : len > eightyFivePercentComplete
        ? `orange.${2 + Math.floor((len - eightyFivePercentComplete) / 10)}00`
        : "gray",
    label:
      len > maxCharacterLength
        ? `-${len - maxCharacterLength} characters left`
        : len > eightyFivePercentComplete
        ? `${maxCharacterLength - len} characters left`
        : ``,
  };
}
