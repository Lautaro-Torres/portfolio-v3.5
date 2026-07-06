"use client";

/** Encode filenames with spaces/parentheses for public/assets paths */
export function showcaseSrc(folder, filename) {
  return `/assets/${folder}/${encodeURIComponent(filename)}`;
}

export default function ShowcaseGallery({ items, columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <div className={`grid ${columns} gap-3`}>
      {items.map((item) => (
        <figure
          key={item.src}
          className="group rounded-sm border border-white/[0.08] bg-white/[0.02] overflow-hidden"
        >
          <div className={`relative bg-black/40 ${item.aspect ?? "aspect-[4/5]"}`}>
            <img
              src={item.src}
              alt={item.label}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <figcaption className="p-3 border-t border-white/[0.06]">
            {item.product && (
              <p className="text-[9px] uppercase tracking-[0.14em] text-[#d7ff6a]/80 mb-1">
                {item.product}
              </p>
            )}
            <p className="text-white/55 text-[11px] leading-snug">{item.label}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
