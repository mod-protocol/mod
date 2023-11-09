export const dynamic = "force-dynamic";
// export const runtime = "edge";

import { NextResponse, NextRequest } from "next/server";
// import { NFTMetadata, UrlMetadata } from "@mod-protocol/core";
import { db } from "./lib/db";
import { chainById } from "./lib/chain-index";

export async function POST(request: NextRequest) {
  try {
    // Get casts IDs from request body
    const casts = await request.json();

    // Normalize casts hashes by removing leading 0x
    const castHashBuffers = casts.map((hash: string) =>
      Buffer.from(hash.startsWith("0x") ? hash.slice(2) : hash, "hex")
    );

    // Fetch metadata for each cast
    const metadata = await db
      .selectFrom("casts")
      .where("casts.hash", "in", castHashBuffers)
      .fullJoin("cast_embed_urls", "casts.hash", "cast_embed_urls.cast_hash")
      .leftJoin("url_metadata", "url_metadata.url", "cast_embed_urls.url")
      .leftJoin(
        "nft_metadata",
        "nft_metadata.id",
        "url_metadata.nft_metadata_id"
      )
      .leftJoin(
        "nft_collections",
        "url_metadata.nft_collection_id",
        "nft_collections.id"
      )
      .selectAll()
      .execute();

    const rowsFormatted = metadata.map((row) => {
      let nftMetadata: any | undefined;

      if (row.nft_collection_id) {
        const [, , prefixAndChainId, prefixAndContractAddress, tokenId] =
          row.nft_collection_id.split("/");

        const [, chainId] = prefixAndChainId.split(":");
        const [, contractAddress] = prefixAndContractAddress.split(":");

        const chain = chainById[chainId];

        nftMetadata = {
          mediaUrl: row.media_url || undefined,
          tokenId: row.token_id || undefined,
          collection: {
            chain: chain.network,
            contractAddress,
            creatorAddress: row.creator_address,
            description: row.description,
            id: row.nft_collection_id,
            imageUrl: row.image_url,
            itemCount: row.item_count,
            mintUrl: row.mint_url,
            name: row.name,
            openSeaUrl: row.open_sea_url || undefined,
            ownerCount: row.owner_count || undefined,
            creator: undefined, // TODO: Look up farcaster user by FID
          },
        };
      }

      const urlMetadata: any = {
        image: row.image_url
          ? {
              url: row.image_url,
              height: row.image_height || undefined,
              width: row.image_width || undefined,
            }
          : undefined,
        alt: row.alt || undefined,
        description: row.description || undefined,
        title: row.title || undefined,
        publisher: row.publisher || undefined,
        logo: row.logo_url ? { url: row.logo_url } : undefined,
        mimeType: row.mime_type || undefined,
        nft: nftMetadata,
      };

      return {
        castHash: `0x${row.hash.toString("hex").toLowerCase()}`,
        url: row.unnormalized_url,
        normalizedUrl: row.url,
        index: row.index,
        urlMetadata,
      };
    });

    const metadataByCastHash: {
      [key: string]: {
        castHash: string;
        url: string;
        normalizedUrl: string;
        index: number;
        urlMetadata: any;
      }[];
    } = rowsFormatted.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.castHash]: [...(acc[cur.castHash] || []), cur].sort(
          (a, b) => a.index - b.index
        ),
      };
    }, {});

    return NextResponse.json(metadataByCastHash);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: err.status });
  }
}
