import { NFTMetadata, UrlMetadata } from "@mod-protocol/core";
import { chainByName } from "./chains/chain-index";

async function fetchUserData(address: string): Promise<{
  fid: number;
  username: string;
  displayName: string;
  pfp: {
    url: string;
  };
} | null> {
  try {
    const searchParams = new URLSearchParams({
      api_key: process.env.NEYNAR_API_SECRET,
      address,
    });
    const response = await fetch(
      `https://api.neynar.com/v1/farcaster/user-by-verification?${searchParams.toString()}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const user = data.result?.user;

    return user
      ? {
          fid: user.fid,
          username: user.username,
          displayName: user.displayName,
          pfp: {
            url: user.pfp.url,
          },
        }
      : null;
  } catch (error) {
    // console.error("Error fetching user data:", error);
    return null;
  }
}

export function toUrlMetadata(nftMetadata: NFTMetadata): UrlMetadata {
  return {
    image: nftMetadata.mediaUrl ? { url: nftMetadata.mediaUrl } : undefined,
    description: nftMetadata.collection.description,
    alt: nftMetadata.collection.name,
    title: nftMetadata.collection.name,
    publisher: nftMetadata.creator?.displayName,
    logo: nftMetadata.creator
      ? {
          url: nftMetadata.creator?.pfp.url,
        }
      : undefined,
    nft: nftMetadata,
  };
}

export async function fetchNFTMetadata({
  contractAddress,
  tokenId,
  chain,
  mintUrl,
  openSeaSlug,
}: {
  contractAddress: string;
  chain: string;
  tokenId?: string;
  mintUrl?: string;
  openSeaSlug?: string;
}): Promise<NFTMetadata | null> {
  const authOptions = {
    headers: {
      "x-api-key": process.env.OPENSEA_API_KEY,
    },
  };

  let tokenData: any = {};
  let collectionSlug: string | undefined = openSeaSlug;
  let tokenStandard = "erc721";

  const tokenResponse = await fetch(
    `https://api.opensea.io/api/v2/chain/${chain}/contract/${contractAddress}/nfts/${
      tokenId || 1
    }`,
    authOptions
  );

  if (tokenResponse.ok) {
    const { nft } = await tokenResponse.json();
    tokenData = nft;
    collectionSlug = tokenData.collection;
    tokenStandard = tokenData.token_standard;
  } else if (!collectionSlug) {
    const contractResponse = await fetch(
      `https://api.opensea.io/api/v2/chain/${chain}/contract/${contractAddress}`,
      authOptions
    );

    if (!contractResponse.ok) {
      return null;
    }

    const { collection } = await contractResponse.json();
    collectionSlug = collection;
  }

  const collectionResponse = await fetch(
    `https://api.opensea.io/api/v2/collections/${collectionSlug}`,
    authOptions
  );

  if (!collectionResponse.ok) {
    return null;
  }

  const collectionData = await collectionResponse.json();

  const collectionStatsResponse = await fetch(
    `https://api.opensea.io/api/v1/collection/${collectionSlug}/stats`,
    authOptions
  );
  let collectionStats: any = {};
  if (collectionStatsResponse.ok) {
    collectionStats = await collectionStatsResponse.json();
  }

  const fcUser = await fetchUserData(collectionData.owner);

  // If the tokenId was specified, use the token image, otherwise use the collection image and
  // fallback to the first token in the collection's image if collection image is not available.
  const image = tokenId
    ? tokenData.image_url
    : collectionData.image_url
    ? collectionData.image_url
    : tokenData.image_url;

  const caip19Uri = `chain://eip155:${
    chainByName[chain].id
  }/${tokenStandard}:${contractAddress}${tokenId ? `/${tokenId}` : ""}`;

  const nftMetadata: NFTMetadata = {
    collectionName: collectionData.name,
    contractAddress: collectionData.contracts[0].address,
    creatorAddress: collectionData.creator,
    mediaUrl: image,
    chain: collectionData.contracts[0].chain,
    collection: {
      id: caip19Uri,
      name: collectionData.name,
      description: collectionData.description,
      itemCount: collectionStats?.stats.count,
      ownerCount: collectionStats?.stats.num_owners,
      imageUrl: image,
      mintUrl: mintUrl || collectionData.opensea_url,
      openSeaUrl: collectionData.opensea_url,
    },
    creator: fcUser,
  };

  return nftMetadata;
}
