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
      .select([
        /* Select all columns with aliases to prevent collisions */

        // URL metadata
        "url_metadata.image_url as url_image_url",
        "url_metadata.image_height as url_image_height",
        "url_metadata.image_width as url_image_width",
        "url_metadata.alt as url_alt",
        "url_metadata.url as url_url",
        "url_metadata.description as url_description",
        "url_metadata.title as url_title",
        "url_metadata.publisher as url_publisher",
        "url_metadata.logo_url as url_logo_url",
        "url_metadata.mime_type as url_mime_type",
        "url_metadata.nft_collection_id as nft_collection_id",
        "url_metadata.nft_metadata_id as nft_metadata_id",
        "url_metadata.custom_open_graph as url_custom_open_graph",

        // NFT Collection metadata
        "nft_collections.creator_address as collection_creator_address",
        "nft_collections.description as collection_description",
        "nft_collections.image_url as collection_image_url",
        "nft_collections.item_count as collection_item_count",
        "nft_collections.mint_url as collection_mint_url",
        "nft_collections.name as collection_name",
        "nft_collections.open_sea_url as collection_open_sea_url",
        "nft_collections.owner_count as collection_owner_count",
        "nft_collections.creator_fid as collection_creator_fid",

        // NFT metadata
        "nft_metadata.token_id as nft_token_id",
        "nft_metadata.media_url as nft_media_url",
      ])
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
          mediaUrl: row.nft_media_url || undefined,
          tokenId: row.nft_token_id || undefined,
          collection: {
            chain: chain.network,
            contractAddress,
            creatorAddress: row.collection_creator_address,
            description: row.collection_description,
            id: row.nft_collection_id,
            imageUrl: row.collection_image_url,
            itemCount: row.collection_item_count,
            mintUrl: row.collection_mint_url,
            name: row.collection_name,
            openSeaUrl: row.collection_open_sea_url || undefined,
            ownerCount: row.collection_owner_count || undefined,
            creator: undefined, // TODO: Look up farcaster user by FID
          },
        };
      }

      const urlMetadata: UrlMetadata = {
        image: row.url_image_url
          ? {
              url: row.url_image_url,
              height: row.url_image_height || undefined,
              width: row.url_image_width || undefined,
            }
          : undefined,
        alt: row.url_alt || undefined,
        description: row.url_description || undefined,
        title: row.url_title || undefined,
        publisher: row.url_publisher || undefined,
        logo: row.url_logo_url ? { url: row.url_logo_url } : undefined,
        mimeType: row.url_mime_type || undefined,
        nft: nftMetadata,
        customOpenGraph: (row.url_custom_open_graph || undefined) as
          | any
          | undefined,
      };

      return {
        url: row.url_url,
        urlMetadata,
      };
    });

    const metadataByUrl: {
      [key: string]: UrlMetadata;
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

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json({});
};
