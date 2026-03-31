/**
 * Canonical origin for metadataBase, Open Graph, Twitter cards, and canonical URLs.
 * In Vercel (or any host), set NEXT_PUBLIC_SITE_URL to the production origin without a trailing slash,
 * e.g. https://lautor.dev — so OG/Twitter resolve absolute image URLs and avoid fallback previews.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lautor.dev";

/** Default social share title (English, editorial positioning). */
export const SHARE_TITLE =
  "Lautaro Torres — Digital Designer, Developer & Creative Director";

/** Default social share description (English). */
export const SHARE_DESCRIPTION =
  "Designing and building distinctive digital experiences through creative direction, design and development.";

/**
 * Default OG/Twitter image (public/ → served from site root).
 * Raster 1200×630 recommended for Facebook, LinkedIn, Slack, X/Twitter large cards.
 */
export const DEFAULT_OG_IMAGE_PATH = "/assets/images/og-image.jpg";

export const DEFAULT_OG_IMAGE = {
  url: DEFAULT_OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: "Lautaro Torres — digital design, development and creative direction",
  type: "image/jpeg",
};

/**
 * Future: per-route or per-project previews can extend this shape in generateMetadata,
 * e.g. { ...DEFAULT_OG_IMAGE, url: project.ogImagePath } with fallbacks to DEFAULT_OG_IMAGE_PATH.
 */
