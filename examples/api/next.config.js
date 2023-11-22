module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    "@mod-protocol/react",
    // Fixes https://discord.com/channels/896185694857343026/1174716239508156496
    "@lit-protocol/bls-sdk",
  ],
  // experimental: {
  //   esmExternals: "loose",
  // },
  // experimental.esmExternals: 'loose'
};
