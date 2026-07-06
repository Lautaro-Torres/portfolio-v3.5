/**
 * Editorial layout primitives for Monks task overviews.
 * Mirrors audit bento cards + project works 12-column grids.
 */

function Card({ children, className = "", style }) {
  return (
    <div
      style={style}
      className={`overflow-hidden rounded-2xl border border-white/[0.075] bg-[linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018)_42%,rgba(255,255,255,0.035))] shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:rounded-[1.35rem] ${className}`}
    >
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <span className="font-general text-[11px] uppercase tracking-[0.2em] text-white/32">
      {children}
    </span>
  );
}

export function OverviewShell({ children }) {
  return (
    <main className="overview-page min-h-screen bg-[#0a0a0a] text-white">
      <div className="w-full bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,#0a0a0a_0%,#0d0d0d_48%,#0a0a0a_100%)] pb-12">
        <div className="mx-auto w-full max-w-[1720px] px-3 sm:px-4 md:px-[5%]">
          {children}
        </div>
      </div>
    </main>
  );
}

export function OverviewHero({ backHref, label, title, subtitle, aside }) {
  return (
    <section className="border-b border-white/[0.07] pb-6 pt-16 md:pb-10 md:pt-20">
      <div className="mb-6">{backHref}</div>
      <div className="grid gap-6 md:grid-cols-[1fr_minmax(280px,400px)] md:items-end md:gap-10">
        <div className="min-w-0">
          <Label>{label}</Label>
          <h1 className="mt-2 font-anton text-[clamp(2.8rem,9vw,7.5rem)] font-normal uppercase leading-[0.88] tracking-[0.005em] text-white">
            {title}
          </h1>
        </div>
        <div className="flex flex-col gap-4 md:items-end md:pb-1 md:text-right">
          {subtitle && (
            <p className="max-w-[400px] font-general text-[0.95rem] leading-[1.65] text-white/45 md:text-[1rem]">
              {subtitle}
            </p>
          )}
          {aside}
        </div>
      </div>
    </section>
  );
}

export function OverviewSection({ label, title, intro, children, className = "" }) {
  return (
    <section className={`py-8 md:py-10 ${className}`}>
      {(label || title || intro) && (
        <div className="mb-6 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8 md:mb-8">
          {(label || title) && (
            <div className="lg:col-span-4 xl:col-span-3">
              {label && <Label>{label}</Label>}
              {title && (
                <h2 className="mt-2 font-anton text-[clamp(1.6rem,3vw,2.6rem)] font-normal uppercase leading-[0.95] text-white">
                  {title}
                </h2>
              )}
            </div>
          )}
          {intro && (
            <div className="lg:col-span-8 xl:col-span-9">
              <StoryIntro>{intro}</StoryIntro>
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export function StoryIntro({ children, className = "" }) {
  return (
    <p className={`font-general text-[0.98rem] leading-[1.7] text-white/55 md:text-base ${className}`}>
      {children}
    </p>
  );
}

export function StoryTimeline({ steps }) {
  return (
    <div className="flex flex-col gap-3 md:gap-5">
      {steps.map((step, i) => (
        <StoryStep key={step.step} {...step} isLast={i === steps.length - 1} />
      ))}
    </div>
  );
}

function StoryStep({ step, title, narrative, decision, outcome, children }) {
  return (
    <Card className="p-4 sm:p-6 md:p-8 lg:p-9">
      <div className="flex flex-col gap-5 md:gap-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4 md:gap-6">
            <span className="shrink-0 font-anton text-[clamp(2.2rem,4vw,3.25rem)] leading-none text-[#d7ff6a]/35">
              {String(step).padStart(2, "0")}
            </span>
            <div className="min-w-0 pt-1">
              <Label>{`Step ${String(step).padStart(2, "0")}`}</Label>
              <h3 className="mt-1.5 font-anton text-[clamp(1.15rem,2.1vw,1.65rem)] font-normal uppercase leading-[1.05] tracking-[0.01em] text-white">
                {title}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-12 lg:gap-8">
          <p className="font-general text-[0.92rem] leading-[1.68] text-white/55 lg:col-span-7 xl:col-span-8 md:text-[0.98rem]">
            {narrative}
          </p>

          {(decision || outcome) && (
            <div className="flex flex-col gap-3 lg:col-span-5 xl:col-span-4">
              {decision && (
                <div className="rounded-xl border border-[#d7ff6a]/20 bg-[#d7ff6a]/[0.04] px-4 py-3.5 md:px-5">
                  <p className="mb-1.5 font-general text-[10px] uppercase tracking-[0.16em] text-[#d7ff6a]/80">
                    Why we chose this
                  </p>
                  <p className="font-general text-[0.84rem] leading-[1.58] text-white/62 md:text-[0.88rem]">
                    {decision}
                  </p>
                </div>
              )}
              {outcome && (
                <div className="rounded-xl border border-white/[0.08] bg-black/15 px-4 py-3.5 md:px-5">
                  <p className="mb-1.5 font-general text-[10px] uppercase tracking-[0.16em] text-white/35">
                    What happened next
                  </p>
                  <p className="font-general text-[0.84rem] leading-[1.58] text-white/50 md:text-[0.88rem]">
                    {outcome}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {children && (
          <div className="border-t border-white/[0.06] pt-5 md:pt-6">{children}</div>
        )}
      </div>
    </Card>
  );
}

export function OverviewSplitSection({ label, title, description, children, reverse = false }) {
  return (
    <section className="py-8 md:py-10">
      <div
        className={`grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10 ${
          reverse ? "" : ""
        }`}
      >
        <div className={`lg:col-span-4 ${reverse ? "lg:order-2" : ""}`}>
          {label && <Label>{label}</Label>}
          {title && (
            <h2 className="mt-2 font-anton text-[clamp(1.5rem,2.8vw,2.4rem)] font-normal uppercase leading-[0.95] text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 font-general text-[0.9rem] leading-[1.65] text-white/45">
              {description}
            </p>
          )}
        </div>
        <div className={`min-w-0 lg:col-span-8 ${reverse ? "lg:order-1" : ""}`}>
          {children}
        </div>
      </div>
    </section>
  );
}

export function OverviewCta({ label, title, description, button }) {
  return (
    <section className="py-8 md:py-10">
      <Card className="border-[#d7ff6a]/20 bg-[#d7ff6a]/[0.04] p-6 md:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            {label && <Label>{label}</Label>}
            {title && (
              <h2 className="mt-2 font-anton text-[clamp(1.5rem,3vw,2rem)] font-normal uppercase leading-none text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 font-general text-[0.88rem] leading-relaxed text-white/45">
                {description}
              </p>
            )}
          </div>
          {button}
        </div>
      </Card>
    </section>
  );
}

export { Card as OverviewCard, Label as OverviewLabel };
