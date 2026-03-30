// Button.js
export default function Button({ children, href, onClick, className = "" }) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex items-center gap-2 text-white/85 text-[11px] md:text-xs uppercase tracking-[0.16em] border-b border-white/35 pb-1 hover:text-white transition-colors ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      className={`group inline-flex items-center gap-2 text-white/85 text-[11px] md:text-xs uppercase tracking-[0.16em] border-b border-white/35 pb-1 hover:text-white transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
