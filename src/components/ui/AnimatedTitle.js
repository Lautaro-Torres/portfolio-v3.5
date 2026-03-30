"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function AnimatedTitle({
  text,
  as = "h1",
  className = "",
  charStaggerMs = 18,
  baseDelayMs = 40,
  once = true,
}) {
  const Tag = as;
  const rootRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const chars = useMemo(() => (text || "").split(""), [text]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        if (once) observer.disconnect();
      },
      { threshold: 0.22, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag ref={rootRef} className={className} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex items-center" style={{ fontFamily: "inherit", fontWeight: "inherit", letterSpacing: "inherit" }}>
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            className="inline-block overflow-hidden align-bottom"
            style={{ fontFamily: "inherit", fontWeight: "inherit", letterSpacing: "inherit", textTransform: "inherit", lineHeight: "inherit" }}
          >
            <span
              className={`inline-block will-change-transform transition-[transform,opacity] duration-500 ease-ui-emphasized ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
              style={{
                transitionDelay: `${baseDelayMs + index * charStaggerMs}ms`,
                fontFamily: "inherit",
                fontWeight: "inherit",
                letterSpacing: "inherit",
                textTransform: "inherit",
                lineHeight: "inherit",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

