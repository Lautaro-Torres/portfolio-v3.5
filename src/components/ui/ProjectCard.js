import Image from "next/image";
import { useRef } from "react";
import { getProjectUrl } from "../../utils/projectUtils";
import { useRouter } from "next/navigation";

export default function ProjectCard({
  title,
  imageUrl,
  logoUrl,
  tags,
  slug,
  className = "",
  projectNumber = 1,
  totalProjects = 1,
}) {
  const router = useRouter();
  const isTransitioning = false;
  const startPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startPos.current = { x: clientX, y: clientY };
    isDragging.current = false;
  };

  const handleMove = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = Math.abs(clientX - startPos.current.x);
    const deltaY = Math.abs(clientY - startPos.current.y);
    
    // Only consider it a drag if horizontal movement is significant (swiper moves horizontally)
    // Require at least 15px horizontal movement and horizontal movement should be greater than vertical
    if (deltaX > 15 && deltaX > deltaY) {
      isDragging.current = true;
    }
  };

  const handleEnd = () => {
    // Reset immediately - let click handler check swiper-dragging class instead
    isDragging.current = false;
  };

  const handleClick = (e) => {
    // Check if swiper is currently being dragged - this is the primary check
    const swiperContainer = e.target.closest('.projects-swiper');
    if (swiperContainer && swiperContainer.classList.contains('swiper-dragging')) {
      e.preventDefault();
      return;
    }
    
    // Only check our own drag state if there was significant horizontal movement
    // This prevents false positives from small mouse movements during clicks
    if (isDragging.current) {
      e.preventDefault();
      return;
    }
    
    // Prevent multiple transitions
    if (isTransitioning) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    const url = getProjectUrl(slug);
    router.push(url);
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      className={`
        group w-full aspect-[16/9] min-h-[40vh] sm:min-h-[50vh] md:min-h-[40vh] relative rounded-lg overflow-hidden shadow-lg bg-[#0a0a0a] flex flex-col
        transition-all duration-300 focus:outline-none ${className}
        ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl'}
      `}
      disabled={isTransitioning}
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
      {/* Background image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={`${title || "Project"} preview`}
          fill
          className="object-cover pointer-events-none transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      )}

      {/* Gradient overlay for contrast (always visible, like WorkCard) */}
      <div
        className={`
          absolute inset-0 z-10 pointer-events-none
          bg-[linear-gradient(to_bottom_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.3)_40%,transparent_100%)]
          md:bg-[linear-gradient(to_top_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.3)_40%,transparent_100%)]
          transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
          md:group-hover:backdrop-blur-lg md:group-hover:bg-[#0a0a0a]/60
        `}
      >
        {/* Gradient Loop Animation - same as navbar/buttons (only on hover) */}
        <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(.4,0,.2,1)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-transparent animate-gradient-move"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-emerald-500/5 animate-gradient-move" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      {/* Project Number - Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="bg-[#0a0a0a]/40 backdrop-blur-md border border-white/30 rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 flex items-center justify-center">
          <span className="text-white/90 text-xs font-ppneue font-medium tracking-wide">
            {projectNumber}/{totalProjects}
          </span>
        </div>
      </div>

      {/* Card Content (desktop only) */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:flex flex-col items-start w-auto">
        {/* Chevron y Logo en una fila, animados juntos */}
        <div className="flex items-center transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)] group-hover:-translate-y-1 mb-3">
          {/* Chevron: animación solo desktop */}
          <span
            className={`
              inline-flex items-center justify-center rounded-full text-white/90
              transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
              opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
              mr-[-30px]
            `}
            aria-hidden="true"
          >
            <svg className="w-8 h-8 drop-shadow-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
          </span>
          {/* Logo: se corre a la derecha para dejar espacio a la flecha - matching WorkCard size */}
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={`${title || "Project"} logo`}
              width={240}
              height={90}
              className={`
                object-contain drop-shadow-lg
                transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
                md:group-hover:translate-x-[38px]
              `}
              style={{ width: "40%", maxWidth: "220px", height: "auto", maxHeight: "80px" }}
              loading="lazy"
            />
          )}
        </div>

        {/* Tags: debajo del logo/flecha - slide up from below on hover */}
        {/* Desktop Tags */}
        <div className="flex flex-wrap gap-2 items-start mt-2 transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)] opacity-90 group-hover:opacity-100">
          {tags?.map((tag, idx) => (
            <span
              key={tag + idx}
              className="px-4 py-2 text-xs font-normal tracking-[0.12em] uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/30 rounded-full"
              style={{ letterSpacing: '0.15em' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* MOBILE TOP-LEFT LOGO */}
      {logoUrl && (
        <div className="absolute top-4 left-4 z-30 md:hidden">
          <Image
            src={logoUrl}
            alt={`${title || "Project"} logo`}
            width={140}
            height={40}
            className="object-contain drop-shadow-lg"
            style={{ width: "40%", maxWidth: "160px", height: "auto" }}
          />
        </div>
      )}

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
    </button>
  );
}
