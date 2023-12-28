// old, deprecated
export type Channelv1 = {
  // null represents the default, "Home" channel
  channel_id: string | null;
  parent_url: string | null;
  name: string;
  image: string | null;
  description?: string | null;
};

export type Channel = VirtualChannel | RealizedChannel;

export const homeVirtualChannel = {
  id: "",
  description: "followers",
  name: "Home",
  object: "channel",
  parent_url: null,
  image_url: "https://warpcast.com/~/channel-images/home.png",
  channel_id: "home",
} as const;

export type VirtualChannel = typeof homeVirtualChannel;

// type is copied from Neynar response type
export type RealizedChannel = {
  id: string;
  url: string;
  name: string;
  description: string;
  object: "channel";
  image_url: string;
  created_at: number;
  parent_url: string;
  lead: {
    object: "user";
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
    profile: {
      bio: {
        text: string;
      };
    };
    follower_count: number;
    following_count: number;
    verifications: string[];
    active_status: "active" | "inactive";
  };
};
