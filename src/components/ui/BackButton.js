// BackButton.js
"use client";
import { useTransitionRouter } from "../../hooks/useTransitionRouter";

export default function BackButton({ href, children = "← Back", className = "" }) {
  const { push } = useTransitionRouter();

  const handleClick = (e) => {
    e.preventDefault();
    push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-colors duration-300 font-general font-normal text-sm uppercase tracking-[0.1em] ${className}`}
    >
      {children}
    </button>
  );
}
