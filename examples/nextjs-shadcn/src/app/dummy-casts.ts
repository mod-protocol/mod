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
        url: "https://zora.co/collect/zora:0x787c6366341fbb8a7bfff1064009bce60796338f/61",
        status: "loaded",
        metadata: {
          image: {
            url: "https://ipfs.io/ipfs/bafkreibyyf6rd5w3l3gxksy2narahb2yj3a2b4nngkqfvwpc3hkaj3daae",
          },
          alt: "Hyperbrand: Opepen",
          description: "a collection expressing Opepen as a hyperbrand",
          title: "Hyperbrand: Opepen",
          publisher: "boop",
          logo: {
            url: "https://i.imgur.com/Cus7QVM.png",
          },
          nft: {
            mediaUrl:
              "https://ipfs.io/ipfs/bafkreifass5p37alcfqz5vn5b5lrgpfvxq7lkvpz45ovwa354jogttwr5u",
            tokenId: "61",
            collection: {
              chain: "zora",
              contractAddress: "0x787c6366341fbb8a7bfff1064009bce60796338f",
              creatorAddress: "0x5adf1c982bde935ce98a07e115ff8d09254ecb1b",
              description: "a collection expressing Opepen as a hyperbrand",
              id: "chain://eip155:7777777/erc1155:0x787c6366341fbb8a7bfff1064009bce60796338f",
              imageUrl:
                "https://ipfs.io/ipfs/bafkreibyyf6rd5w3l3gxksy2narahb2yj3a2b4nngkqfvwpc3hkaj3daae",
              itemCount: 53,
              mintUrl:
                "https://mint.fun/zora/0x787c6366341fbb8a7bfff1064009bce60796338f",
              name: "Hyperbrand: Opepen",
              openSeaUrl: "https://opensea.io/collection/hyperbrand-opepen",
              ownerCount: 22,
            },
          },
        },
      },
    ],
  },
];
