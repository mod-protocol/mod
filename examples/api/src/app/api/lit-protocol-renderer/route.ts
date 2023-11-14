import { NextRequest, NextResponse } from "next/server";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

async function getLitNodeClient() {
  // Initialize LitNodeClient
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
}) {
  const litNodeClient = await getLitNodeClient();

  let decryptedString;
  try {
    decryptedString = await LitJsSdk.decryptToString(
      {
        authSig,
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        chain: "ethereum",
      },
      litNodeClient
    );
  } catch (e) {
    console.log(e);
  }

  return decryptedString;
}

async function retrieveFromIrys(id: string) {
  const gatewayAddress = "https://gateway.irys.xyz/";
  const url = `${gatewayAddress}${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to retrieve data for ID: ${id}`);
    }

    const data = await response.json();
    return [
      data.cipherText,
      data.dataToEncryptHash,
      data.accessControlConditions,
    ];
  } catch (e) {
    console.log("Error retrieving data ", e);
  }
}

export async function POST(request: NextRequest) {
  const { authSig, irysTransactionId } = await request.json();

  const [
    cipherTextRetrieved,
    dataToEncryptHashRetrieved,
    accessControlConditions,
  ] = await retrieveFromIrys(irysTransactionId);

  // 4. Decrypt data
  const decryptedString = await decryptData({
    ciphertext: cipherTextRetrieved,
    authSig,
    dataToEncryptHash: dataToEncryptHashRetrieved,
    accessControlConditions,
  });

  return NextResponse.json({
    decryptedString,
  });
}
