import { SITE_URL } from "@/config/site";

export const metadata = {
  title: "Lifestyle Generator",
  description:
    "Generá imágenes lifestyle fotorrealistas con producto consistente usando Gemini AI.",
  alternates: {
    canonical: `${SITE_URL}/lifestyle-generator`,
  },
  robots: { index: false, follow: false },
};

export { default } from "./LifestyleGenerator";
