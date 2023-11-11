import { NextRequest, NextResponse } from "next/server";
import LitJsSdk from "@lit-protocol/lit-node-client-nodejs";

const { INFURA_API_KEY, INFURA_API_SECRET } = process.env;

export async function POST(request: NextRequest) {
  try {
    const {
      // await signAuthMessage();
      authSig,
      messageToEncrypt,
      chain = "ethereum",
      // https://developer.litprotocol.com/v3/sdk/access-control/evm/basic-examples#must-be-a-member-of-a-dao-molochdaov21-also-supports-daohaus
      // https://lit-share-modal-v3-playground.netlify.app/
      tokens = "1",
      contract,
    } = await request.json();

    const accessControlConditions = [
      {
        conditionType: "evmBasic" as const,
        contractAddress: contract,
        // FIXME: 20, 1155 or 721
        standardContractType: "ERC721",
        chain: chain,
        method: "balanceOf",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: ">=",
          value: tokens,
        },
      },
    ];

    const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({});

    await litNodeClient.connect();

    // 1. Encryption
    // <Blob> encryptedString
    // <Uint8Array(32)> symmetricKey
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      messageToEncrypt
    );

    // 2. Saving the Encrypted Content to the Lit Nodes
    // <Unit8Array> encryptedSymmetricKey
    const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    const contentString = JSON.stringify({
      encryptedString: await encryptedString.text(),
      encryptedSymmetricKey,
      chain,
      accessControlConditions,
      id: "lit-v3",
    });
    const bytes = new TextEncoder().encode(contentString);
    const blob = new Blob([bytes], {
      type: "application/json;charset=utf-8",
    });

    // Store metadata on IPFS
    const ipfsUploadRequest: Response | null = await fetch(
      "https://ipfs.infura.io:5001/api/v0/add",
      {
        method: "POST",
        body: blob,
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(INFURA_API_KEY + ":" + INFURA_API_SECRET).toString(
              "base64"
            ),
        },
      }
    );

    const ipfsUploadRequestJson = await ipfsUploadRequest.json();

    return NextResponse.json({
      data: {
        url: `https://cast.fun/FIP-1/${encodeURIComponent(
          `https://discove.infura-ipfs.io/ipfs/${ipfsUploadRequestJson.Hash}`
        )}`,
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(null, {
      status: 500,
    });
  }
}
