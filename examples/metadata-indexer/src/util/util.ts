import { fromFarcasterTime } from "@farcaster/hub-nodejs";
import { Logger } from "../log";
import normalizeUrl_ from "./normalizeUrl";

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// How long to wait for finalizers to complete before forcibly terminating
const SHUTDOWN_TIMEOUT_MS = 10_000;
// biome-ignore lint/suspicious/noExplicitAny: legacy code, avoid using ignore for new code
const finalizers: Array<() => Promise<any>> = [];

// Source: https://github.com/farcasterxyz/hub-monorepo/blob/main/apps/replicator/src/util.ts
export async function terminateProcess({
  success,
  log,
}: {
  success: boolean;
  log: Logger;
}) {
  log.debug(`Terminating process. Running ${finalizers.length} finalizers...`);
  let completedFinalizers = 0;
  await Promise.race([
    Promise.all(
      finalizers.map(async (fn) => {
        await fn();
        completedFinalizers += 1;
        log.debug(
          `Finished ${completedFinalizers}/${finalizers.length} finalizers`
        );
      })
    ),
    (async () => {
      await sleep(SHUTDOWN_TIMEOUT_MS);
      log.debug(
        `Finalizers took longer than ${SHUTDOWN_TIMEOUT_MS}ms to complete. Forcibly terminating.`
      );
    })(),
  ]);
  if (success) {
    process.exitCode = 0;
  } else if (process.exitCode === undefined) {
    process.exitCode = 1;
  }
  process.exit();
}

// biome-ignore lint/suspicious/noExplicitAny: legacy code, avoid using ignore for new code
export function onTerminate(fn: () => Promise<any>) {
  finalizers.push(fn);
}

export function farcasterTimeToDate(time: undefined): undefined;
export function farcasterTimeToDate(time: null): null;
export function farcasterTimeToDate(time: number): Date;
export function farcasterTimeToDate(
  time: number | null | undefined
): Date | null | undefined;
export function farcasterTimeToDate(
  time: number | null | undefined
): Date | null | undefined {
  if (time === undefined) return undefined;
  if (time === null) return null;
  const result = fromFarcasterTime(time);
  if (result.isErr()) throw result.error;
  return new Date(result.value);
}

export function bytesToHex(bytes: undefined): undefined;
export function bytesToHex(bytes: null): null;
export function bytesToHex(bytes: Uint8Array): `0x${string}`;
export function bytesToHex(
  bytes: Uint8Array | null | undefined
): `0x${string}` | null | undefined {
  if (bytes === undefined) return undefined;
  if (bytes === null) return null;
  return `0x${Buffer.from(bytes).toString("hex")}`;
}

export function normalizeUrl(url: string): string {
  try {
    const normalizedUrl = normalizeUrl_(url, {
      forceHttps: true,
      stripWWW: false,
      stripHash: true,
    });

    return normalizedUrl;
  } catch (e) {
    if (url.toLowerCase().startsWith("chain://")) {
      return url.toLowerCase();
    }
  }

  return url;
}

// Source: https://stackoverflow.com/a/2450976
export function shuffle<T>(initial: T[]) {
  const array = [...initial];
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex]!,
      array[currentIndex]!,
    ];
  }

  return array;
}
