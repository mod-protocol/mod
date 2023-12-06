import { NextRequest, NextResponse } from "next/server";
import Irys from "@irys/sdk";
import { generatePrivateKey } from "viem/accounts";
import { textToImage } from "./text-to-image";

const { NEXT_PUBLIC_IMGUR_CLIENT_ID } = process.env;

const uploadToImgur = async (file: Blob): Promise<string | null> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", "file");
  const response = await fetch("https://api.imgur.com/3/upload", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${NEXT_PUBLIC_IMGUR_CLIENT_ID}`,
    },
    body: formData,
  });

  const { data, error } = await response.json();

  if (!response.ok) {
    console.error(response.status, response.statusText, error, data);
    return null;
  }

  if (!data) return null;

  return data.link;
};

function createSchemaMetadata(
  imageUrl: string,
  payload: {
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
    endDate: string;
  }
) {
  return {
    "@context": ["https://schema.org", "https://schema.modprotocol.org"],
    "@type": "WebPage",
    name: "Reply to this Cast to participate in the Poll",
    image: imageUrl,
    description:
      // Warpcast shows 176 characters in the description on desktop, and 0 on mobile.
      "Your Farcaster app doesn't support Mods yet, but if it did, you'd be able to vote with one click & see tallied results",
    "mod:model": {
      // unique identifier for the renderer of this miniapp
      "@type": "schema.modprotocol.org/create-poll/0.0.1/Poll",
      payload,
    },
  };
}

async function getIrys() {
  const key = generatePrivateKey();

  const irys = new Irys({
    url: "https://node2.irys.xyz",
    token: "matic",
    // under 100kb is free, so will be free
    key: key,
    config: { providerUrl: "https://polygon-mainnet.infura.io" },
  });

  return irys;
}

async function storeOnIrys(jsonPayload: object): Promise<string | null> {
  const irys = await getIrys();

  try {
    const receipt = await irys.upload(JSON.stringify(jsonPayload), {
      tags: [{ name: "Content-Type", value: "application/json" }],
    });

    return receipt.id;
  } catch (e) {
    console.log("Error uploading data ", e);
    return null;
  }
}

// take a poll object, generate image, store in irys, return a gateway url
export async function POST(request: NextRequest) {
  try {
    const { choice1, choice2, choice3, choice4, days, hours, minutes } =
      await request.json();

    // calculate endDate
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    endDate.setTime(
      endDate.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000
    );

    // generate image
    const text = `1. ${choice1}
2. ${choice2}${choice3 ? `\n3. ${choice3}` : ""}${
      choice3 ? `\n4. ${choice4}` : ""
    }

Poll ends on ${endDate.toUTCString()}
`;
    const imageBuffer = await textToImage({ text });
    // const imageBuffer = new Buffer([]);

    // upload image to imgur
    const imageUrl = await uploadToImgur(new Blob([imageBuffer]));

    // create schema
    const schema = createSchemaMetadata(imageUrl, {
      choice1,
      choice2,
      choice3,
      choice4,
      endDate: endDate.toISOString(),
    });

    // store with irys
    const irysTransactionId = await storeOnIrys(schema);

    if (!irysTransactionId) {
      return new Response(null, {
        status: 500,
      });
    }

    return NextResponse.json({
      url: `${process.env.GATEWAY_URL}/f/embed/${encodeURIComponent(
        // https://github.com/ChainAgnostic/namespaces/blob/main/arweave/caip2.md
        `arweave:7wIU:${irysTransactionId}`
        // `https://gateway.irys.xyz/${irysTransactionId}`
      )}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        message: err.message,
      },
      {
        status: 500,
        statusText: err.message,
      }
    );
  }
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  // Return Response
  return NextResponse.json({});
};
