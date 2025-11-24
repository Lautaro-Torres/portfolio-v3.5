// Button.js
export default function Button({ children, href, onClick, className = "" }) {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`px-6 py-3 rounded-full font-figtree font-bold shadow-lg transition-all duration-300 ease-in-out inline-block ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      className={`px-6 py-3 rounded-full font-figtree font-bold shadow-lg transition-all duration-300 ease-in-out ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
