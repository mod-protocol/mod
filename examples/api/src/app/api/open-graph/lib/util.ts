import { FarcasterUser, NFTMetadata, UrlMetadata } from "@mod-protocol/core";
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
    mimeType: null,
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

  chain = chain.toLowerCase();

  let tokenData: any = {};
  let collectionSlug: string | undefined = openSeaSlug;
  let tokenStandard = "erc721";
  let tokenOwnerAddress: string | undefined;

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
    if (tokenData.owners?.length > 0)
      tokenOwnerAddress = tokenData.owners[0].address;
  } else if (!collectionSlug) {
    const contractResponse = await fetch(
      `https://api.opensea.io/api/v2/chain/${chain}/contract/${contractAddress}`,
      authOptions
    );

    if (!contractResponse.ok) {
      // console.error(
      //   `Error fetching contract ${contractAddress}`,
      //   await contractResponse.text()
      // );
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
    if (collectionResponse.status === 429) {
      // console.log(`Rate limited, waiting 1 second...`);
      // Wait 1 second and try again
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchNFTMetadata({
        contractAddress,
        tokenId,
        chain,
        mintUrl,
        openSeaSlug,
      });
    }

    // console.error(
    //   `Error fetching collection ${collectionSlug}`,
    //   collectionResponse.status,
    //   await collectionResponse.text()
    // );
    return null;
  }

  const collectionData = await collectionResponse.json();

  const collectionStatsResponse = await fetch(
    `https://api.opensea.io/api/v1/collection/${collectionSlug}/stats`,
    authOptions
  );
  // Collection stats should exist if the collection exists
  const collectionStats = await collectionStatsResponse.json();

  const creatorFcUser = await fetchUserData(collectionData.owner);
  const ownerFcUser =
    tokenId && tokenOwnerAddress
      ? await fetchUserData(tokenOwnerAddress || "")
      : null;

  // If the tokenId was specified, use the token image, otherwise use the collection image and
  // fallback to the first token in the collection's image if collection image is not available.
  const image = tokenId
    ? tokenData.image_url
    : collectionData.image_url
    ? collectionData.image_url
    : tokenData.image_url;

  const collectionCaip19Uri = `chain://eip155:${chainByName[chain].id}/${tokenStandard}:${contractAddress}`;

  const nftMetadata: NFTMetadata = {
    mediaUrl: image,
    tokenId: tokenId,
    owner: ownerFcUser,
    collection: {
      id: collectionCaip19Uri,
      chain: collectionData.contracts[0].chain,
      contractAddress: collectionData.contracts[0].address,
      creatorAddress: collectionData.owner,
      name: collectionData.name,
      description: collectionData.description,
      itemCount: collectionStats.stats.count,
      ownerCount: collectionStats.stats.num_owners,
      imageUrl: image,
      mintUrl: mintUrl || collectionData.opensea_url,
      openSeaUrl: collectionData.opensea_url,
      creator: creatorFcUser,
    },
  };

  return nftMetadata;
}
