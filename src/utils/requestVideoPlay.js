/**
 * Programmatic play for muted inline clips.
 * - First play() can reject before enough data is buffered (common on mobile / cold cache).
 * - If canplay/loadeddata already fired, listeners never run again — retry using readyState first.
 */
export function requestVideoPlay(video) {
  if (!video) return;

  try {
    video.muted = true;
    video.playsInline = true;
  } catch {
    /* ignore */
  }

  const tryPlay = () => {
    const p = video.play();
    if (!p || typeof p.catch !== "function") return;
    p.catch(() => scheduleRetry());
  };

  const scheduleRetry = () => {
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      video.play()?.catch?.(() => {});
      return;
    }
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      queueMicrotask(() => video.play()?.catch?.(() => {}));
      return;
    }
    let settled = false;
    const retry = () => {
      if (settled) return;
      settled = true;
      video.removeEventListener("loadeddata", retry);
      video.removeEventListener("canplay", retry);
      video.play()?.catch?.(() => {});
    };
    video.addEventListener("loadeddata", retry, { once: true });
    video.addEventListener("canplay", retry, { once: true });
  };

  tryPlay();
}
