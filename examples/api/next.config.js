module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@mod-protocol/react"],
  experimental: {
    // For create-poll image generation https://stackoverflow.com/questions/76449953/node-canvas-on-vercel-serverless-function-serverless-function-exceeds-the-maxi/76879546#76879546
    outputFileTracingExcludes: {
      "/api/create-poll": ["**canvas**", "**ultimate-text-to-image**"],
    },
  },
  webpack: (config) => {
    config.externals = [
      ...config.externals,
      // For create-poll image generation https://stackoverflow.com/questions/76449953/node-canvas-on-vercel-serverless-function-serverless-function-exceeds-the-maxi/76879546#76879546
      "ultimate-text-to-image",
      "canvas",
    ];
    return config;
  },
};
