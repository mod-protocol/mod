import { FarcasterUser, NFTMetadata, UrlMetadata } from "@mod-protocol/core";
import { reservoirChains } from "@reservoir0x/reservoir-sdk";
import { chainByName } from "./chains/chain-index";

async function fetchUserData(address: string): Promise<FarcasterUser | null> {
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
    publisher: nftMetadata.collection.creator?.displayName,
    logo: nftMetadata.collection.creator
      ? {
          url: nftMetadata.collection.creator.pfp.url,
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
}: {
  contractAddress: string;
  chain: string;
  tokenId?: string;
  mintUrl?: string;
}): Promise<NFTMetadata | null> {
  const searchParams = new URLSearchParams(
    tokenId
      ? {
          tokens: `${contractAddress}:${tokenId}`,
        }
      : {
          collection: contractAddress,
        }
  );

  const viemChain = chainByName[chain];
  const reservoirChain = [...Object.values(reservoirChains)].find(
    (chain) => chain.id === viemChain.id
  );

  const reservoirResponse = await fetch(
    `${reservoirChain.baseApiUrl}/tokens/v6?${searchParams.toString()}`,
    {
      headers: {
        "x-api-key": process.env.RESERVOIR_API_KEY,
      },
    }
  );

  if (!reservoirResponse.ok) {
    // console.error(
    //   `Error fetching token ${contractAddress}:${tokenId}`,
    //   await reservoirResponse.text()
    // );
    return null;
  }

  const reservoirData = await reservoirResponse.json();
  const tokenData = reservoirData.tokens[0].token;
  const collectionData = tokenData.collection;

  const collectionStatsResponse = await fetch(
    `https://api.opensea.io/api/v1/collection/${collectionData.slug}/stats`,
    {
      headers: {
        "x-api-key": process.env.OPENSEA_API_KEY,
      },
    }
  );
  // Collection stats should exist if the collection exists
  const collectionStats = await collectionStatsResponse.json();

  const creatorFcUser = await fetchUserData(collectionData.creator);
  const ownerFcUser = await fetchUserData(tokenData.owner);

  const image = tokenId
    ? tokenData.image
    : collectionData.image
    ? collectionData.image
    : tokenData.image;

  const collectionCaip19Uri = `chain://eip155:${tokenData.chainId}/${tokenData.kind}:${contractAddress}`;
  const openseaUrl = `https://opensea.io/collection/${collectionData.slug}`;

  const nftMetadata: NFTMetadata = {
    mediaUrl: image,
    tokenId: tokenId,
    owner: ownerFcUser,
    collection: {
      id: collectionCaip19Uri,
      chain: chain,
      contractAddress: collectionData.id,
      creatorAddress: collectionData.creator,
      name: collectionData.name,
      description: collectionData.description,
      itemCount: collectionData.tokenCount,
      ownerCount: collectionStats?.stats?.num_owners || 0,
      imageUrl: collectionData.image,
      mintUrl: mintUrl || openseaUrl,
      openSeaUrl: openseaUrl,
      creator: creatorFcUser,
    },
  };

  return nftMetadata;
}
