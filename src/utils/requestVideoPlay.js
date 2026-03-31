/**
 * Programmatic play for muted inline clips. Mobile Safari often rejects the first
 * play() until enough data is buffered; this schedules a one-shot retry on canplay/loadeddata.
 */
export function requestVideoPlay(video) {
  if (!video) return;

  try {
    video.muted = true;
    video.playsInline = true;
  } catch {
    /* ignore */
  }

  const attempt = () => {
    const p = video.play();
    if (!p || typeof p.catch !== "function") return;
    p.catch(() => {
      let settled = false;
      const retry = () => {
        if (settled) return;
        settled = true;
        video.removeEventListener("loadeddata", retry);
        video.removeEventListener("canplay", retry);
        const p2 = video.play();
        p2?.catch?.(() => {});
      };
      video.addEventListener("loadeddata", retry, { once: true });
      video.addEventListener("canplay", retry, { once: true });
    });
  };

  attempt();
}
