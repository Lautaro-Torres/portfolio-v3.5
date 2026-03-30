import { notFound } from "next/navigation";
import { projectsData } from "../../../data/projects";
import ProjectDetail from "./ProjectDetail";

export function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Proyecto no encontrado",
      description: "El proyecto que estás buscando no existe en el portfolio de Lautaro Torres.",
    };
  }

  const title = `${project.title} · Proyecto | Lautaro Torres`;
  const description =
    project.summary ||
    (Array.isArray(project.description) ? project.description[0] : project.description) ||
    project.hoverDescription ||
    "Detalle de proyecto en el portfolio de Lautaro Torres, Creative Developer & Designer.";

  const ogImage =
    project.imageUrl || project.logoUrl || "/assets/images/logos/logo-lt-4327568.svg";

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/projects/${slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      title,
      description,
      images: [ogImage],
      card: "summary_large_image",
    },
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}

