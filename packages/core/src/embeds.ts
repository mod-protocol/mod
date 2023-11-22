import { FarcasterEmbed, isFarcasterUrlEmbed } from "@mod-protocol/farcaster";

export function isImageEmbed(embed: Embed) {
  return (
    isFarcasterUrlEmbed(embed) &&
    ((embed.metadata?.hasOwnProperty("image") &&
      embed.url === embed.metadata?.image?.url) ||
      embed.metadata?.mimeType?.startsWith("image"))
  );
}

export function isVideoEmbed(embed: Embed) {
  return isFarcasterUrlEmbed(embed) && embed.url.endsWith(".m3u8");
}

export function hasFullSizedImage(embed: Embed) {
  return (
    embed.metadata?.image?.url &&
    embed.metadata?.image.width !== embed.metadata.image.height
  );
}

export type FarcasterUser = {
  fid: number;
  username: string;
  displayName: string;
  pfp: {
    url: string;
  };
};

export type NFTMetadata = {
  owner?: FarcasterUser;
  tokenId?: string;
  mediaUrl?: string;
  collection: {
    id: string;
    name: string;
    chain: string;
    contractAddress: string;
    creatorAddress: string;
    itemCount: number;
    ownerCount: number;
    mintUrl: string;
    description?: string;
    imageUrl?: string;
    openSeaUrl?: string;
    creator?: FarcasterUser;
  };
};

export type UrlMetadata = {
  image?: {
    url?: string;
    width?: number;
    height?: number;
  };
  // A schema.org definition
  "json-ld"?: object;
  description?: string;
  alt?: string;
  title?: string;
  publisher?: string;
  logo?: {
    url: string;
  };
  nft?: NFTMetadata;
  mimeType?: string;
};

export type Embed = {
  status: "loading" | "loaded";
  metadata?: UrlMetadata;
} & FarcasterEmbed;

// export type Embed =
//   | { alt: string; sourceUrl: string; type: "image"; url: string }
//   | {
//       type: "url";
//       openGraph: {
//         url: string;
//         image: string;
//         title: string;
//         domain: string;
//         description?: string;
//         logo?: string;
//         nft?: NFT;
//       };
//     };
