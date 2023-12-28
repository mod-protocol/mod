import { Channel } from "./channels";
import { FarcasterMention } from "./mentions";

export function getFarcasterMentions(api_url: string) {
  return async (query: string): Promise<FarcasterMention[]> => {
    const req = await fetch(
      `${api_url}/farcaster/mentions?q=${encodeURIComponent(query)}`
    );

    const reqJson = await req.json();

    return reqJson.data;
  };
}

export function getFarcasterChannels(api_url: string) {
  return async (query: string, hideHome?: boolean): Promise<Channel[]> => {
    const results = await fetch(
      `${api_url}/farcaster/channels/v2?q=${encodeURIComponent(
        query
      )}&hideHome=${hideHome}`
    );

    const body = await results.json();

    return body.channels;
  };
}

export function getMentionFidsByUsernames(api_url: string) {
  return async (usernames: string[]): Promise<FarcasterMention[]> => {
    const reqs = await Promise.all(
      usernames.map(async (username): Promise<FarcasterMention> => {
        const req = await fetch(
          `${api_url}/farcaster/user-by-username?username=${encodeURIComponent(
            username
          )}`
        );

        const reqJson = await req.json();

        return reqJson.data;
      })
    );

    return reqs;
  };
}
