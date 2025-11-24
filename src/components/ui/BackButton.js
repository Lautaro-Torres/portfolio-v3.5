// BackButton.js
"use client";
import { useRouter } from "next/navigation";

export default function BackButton({ href, children = "← Back", className = "" }) {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-colors duration-300 font-montreal text-sm uppercase tracking-wider ${className}`}
    >
      {children}
    </button>
  );
}
