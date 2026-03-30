"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const TEXT_RTL =
  "AFTER EFFECTS • PHOTOSHOP • PREMIERE • ILLUSTRATOR • BLENDER • FIGMA •";

// GSAP helper based on seamless horizontalLoop pattern
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
  const pixelsPerSecond = (config.speed || 1) * 100;
  const snap =
    config.snap === false
      ? (v) => v
      : gsap.utils.snap(config.snap || 1);

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
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);

  for (let i = 0; i < length; i++) {
    const item = items[i];
    const curX = (xPercents[i] / 100) * widths[i];
    const distanceToStart = item.offsetLeft + curX - startX;
    const distanceToLoop =
      distanceToStart +
      widths[i] * gsap.getProperty(item, "scaleX");

    tl.to(
      item,
      {
        xPercent: snap(
          ((curX - distanceToLoop) / widths[i]) * 100
        ),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) /
            pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index, vars = {}) {
    if (Math.abs(index - curIndex) > length / 2) {
      index += index > curIndex ? -length : length;
    }
    const newIndex = gsap.utils.wrap(0, length, index);
    let time = times[newIndex];

    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }

    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true);

  return tl;
}

function FullBleed({ children }) {
  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden py-1 md:py-1.5" style={{ backgroundColor: "#0a0a0a" }}>
      {children}
    </div>
  );
}

function MarqueeTrack({ text, speed = 0.5, repeat = 8, direction = "left" }) {
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
        repeat: -1,
        paddingRight: 0,
        paddingLeft: 0,
      });
    };

    if (typeof document !== "undefined" && "fonts" in document && document.fonts?.ready) {
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
  }, [text, speed]);

  const items = Array.from({ length: repeat }, (_, i) => (
    <span
      key={i}
      className="marquee-item text-white text-sm md:text-lg tracking-wide select-none inline-block mr-[30px]"
      style={{
        letterSpacing: "0.15em",
        transform: direction === "right" ? "scaleX(-1)" : "none",
      }}
    >
      {text}
    </span>
  ));

  return (
    <div
      ref={trackRef}
      className="flex whitespace-nowrap will-change-transform"
      style={{
        transform: direction === "right" ? "scaleX(-1)" : "none",
      }}
    >
      {items}
    </div>
  );
}

export default function MarqueeSection2() {
  return (
    <FullBleed>
      <MarqueeTrack text={TEXT_RTL} direction="right" speedSeconds={26} />
    </FullBleed>
  );
}
