"use client";

/**
 * Next.js route loading UI (RSC / chunk pending).
 * Honest: no numeric progress — only indeterminate motion + copy.
 */
export default function ProjectDetailLoading() {
  return (
    <div
      className="fixed inset-0 z-[2147483500] bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-6 px-6"
      style={{ isolation: "isolate" }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="text-white/70 text-sm font-general font-light tracking-[0.14em] uppercase text-center max-w-md">
        Preparando proyecto…
      </p>
      <div className="w-64 h-1 bg-white/10 rounded-full route-loader-track">
        <div className="route-loader-indeterminate" />
      </div>
    </div>
  );
}
