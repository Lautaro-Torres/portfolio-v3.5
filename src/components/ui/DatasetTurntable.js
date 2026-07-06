"use client";

import { useState } from "react";

const PRODUCTS = [
  { id: "pale", name: "Pale Ale" },
  { id: "belgian", name: "Belgian" },
  { id: "porter", name: "Porter" },
];

const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function angleSrc(slug, deg) {
  const suffix = deg === 0 ? "00" : String(deg);
  return `/datasets/${slug}/${slug}_${suffix}.jpg`;
}

function labelSrc(slug) {
  return `/datasets/${slug}/etiqueta-${slug}-2022.png`;
}

export default function DatasetTurntable() {
  const [active, setActive] = useState("pale");
  const product = PRODUCTS.find((p) => p.id === active);

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/15">
      <div className="flex border-b border-white/[0.06]">
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`flex-1 px-3 py-2.5 text-[10px] uppercase tracking-[0.12em] transition-colors ${
              active === p.id
                ? "bg-[#d7ff6a]/[0.08] text-[#d7ff6a] border-b-2 border-[#d7ff6a]"
                : "text-white/40 hover:text-white/65"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="p-4">
        <p className="text-[9px] uppercase tracking-[0.14em] text-white/30 mb-3">
          {product.name} · 8 angle renders (Blender)
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ANGLES.map((deg) => (
            <div
              key={deg}
              className="relative aspect-square rounded-sm bg-[#0a0a0a] overflow-hidden border border-white/[0.06]"
            >
              <img
                src={angleSrc(active, deg)}
                alt={`${product.name} ${deg}°`}
                className="absolute inset-0 w-full h-full object-contain mix-blend-screen p-1"
                loading="lazy"
              />
              <span className="absolute bottom-1 left-1 text-[8px] uppercase tracking-[0.1em] text-white/35 bg-black/50 px-1 py-0.5 rounded-sm">
                {deg}°
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-[9px] uppercase tracking-[0.14em] text-white/30">
              Flat label artwork
            </p>
            <span className="text-[8px] uppercase tracking-[0.1em] text-[#d7ff6a]/80 border border-[#d7ff6a]/25 px-1.5 py-0.5 rounded-sm">
              Gemini ref
            </span>
          </div>
          <div className="relative aspect-[16/7] rounded-sm bg-[#0a0a0a] border border-white/[0.06] overflow-hidden">
            <img
              src={labelSrc(active)}
              alt={`${product.name} label`}
              className="absolute inset-0 w-full h-full object-contain p-2"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
