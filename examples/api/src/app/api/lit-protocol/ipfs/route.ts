// const litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
//   // alertWhenUnauthorized: false,
//   litNetwork: "cayenne",
// });

// await litNodeClient.connect();

// // 1. Encryption
// // <Blob> encryptedString
// // <Uint8Array(32)> symmetricKey
// const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
//   {
//     authSig,
//     accessControlConditions,
//     dataToEncrypt: messageToEncrypt,
//     chain: "ethereum",
//   },
//   litNodeClient
// );

// // 2. Saving the Encrypted Content to the Lit Nodes
// // <Unit8Array> encryptedSymmetricKey
// const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
//   accessControlConditions,
//   symmetricKey,
//   authSig,
//   chain,
// });

// const contentString = JSON.stringify({
//   encryptedString: await encryptedString.text(),
//   encryptedSymmetricKey,
//   chain,
//   accessControlConditions,
//   id: "lit-v3",
// });
// const bytes = new TextEncoder().encode(contentString);
// const blob = new Blob([bytes], {
//   type: "application/json;charset=utf-8",
// });

// // // Store metadata on IPFS
// // const ipfsUploadRequest: Response | null = await fetch(
// //   "https://ipfs.infura.io:5001/api/v0/add",
// //   {
// //     method: "POST",
// //     body: blob,
// //     headers: {
// //       Authorization:
// //         "Basic " +
// //         Buffer.from(INFURA_API_KEY + ":" + INFURA_API_SECRET).toString(
// //           "base64"
// //         ),
// //     },
// //   }
// // );

// // const ipfsUploadRequestJson = await ipfsUploadRequest.json();

// // return NextResponse.json({
// //   data: {
// //     url: `https://cast.fun/FIP-1/${encodeURIComponent(
// //       `https://discove.infura-ipfs.io/ipfs/${ipfsUploadRequestJson.Hash}`
// //     )}`,
// //   },
// // });
