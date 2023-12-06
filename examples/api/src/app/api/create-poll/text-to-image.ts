import { UltimateTextToImage, VerticalImage } from "ultimate-text-to-image";

// Original copied from https://github.com/backmeupplz/essay/blob/main/src/helpers/textToImage.ts (MIT)

export function textToImage({
  text,
  author,
  title,
}: {
  text: string;
  author?: string;
  title?: string;
}) {
  const textToImage = new UltimateTextToImage(text, {
    width: 1524,
    fontFamily: "Arial",
    fontColor: "#373530",
    fontSize: 32,
    valign: "middle",
    marginTop: 40,
  });
  const verticalImage = new VerticalImage(
    [
      ...(title
        ? [
            new UltimateTextToImage(title, {
              width: 1524,
              fontFamily: "Arial",
              fontColor: "#373530",
              fontSize: 64,
              fontWeight: "bold",
              valign: "middle",
              marginBottom: 16,
            }),
          ]
        : []),
      ...(author
        ? [
            new UltimateTextToImage(`@${author}`, {
              width: 1524,
              fontFamily: "Arial",
              fontColor: "#373530",
              fontSize: 25,
              valign: "middle",
            }),
          ]
        : []),
      textToImage,
    ],
    {
      margin: 35,
      backgroundColor: "#ffffff",
    }
  );
  return verticalImage.render().toBuffer();
}
