// components/MarqueeSection.js
"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const TEXT_RTL =
  "WORDPRESS • REACT • NEXT • THREE.JS • JAVASCRIPT • HTML5 • CSS •";

function horizontalLoop(items, config = {}) {
  items = gsap.utils.toArray(items);
  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
  });

  const length = items.length;
  const startX = items[0].offsetLeft;
  const times = [];
  const widths = [];
  const xPercents = [];
  let curIndex = 0;
  const pps = (config.speed || 1) * 100;
  const snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1);

  gsap.set(items, {
    xPercent: (i, el) => {
      const w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
      );
      return xPercents[i];
    },
  });
  gsap.set(items, { x: 0 });

  const totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);

  for (let i = 0; i < length; i++) {
    const item = items[i];
    const curX = (xPercents[i] / 100) * widths[i];
    const distStart = item.offsetLeft + curX - startX;
    const distLoop = distStart + widths[i] * gsap.getProperty(item, "scaleX");

    tl.to(item, { xPercent: snap(((curX - distLoop) / widths[i]) * 100), duration: distLoop / pps }, 0)
      .fromTo(
        item,
        { xPercent: snap(((curX - distLoop + totalWidth) / widths[i]) * 100) },
        {
          xPercent: xPercents[i],
          duration: (curX - distLoop + totalWidth - curX) / pps,
          immediateRender: false,
        },
        distLoop / pps
      )
      .add("label" + i, distStart / pps);

    times[i] = distStart / pps;
  }

  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }

  return tl;
}

function FullBleed({ children }) {
  return (
    <div className="w-screen overflow-hidden py-2" style={{ backgroundColor: '#0a0a0a' }}>
      {children}
    </div>
  );
}

function MarqueeTrack({ text, speed = 0.5, repeat = 16 }) {
  const trackRef = useRef(null);
  const tlRef = useRef(null);

  useLayoutEffect(() => {
    const init = () => {
      tlRef.current?.kill();
      tlRef.current = null;

      const items = trackRef.current?.querySelectorAll(".marquee-item");
      if (!items?.length) return;

      tlRef.current = horizontalLoop(items, {
        speed,
        paused: false,
        repeat: -1,
        paddingRight: 0,
        snap: 1,
      });
    };

    if ("fonts" in document && document.fonts?.ready) {
      document.fonts.ready.then(init);
    } else {
      init();
    }

    const onResize = () => init();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      tlRef.current?.kill();
    };
  }, [text, speed, repeat]);

  const items = Array.from({ length: repeat }, (_, i) => (
    <span
      key={i}
      className="marquee-item text-white text-sm md:text-lg tracking-wide select-none inline-block px-1"
      style={{ letterSpacing: '0.15em' }}
    >
      {text}
    </span>
  ));

  return (
    <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
      {items}
    </div>
  );
}

export default function MarqueeSection() {
  return (
    <FullBleed>
      <MarqueeTrack text={TEXT_RTL} speed={0.6} repeat={8} />
    </FullBleed>
  );
}
