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

  const handleMouseDown = (e) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    const deltaX = Math.abs(e.clientX - startPos.current.x);
    const deltaY = Math.abs(e.clientY - startPos.current.y);
    
    // If mouse moved more than 5px, consider it a drag
    if (deltaX > 5 || deltaY > 5) {
      isDragging.current = true;
    }
  };

  const handleClick = (e) => {
    // Check if swiper is currently being dragged
    const swiperContainer = e.target.closest('.projects-swiper');
    if (swiperContainer && swiperContainer.classList.contains('swiper-dragging')) {
      e.preventDefault();
      return;
    }
    
    e.preventDefault();
    
    // Prevent multiple transitions
    if (isTransitioning) {
      console.log('Transition in progress, ignoring ProjectCard click');
      return;
    }
    
    const url = getProjectUrl(slug);
    console.log(`ProjectCard clicked: navigating to ${url}`);
    router.push(url);
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      className={`
        group w-full aspect-[16/9] min-h-[50vh] md:min-h-[40vh] relative rounded-lg overflow-hidden shadow-lg bg-[#0a0a0a] flex flex-col
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

      {/* Blur overlay with gradient loop (solo en desktop hover) */}
      <div
        className={`
          absolute inset-0 z-10 pointer-events-none transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
          md:group-hover:backdrop-blur-lg md:group-hover:bg-[#0a0a0a]/60
        `}
      >
        {/* Gradient Loop Animation - same as navbar/buttons */}
        <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(.4,0,.2,1)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-transparent animate-gradient-move"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-emerald-500/5 animate-gradient-move" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      {/* Project Number - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-[#0a0a0a]/40 backdrop-blur-md border border-white/30 rounded-full px-3 py-1.5 flex items-center justify-center">
          <span className="text-white/90 text-xs font-ppneue font-medium tracking-wide">
            {projectNumber}/{totalProjects}
          </span>
        </div>
      </div>

      {/* Card Content (anclado abajo izquierda, sin paddings innecesarios) */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col items-start w-auto">
        {/* Chevron y Logo en una fila, animados juntos */}
        <div className="flex items-center transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)] md:group-hover:-translate-y-2">
          {/* Chevron: animación solo desktop */}
          <span
            className={`
              hidden md:inline-flex items-center justify-center rounded-full text-white/90
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
          {/* Logo: se corre a la derecha para dejar espacio a la flecha */}
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={`${title || "Project"} logo`}
              width={190}
              height={70}
              className={`
                object-contain max-h-14 drop-shadow-lg
                transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)]
                md:group-hover:translate-x-[38px]
              `}
              style={{ width: "52%", height: "auto" }}
              loading="lazy"
            />
          )}
        </div>

        {/* Tags: debajo del logo/flecha - slide up from below on hover */}
        <div className="flex flex-wrap gap-2 items-start mt-3 transition-all duration-700 ease-[cubic-bezier(.4,0,.2,1)] translate-y-2 opacity-90 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          {tags?.map((tag, idx) => (
            <span
              key={tag + idx}
              className="px-4 py-2 text-[10px] md:text-xs font-normal tracking-[0.12em] uppercase text-white bg-[#0a0a0a]/40 backdrop-blur-md border border-white/30 rounded-full"
              style={{ letterSpacing: '0.15em' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
