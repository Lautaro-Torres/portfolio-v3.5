// Utility functions for project navigation

export const getProjectUrl = (slug) => {
  return `/projects/${slug}`;
};

export const getProjectSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

