import { MultiToken, Options, tokenize } from "linkifyjs";
import { LinkifyLink } from "../link";

const textcuts =
  /(\b)([^ \.\n,]+)(\.)(twitter|github|lens|telegram|eth)($| |\n)/i;

function isTokenTextcut(str: MultiToken): boolean {
  return textcuts.test(str.toString());
}

export function findLinksAndTextcuts(str: string): LinkifyLink[] {
  const tokens = tokenize(str);
  const filtered = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.isLink) {
      filtered.push({
        ...token.toFormattedObject(new Options()),
        isTextcut: false,
      });
    } else if (isTokenTextcut(token)) {
      filtered.push({
        ...token.toFormattedObject(new Options()),
        isLink: true,
        isTextcut: true,
        href: "#",
      });
    }
  }

  return filtered;
}
