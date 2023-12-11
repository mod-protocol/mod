import { NextRequest, NextResponse } from "next/server";
import { PremintAPI, PremintResponse } from "@zoralabs/premint-sdk";
import { zora } from "viem/chains";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { NFTStorage } from "nft.storage";

const { NFT_STORAGE_API_KEY } = process.env;

async function storeImage({
  image,
  name = "Untitled",
  description = `Uploaded on ${new Date().toISOString()}`,
}: {
  image: Blob;
  name?: string;
  description?: string;
}) {
  const nft = {
    image, // use image Blob as `image` field
    name: name,
    description: description,
  };

  const client = new NFTStorage({ token: NFT_STORAGE_API_KEY });
  const metadata = await client.store(nft);

  return metadata.url;
}

export async function POST(request: NextRequest) {
  const requestData = (await request.json()) as {
    // Required
    creator: {
      address: `0x${string}`;
    };
    imageData: string;
    // Optional
    title: string | undefined;
    description: string | undefined;
    signature: string | undefined;
    collection: PremintResponse["collection"] | undefined;
    chain_name: string | undefined;
  };
  const {
    title: prefilledTitle,
    description: prefilledDescription,
    creator,
    imageData,
    signature,
    collection: prefilledCollection,
  } = requestData;

  // Upload to NFT.storage // TODO: Detect mime type
  const [dataPrefix, b64data] = imageData.split(",");
  const mimeType = dataPrefix.split(";")[0].split(":")[1];
  const imageBlob = new Blob([Buffer.from(b64data, "base64")], {
    type: mimeType,
  });

  const timeString = new Date().toISOString();
  const title = prefilledTitle || `Zora Create Mod - ${timeString}`;
  const description =
    prefilledDescription ||
    `This digital collectible was created using the Zora Create Mod.`;

  const tokenMetadataURI = await storeImage({
    image: imageBlob,
    name: title,
    description: description,
  });

  // Upload to zora
  const premintAPI = new PremintAPI(zora);

  const adminAccount = privateKeyToAccount(
    process.env.ZORA_ADMIN_PRIVATE_KEY as `0x${string}`
  );
  const contractAdminWallet = createWalletClient({
    chain: zora,
    account: adminAccount,
    transport: http(),
  });

  // TODO: If signature and sufficient data is present, just submit data to Zora API
  if (!signature) {
    // TODO: Custom collection metadata
    const collection: PremintResponse["collection"] = {
      contractAdmin: adminAccount.address,
      contractName: title,
      // Collection metadata same as token metadata
      contractURI: tokenMetadataURI,
      ...prefilledCollection,
    };

    const premint = await premintAPI.createPremint({
      checkSignature: true,
      collection,
      account: contractAdminWallet.account.address,
      walletClient: contractAdminWallet,
      token: {
        tokenURI: tokenMetadataURI,
        royaltyRecipient: creator.address,
      },
    });

    return NextResponse.json({ url: premint.zoraUrl });
  } else {
    return NextResponse.json({ message: "Not implemented" }, { status: 400 });
  }
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json({});
};
