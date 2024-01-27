// import {
//   SendFcFrameActionResolverInit,
//   SendFcFrameActionResolverEvents,
// } from "@mod-protocol/core";

// export function signFrameAction(init: SendFcFrameActionResolverInit,
//   events: SendFcFrameActionResolverEvents){

//   const message = await builders.makeFrameAction(
//       protobufs.FrameActionBody.create({
//         buttonIndex: 1,
//         url: Buffer.from("https://example.com"),
//         castId: { fid, hash: Factories.MessageHash.build() },
//       }),
//       { fid, network },
//       ed25519Signer,
//     );

//  const frameAction = await Factories.FrameActionMessage.create(
//         { data: { fid, network } },
//         { transient: { signer } },
//       );
//   return ({castFid, castHash}: { castFid: number, castHash: string }) => {
//     const message = {
//       "data": {
//         "type": "MESSAGE_TYPE_FRAME_ACTION",
//         "fid": ,
//         "timestamp": 96774342,
//         "network": "FARCASTER_NETWORK_MAINNET",
//         "frameActionBody": {
//           url: init.url,
//           buttonIndex: Number(init.action) - 1,
//           "castId": {
//             "fid": castFid,
//             "hash": castHash
//           }
//         }
//       },
//       "hash": "0x230a1291ae8e220bf9173d9090716981402bdd3d",
//       "hashScheme": "HASH_SCHEME_BLAKE3",
//       "signature": "8IyQdIav4cMxFWW3onwfABHHS9IroWer6Lowo16AjL6uZ0rve3TTFhxhhuSOPMTYQ8XsncHc6ca3FUetzALJDA==",
//       "signer": "0x196a70ac9847d59e039d0cfcf0cde1adac12f5fb447bb53334d67ab18246306c"
//     }

//     const response = fetch(`${init.url}`, {
//       method: "POST",
//       body: JSON.stringify({
//         untrustedData: {
//           fid: ,
//           url: init.url,
//           messageHash: "0xd2b1ddc6c88e865a33cb1a565e0058d757042974",
//           timestamp: 1706243218,
//           network: 1,
//           buttonIndex: Number(init.action) - 1,
//           castId: {
//             fid: castFid,
//             hash: castHash,
//           },
//         },
//         trustedData: {
//             // Buffer.from(encoded).toString(“hex”) (no 0x prefix)
//             // Message.encode(frameActionMsg).finish()
//             messageBytes: ''
//         },
//       } as {
//       untrustedData: {
//         fid: number
//         url: string
//         messageHash: string
//         timestamp: number
//         network: number
//         buttonIndex: number
//         castId: { fid: number; hash: string }
//       }
//       trustedData: {
//         messageBytes: string
//       }
//     }),
//     }).then(() => {});

//     // create user signature

//     // parse OG from htmlString

//     events.onSuccess();
//   }

// }
