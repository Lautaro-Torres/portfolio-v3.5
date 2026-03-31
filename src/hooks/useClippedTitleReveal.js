"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitTextToClippedChars } from "../utils/gsapSplitTitle";

export function useClippedTitleReveal(options = {}) {
  const {
    scrollTrigger = true,
    start = "top 85%",
    delay = 0,
    duration = 0.72,
    stagger = 0.03,
    ease = "power2.inOut",
    yPercent = 100,
    playWhen = true,
    fontFamily = "Anton, sans-serif",
    onComplete,
  } = options;

  const elementRef = useRef(null);
  const pluginReadyRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!pluginReadyRef.current) {
      gsap.registerPlugin(ScrollTrigger);
      pluginReadyRef.current = true;
    }

    const element = elementRef.current;
    if (!element || !playWhen) return;

    const { chars, restore } = splitTextToClippedChars(element, { fontFamily });
    if (!chars.length) {
      return () => restore();
    }

    gsap.set(chars, { yPercent });

    let animation;
    if (scrollTrigger) {
      animation = gsap.to(chars, {
        yPercent: 0,
        duration,
        stagger,
        ease,
        delay,
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: "play none none none",
          once: true,
          invalidateOnRefresh: true,
        },
        onComplete: () => {
          onCompleteRef.current?.();
        },
      });
    } else {
      animation = gsap.to(chars, {
        yPercent: 0,
        duration,
        stagger,
        ease,
        delay,
        onComplete: () => {
          onCompleteRef.current?.();
        },
      });
    }

    return () => {
      if (animation) animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) trigger.kill();
      });
      restore();
    };
  }, [scrollTrigger, start, delay, duration, stagger, ease, yPercent, playWhen, fontFamily]);

  return elementRef;
}

