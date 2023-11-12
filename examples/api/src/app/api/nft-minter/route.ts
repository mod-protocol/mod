import { createClient, reservoirChains } from "@reservoir0x/reservoir-sdk";
import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http } from "viem";
import * as viemChains from "viem/chains";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const taker = searchParams.get("taker");
    const itemId = searchParams.get("itemId"); // CAIP-19 ID
    const referrer = searchParams.get("referrer") || undefined;

    // Extract contract, type, and chain ID from itemId
    // e.g. chain://eip155:1/erc721:0xa723a8a69d9b8cf0bc93b92f9cb41532c1a27f8f/11
    // e.g. chain://eip155:7777777/erc1155:0xd4fbb6ee19708983b4a2ba7e6e627b94da690a3e/1
    // e.g. chain://eip155:8453/erc721:0x029B142Fe0cEb2e50e02C319647CE9A7657c2B59
    // e.g. chain://eip155:1/erc721:0x87C9ffD26ADe3fDAEf35cddB8c1ff86B6355a263 (allowlist)
    // e.g. chain://eip155:10/erc721:0xEc5cF8551C812A9fa2DDF3B0741AEeF72314B25d
    // e.g. chain://eip155:7777777/erc1155:0x4afa7992f876225cda4d503d0d1a3125348ce35b/1
    const [, , prefixAndChainId, prefixAndContractAddress, tokenId] =
      itemId.split("/");

    let [, chainId] = prefixAndChainId.split(":");
    const [type, contractAddress] = prefixAndContractAddress.split(":");

    let buyTokenPartial: { token?: string; collection?: string };
    if (type === "erc721") {
      buyTokenPartial = { collection: contractAddress };
    } else if (type === "erc1155") {
      buyTokenPartial = { token: `${contractAddress}:${tokenId}` };
    }

    const reservoirChain = [...Object.values(reservoirChains)].find(
      (chain) => chain.id === parseInt(chainId)
    );

    const viemChain: viemChains.Chain = [...Object.values(viemChains)].find(
      (chain) => chain.id === parseInt(chainId)
    );

    if (!reservoirChain) {
      throw new Error("Unsupported chain");
    }

    // Create reservoir client with applicable chain
    const reservoirClient = createClient({
      chains: [{ ...reservoirChain, active: true }],
    });

    const wallet = createWalletClient({
      account: taker as `0x${string}`,
      transport: http(),
      chain: viemChain,
    });

    const res = await reservoirClient.actions.buyToken({
      items: [{ ...buyTokenPartial, quantity: 1, fillType: "mint" }],
      options: {
        referrer,
      },
      wallet,
      precheck: true,
      onProgress: () => void 0,
    });

    if (res === true) {
      return NextResponse.json(res);
    }

    const mintTx = res.steps.find((step) => step.id === "sale").items[0];

    return NextResponse.json({
      ...mintTx,
      chainId,
      explorer: viemChain.blockExplorers.default,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err.response?.data?.message || err.message },
      { status: err.status ?? 400 }
    );
  }
}
