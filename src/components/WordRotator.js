"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const WORDS = ["DEVELOPER", "DESIGNER", "DIRECTOR", "HUMAN"];
const WORD_DURATION_MS = 2600;
export const WORD_ROTATOR_TRANSITION_DURATION = 0.72;
const STAGGER = 0.03;
const EASE = "power2.inOut";
const NOOP = () => {};

function buildWordNode(word) {
  const wordEl = document.createElement("div");
  wordEl.style.display = "inline-flex";
  wordEl.style.alignItems = "flex-end";
  wordEl.style.lineHeight = "1";
  wordEl.style.fontFamily = "'Anton', sans-serif";
  wordEl.style.color = "inherit";

  const chars = [];
  for (const char of word) {
    const clip = document.createElement("span");
    clip.style.display = "inline-block";
    clip.style.overflow = "hidden";
    clip.style.height = "1em";
    clip.style.lineHeight = "1";
    clip.style.verticalAlign = "bottom";
    clip.style.fontFamily = "'Anton', sans-serif";
    clip.style.color = "inherit";

    const inner = document.createElement("span");
    inner.textContent = char;
    inner.style.display = "inline-block";
    inner.style.lineHeight = "1";
    inner.style.willChange = "transform";
    inner.style.fontFamily = "'Anton', sans-serif";
    inner.style.color = "inherit";

    clip.appendChild(inner);
    wordEl.appendChild(clip);
    chars.push(inner);
  }

  return { node: wordEl, chars };
}

export default function WordRotator({
  className = "",
  isReady = true,
  onWordChange = NOOP,
  onTransitionTimeline = NOOP,
}) {
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const currentLayerRef = useRef(null);
  const nextLayerRef = useRef(null);
  const measureRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const currentIndexRef = useRef(0);
  const currentWordObjRef = useRef(null);
  const nextWordObjRef = useRef(null);
  const timerRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!mounted || !isReady) return;
    if (!rootRef.current || !viewportRef.current || !currentLayerRef.current || !nextLayerRef.current || !measureRef.current) return;

    let disposed = false;

    const init = async () => {
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch (_) {}
      }
      if (disposed) return;

      const measureEl = measureRef.current;
      const viewport = viewportRef.current;
      const currentLayer = currentLayerRef.current;
      const nextLayer = nextLayerRef.current;

      let maxWidth = 0;
      WORDS.forEach((word) => {
        measureEl.textContent = word;
        maxWidth = Math.max(maxWidth, measureEl.getBoundingClientRect().width);
      });
      viewport.style.width = `${Math.ceil(maxWidth)}px`;
      viewport.style.minWidth = `${Math.ceil(maxWidth)}px`;
      measureEl.textContent = "";

      const first = buildWordNode(WORDS[0]);
      currentLayer.appendChild(first.node);
      currentWordObjRef.current = first;
      currentIndexRef.current = 0;
      onWordChange(WORDS[0].toLowerCase());

      const second = buildWordNode(WORDS[1]);
      nextLayer.appendChild(second.node);
      nextWordObjRef.current = second;
      gsap.set(second.chars, { yPercent: 100 });

      const runTransition = () => {
        const currentObj = currentWordObjRef.current;
        const nextObj = nextWordObjRef.current;
        const nextIndex = (currentIndexRef.current + 1) % WORDS.length;

        if (!currentObj || !nextObj) return;
        const nextMode = WORDS[nextIndex].toLowerCase();
        // Visible transition starts now, so external systems sync from this exact tick.
        onWordChange(nextMode);

        tlRef.current = gsap.timeline({
          onComplete: () => {
            currentLayer.innerHTML = "";
            currentLayer.appendChild(nextObj.node);

            currentWordObjRef.current = nextObj;
            currentIndexRef.current = nextIndex;

            nextLayer.innerHTML = "";
            const upcomingIndex = (nextIndex + 1) % WORDS.length;
            const upcoming = buildWordNode(WORDS[upcomingIndex]);
            nextLayer.appendChild(upcoming.node);
            gsap.set(upcoming.chars, { yPercent: 100 });
            nextWordObjRef.current = upcoming;

            timerRef.current = setTimeout(runTransition, WORD_DURATION_MS);
          },
        });
        onTransitionTimeline(tlRef.current, nextMode, WORD_ROTATOR_TRANSITION_DURATION);

        tlRef.current.to(
          currentObj.chars,
          {
            yPercent: -100,
            duration: WORD_ROTATOR_TRANSITION_DURATION,
            stagger: STAGGER,
            ease: EASE,
          },
          0
        );

        tlRef.current.to(
          nextObj.chars,
          {
            yPercent: 0,
            duration: WORD_ROTATOR_TRANSITION_DURATION,
            stagger: STAGGER,
            ease: EASE,
          },
          0
        );
      };

      timerRef.current = setTimeout(runTransition, WORD_DURATION_MS);
    };

    init();

    return () => {
      disposed = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (tlRef.current) tlRef.current.kill();
      if (currentLayerRef.current) currentLayerRef.current.innerHTML = "";
      if (nextLayerRef.current) nextLayerRef.current.innerHTML = "";
    };
  }, [mounted, isReady, onWordChange, onTransitionTimeline]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className={`flex justify-end items-end ${className}`}
      style={{
        fontFamily: "'Anton', sans-serif",
        lineHeight: 1,
      }}
    >
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          lineHeight: 1,
          fontFamily: "'Anton', sans-serif",
        }}
      />

      <div
        ref={viewportRef}
        style={{
          position: "relative",
          height: "1em",
          minHeight: "1em",
        }}
      >
        <div
          ref={currentLayerRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: isDesktop ? "flex-end" : "flex-start",
            alignItems: "flex-end",
            lineHeight: 1,
          }}
        />
        <div
          ref={nextLayerRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: isDesktop ? "flex-end" : "flex-start",
            alignItems: "flex-end",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
