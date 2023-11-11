export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";
import { NFTMetadata, UrlMetadata } from "@mod-protocol/core";
import { db } from "../lib/db";
import { chainById } from "../lib/chain-index";

export async function POST(request: NextRequest) {
  try {
    const urls = await request.json();

    // todo: consider normalizing urls here? currently clients are responsible for doing this.

    // Fetch metadata for each url
    const metadata = await db
      .selectFrom("url_metadata")
      .where("url_metadata.url", "in", urls)
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
      let nftMetadata: NFTMetadata | undefined;

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

      const urlMetadata: UrlMetadata = {
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
        url: row.url,
        urlMetadata,
      };
    });

    const metadataByUrl: {
      [key: string]: {
        urlMetadata: UrlMetadata;
      }[];
    } = rowsFormatted.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.url]: cur.urlMetadata,
      };
    }, {});

    return NextResponse.json(metadataByUrl);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: err.status });
  }
}
