import TextCtaLink from "../components/ui/TextCtaLink";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-[5%] py-16">
      <div className="text-center w-full max-w-[min(100%,520px)]">
        <p className="font-general font-light text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-white/40 mb-5 md:mb-6">
          Not found
        </p>
        <h1 className="font-anton font-normal uppercase text-white leading-[0.88] tracking-[0.02em] text-[clamp(5rem,28vw,14rem)] select-none">
          404
        </h1>
        <p className="mt-8 md:mt-10 font-general font-normal text-white/62 text-[15px] md:text-lg leading-relaxed max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
          <TextCtaLink href="/" text="Back home" ariaLabel="Go to homepage" />
          <TextCtaLink href="/projects" text="Projects" ariaLabel="View projects" />
        </div>
      </div>
    </div>
  );
}
