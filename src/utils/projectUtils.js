// Utility functions for project navigation

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

/** Video URL for grid cards: explicit `videoUrl`, else first gallery clip. */
export function getProjectCardVideoUrl(project) {
  if (project?.videoUrl && typeof project.videoUrl === "string") return project.videoUrl;
  const gallery = project?.gallery;
  if (!Array.isArray(gallery)) return undefined;
  for (const item of gallery) {
    if (item?.type === "video" && item.src) return item.src;
    if (typeof item?.src === "string" && VIDEO_EXT.test(item.src)) return item.src;
  }
  return undefined;
}

export const getProjectUrl = (slug) => {
  return `/projects/${slug}`;
};

export const getProjectSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

