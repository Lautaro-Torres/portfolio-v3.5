"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Renders a poster for a video. If `poster` URL is provided, uses it.
 * Otherwise extracts a frame from the video at `posterTime` seconds (default 1).
 */
/** Seconds shaved before loop jump — avoids black tail frames / decoder gap on many exports. */
const FULL_LOOP_TRIM_END = 0.18;

export function VideoPoster({
  src,
  poster,
  posterTime = 1,
  className = "",
  previewLoop = false,
  previewLoopStart = 0,
  previewLoopSeconds = 2.2,
  fullVideoLoop = false,
  /** Extra tail trim (sec) for heavy black fades at EOF; optional per asset */
  loopTrimEnd = 0,
}) {
  const containerRef = useRef(null);
  const previewVideoRef = useRef(null);
  const reverseAnimRef = useRef(null);
  const lastTimeRef = useRef(0);
  const isReversingRef = useRef(false);
  const [frameDataUrl, setFrameDataUrl] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const [hasExtracted, setHasExtracted] = useState(false);
  const shouldUseLoopPreview = Boolean(previewLoop && !poster && src && !fullVideoLoop);
  const shouldUseFullVideoLoop = Boolean(fullVideoLoop && !poster && src);

  // Intersection Observer: trigger extraction/playback when card is visible.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!shouldUseLoopPreview && !shouldUseFullVideoLoop && (poster || hasExtracted)) return;

    const io = new IntersectionObserver(
      (entries) => {
        setIsInView(Boolean(entries[0]?.isIntersecting));
      },
      { rootMargin: "100px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [poster, hasExtracted, shouldUseLoopPreview, shouldUseFullVideoLoop]);

  // Pause preview videos outside viewport to keep it lightweight on mobile.
  useEffect(() => {
    if ((!shouldUseLoopPreview && !shouldUseFullVideoLoop) || !previewVideoRef.current) return;
    const video = previewVideoRef.current;
    if (isInView) {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
    } else {
      if (reverseAnimRef.current) {
        cancelAnimationFrame(reverseAnimRef.current);
        reverseAnimRef.current = null;
      }
      isReversingRef.current = false;
      video.pause();
    }
  }, [isInView, shouldUseLoopPreview, shouldUseFullVideoLoop]);

  // Extract frame when in view and no poster provided
  useEffect(() => {
    if (!isInView || poster || !src || hasExtracted || shouldUseLoopPreview || shouldUseFullVideoLoop) return;

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.crossOrigin = "anonymous";
    video.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;";
    document.body.appendChild(video);

    const onLoadedMetadata = () => {
      const time = Math.min(posterTime, video.duration * 0.5);
      video.currentTime = time;
    };

    const onSeeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setFrameDataUrl(dataUrl);
          setHasExtracted(true);
        }
      } catch {
        // CORS or canvas error: fallback to blank
        setHasExtracted(true);
      }
      if (video.parentNode) document.body.removeChild(video);
    };

    const onError = () => {
      setHasExtracted(true);
      if (video.parentNode) document.body.removeChild(video);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    video.src = src;

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      video.src = "";
      video.load();
      if (video.parentNode) document.body.removeChild(video);
    };
  }, [isInView, poster, src, posterTime, hasExtracted, shouldUseLoopPreview, shouldUseFullVideoLoop]);

  const handlePreviewLoadedMetadata = () => {
    if (!previewVideoRef.current) return;
    const video = previewVideoRef.current;
    const safeStart = Math.max(0, Math.min(previewLoopStart, Math.max(0, video.duration - 0.2)));
    video.currentTime = safeStart;
  };

  const startReversePlayback = useCallback((safeStart, safeEnd) => {
    const video = previewVideoRef.current;
    if (!video || isReversingRef.current) return;
    isReversingRef.current = true;
    video.pause();

    const animate = (timestamp) => {
      if (!previewVideoRef.current) {
        isReversingRef.current = false;
        return;
      }
      const delta = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = timestamp;
      video.currentTime = Math.max(safeStart, video.currentTime - delta);
      if (video.currentTime <= safeStart) {
        video.currentTime = safeStart;
        lastTimeRef.current = 0;
        isReversingRef.current = false;
        reverseAnimRef.current = null;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
        return;
      }
      reverseAnimRef.current = requestAnimationFrame(animate);
    };
    lastTimeRef.current = performance.now();
    reverseAnimRef.current = requestAnimationFrame(animate);
  }, []);

  const handlePreviewTimeUpdate = () => {
    if (!previewVideoRef.current || isReversingRef.current) return;
    const video = previewVideoRef.current;
    const safeStart = Math.max(0, previewLoopStart);
    const safeEnd = safeStart + Math.max(0.8, previewLoopSeconds);
    if (video.currentTime >= safeEnd || video.currentTime >= video.duration - 0.05) {
      startReversePlayback(safeStart, safeEnd);
    }
  };

  // Cleanup reverse animation on unmount.
  useEffect(() => {
    if (!shouldUseLoopPreview) return;
    return () => {
      if (reverseAnimRef.current) {
        cancelAnimationFrame(reverseAnimRef.current);
      }
    };
  }, [shouldUseLoopPreview]);

  const handleFullLoopTimeUpdate = useCallback(
    (e) => {
      const video = e.currentTarget;
      const dur = video.duration;
      if (!dur || Number.isNaN(dur)) return;
      const trim = FULL_LOOP_TRIM_END + Math.max(0, loopTrimEnd);
      if (dur <= trim * 2) return;
      if (video.currentTime >= dur - trim) {
        video.currentTime = 0;
      }
    },
    [loopTrimEnd]
  );

  const handleFullLoopEnded = useCallback((e) => {
    const video = e.currentTarget;
    video.currentTime = 0;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);

  // Full video loop: plays entire video, then restarts (no short segment / reverse)
  if (shouldUseFullVideoLoop) {
    return (
      <div ref={containerRef} className="w-full h-full min-h-0">
        <video
          ref={previewVideoRef}
          src={src}
          muted
          playsInline
          autoPlay
          preload="auto"
          onTimeUpdate={handleFullLoopTimeUpdate}
          onEnded={handleFullLoopEnded}
          className={`min-h-0 ${className}`}
        />
      </div>
    );
  }

  if (shouldUseLoopPreview) {
    return (
      <div ref={containerRef} className="w-full h-full">
        <video
          ref={previewVideoRef}
          src={src}
          muted
          playsInline
          autoPlay
          preload="metadata"
          className={`block w-full h-auto ${className}`}
          onLoadedMetadata={handlePreviewLoadedMetadata}
          onTimeUpdate={handlePreviewTimeUpdate}
        />
      </div>
    );
  }

  // Poster URL provided: use it
  if (poster) {
    return (
      <img
        src={poster}
        alt=""
        className={`block w-full h-auto ${className}`}
      />
    );
  }

  // Extracted frame: use data URL
  if (frameDataUrl) {
    return (
      <img
        src={frameDataUrl}
        alt=""
        className={`block w-full h-auto ${className}`}
      />
    );
  }

  // Loading: show placeholder (min-height so play button has space)
  return (
    <div
      ref={containerRef}
      className={`min-h-[200px] w-full bg-black/60 animate-pulse ${className}`}
    />
  );
}
