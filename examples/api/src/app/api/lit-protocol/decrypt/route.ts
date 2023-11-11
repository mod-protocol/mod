import { NextRequest, NextResponse } from "next/server";
import LitJsSdk from "@lit-protocol/lit-node-client-nodejs";

export async function POST(request: NextRequest) {
  const {
    authSig,
    encryptedString,
    encryptedSymmetricKey,
    chain = "ethereum",
    accessControlConditions,
  } = await request.json();

  // -- same thing, but without browser auth
  const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({});

  await litNodeClient.connect();

  // 3. Decrypt it
  // <String> toDecrypt
  const toDecrypt = LitJsSdk.uint8arrayToString(
    encryptedSymmetricKey,
    "base16"
  );

  // <Uint8Array(32)> _symmetricKey
  const _symmetricKey = await litNodeClient.getEncryptionKey({
    accessControlConditions,
    toDecrypt,
    chain,
    authSig,
  });

  // <String> decryptedString
  let decryptedString;

  try {
    decryptedString = await LitJsSdk.decryptString(
      encryptedString,
      _symmetricKey
    );
  } catch (e) {
    console.log(e);

    return new Response(null, {
      status: 500,
    });
  }

  return NextResponse.json({
    decryptedString,
  });
}
