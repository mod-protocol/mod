export type Channel = {
  // null represents the default, "Home" channel
  channel_id: string | null;
  parent_url: string | null;
  name: string;
  image: string | null;
  description?: string | null;
};
