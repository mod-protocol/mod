import {
  HashScheme,
  Message,
  MessageData,
  NobleEd25519Signer,
} from "@farcaster/hub-web";
import { blake3 } from "@noble/hashes/blake3";

// fixme: actually store this?
function getSigner(privateKey: string): NobleEd25519Signer {
  const ed25519Signer = new NobleEd25519Signer(Buffer.from(privateKey, "hex"));
  return ed25519Signer;
}

function getSignerFromStorage(key: string = "keyPair"): NobleEd25519Signer {
  const privateKey = JSON.parse(localStorage.getItem(key) || "{}").privateKey;
  return getSigner(privateKey);
}

export async function makeMessage(messageData: MessageData) {
  const signer = getSignerFromStorage();

  const dataBytes = MessageData.encode(messageData).finish();

  const hash = blake3(dataBytes, { dkLen: 20 });

  const signature = await signer.signMessageHash(hash);
  if (signature.isErr()) return null;

  const signerKey = await signer.getSignerKey();
  if (signerKey.isErr()) return null;

  const message = Message.create({
    data: messageData,
    hash,
    hashScheme: HashScheme.BLAKE3,
    signature: signature.value,
    signatureScheme: signer.scheme,
    signer: signerKey.value,
  });

  return message;
}
