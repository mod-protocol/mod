import { useMemo } from "react";

export function fromNow(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const years = Math.floor(seconds / 31536000);
  const months = Math.floor(seconds / 2592000);
  const days = Math.floor(seconds / 86400);

  if (days > 548) {
    return years + "y";
  }
  if (days >= 320 && days <= 547) {
    return "1y";
  }
  if (days >= 45 && days <= 319) {
    return months + "mo";
  }
  if (days >= 26 && days <= 45) {
    return "1mo";
  }

  // rounds down
  const hours = Math.floor(seconds / 3600);

  if (hours >= 48 && days <= 25) {
    return days + "d";
  }
  if (hours >= 22 && hours <= 48) {
    return "1d";
  }

  // rounds down
  const minutes = Math.floor(seconds / 60);

  if (minutes >= 120) {
    return hours + "h";
  }
  if (minutes >= 45) {
    return "1h";
  }
  if (minutes >= 1) {
    return minutes + "m";
  }
  // don't show seconds, so that it doesn't have SSR issues
  return "1m";
}

// https://github.com/vercel/next.js/discussions/38263
export const useRelativeDate = (date: Date | null): string | null => {
  const formattedDate = useMemo(() => (date ? fromNow(date) : null), [date]);

  return formattedDate;
};
