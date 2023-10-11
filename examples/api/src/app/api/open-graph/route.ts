import { NextResponse, NextRequest } from "next/server";
import { NFTMetadata, UrlMetadata } from "@mod-protocol/core";

async function fetchUserData(address: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.neynar.com/v1/farcaster/user-by-verification?api_key=${process.env.NEYNAR_API_SECRET}&address=${address}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.result?.user || null;
  } catch (error) {
    // console.error("Error fetching user data:", error);
    return null;
  }
}

async function handleOpenSeaUrl(url: string): Promise<UrlMetadata> {
  // If collection url (e.g. https://opensea.io/collection/farcaster-v3-1)
  if (url.match(/https:\/\/opensea\.io\/collection\/.*/)) {
    return await fallbackUrlHandler(url);
  }
  // If asset url (e.g. https://opensea.io/assets/base/0xbfdb5d8d1856b8617f1881fd718580256fa8cf35/13354)
  else if (url.match(/https:\/\/opensea\.io\/assets\/.*/)) {
    return await fallbackUrlHandler(url);
  }
}

async function fallbackUrlHandler(url: string): Promise<UrlMetadata> {
  const ogExtension = `data.ethProperty.selectorAll=meta%5Bproperty%5E%3D%22eth%3A%22%5D&data.ethProperty.attr=property&data.ethContent.selectorAll=meta%5Bproperty%5E%3D%22eth%3A%22%5D&data.ethContent.attr=content&data.ethContent.type=string`;
  const response = await fetch(
    // To self host, use https://github.com/microlinkhq/metascraper
    `https://api.microlink.io/?url=${encodeURIComponent(url)}&${ogExtension}`
  );
  const { data } = await response.json();

  const urlMetadata: UrlMetadata = {
    image: data.image
      ? {
          url: data.image.url,
          width: data.image.width,
          height: data.image.height,
        }
      : undefined,
    description: data.description,
    alt: data.alt,
    title: data.title,
    publisher: data.publisher,
    logo: data.logo
      ? {
          url: data.logo.url,
        }
      : undefined,
  };

  // Zip opengraph extension data into a single object
  // https://warpcast.notion.site/NFT-extended-open-graph-5a64ca22d2374f99832bc4b91c386c46
  if (data.ethProperty && data.ethContent) {
    const ethData = {};
    for (let i = 0; i < data.ethProperty.length; i++) {
      ethData[data.ethProperty[i]] = data.ethContent[i];
    }

    // Resolve farcaster user profile
    let user = null;
    if (ethData["eth:nft:creator_address"]) {
      user = await fetchUserData(ethData["eth:nft:creator_address"]);
    }

    const nftMetadata: NFTMetadata = {
      collectionName: ethData["eth:nft:collection"] || "",
      contractAddress: ethData["eth:nft:contract_address"] || "",
      creatorAddress: ethData["eth:nft:creator_address"] || "",
      mediaUrl: ethData["eth:nft:media_url"] || urlMetadata.image.url || "",
      chain: ethData["eth:nft:chain"] || ethData["nft:chain"] || "ethereum",
      collection: {
        id: "", // TODO: Need to fetch or define how this is determined
        name: ethData["eth:nft:collection"] || "",
        description: "", // TODO: Need to fetch or define how this is determined
        itemCount: Number(ethData["eth:nft:mint_count"]) || 0,
        ownerCount: 0, // TODO: Need to fetch or define how this is determined
        imageUrl: urlMetadata.image.url || "",
        mintUrl: ethData["eth:nft:mint_url"] || url,
      },
      creator: user
        ? {
            fid: user.fid,
            username: user.username,
            displayName: user.displayName,
            pfp: {
              url: user.pfp.url,
            },
          }
        : undefined,
    };
    urlMetadata.nft = nftMetadata;
  }

  return urlMetadata;
}

export async function GET(request: NextRequest) {
  try {
    const urlHandlers: {
      matchers: string[];
      handler: (url: string) => Promise<UrlMetadata>;
    }[] = [
      {
        // Opensea regex
        matchers: [
          "https://opensea.io/assets/.*",
          "https://opensea.io/collection/.*",
        ],
        handler: handleOpenSeaUrl,
      },
      // Fallback handler
      {
        matchers: [".*"],
        handler: fallbackUrlHandler,
      },
    ];

    const url = decodeURIComponent(request.nextUrl.searchParams.get("url"));

    let urlMetadata: UrlMetadata | null = null;
    for (const { matchers, handler } of urlHandlers) {
      if (matchers.some((matcher) => url.match(matcher))) {
        urlMetadata = await handler(url);
        break;
      }
    }

    return NextResponse.json(urlMetadata);
  } catch (err) {
    // console.error(err);
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: err.status }
    );
  }
}
