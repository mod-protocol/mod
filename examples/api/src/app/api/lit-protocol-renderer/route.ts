import { NextRequest, NextResponse } from "next/server";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

async function getLitNodeClient() {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "cayenne",
  });
  await litNodeClient.connect();

  return litNodeClient;
}

async function decryptData({
  authSig,
  ciphertext,
  dataToEncryptHash,
  accessControlConditions,
}): Promise<null | string> {
  const litNodeClient = await getLitNodeClient();

  let decryptedString;
  try {
    decryptedString = await LitJsSdk.decryptToString(
      {
        authSig,
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        // FIXME
        chain: "ethereum",
      },
      litNodeClient
    );
  } catch (e) {
    console.error(e);
    return null;
  }

  return decryptedString;
}

export async function POST(request: NextRequest) {
  const {
    authSig,
    payload: {
      cipherTextRetrieved,
      dataToEncryptHashRetrieved,
      accessControlConditions,
    },
  } = await request.json();

  // 4. Decrypt data
  const decryptedString = await decryptData({
    ciphertext: cipherTextRetrieved,
    authSig: { ...authSig, derivedVia: "web3.eth.personal.sign" },
    dataToEncryptHash: dataToEncryptHashRetrieved,
    accessControlConditions,
  });

  if (decryptedString === null) {
    return NextResponse.json(
      {
        message: "An unknown error occurred",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    decryptedString: "",
  });
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  return NextResponse.json({});
};
