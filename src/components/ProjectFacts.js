/**
 * Project info tags below title.
 * Mobile: stacked (label above value).
 * Desktop: single horizontal line (label value · label value ...).
 */
export function ProjectFacts({ year, country, industry, timeOfProject }) {
  const facts = [
    year && { label: "Year", value: year },
    country && { label: "Country", value: country },
    industry && { label: "Industry", value: industry },
    timeOfProject && { label: "Duration", value: timeOfProject },
  ].filter(Boolean);

  if (facts.length === 0) return null;

  return (
    <div className="font-general mt-[clamp(0.75rem,2vw,1.5rem)]">
      {/* Mobile: stacked layout */}
      <div className="flex flex-wrap gap-x-[clamp(1rem,4vw,2rem)] gap-y-[clamp(0.75rem,2vw,1.5rem)] md:hidden">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col">
            <span className="text-white/80 font-light uppercase text-[clamp(0.75rem,1.6vw,0.9rem)] tracking-[0.12em]">
              {fact.label}
            </span>
            <span className="text-white/80 font-normal text-[clamp(0.7rem,1.4vw,0.8rem)] mt-[0.25rem] tracking-normal">
              {fact.value}
            </span>
          </div>
        ))}
      </div>
      {/* Desktop: single horizontal line */}
      <div className="hidden md:flex flex-wrap items-baseline gap-x-[clamp(0.5rem,1.5vw,1rem)] gap-y-[0.25rem]">
        {facts.map((fact) => (
          <span key={fact.label} className="inline-flex items-baseline gap-x-[0.375rem]">
            <span className="text-white/80 font-light uppercase text-[clamp(0.75rem,1.6vw,0.9rem)] tracking-[0.12em]">
              {fact.label}
            </span>
            <span className="text-white/80 font-normal text-[clamp(0.75rem,1.6vw,0.9rem)] tracking-normal">
              {fact.value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
