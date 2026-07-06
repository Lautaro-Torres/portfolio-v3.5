import { SITE_URL } from "@/config/site";

export const metadata = {
  title: "Task 1 — Campo Alegre",
  description:
    "Multi-product lifestyle image generator for Campo Alegre, powered by a Gemini dual-model chain.",
  alternates: {
    canonical: `${SITE_URL}/monks/task-1`,
  },
  robots: { index: false, follow: false },
};

export { default } from "./Task1Generator";
