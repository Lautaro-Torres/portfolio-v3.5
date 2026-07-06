"use client";

import { useImageLightbox, ImageLightbox, LightboxTrigger } from "@/components/ui/ImageLightbox";

/** Encode filenames with spaces/parentheses for public/assets paths */
export function showcaseSrc(folder, filename) {
  return `/assets/${folder}/${encodeURIComponent(filename)}`;
}

export default function ShowcaseGallery({ items, columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" }) {
  const lightbox = useImageLightbox();

  const lightboxItems = items.map((item) => ({
    src: item.src,
    alt: item.label,
    label: item.product ? `${item.product} · ${item.label}` : item.label,
  }));

  return (
    <>
      <div className={`grid ${columns} gap-3`}>
        {items.map((item, index) => (
          <figure
            key={item.src}
            className="group overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.02]"
          >
            <LightboxTrigger
              items={lightboxItems}
              index={index}
              onOpen={lightbox.open}
              className={`relative bg-black/40 ${item.aspect ?? "aspect-[4/5]"}`}
            >
              <img
                src={item.src}
                alt={item.label}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </LightboxTrigger>
            <figcaption className="border-t border-white/[0.06] p-3">
              {item.product && (
                <p className="mb-1 text-[9px] uppercase tracking-[0.14em] text-[#d7ff6a]/80">
                  {item.product}
                </p>
              )}
              <p className="text-[11px] leading-snug text-white/55">{item.label}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <ImageLightbox
        items={lightbox.items}
        index={lightbox.index}
        onClose={lightbox.close}
        onNavigate={lightbox.go}
      />
    </>
  );
}
