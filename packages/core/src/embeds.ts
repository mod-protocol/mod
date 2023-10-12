import { FarcasterEmbed, isFarcasterUrlEmbed } from "@mod-protocol/farcaster";

export function isImageEmbed(embed: Embed) {
  return (
    isFarcasterUrlEmbed(embed) &&
    embed.metadata?.hasOwnProperty("image") &&
    embed.url === embed.metadata?.image?.url
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

export type NFTMetadata = {
  collectionName: string;
  contractAddress: string;
  creatorAddress: string;
  mediaUrl: string;
  chain: string;
  collection: {
    id: string;
    name: string;
    description: string;
    itemCount?: number;
    ownerCount?: number;
    imageUrl: string;
    mintUrl: string;
    openSeaUrl?: string;
  };
  creator?: {
    fid: number;
    username: string;
    displayName: string;
    pfp: {
      url: string;
    };
  };
};

export type UrlMetadata = {
  image?: {
    url?: string;
    width?: number;
    height?: number;
  };
  description?: string;
  alt?: string;
  title?: string;
  publisher?: string;
  logo?: {
    url: string;
  };
  nft?: NFTMetadata;
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
