import { FarcasterUser } from "@mod-protocol/core";
import { Token } from "@uniswap/sdk-core";
import * as smartOrderRouter from "@uniswap/smart-order-router";
import { USDC_BASE } from "@uniswap/smart-order-router";
import { NextRequest, NextResponse } from "next/server";
import { publicActionReverseMirage, priceQuote } from "reverse-mirage";
import { PublicClient, createClient, http, parseUnits } from "viem2";
import * as chains from "viem2/chains";

const { AIRSTACK_API_KEY } = process.env;
const AIRSTACK_API_URL = "https://api.airstack.xyz/gql";

const chainByName: { [key: string]: chains.Chain } = Object.entries(
  chains
).reduce(
  (acc: { [key: string]: chains.Chain }, [key, chain]) => {
    acc[key] = chain;
    return acc;
  },
  { ethereum: chains.mainnet } // Convenience for ethereum, which is 'homestead' otherwise
);

const chainById = Object.values(chains).reduce(
  (acc: { [key: number]: chains.Chain }, cur) => {
    if (cur.id) acc[cur.id] = cur;
    return acc;
  },
  {}
);

function numberWithCommas(x: string | number) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

const query = `
query MyQuery($identity: Identity!, $token_address: Address!, $blockchain: TokenBlockchain, $cursor: String) {
  SocialFollowings(
    input: {
      filter: {
        identity: {_eq: $identity},
        dappName: {_eq: farcaster}
      },
      blockchain: ALL,
      limit: 200,
      cursor: $cursor
    }
  ) {
    pageInfo {
      hasNextPage
      nextCursor
    }
    Following {
      followingProfileId,
      followingAddress {
        socials {
          profileDisplayName
          profileName
          profileImage
          profileBio
        }
        tokenBalances(
          input: {
            filter: {
              tokenAddress: {_eq: $token_address},
              formattedAmount: {_gt: 0}
            },
            blockchain: $blockchain
          }
        ) {
          owner {
            identity
          }
          formattedAmount
        }
      }
    }
  }
}
`;

async function getFollowingHolderInfo({
  fid,
  tokenAddress,
  blockchain,
}: {
  fid: string;
  tokenAddress: string;
  blockchain: string;
}): Promise<{ user: FarcasterUser; amount: number }[]> {
  const acc: any[] = [];

  let hasNextPage = true;
  let cursor = "";

  try {
    while (hasNextPage) {
      hasNextPage = false;
      const res = await fetch(AIRSTACK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AIRSTACK_API_KEY, // Add API key to Authorization header
        },
        body: JSON.stringify({
          query,
          variables: {
            identity: `fc_fid:${fid}`,
            token_address: tokenAddress,
            blockchain,
            cursor,
          },
        }),
      });
      const json = await res?.json();
      const result = json?.data.SocialFollowings.Following.filter(
        (item) => item.followingAddress.tokenBalances.length > 0
      );
      acc.push(...result);

      hasNextPage = json?.data.SocialFollowings.pageInfo.hasNextPage;
      cursor = json?.data.SocialFollowings.pageInfo.nextCursor;
    }
  } catch (error) {
    console.error(error);
  }

  const result = acc
    .map((item) => {
      const socialData = item.followingAddress.socials[0];
      return {
        user: {
          displayName: socialData.profileDisplayName,
          username: socialData.profileName,
          fid: item.followingProfileId,
          pfp: socialData.profileImage,
        } as FarcasterUser,
        amount: item.followingAddress.tokenBalances[0].formattedAmount,
      };
    })
    .sort((a, b) => Number(b.amount) - Number(a.amount));

  return result;
}

