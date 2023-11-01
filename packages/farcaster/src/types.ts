// https://github.com/farcasterxyz/protocol/blob/main/docs/SPECIFICATION.md#14-casts
export type FarcasterUrlEmbed = { url: string };
export type FarcasterCastIdEmbed = {
  castId: { fid: number; hash: Uint8Array };
};
export type FarcasterEmbed = FarcasterCastIdEmbed | FarcasterUrlEmbed;

export function isFarcasterUrlEmbed(
  embed: FarcasterEmbed
): embed is FarcasterUrlEmbed {
  return embed.hasOwnProperty("url");
}

export function isFarcasterCastIdEmbed(
  embed: FarcasterEmbed
): embed is FarcasterCastIdEmbed {
  return embed.hasOwnProperty("castId");
}

export const FARCASTER_MAX_EMBEDS = 2;
