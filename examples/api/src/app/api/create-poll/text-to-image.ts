import { UltimateTextToImage, VerticalImage } from "ultimate-text-to-image";

// Original copied from https://github.com/backmeupplz/essay/blob/main/src/helpers/textToImage.ts (MIT)

export function textToImage({ text }: { text: string }) {
  const textToImage = new UltimateTextToImage(text, {
    // 1200x600 is twitter, 1200x630 is facebook,  532x264 warpcast web
    width: 1200,
    height: 630,
    fontFamily: "Arial",
    fontColor: "#373530",
    fontWeight: "bold",
    fontSize: 48,
    lineHeight: 68,
    backgroundColor: "#ffffff",
    // big margin allows for different client rendering dimensions
    margin: 80,
    valign: "middle",
  });
  return textToImage.render().toBuffer();
}
