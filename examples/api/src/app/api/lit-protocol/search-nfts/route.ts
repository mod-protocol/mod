import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<Array<{ value: any; label: string }>>> {
  const wallet_address = request.nextUrl.searchParams.get("wallet_address");
  const q = request.nextUrl.searchParams.get("q") || "";

  // paginate over all of them
  let hasNext = true;
  const allResults: any[] = [];
  let query = `https://api.simplehash.com/api/v0/nfts/owners?chains=polygon,ethereum,optimism&wallet_addresses=${wallet_address}&limit=50`;
  while (hasNext) {
    const response = await fetch(query, {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-KEY": process.env.SIMPLEHASH_API_KEY,
      },
    })
      .then((response) => response.json())
      .catch((err) => console.error(err));

    allResults.push(...response.nfts);
    if (response.next) {
      query = response.next;
    } else {
      hasNext = false;
    }
  }

  // todo: remove spam tokens
  return NextResponse.json(
    allResults
      .filter((nft) =>
        nft?.contract?.name?.toLowerCase().includes(q?.toLowerCase())
      )
      .map((nft) => ({
        label: nft.contract.name,
        value: {
          contract_type: nft.contract.type,
          chain: nft.chain,
          contract_address: nft.contract_address,
          image: nft.previews.image_small_url,
          description: nft.description,
        },
      }))
  );
}