async function getPriceData({
  tokenAddress,
  blockchain,
}: {
  tokenAddress: string;
  blockchain: string;
}): Promise<{
  unitPriceUsd: string;
  marketCapUsd?: string;
  volume24hUsd?: string;
  change24h?: string;
}> {
  // https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xd7c1eb0fe4a30d3b2a846c04aa6300888f087a5f&vs_currencies=usd&points&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true
  const params = new URLSearchParams({
    contract_addresses: tokenAddress,
    vs_currencies: "usd",
    include_market_cap: "true",
    include_24hr_vol: "true",
    include_24hr_change: "true",
    include_last_updated_at: "true",
  });
  const coingecko = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/${blockchain}?${params.toString()}`
  );
  const coingeckoJson = await coingecko.json();

  if (coingeckoJson[tokenAddress]) {
    const {
      usd: unitPriceUsd,
      usd_market_cap: marketCapUsd,
      usd_24h_vol: volume24hUsd,
      usd_24h_change: change24h,
    } = coingeckoJson[tokenAddress];

    const unitPriceUsdFormatted = `${numberWithCommas(
      parseFloat(unitPriceUsd).toPrecision(4)
    )}`;
    const marketCapUsdFormatted = `${parseFloat(
      parseFloat(marketCapUsd).toFixed(0)
    ).toLocaleString()}`;
    const volume24hUsdFormatted = `${parseFloat(
      parseFloat(volume24hUsd).toFixed(0)
    ).toLocaleString()}`;

    const change24hNumber = parseFloat(change24h);
    const change24hPartial = parseFloat(
      change24hNumber.toFixed(2)
    ).toLocaleString();
    const change24hFormatted =
      change24hNumber > 0 ? `+${change24hPartial}%` : `-${change24hPartial}%`;

    return {
      unitPriceUsd: unitPriceUsdFormatted,
      marketCapUsd: marketCapUsdFormatted,
      volume24hUsd: volume24hUsdFormatted,
      change24h: change24hFormatted,
    };
  }

  // Use on-chain data as fallback
  const chain = chainByName[blockchain.toLowerCase()];
  const url = `https://api.1inch.dev/price/v1.1/${chain.id}/${tokenAddress}?currency=USD`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env["1INCH_API_KEY"]}`,
    },
  });
  const resJson = await res.json();

  return {
    unitPriceUsd: parseFloat(resJson[tokenAddress]).toPrecision(4),
  };
}

async function tokenInfo({
  tokenAddress,
  blockchain,
}: {
  tokenAddress: string;
  blockchain: string;
}): Promise<{
  symbol: string;
  name: string;
  image?: string;
}> {
  //0x4ed4e862860bed51a9570b96d89af5e1b0efefed
  // https://api.coingecko.com/api/v3/coins/0x4ed4e862860bed51a9570b96d89af5e1b0efefed/market_chart?vs_currency=usd&days=1
  // https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xd7c1eb0fe4a30d3b2a846c04aa6300888f087a5f&vs_currencies=usd&points&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true
  // https://api.coingecko.com/api/v3/coins/ethereum/contract/0xd7c1eb0fe4a30d3b2a846c04aa6300888f087a5f
  // https://api.coingecko.com/api/v3/coins/base/contract/0x27d2decb4bfc9c76f0309b8e88dec3a601fe25a8
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${blockchain}/contract/${tokenAddress}`
  );

  if (res.ok) {
    const json = await res?.json();
    return {
      symbol: json.symbol,
      name: json.name,
      image: json.image?.thumb,
    };
  }

  // Use on-chain data as fallback
  const chain = chainByName[blockchain];
  const client = (
    createClient({
      transport: http(),
      chain,
    }) as PublicClient
  ).extend(publicActionReverseMirage);

  const token = await client.getERC20({
    erc20: {
      address: tokenAddress as `0x${string}`,
      chainID: chain.id,
    },
  });

  return {
    symbol: token.symbol,
    name: token.name,
  };
}

export async function GET(request: NextRequest) {
  const fid = request.nextUrl.searchParams.get("fid")?.toLowerCase();
  const token = request.nextUrl.searchParams.get("token")?.toLowerCase();
  let tokenAddress = request.nextUrl.searchParams
    .get("tokenAddress")
    ?.toLowerCase();
  let blockchain = request.nextUrl.searchParams
    .get("blockchain")
    ?.toLowerCase();

  if (token) {
    // Splitting the string at '/erc20:'
    const parts = token.split("/erc20:");

    // Extracting the chain ID
    const chainIdPart = parts[0];
    const chainId = chainIdPart.split(":")[1];

    // The token address is the second part of the split, but without '0x' if present
    tokenAddress = parts[1];

    const [blockchainName] = Object.entries(chainByName).find(
      ([, value]) => value.id.toString() == chainId
    );
    blockchain = blockchainName;
  }

  if (!tokenAddress) {
    return NextResponse.json({
      error: "Missing tokenAddress",
    });
  }

  if (!blockchain) {
    return NextResponse.json({
      error: "Missing or invalid blockchain (ethereum, polygon, base)",
    });
  }

  const [holderData, priceData, tokenData] = await Promise.all([
    getFollowingHolderInfo({
      blockchain: blockchain,
      tokenAddress: tokenAddress,
      fid: fid,
    }),
    getPriceData({
      blockchain: blockchain,
      tokenAddress: tokenAddress,
    }),
    tokenInfo({
      tokenAddress,
      blockchain,
    }),
  ]);

  return NextResponse.json({
    holderData: {
      holders: [...(holderData || [])],
      holdersCount: holderData?.length || 0,
    },
    priceData,
    tokenData,
  });
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  return NextResponse.json({});
};
