module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@mod-protocol/react"],

  images: {
    domains: [
      "*.i.imgur.com",
      "i.imgur.com",
      // cloudflare proxy
      "https://imagedelivery.net",
      "https://www.discove.xyz",
      // preview deployments
      "*-discove.vercel.app",
      // warpcast
      "res.cloudinary.com",
      "warpcast.com",
      "ipfs.decentralized-content.com",
      "i.seadn.io",
      "www.github.com",
      "opengraph.githubassets.com",
    ],
  },
};
