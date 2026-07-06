import { SITE_URL } from "@/config/site";

export const metadata = {
  title: "Lifestyle Generator",
  description:
    "Generate photorealistic lifestyle images with consistent product identity using Gemini AI.",
  alternates: {
    canonical: `${SITE_URL}/lifestyle-generator`,
  },
  robots: { index: false, follow: false },
};

export { default } from "./LifestyleGenerator";
