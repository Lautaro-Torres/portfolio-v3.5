import { SITE_URL } from "@/config/site";

export const metadata = {
  title: "Task 1 — Campo Alegre",
  description:
    "Generador de imágenes lifestyle multi-producto para Campo Alegre, con dual-model chain de Gemini.",
  alternates: {
    canonical: `${SITE_URL}/monks/task-1`,
  },
  robots: { index: false, follow: false },
};

export { default } from "./Task1Generator";
