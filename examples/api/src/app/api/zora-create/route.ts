import { createPremintClient } from "@zoralabs/protocol-sdk";
import { NextRequest, NextResponse } from "next/server";
import { NFTStorage } from "nft.storage";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { zora } from "viem/chains";

const { NFT_STORAGE_API_KEY } = process.env;

function formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const nthNumber = (number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${nthNumber(day)} ${month}, ${year}`;
}

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
  };
  const {
    title: prefilledTitle,
    description: prefilledDescription,
    creator,
    imageData,
  } = requestData;

  const [dataPrefix, b64data] = imageData.split(",");
  const mimeType = dataPrefix.split(";")[0].split(":")[1];
  const imageBlob = new Blob([Buffer.from(b64data, "base64")], {
    type: mimeType,
  });

  const timeString = formatDate(new Date());
  const title = prefilledTitle || `Untitled - ${timeString}`;
  const description =
    prefilledDescription ||
    `This digital collectible was created using the Zora Create Mod.`;

  const tokenMetadataURI = await storeImage({
    image: imageBlob,
    name: title,
    description: description,
  });
  const adminAccount = privateKeyToAccount(
    process.env.ZORA_ADMIN_PRIVATE_KEY as `0x${string}`
  );

  const contractAdminWallet = createWalletClient({
    chain: zora,
    account: adminAccount,
    transport: http(),
  });

  // Upload to zora
  const premintClient = createPremintClient({
    chain: zora,
  });

  const collection = {
    contractAdmin: adminAccount.address,
    contractName: title,
    // Collection metadata same as token metadata
    contractURI: tokenMetadataURI,
  };

  const premint = await premintClient.createPremint({
    checkSignature: true,
    collection,
    creatorAccount: contractAdminWallet.account.address,
    walletClient: contractAdminWallet,
    tokenCreationConfig: {
      tokenURI: tokenMetadataURI,
      royaltyRecipient: creator.address,
    },
  });

  return NextResponse.json({ url: premint.urls.zoraCollect });
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json({});
};
