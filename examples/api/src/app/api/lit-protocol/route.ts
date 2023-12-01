import { NextRequest, NextResponse } from "next/server";
import Irys from "@irys/sdk";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { AccessControlConditions, AuthSig } from "@lit-protocol/types";
import { generatePrivateKey } from "viem/accounts";
import { getAddress } from "viem";

/**
 * Built using the guide
 * https://developer.litprotocol.com/v3/integrations/storage/irys/
 */

async function getLitNodeClient() {
  // Initialize LitNodeClient
  const litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: true,
    litNetwork: "cayenne",
  });
  await litNodeClient.connect();

  return litNodeClient;
}

function getAccessControlConditions({
  chain,
  contract,
  tokens,
  standardContractType,
}: {
  chain: string;
  contract: string;
  tokens: string;
  standardContractType: "ERC721" | "ERC1155";
}): AccessControlConditions {
  return [
    {
      conditionType: "evmBasic" as const,
      contractAddress: getAddress(contract),
      standardContractType: standardContractType,
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
  standardContractType,
  contract,
  tokens,
}: {
  dataToEncrypt: string;
  authSig: AuthSig;
  chain: string;
  standardContractType: "ERC721" | "ERC1155";
  contract: string;
  tokens: string;
}) {
  const accessControlConditions: AccessControlConditions =
    getAccessControlConditions({
      chain,
      contract,
      standardContractType,
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
      chain,
    },
    litNodeClient
  );
  return { ciphertext, dataToEncryptHash, accessControlConditions };
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

async function getIrys() {
  // Uint8Array with length 32
  // const key = Uint8Array.from(
  //   Buffer.from(
  //     bip39.mnemonicToSeedSync(process.env.PRIVATE_KEY).toString("hex"),
  //     "hex"
  //   )
  // );
  // if (!bip39.validateMnemonic(process.env.PRIVATE_KEY)) {
  //   throw new Error("Invalid mnemonic");
  // }
  // mnemonicToAccount(process.env.PRIVATE_KEY);
  // const key = (await bip39.mnemonicToSeed(process.env.PRIVATE_KEY)).toString(
  //   "hex"
  // );
  const key = generatePrivateKey();

  const irys = new Irys({
    url: "https://node2.irys.xyz",
    // url: "https://node2.irys.xyz", // URL of the node you want to connect to
    token: "matic", // Token used for payment
    // under 100kb is free.
    key: key,
    config: { providerUrl: "https://polygon-mainnet.infura.io" }, // Optional provider URL, only required when using Devnet
  });

  // try {
  //   const fundTx = await irys.fund(irys.utils.toAtomic(0.05));
  //   console.log(
  //     `Successfully funded ${irys.utils.fromAtomic(fundTx.quantity)} ${
  //       irys.token
  //     }`
  //   );
  // } catch (e) {
  //   console.log("Error uploading data ", e);
  // }

  return irys;
}

// encrypts the text
export async function POST(request: NextRequest) {
  try {
    const {
      // await signAuthMessage();
      authSig,
      messageToEncrypt,
      standardContractType = "ERC721",
      chain = "ethereum",
      // https://developer.litprotocol.com/v3/sdk/access-control/evm/basic-examples#must-be-a-member-of-a-dao-molochdaov21-also-supports-daohaus
      // https://lit-share-modal-v3-playground.netlify.app/
      tokens = "1",
      contract,
    } = await request.json();

    // TODO: Zod validation to get types

    const { ciphertext, dataToEncryptHash, accessControlConditions } =
      await encryptData({
        chain,
        tokens,
        contract,
        standardContractType,
        authSig: { ...authSig, derivedVia: "web3.eth.personal.sign" },
        dataToEncrypt: messageToEncrypt,
      });

    const irysTransactionId = await storeOnIrys(
      createSchemaMetadata({
        cipherText: ciphertext,
        dataToEncryptHash,
        accessControlConditions: accessControlConditions,
      })
    );

    if (!irysTransactionId) {
      return new Response(null, {
        status: 500,
      });
    }

    console.log(irysTransactionId);

    return NextResponse.json({
      url: `${process.env.GATEWAY_URL}/f/embed/${encodeURIComponent(
        // https://github.com/ChainAgnostic/namespaces/blob/main/arweave/caip2.md
        `arweave:7wIU:${irysTransactionId}`
        // `https://gateway.irys.xyz/${irysTransactionId}`
      )}`,
    });
  } catch (err) {
    console.error(err);
    return new Response(null, {
      status: 500,
    });
  }
}

// needed for preflight requests to succeed
export const OPTIONS = async (request: NextRequest) => {
  return NextResponse.json({});
};

function createSchemaMetadata(payload: {
  cipherText: string;
  dataToEncryptHash: string;
  accessControlConditions: AccessControlConditions;
}) {
  return {
    "@context": ["https://schema.org", "https://schema.modprotocol.org"],
    "@type": "WebPage",
    name: "Token gated content",
    image: "https://i.imgur.com/RO76xMR.png",
    description:
      "It looks like this app doesn't support Mods yet, but if it did, you'd see the Mod here. Click here to unlock the content if you have access",
    "mod:model": {
      // unique identifier for the renderer of this miniapp
      "@type": "schema.modprotocol.org/lit-protocol/0.0.1/EncryptedData",
      payload,
    },
  };
}
