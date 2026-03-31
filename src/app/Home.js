"use client";
import { useEffect } from "react";
import HeroSection from "../sections/HeroSection";
import AboutSection from "../sections/AboutSection";
import Projects from "../sections/Projects";
import { markRouteReady } from "../utils/routeReadyGate";
// TEMP: Experiments feature disabled
// const ExperimentsSection = dynamic(() => import("../sections/ExperimentsSection"), { ssr: false });

export default function Home() {
  useEffect(() => {
    const id = setTimeout(() => markRouteReady("/"), 9000);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="relative w-full">
      <HeroSection />
      <div className="w-[90%] mx-auto">
        <div id="about" className="mt-0 pt-0 mb-3 md:mb-4 lg:mb-6">
          <AboutSection />
        </div>
        <div className="my-2 md:my-4 lg:my-6" />
        <div id="projects" className="mb-6 md:mb-10 lg:mb-12">
          <Projects />
        </div>
      </div>
    </main>
  );
}
