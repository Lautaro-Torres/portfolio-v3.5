import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-anton text-white leading-none">
          Project not found
        </h1>
        <p className="text-white/70 text-lg max-w-md mx-auto">
          The project you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/#projects"
          className="inline-block px-8 py-4 rounded-full font-figtree font-bold bg-white/15 backdrop-blur-md border border-white/30 hover:bg-white/25 hover:border-white/50 hover:scale-105 transition-all duration-300"
        >
          Back to Projects
        </Link>
      </div>
    </div>
  );
}


