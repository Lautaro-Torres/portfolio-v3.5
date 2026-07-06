import { SITE_URL } from "@/config/site";

export const metadata = {
  title: "Monks",
  description: "Sistema de generación de imágenes lifestyle con producto consistente, vía IA generativa.",
  alternates: {
    canonical: `${SITE_URL}/monks`,
  },
  robots: { index: false, follow: false },
};

export { default } from "./MonksHub";
