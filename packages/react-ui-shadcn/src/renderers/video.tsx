"use client";

import React, { useMemo, useEffect, useCallback } from "react";
import videojs from "video.js";

interface PlayerProps {
  videoSrc: string;
}

const videoJSoptions: {
  techOrder?: string[];
  autoplay?: boolean;
  fill?: boolean;
  controls?: boolean;
  responsive?: true;
  fluid?: true;
} = {
  fluid: true,
  controls: true,
  fill: true,
  responsive: true,
};

function handleClick(e: any) {
  e.stopPropagation();
  e.preventDefault();
}

export const VideoRenderer = (props: PlayerProps) => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<any>(null);

  const [videoSrc, setVideoSrc] = React.useState<string | undefined>();
  const [overrideMimeType, setOverrideMimeType] = React.useState<
    string | undefined
  >(undefined);

  const [hasStartedPlaying, setHasStartedPlaying] =
    React.useState<boolean>(false);

  const pollUrl = useCallback(
    async (url: string) => {
      const res = await fetch(url, { method: "HEAD" });
      if (hasStartedPlaying) return;
      if (res.ok) {
        setVideoSrc(url);
      } else {
        setTimeout(() => {
          pollUrl(url);
        }, 1000);
      }
    },
    [setVideoSrc, hasStartedPlaying]
  );

  const options = useMemo(
    () => ({
      ...videoJSoptions,
      // video is not necessarily rewritten yet
      sources: [
        {
          src: videoSrc ?? "",
          type:
            overrideMimeType ||
            (videoSrc?.endsWith(".m3u8")
              ? "application/x-mpegURL"
              : videoSrc?.endsWith(".mp4")
              ? "video/mp4"
              : ""),
        },
      ],
    }),
    [videoSrc, overrideMimeType]
  );

  useEffect(() => {
    if (props.videoSrc.startsWith("ipfs://")) {
      // Exchange ipfs:// for .m3u8 url via /livepeer-video?url=ipfs://...
      const baseUrl = `${
        process.env.NEXT_PUBLIC_API_URL || "https://api.modprotocol.org"
      }/livepeer-video`;
      const endpointUrl = `${baseUrl}?url=${props.videoSrc}`;
      fetch(endpointUrl).then(async (res) => {
        const { url, fallbackUrl, mimeType } = await res.json();
        setOverrideMimeType(mimeType);
        setVideoSrc(`${fallbackUrl}`);
        pollUrl(url);
      });
    } else {
      setVideoSrc(props.videoSrc);
    }
  }, [props.videoSrc, pollUrl]);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current?.appendChild(videoElement);

      playerRef.current = videojs(videoElement, options);
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
      player.on("play", () => {
        setHasStartedPlaying(true);
      });
    }
  }, [options, videoRef, videoSrc]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player onClick={handleClick}>
      <div ref={videoRef} />
    </div>
  );
};
