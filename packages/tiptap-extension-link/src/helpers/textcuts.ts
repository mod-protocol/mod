import { MultiToken, Options, tokenize } from "linkifyjs";

const textcuts =
  /(\b)([^ \.\n,]+)(\.)(twitter|github|lens|telegram|eth)($| |\n)/gi;

function isTokenTextcut(str: MultiToken): boolean {
  return textcuts.test(str.toString());
}

export function findLinksAndTextcuts(str: string) {
  const tokens = tokenize(str);
  const filtered = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.isLink) {
      filtered.push(token.toFormattedObject(new Options()));
    } else if (isTokenTextcut(token)) {
      filtered.push({
        ...token.toFormattedObject(new Options()),
        isLink: true,
        href: "#",
      });
    }
  }

  return filtered;
}
