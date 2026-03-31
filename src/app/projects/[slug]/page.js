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
      description:
        "El proyecto que buscás no está en este portfolio. Diseño digital, desarrollo y dirección creativa en lautor.dev.",
    };
  }

  const title = `${project.title} · Proyecto`;
  const titleSocial = `${title} | Lautaro Torres`;
  const description =
    project.summary ||
    (Array.isArray(project.description) ? project.description[0] : project.description) ||
    project.hoverDescription ||
    "Proyecto en el portfolio de Lautaro Torres: diseño digital, desarrollo y dirección creativa.";

  const ogImage =
    project.imageUrl || project.logoUrl || "/assets/images/logos/logo-lt-4327568.svg";

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: titleSocial,
      description,
      url: `/projects/${slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      title: titleSocial,
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

