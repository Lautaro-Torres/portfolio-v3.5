"use client";

import { useState } from "react";
import { experiences } from "../../data/experiences";

export default function ExperienceAccordion({ className = "" }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={className}>
      <div className="hidden md:grid grid-cols-[2.15fr_1.65fr_0.9fr] gap-5 border-t border-b border-white/30 py-3.5 text-[13px] font-general font-light uppercase tracking-[0.15em] text-white/88">
        <span>Company</span>
        <span>Role</span>
        <span className="text-right">Period</span>
      </div>

      {experiences.map((exp, idx) => (
        <div
          key={`${idx}-${exp.company}-${exp.role}-${exp.period}`}
          className="experience-row border-b border-white/18"
        >
          <button
            className="md:hidden w-full py-4 text-left flex justify-between items-start focus:outline-none"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <div className="flex-1">
              <span className="block text-xs text-white/60 mb-2">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="block font-general font-light text-white text-lg mb-2 uppercase tracking-[0.12em]">
                {exp.company}
              </span>
              <span className="block font-general font-normal text-white/82 text-base normal-case leading-relaxed">
                {exp.role}
              </span>
              <span className="block font-general font-normal text-white/72 text-sm normal-case leading-relaxed mt-1">
                {exp.period}
              </span>
            </div>
            <div className="ml-4 flex-shrink-0 self-center">
              <svg
                className={`w-5 h-5 text-white/60 transition-transform duration-300 ${
                  openIndex === idx ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <button
            className="hidden md:grid group w-full py-3 px-2 -mx-2 rounded-sm text-left transition-colors duration-200 hover:bg-white/[0.03] grid-cols-[2.15fr_1.65fr_0.9fr] gap-5"
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <p className="font-general font-light text-[14px] leading-[1.2] uppercase tracking-[0.12em] text-white/94 transition-transform duration-200 group-hover:translate-x-1">
              {exp.company}
            </p>
            <p className="font-general font-light text-[12px] uppercase tracking-[0.12em] text-white/82">{exp.role}</p>
            <p className="font-general font-light text-[12px] uppercase tracking-[0.12em] text-white/88 text-right">
              {exp.period}
            </p>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ${
              openIndex === idx ? "max-h-[680px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pt-4 pb-6 md:pt-5 md:pb-9 px-1 md:px-0 md:max-w-[920px]">
              {exp.location ? (
                <p className="font-general font-light text-xs md:text-[11px] uppercase tracking-[0.14em] text-white/56 mb-3">
                  {exp.location}
                </p>
              ) : null}

              <p className="font-general font-normal text-white text-sm md:text-[17px] leading-relaxed md:leading-[1.62]">
                {exp.description}
              </p>

              <ul className="mt-4 md:mt-5 space-y-3 md:space-y-2.5 pl-0 list-none md:list-disc md:pl-5 md:marker:text-white/45">
                {exp.highlights.map((highlight, i) => (
                  <li
                    key={`${idx}-highlight-${i}`}
                    className="font-general font-normal text-white/70 text-sm md:text-[17px] leading-relaxed md:leading-[1.62] pl-0 md:pl-1"
                  >
                    <span className="md:hidden">• </span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
