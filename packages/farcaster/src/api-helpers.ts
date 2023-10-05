export function getFarcasterMentions(api_url: string) {
  return async (query: string) => {
    const req = await fetch(
      `${api_url}/farcaster/mentions?q=${encodeURIComponent(query)}`
    );

    const reqJson = await req.json();

    return reqJson.data;
  };
}

export function getFarcasterChannels(api_url: string) {
  return async (query: string) => {
    const results = await fetch(
      `${api_url}/farcaster/channels?q=${encodeURIComponent(query)}`
    );

    const body = await results.json();

    return body.channels;
  };
}
