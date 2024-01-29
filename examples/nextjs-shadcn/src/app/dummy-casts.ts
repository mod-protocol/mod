import { Embed } from "@mod-protocol/core";

export const dummyCastData: Array<{
  avatar_url: string;
  display_name: string;
  username: string;
  timestamp: string;
  text: string;
  embeds: Array<Embed>;
}> = [
  {
    avatar_url:
      "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_144/https%3A%2F%2Flh3.googleusercontent.com%2F-S5cdhOpZtJ_Qzg9iPWELEsRTkIsZ7qGYmVlwEORgFB00WWAtZGefRnS4Bjcz5ah40WVOOWeYfU5pP9Eekikb3cLMW2mZQOMQHlWhg",
    display_name: "David Furlong",
    username: "df",
    timestamp: "2023-08-17 09:16:52.293739",
    text: "[Automated] @df just starred the repo 0xOlias/ponder on Github",
    embeds: [
      {
        url: "https://www.github.com/0xOlias/ponder",
        status: "loaded",
        metadata: {
          image: {
            url: "https://opengraph.githubassets.com/dc3ad0a62f7156e3e055d38d5fe752540c446797089d9cc82467304244c028f3/0xOlias/ponder",
          },
          title:
            "0xOlias/ponder: A framework for blockchain application backends",
          publisher: "github.com",
        },
      },
    ],
  },
  {
    avatar_url:
      "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_144/https%3A%2F%2Flh3.googleusercontent.com%2F-S5cdhOpZtJ_Qzg9iPWELEsRTkIsZ7qGYmVlwEORgFB00WWAtZGefRnS4Bjcz5ah40WVOOWeYfU5pP9Eekikb3cLMW2mZQOMQHlWhg",
    display_name: "David Furlong",
    username: "df",
    timestamp: "2023-08-17 09:16:52.293739",
    text: "a fluke",
    embeds: [
      // image embed
      {
        url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_jpg/https://i.imgur.com/TpOwGi4.jpg",
        status: "loaded",
        metadata: {
          image: {
            url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_jpg/https://i.imgur.com/TpOwGi4.jpg",
          },
          alt: "Github",
        },
      },
    ],
  },
  {
    avatar_url:
      "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_144/https%3A%2F%2Flh3.googleusercontent.com%2F-S5cdhOpZtJ_Qzg9iPWELEsRTkIsZ7qGYmVlwEORgFB00WWAtZGefRnS4Bjcz5ah40WVOOWeYfU5pP9Eekikb3cLMW2mZQOMQHlWhg",
    display_name: "David Furlong",
    username: "df",
    timestamp: "2023-08-17 09:16:52.293739",
    text: "I just minted Farcaster v3",
    embeds: [
      {
        url: "https://zora.co/collect/base:0xbfdb5d8d1856b8617f1881fd718580256fa8cf35",
        status: "loaded",
        metadata: {
          title: "Farcaster v3",
          description: "A new chapter for Farcaster",
          publisher: "zora.co",
          image: {
            url: "https://ipfs.decentralized-content.com/ipfs/bafybeicto6doldfjy7nrqxn7jiduw47xs7cmzppjd6mm3mrao4z46asiwq",
          },
          logo: {
            url: "https://ipfs.decentralized-content.com/ipfs/bafybeicto6doldfjy7nrqxn7jiduw47xs7cmzppjd6mm3mrao4z46asiwq",
          },
          nft: {
            mediaUrl:
              "https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeicto6doldfjy7nrqxn7jiduw47xs7cmzppjd6mm3mrao4z46asiwq&w=1920&q=75",
            collection: {
              contractAddress: "0xbfdb5d8d1856b8617f1881fd718580256fa8cf35",
              creatorAddress: "0xd7029bdea1c17493893aafe29aad69ef892b8ff2",
              chain: "base",
              id: "farcaster-v3-1",
              name: "Farcaster v3",
              description: "A new chapter for Farcaster",
              itemCount: 13415,
              ownerCount: 13395,
              imageUrl:
                "https://ipfs.io/ipfs/bafybeicto6doldfjy7nrqxn7jiduw47xs7cmzppjd6mm3mrao4z46asiwq",
              mintUrl:
                "https://zora.co/collect/base:0xbfdb5d8d1856b8617f1881fd718580256fa8cf35",
              openSeaUrl: "https://opensea.io/collection/farcaster-v3-1",
              creator: {
                fid: 3,
                username: "dwr.eth",
                displayName: "Dan Romero",
                pfp: {
                  url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA",
                },
              },
            },
          },
        },
      },
    ],
  },
  {
    avatar_url:
      "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_144/https%3A%2F%2Flh3.googleusercontent.com%2F-S5cdhOpZtJ_Qzg9iPWELEsRTkIsZ7qGYmVlwEORgFB00WWAtZGefRnS4Bjcz5ah40WVOOWeYfU5pP9Eekikb3cLMW2mZQOMQHlWhg",
    display_name: "David Furlong",
    username: "df",
    timestamp: "2023-08-17 09:16:52.293739",
    text: "This is an example of an embedded video",
    embeds: [
      // video embed
      {
        url: "https://lp-playback.com/hls/3087gff2uxc09ze1/index.m3u8",
        status: "loaded",
        metadata: {},
      },
    ],
  },
  {
    avatar_url:
      "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_144/https%3A%2F%2Flh3.googleusercontent.com%2F-S5cdhOpZtJ_Qzg9iPWELEsRTkIsZ7qGYmVlwEORgFB00WWAtZGefRnS4Bjcz5ah40WVOOWeYfU5pP9Eekikb3cLMW2mZQOMQHlWhg",
    display_name: "David Furlong",
    username: "df",
    timestamp: "2023-08-17 09:16:52.293739",
    text: "I just minted this straight from my feed",
    embeds: [
      {
        url: "https://zora.co/collect/zora:0x81d226fb36ca785583e79e84312335d0e166d59b/1",
        status: "loaded",
        metadata: {
          image: {
            url: "https://i.seadn.io/s/raw/files/d6384f27778a43e614caeee5bff07496.png?auto=format&dpr=1&w=640",
          },
          alt: "Gitcoin Impact Report 01",
          description: "Gitcoin Impact Report 01: PDF Onchain",
          title: "Gitcoin Impact Report 01: PDF Onchain",
          publisher: "boop",
          logo: {
            url: "https://i.imgur.com/Cus7QVM.png",
          },
          nft: {
            mediaUrl:
              "https://i.seadn.io/s/raw/files/d6384f27778a43e614caeee5bff07496.png?auto=format&dpr=1&w=640",
            tokenId: "1",
            collection: {
              chain: "zora",
              contractAddress: "0x81d226fb36ca785583e79e84312335d0e166d59b",
              creatorAddress: "0x3e364ebc92aa057c10597ef3d30c0201d84f03e8",
              description: "Gitcoin's Impact Report on Zora Network",
              id: "chain://eip155:7777777/erc721:0x81d226fb36ca785583e79e84312335d0e166d59b",
              imageUrl:
                "https://i.seadn.io/s/raw/files/d6384f27778a43e614caeee5bff07496.png?auto=format&dpr=1&w=640",
              itemCount: 91324,
              mintUrl:
                "https://zora.co/collect/zora:0x81d226fb36ca785583e79e84312335d0e166d59b/1",
              name: "Impact on Zora Network",
              openSeaUrl: "https://opensea.io/collection/rabby-desktop-genesis",
              ownerCount: 78254,
            },
          },
        },
      },
    ],
  },
];
