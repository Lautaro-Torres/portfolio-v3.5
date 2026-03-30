"use client";

import Link from "next/link";

const BASE_CTA_CLASS =
  "group inline-flex items-center gap-2 font-general font-normal text-white/85 text-[11px] md:text-xs uppercase tracking-[0.16em] border-b border-white/35 pb-1 hover:text-white transition-colors";

function ArrowIcon() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-[1.1em] w-[1.1em] overflow-hidden"
    >
      <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-ui-pop group-hover:-translate-y-[135%]">
        <svg
          viewBox="0 0 16 16"
          className="h-[0.95em] w-[0.95em]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.75 11.25L11.25 3.75M6 3.75H11.25V9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="absolute inset-0 flex translate-y-[135%] items-center justify-center transition-transform duration-300 ease-ui-pop group-hover:translate-y-0">
        <svg
          viewBox="0 0 16 16"
          className="h-[0.95em] w-[0.95em]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.75 11.25L11.25 3.75M6 3.75H11.25V9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}

export default function TextCtaLink({
  text,
  href,
  onClick,
  className = "",
  external,
  ariaLabel,
}) {
  const classes = `${BASE_CTA_CLASS} ${className}`.trim();
  const isExternalHref =
    typeof href === "string" &&
    /^(https?:\/\/|mailto:|tel:)/i.test(href);
  const shouldOpenExternal = external ?? isExternalHref;

  const content = (
    <>
      {text}
      <ArrowIcon />
    </>
  );

  if (typeof onClick === "function" && !href) {
    return (
      <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel}>
        {content}
      </button>
    );
  }

  if (href && shouldOpenExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href || "#"} className={classes} aria-label={ariaLabel}>
      {content}
    </Link>
  );
}

