import { SITE_URL } from "@/config/site";

export const metadata = {
  title: "Monks",
  description: "AI lifestyle image generation systems with consistent product identity, built on Gemini.",
  alternates: {
    canonical: `${SITE_URL}/monks`,
  },
  robots: { index: false, follow: false },
};

export { default } from "./MonksHub";
