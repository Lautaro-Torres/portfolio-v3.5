import { projectsData } from "../data/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lautor.dev";

export default function sitemap() {
  const now = new Date();
  const staticRoutes = ["", "/projects", "/archives", "/experience"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const projectRoutes = projectsData.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
