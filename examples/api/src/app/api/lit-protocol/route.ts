import { NextRequest, NextResponse } from "next/server";
import Irys from "@irys/sdk";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

/**
 * Built using the guide
 * https://developer.litprotocol.com/v3/integrations/storage/irys/
 */

async function getLitNodeClient() {
  // Initialize LitNodeClient
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: "cayenne",
  });
  await litNodeClient.connect();

  return litNodeClient;
}

function getAccessControlConditions({ chain, contract, tokens }) {
  return [
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
}

async function encryptData({
  dataToEncrypt,
  authSig,
  chain,
  contract,
  tokens,
}: {
  dataToEncrypt;
  authSig;
  chain;
  contract;
  tokens;
}) {
  const accessControlConditions = getAccessControlConditions({
    chain,
    contract,
    tokens,
  });
  const litNodeClient = await getLitNodeClient();

  // 1. Encryption
  // <Blob> encryptedString
  // <Uint8Array(32)> dataToEncryptHash`
  const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
    {
      authSig,
      accessControlConditions,
      dataToEncrypt: dataToEncrypt,
      chain: "ethereum",
    },
    litNodeClient
  );
  return { ciphertext, dataToEncryptHash, accessControlConditions };
}

async function storeOnIrys({
  cipherText,
  dataToEncryptHash,
  accessControlConditions,
}: {
  cipherText;
  dataToEncryptHash;
  accessControlConditions;
}) {
  const irys = await getIrys();

  const dataToUpload = {
    cipherText: cipherText,
    dataToEncryptHash: dataToEncryptHash,
    accessControlConditions: accessControlConditions,
  };

  let receipt;
  try {
    const tags = [{ name: "Content-Type", value: "application/json" }];
    receipt = await irys.upload(JSON.stringify(dataToUpload), { tags });
  } catch (e) {
    console.log("Error uploading data ", e);
  }

  return receipt?.id;
}

async function getIrys() {
  const irys = new Irys({
    url: "https://node2.irys.xyz", // URL of the node you want to connect to
    token: "matic", // Token used for payment
    // under 100kb is free.
    key: process.env.ETH_PRIVATE_KEY ?? "", // Ethereum Private key for paying for storage. shouldn't actually be needed
    config: { providerUrl: "https://rpc-mumbai.maticvigil.com" }, // Optional provider URL, only required when using Devnet
  });
  return irys;
}

// encrypts the text
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

    const { ciphertext, dataToEncryptHash, accessControlConditions } =
      await encryptData({
        chain,
        tokens,
        contract,
        authSig,
        dataToEncrypt: messageToEncrypt,
      });

    const irysTransactionId = await storeOnIrys({
      cipherText: ciphertext,
      dataToEncryptHash,
      accessControlConditions: accessControlConditions,
    });

    return NextResponse.json({
      data: {
        url: `https://cast.fun/f/embed/${encodeURIComponent(
          `https://gateway.irys.xyz/${irysTransactionId}`
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
