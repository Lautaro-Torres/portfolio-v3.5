"use client";

import { useEffect, useRef, useState } from "react";

const LOTTIE_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";

let lottieScriptPromise = null;

function loadLottieScript() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.lottie) return Promise.resolve(window.lottie);
  if (lottieScriptPromise) return lottieScriptPromise;

  lottieScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-lottie-cdn="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.lottie), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = LOTTIE_CDN;
    script.async = true;
    script.defer = true;
    script.dataset.lottieCdn = "true";
    script.onload = () => resolve(window.lottie);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return lottieScriptPromise;
}

export default function InlineLottieGlobe({
  src = "/lotties/globe-trans.json",
  className = "",
}) {
  const mountRef = useRef(null);
  const [shouldLoadLottie, setShouldLoadLottie] = useState(false);

  const normalizeColor = (colorValue, fallback) => {
    if (!colorValue) return fallback;
    if (Array.isArray(colorValue) && colorValue.length >= 4) return colorValue;
    return fallback;
  };

  const recolorAnimationData = (animationData) => {
    const WHITE = [1, 1, 1, 1];
    const BODY = [0.039, 0.039, 0.039, 1]; // #0a0a0a

    const walk = (node) => {
      if (!node || typeof node !== "object") return;

      if (node.ty === "st" && node.c) {
        if (Array.isArray(node.c.k)) {
          if (node.c.k.length && typeof node.c.k[0] === "object" && "s" in node.c.k[0]) {
            node.c.k = node.c.k.map((kf) => ({
              ...kf,
              s: normalizeColor(kf.s, WHITE),
            }));
          } else {
            node.c.k = WHITE;
          }
        }
      }

      if (node.ty === "fl" && node.c) {
        if (Array.isArray(node.c.k)) {
          if (node.c.k.length && typeof node.c.k[0] === "object" && "s" in node.c.k[0]) {
            node.c.k = node.c.k.map((kf) => ({
              ...kf,
              s: normalizeColor(kf.s, BODY),
            }));
          } else {
            node.c.k = BODY;
          }
        }
      }

      for (const key of Object.keys(node)) {
        const value = node[key];
        if (Array.isArray(value)) value.forEach(walk);
        else if (value && typeof value === "object") walk(value);
      }
    };

    const cloned =
      typeof structuredClone === "function"
        ? structuredClone(animationData)
        : JSON.parse(JSON.stringify(animationData));
    walk(cloned);
    return cloned;
  };

  const applyMonochromeTheme = () => {
    const root = mountRef.current;
    if (!root) return;
    const svg = root.querySelector("svg");
    if (!svg) return;

    svg.style.background = "transparent";
    svg.querySelectorAll("[stroke]").forEach((el) => {
      el.setAttribute("stroke", "#ffffff");
    });
    // Remove white fill from the base circle so it matches the page background.
    svg.querySelectorAll("[fill]").forEach((el) => {
      const fill = (el.getAttribute("fill") || "").toLowerCase();
      if (fill && fill !== "none") {
        el.setAttribute("fill", "#0a0a0a");
      }
    });
  };

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl || typeof window === "undefined") return;

    const preloadAheadPx = 900;
    const top = mountEl.getBoundingClientRect().top;
    if (top <= window.innerHeight + preloadAheadPx) {
      setShouldLoadLottie(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldLoadLottie(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoadLottie(true);
        observer.disconnect();
      },
      {
        root: null,
        rootMargin: `${preloadAheadPx}px 0px`,
        threshold: 0.01,
      }
    );

    observer.observe(mountEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadLottie) return;
    let animation = null;
    let cancelled = false;

    Promise.all([
      loadLottieScript(),
      fetch(src).then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([lottie, rawData]) => {
        if (cancelled || !lottie || !mountRef.current || !rawData) return;
        const themedData = recolorAnimationData(rawData);
        animation = lottie.loadAnimation({
          container: mountRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: themedData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
          },
        });
        animation.addEventListener("DOMLoaded", applyMonochromeTheme);
      })
      .catch(() => {
        // Silent fail: title still renders without the lottie.
      });

    return () => {
      cancelled = true;
      animation?.removeEventListener?.("DOMLoaded", applyMonochromeTheme);
      animation?.destroy?.();
    };
  }, [src, shouldLoadLottie]);

  return (
    <span
      ref={mountRef}
      className={`inline-flex items-center justify-center align-middle ${className}`}
      aria-hidden="true"
    />
  );
}
