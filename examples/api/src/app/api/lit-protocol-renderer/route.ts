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

// async function retrieveFromIrys(id: string) {
//   const gatewayAddress = "https://gateway.irys.xyz/";
//   const url = `${gatewayAddress}${id}`;

//   try {
//     const response = await fetch(url);

//     if (!response.ok) {
//       throw new Error(`Failed to retrieve data for ID: ${id}`);
//     }

//     const data = await response.json();
//     return [
//       data.cipherText,
//       data.dataToEncryptHash,
//       data.accessControlConditions,
//     ];
//   } catch (e) {
//     console.log("Error retrieving data ", e);
//   }
// }

export async function POST(request: NextRequest) {
  // const { authSig, irysTransactionId } = await request.json();

  // const [
  //   cipherTextRetrieved,
  //   dataToEncryptHashRetrieved,
  //   accessControlConditions,
  // ] = await retrieveFromIrys(irysTransactionId);

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
