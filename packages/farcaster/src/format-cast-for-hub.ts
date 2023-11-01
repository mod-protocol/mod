import {
  StructuredCastMention,
  convertCastPlainTextToStructured,
} from "./structure-cast";
import { makeCastAdd } from "@farcaster/hub-nodejs";
import {
  FARCASTER_MAX_EMBEDS,
  FarcasterEmbed,
  isFarcasterCastIdEmbed,
  isFarcasterUrlEmbed,
} from "./types";

// returns arrayify(hash) by removing the prefixing "0x" from a hexstring and converting to a uint8 array
export function stringHashToUint(hash: string): Uint8Array {
  return new Uint8Array(Buffer.from(hash.slice(2), "hex"));
}

type ValidMention = { fid: number; username: string };

/**
 * Formats a cast to be ready for a hub, including validating and calculating `mentions` and `mentionsPositions`
 * @link https://github.com/farcasterxyz/protocol/blob/e929829e158bc780c7c847a8e0154cccf6b8ae83/README.md#store
 * @returns false if validation failed, otherwise returns an object ready for the `makeCastAdd` function
 */
//
export async function formatPlaintextToHubCastMessage({
  text,
  embeds,
  parentCastFid,
  parentCastHash,
  parentUrl,
  getMentionFidsByUsernames,
}: {
  text: string;
  embeds: FarcasterEmbed[];
  getMentionFidsByUsernames: (
    usernames: string[]
  ) => Promise<Array<{ fid: number; username: string }>>;
  parentUrl?: string;
  parentCastFid?: number;
  parentCastHash?: string;
}): Promise<Parameters<typeof makeCastAdd>[0] | false> {
  // Up to 2 embed urls allowed by Farcaster
  if (embeds.length > FARCASTER_MAX_EMBEDS) {
    return false;
  }

  // TODO: enforce constraint of may not be over 256 bytes

  const structuredCast = convertCastPlainTextToStructured({
    text,
  });

  // To detect embeds in the plaintext, use the following code.
  // const embeds = structuredCast
  //   .filter((x) => x.type === "url" || x.type === "videourl")
  //   .slice(0, 2)
  //   .map((x) => {
  //     return { url: x.serializedContent };
  //   });

  const mentionCandidates: StructuredCastMention[] = structuredCast.filter(
    (x): x is StructuredCastMention => x.type === "mention"
  );

  let formattedText = "";
  let mentions: number[] = [];
  let remainingMentions: Array<ValidMention> = [];
  let mentionsPositions: number[] = [];
  if (mentionCandidates.length) {
    const fetchedMentionFids = await getMentionFidsByUsernames(
      mentionCandidates.map((x) => x.serializedContent.replace("@", ""))
    );

    const mentionCandidatesFormatted: Array<ValidMention> = mentionCandidates
      .map((mentionCandidate) => {
        return {
          fid: fetchedMentionFids?.find(
            (u) =>
              u.username === mentionCandidate.serializedContent.replace("@", "")
          )?.fid,
          username: mentionCandidate.serializedContent,
        };
      })
      // only mentions we can find
      .filter((x): x is ValidMention => !!x.fid)
      // Farcaster casts may have up to 5 mentions https://github.com/farcasterxyz/protocol/blob/e929829e158bc780c7c847a8e0154cccf6b8ae83/README.md#store
      .slice(0, 5);

    remainingMentions = mentionCandidatesFormatted;
  }

  structuredCast.forEach((structuredCastUnit, i) => {
    if (
      structuredCastUnit.type === "mention" &&
      remainingMentions.length &&
      remainingMentions[0].username === structuredCastUnit.serializedContent
    ) {
      const encodedText = new TextEncoder().encode(formattedText);
      // Use # of UTF-8 bytes not characters. Some emojis take more than 2 bytes. https://github.com/farcasterxyz/protocol/blob/main/docs/SPECIFICATION.md
      mentionsPositions.push(encodedText.length);
      mentions.push(remainingMentions[0].fid);
      remainingMentions = remainingMentions.slice(1);
    } else {
      formattedText = formattedText + structuredCastUnit.serializedContent;
    }
  });

  const targetHashBytes = parentCastHash
    ? stringHashToUint(parentCastHash)
    : false;

  const res: Parameters<typeof makeCastAdd>[0] = {
    text: formattedText,
    mentions: mentions,
    embedsDeprecated: [],
    mentionsPositions: mentionsPositions,
    ...(parentCastFid && targetHashBytes
      ? {
          parentCastId: {
            fid: parentCastFid,
            hash: targetHashBytes,
          },
        }
      : parentUrl
      ? {
          parentUrl: parentUrl,
        }
      : {}),
    embeds: embeds.map((embed) => {
      if (isFarcasterCastIdEmbed(embed))
        return {
          castId: embed.castId,
        };
      if (isFarcasterUrlEmbed(embed)) {
        return {
          url: embed.url,
        };
      }
      return embed;
    }),
  };

  return res;
}
