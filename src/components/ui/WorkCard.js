import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WorkCard({
  title,
  imageUrl,
  logoUrl,
  tags,
  href,
  containerClassName = "",
  ariaLabel,
}) {
  const router = useRouter();
  const isTransitioning = false;

  const handleClick = (e) => {
    e.preventDefault();

    if (isTransitioning) return;

    router.push(href);
  };

  const hasLogo = logoUrl?.trim(); // logo vacío = fallback

  return (
    <button
      onClick={handleClick}
      className={`
        group w-full h-[35vh] relative rounded-lg overflow-hidden shadow-lg bg-[#0a0a0a] flex flex-col
        transition-all duration-300 focus:outline-none ${containerClassName}
        ${isTransitioning ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-2xl"}
      `}
      disabled={isTransitioning}
      tabIndex={0}
      aria-label={ariaLabel || `View details for ${title}`}
    >
      {/* Background image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={`${title || "Work"} preview`}
          fill
          className="object-cover pointer-events-none transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.03]"
          priority={false}
        />
      )}

      {/* Gradient */}
      <div
        className={`
          absolute inset-0 z-10 pointer-events-none
          bg-[linear-gradient(to_bottom_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.3)_40%,transparent_100%)]
          md:bg-[linear-gradient(to_top_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.3)_40%,transparent_100%)]
          transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
          md:group-hover:backdrop-blur-lg md:group-hover:bg-[#0a0a0a]/60
        `}
      />

      {/* ------------------------------ */}
      {/* MOBILE TOP-LEFT */}
      {/* ------------------------------ */}
      <div className="absolute top-4 left-4 z-30 md:hidden">
        {hasLogo ? (
          <img
            src={logoUrl}
            alt={`${title} logo`}
            className="h-10 w-auto object-contain brightness-0 invert drop-shadow-lg"
          />
        ) : (
          <span
            className="
              text-white
              text-[1rem]
              font-medium
              drop-shadow-lg
            "
          >
            {title}
          </span>
        )}
      </div>

      {/* MOBILE TAGS */}
      <div className="absolute bottom-3 left-3 z-20 md:hidden">
        <div className="flex flex-wrap gap-1">
          {tags?.map((tag, idx) => (
            <span
              key={tag + idx}
              className="px-2 py-1 text-[10px] uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/20 rounded-full tracking-[0.12em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ------------------------------ */}
      {/* DESKTOP CONTENT */}
      {/* ------------------------------ */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:flex flex-col items-start">
        <div className="flex items-center">
          {/* Chevron */}
          <span
            className={`
              inline-flex items-center justify-center text-white/90
              transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
              opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
              mr-[-30px]
            `}
          >
            <svg
              className="w-8 h-8 drop-shadow-lg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
          </span>

          {/* Logo OR Fallback Title */}
          {hasLogo ? (
            <Image
              src={logoUrl}
              alt={`${title} logo`}
              width={240}
              height={90}
              className="object-contain drop-shadow-lg transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:translate-x-[38px]"
              style={{ width: "50%", height: "auto", maxHeight: "80px" }}
            />
          ) : (
            <span
              className="
                text-white
                text-[1.4rem]
                font-medium
                drop-shadow-lg
                transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
                group-hover:translate-x-[38px]
              "
            >
              {title}
            </span>
          )}
        </div>

        {/* DESKTOP TAGS */}
        <div className="flex flex-wrap gap-2 mt-3">
          {tags?.map((tag, idx) => (
            <span
              key={tag + idx}
              className="px-4 py-2 text-[10px] md:text-xs uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/20 rounded-full tracking-[0.15em]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
