import { FarcasterUser } from "@mod-protocol/core";
import { Protocol } from "@uniswap/router-sdk";
import { Percent, Token, TradeType } from "@uniswap/sdk-core";
import {
  AlphaRouter,
  AlphaRouterConfig,
  CurrencyAmount,
  SwapOptions,
  SwapType,
  nativeOnChain,
} from "@uniswap/smart-order-router";
import { ethers } from "ethers";
import JSBI from "jsbi";
import { NextRequest } from "next/server";
import { publicActionReverseMirage } from "reverse-mirage";
import { createPublicClient, http } from "viem2";
import * as chains from "viem2/chains";

export function numberWithCommas(x: string | number) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export async function getFollowingHolderInfo({
  fid,
  tokenAddress,
  blockchain,
}: {
  fid: string;
  tokenAddress: string;
  blockchain: string;
}): Promise<{
  holders: { user: FarcasterUser; amount: number }[];
  holdersCount: number;
}> {
  const { ERC_20_AIRSTACK_API_KEY } = process.env;
  const AIRSTACK_API_URL = "https://api.airstack.xyz/gql";
  const airstackQuery = `
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
          Authorization: ERC_20_AIRSTACK_API_KEY, // Add API key to Authorization header
        },
        body: JSON.stringify({
          query: airstackQuery,
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
        (item) => item.followingAddress.tokenBalances?.length > 0
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

  return { holders: result, holdersCount: result.length };
}

export async function getPriceData({
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
      change24hNumber > 0 ? `+${change24hPartial}%` : `-${-change24hPartial}%`;

    return {
      unitPriceUsd: unitPriceUsdFormatted,
      marketCapUsd: marketCapUsdFormatted,
      volume24hUsd: volume24hUsdFormatted,
      change24h: change24hFormatted,
    };
  }

  // Use on-chain data as fallback
  // TODO: Query uniswap contracts directly
  const chain = chainByName[blockchain.toLowerCase()];
  const url = `https://api.1inch.dev/price/v1.1/${chain.id}/${tokenAddress}?currency=USD`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env["ERC_20_1INCH_API_KEY"]}`,
    },
  });
  const resJson = await res.json();

  return {
    unitPriceUsd: parseFloat(resJson[tokenAddress]).toPrecision(4),
  };
}

export async function getTokenInfo({
  tokenAddress,
  blockchain,
}: {
  tokenAddress: string;
  blockchain: string;
}): Promise<{
  symbol: string;
  name: string;
  url: string;
  image?: string;
}> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${blockchain}/contract/${tokenAddress}`
  );

  if (res.ok) {
    const json = await res?.json();
    return {
      symbol: json.symbol.toUpperCase(),
      name: json.name,
      image: json.image?.small,
      url: `https://www.coingecko.com/en/coins/${json.id}`,
    };
  }

  // Use on-chain data as fallback
  const chain = chainByName[blockchain];
  const client = createPublicClient({
    transport: http(),
    chain,
  }).extend(publicActionReverseMirage);

  const token = await client.getERC20({
    erc20: {
      address: tokenAddress as `0x${string}`,
      chainID: chain.id,
    },
  });

  return {
    symbol: token.symbol.toUpperCase(),
    name: token.name,
    url: `https://app.uniswap.org/tokens/${blockchain}/${tokenAddress}`,
  };
}
export const chainByName: { [key: string]: chains.Chain } = Object.entries(
  chains
).reduce(
  (acc: { [key: string]: chains.Chain }, [key, chain]) => {
    acc[key] = chain;
    return acc;
  },
  { ethereum: chains.mainnet } // Convenience for ethereum, which is 'homestead' otherwise
);

export function parseTokenParam(tokenParam: string) {
  let tokenAddress: string;
  let blockchain: string;

  // Splitting the string at '/erc20:'
  const parts = tokenParam.split("/erc20:");

  // Extracting the chain ID
  const chainIdPart = parts[0];
  const chainId = chainIdPart.split(":")[1];

  // The token address is the second part of the split, but without '0x' if present
  tokenAddress = parts[1];

  const [blockchainName] = Object.entries(chainByName).find(
    ([, value]) => value.id.toString() == chainId
  );
  blockchain = blockchainName;

  return {
    tokenAddress,
    blockchain,
  };
}

