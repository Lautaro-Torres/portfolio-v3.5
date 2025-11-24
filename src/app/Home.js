"use client";
import dynamic from "next/dynamic";
import HeroSection from "../sections/HeroSection";
const AboutSection = dynamic(() => import("../sections/AboutSection"), { ssr: false });
const Projects = dynamic(() => import("../sections/Projects"), { ssr: false });
const MarqueeSection = dynamic(() => import("../sections/MarqueeSection"), { ssr: false });
const MarqueeSection2 = dynamic(() => import("../sections/MarqueeSection2"), { ssr: false });
const ExperimentsSection = dynamic(() => import("../sections/ExperimentsSection"), { ssr: false });

export default function Home() {
  return (
    <>
      <main className="relative w-full pt-20">
        <HeroSection />
        <div className="w-full max-w-[1900px] mx-auto px-[5%]">
          <div id="about" className="mb-12 md:mb-24 lg:mb-32">
            <AboutSection />
          </div>
        </div>
        <MarqueeSection />
        <MarqueeSection2 />
        <div className="w-full max-w-[1900px] mx-auto px-[5%]">
          <div className="my-12 md:my-24 lg:my-32" />
          <div id="projects" className="mb-12 md:mb-24 lg:mb-32">
            <Projects />
          </div>
          <div id="experiments" className="mb-12 md:mb-24 lg:mb-32">
            <ExperimentsSection />
          </div>
        </div>
      </main>
    </>
  );
}

