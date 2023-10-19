"use client";

import React, { useMemo, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

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

  const options = useMemo(
    () => ({
      ...videoJSoptions,
      // video is not necessarily rewritten yet
      sources: [
        {
          src: props.videoSrc ?? "",
          type: props.videoSrc?.endsWith(".m3u8")
            ? "application/x-mpegURL"
            : props.videoSrc?.endsWith(".mp4")
            ? "video/mp4"
            : "",
        },
      ],
    }),
    [props.videoSrc]
  );

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
    }
  }, [options, videoRef, props]);

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