export async function getEthUsdPrice(): Promise<number> {
  const client = createPublicClient({
    transport: http(),
    chain: chains.mainnet,
  });

  // roundId uint80, answer int256, startedAt uint256, updatedAt uint256, answeredInRound uint80
  const [, answer] = await client.readContract({
    abi: [
      {
        inputs: [],
        name: "latestRoundData",
        outputs: [
          { internalType: "uint80", name: "roundId", type: "uint80" },
          { internalType: "int256", name: "answer", type: "int256" },
          { internalType: "uint256", name: "startedAt", type: "uint256" },
          { internalType: "uint256", name: "updatedAt", type: "uint256" },
          { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "latestRoundData",
    // https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1&search=usdc#ethereum-mainnet
    address: "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4",
  });

  const ethPriceUsd = (1 / Number(answer)) * 1e18;

  return ethPriceUsd;
}

export async function getSwapTransaction({
  outTokenAddress,
  blockchain,
  ethInputAmountFormatted,
  recipientAddress,
  feeRecipientAddress,
  feePercentageInt,
}: {
  outTokenAddress: string;
  blockchain: string;
  ethInputAmountFormatted: string;
  recipientAddress: string;
  feePercentageInt?: number;
  feeRecipientAddress?: string;
}) {
  const tokenOut = await getUniswapToken({
    tokenAddress: outTokenAddress,
    blockchain,
  });
  const chain = chainByName[blockchain];
  const provider = new ethers.providers.JsonRpcProvider(
    chain.rpcUrls.default.http[0]
  );

  const router = new AlphaRouter({
    chainId: chain.id,
    provider,
  });

  const tokenIn = nativeOnChain(chain.id);
  const amountIn = CurrencyAmount.fromRawAmount(
    tokenIn,
    JSBI.BigInt(
      ethers.utils.parseUnits(ethInputAmountFormatted, tokenIn.decimals)
    )
  );

  let swapOptions: SwapOptions = {
    type: SwapType.UNIVERSAL_ROUTER,
    recipient: recipientAddress,
    slippageTolerance: new Percent(5, 100),
    deadlineOrPreviousBlockhash: parseDeadline("360"),
    fee:
      feeRecipientAddress && feePercentageInt
        ? {
            fee: new Percent(feePercentageInt, 100),
            recipient: feeRecipientAddress,
          }
        : undefined,
  };

  const partialRoutingConfig: Partial<AlphaRouterConfig> = {
    protocols: [Protocol.V2, Protocol.V3],
  };

  const quote = await router.route(
    amountIn,
    tokenOut,
    TradeType.EXACT_INPUT,
    swapOptions,
    partialRoutingConfig
  );

  if (!quote) return;
  return quote;
}

async function getUniswapToken({
  tokenAddress,
  blockchain,
}: {
  tokenAddress: string;
  blockchain: string;
}): Promise<Token> {
  const chain = chainByName[blockchain];
  const client = createPublicClient({
    transport: http(),
    chain,
  }).extend(publicActionReverseMirage);

  const token = await client.getERC20({
    erc20: {
      address: tokenAddress as `0x${string}`,
      chainID: chain.id,
    },
  });

  const uniswapToken = new Token(
    chain.id,
    tokenAddress,
    token.decimals,
    token.symbol,
    token.name
  );

  return uniswapToken;
}

function parseDeadline(deadline: string): number {
  return Math.floor(Date.now() / 1000) + parseInt(deadline);
}

export function parseInfoRequestParams(request: NextRequest) {
  const fid = request.nextUrl.searchParams.get("fid");
  const token = request.nextUrl.searchParams.get("token")?.toLowerCase();
  let tokenAddress = request.nextUrl.searchParams
    .get("tokenAddress")
    ?.toLowerCase();
  let blockchain = request.nextUrl.searchParams
    .get("blockchain")
    ?.toLowerCase();

  if (token) {
    const parsedToken = parseTokenParam(token);
    tokenAddress = parsedToken.tokenAddress;
    blockchain = parsedToken.blockchain;
  }

  return {
    fid,
    tokenAddress,
    blockchain,
  };
}
