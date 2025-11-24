// src/data/experiments.js

export const experimentsData = [
  {
    id: 1,
    title: "Pulsar",
    slug: "pulsar",
    summary:
      "Creative direction, visual identity, and production of an electronic music event series in Salta.",
    description:
      "Pulsar is an electronic event series that merges music, visual art, and design. I was responsible for the full creative direction — from developing the logo and visual identity to producing flyers, audiovisual content, live visuals, and the overall event communication. Beyond the visual aspect, I also produce and organize each edition, managing the line-up, the atmosphere, and the coordination with DJs. The goal was to create a coherent, modern, and recognizable sound and visual brand within the local scene.",

    // ✅ Main hero section with clickable background video
    videoUrl: "/assets/experiments/pulsar/pruebaVideo.mkv", // your local or loop video
    imageUrl: "/assets/experiments/pulsar/pulsar-cover-card.webp",
    logoUrl: "/assets/experiments/pulsar/logo-pulsar-w.svg",

    tags: [
      "Branding",
      "Creative Direction",
      "Event Production",
      "Visuals",
    ],
    hoverDescription:
      "Creative direction, branding, and live visuals for Pulsar — an electronic music event series in Salta, Argentina.",
    ctaText: "View on Instagram",
    ctaLink: "https://www.instagram.com/pulsar.salta/",

    // 🎞️ Mixed gallery with images and videos
    galleryImages: [
      "https://images.unsplash.com/photo-1585386959984-a4155224a1b0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1602524200612-8d2b1f9f7a6b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617720723584-f1d1e01cf9a8?w=800&h=600&fit=crop"
    ]
  },
  {
    id: 2,
    title: "Cardamomo",
    slug: "cardamomo-opening",
    summary:
      "Audioreactive flyers and visual identity for the reopening of Cardamomo Restaurant in Salta.",
    description:
      "For the reopening of Cardamomo, a restaurant in Salta, I created the entire visual direction and digital art for the event. I designed the flyers and scanned the new location using my phone to generate a photogrammetric point cloud. This 3D scan was processed and reinterpreted in TouchDesigner, turning it into an audioreactive visual piece synced to music chosen by the client, who are passionate music lovers. The resulting flyer became both a teaser and an audiovisual representation of the new space — blending architecture, sound, and motion design. The layout design drew inspiration from restaurant tickets, displaying time, artists, collaborators, and event details. Tools used: Photoshop and TouchDesigner.",
  
    // ✅ Hero section (video background)
    videoUrl: "/assets/experiments/cardamomo/carda-frente-feed.mp4",
    imageUrl:"/assets/experiments/cardamomo/cardamomo-card-cover.webp",
    logoUrl: "/assets/experiments/cardamomo/logo-cardamomo-w.svg",
  
    tags: [
      "TouchDesigner",
      "Photogrammetry",
      "Point Cloud",
      "Graphic Design"
    ],
    hoverDescription:
      "Audioreactive flyer and photogrammetric visuals for Cardamomo’s reopening event.",
    ctaText: "View Experiment",
    ctaLink: "https://instagram.com/tuusuario",
  
    // 🎞️ Mixed gallery (videos + stills)
    galleryImages: [
      "/assets/experiments/cardamomo/joaco-madonna-feed.mp4",
      "/assets/experiments/cardamomo/joaco-justice-feed.mp4",
      "/assets/experiments/cardamomo/carda-frente-feed.mp4",
      "/assets/experiments/cardamomo/carda-patio-feed.mp4",
      "/assets/experiments/cardamomo/carda-salon-feed.mp4",
      "/assets/experiments/cardamomo/carda-esquina-feed.mp4",
      "/assets/experiments/cardamomo/carda-barra.mp4",
      "/assets/experiments/cardamomo/carda-panaderia-feed.mp4"
    ]
  },
  {
    id: 3,
    title: "Imprudente",
    slug: "imprudente",
    summary:
      "3D animated flyer for the electronic event Imprudente, inspired by the Watchmen aesthetic.",
    description:
      "For the electronic event Imprudente, held in Salta, I created a fully 3D animated flyer using Blender. I had complete creative freedom, so I built upon existing elements from the event’s branding. The logo — a modified smiley face — immediately reminded me of Watchmen, particularly the iconic scene where the Comedian’s smiley badge falls from the building. Using that reference as the conceptual base, I added pills (a recurring element in their identity) colliding with the spinning smiley to emulate the shattered glass effect. I modeled and animated all elements, including the logo and the 3D Watchmen-inspired typography. The final composition and edits were refined in Premiere Pro. Tools used: Blender, Photoshop, and Premiere Pro.",
  
    // ✅ Hero section (video or fallback image)
    videoUrl: "/assets/experiments/imprudente/video.mp4", // placeholder for your animation
    imageUrl: "/assets/experiments/imprudente/imprudente-card-cover.webp", // Unsplash placeholder
    logoUrl: "",
  
    tags: [
      "Blender",
      "3D Animation",
      "Motion Design",
      "Branding",
      "Photoshop",
      "Premiere Pro"
    ],
    hoverDescription:
      "3D animated flyer inspired by Watchmen, created in Blender for Imprudente’s electronic event.",
    ctaText: "View Experiment",
    ctaLink: "https://instagram.com/tuusuario",
  
    // 🎞️ Placeholder gallery (replace later with your renders or animation frames)
    galleryImages: [
      "https://images.unsplash.com/photo-1615461066841-14a043de9b36?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1b0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617720723584-f1d1e01cf9a8?w=800&h=600&fit=crop"
    ]
  },
  {
    id: 4,
    title: "Project",
    slug: "project",
    summary:
      "Live visuals and lighting direction for the electronic event Project in Salta.",
    description:
      "For Project, an electronic music event in Salta, I was responsible for the live visuals and lighting design. I performed photogrammetric 3D scans of the female artists and processed them in TouchDesigner to create dynamic, real-time visuals. To enhance the texture and atmosphere, I designed custom CRT-style overlays and glitch layers that were composited live during the performance. I also directed the stage lighting, ensuring a cohesive aesthetic between visuals, sound, and light. Tools used: TouchDesigner and Photoshop.",
  
    // ✅ Hero section (video or fallback image)
    videoUrl: "/assets/experiments/project/video.mp4", // placeholder for your live visuals video
    imageUrl: "/assets/experiments/project/project-card-cover.webp", // Unsplash placeholder
    logoUrl: "",
  
    tags: [
      "TouchDesigner",
      "Photogrammetry",
      "Lighting Design",
      "Live Visuals",
      "CRT Textures"
    ],
    hoverDescription:
      "Live visuals and lighting design created in TouchDesigner for the electronic event Project.",
    ctaText: "View Experiment",
    ctaLink: "https://instagram.com/tuusuario",
  
    // 🎞️ Placeholder gallery (replace later with real assets)
    galleryImages: [
      "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615461066841-14a043de9b36?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617720723584-f1d1e01cf9a8?w=800&h=600&fit=crop"
    ]
  },
  {
    id: 5,
    title: "Lola Bloom",
    slug: "lola-bloom",
    summary:
      "Audioreactive visuals for the electronic experimental artist Lola Bloom.",
    description:
      "For Lola Bloom, an experimental electronic artist, I created a series of live audioreactive visuals designed to evolve dynamically with her sound. The aesthetic direction drew from brutalist and neo-glitch influences based on the references she provided. The visuals were built to react in real time to her performance, blending raw geometry, distortion, and rhythmic light to capture the intensity and unpredictability of her music. Tools used: TouchDesigner and Photoshop.",
  
    // ✅ Hero section (video or fallback image)
    videoUrl: "/assets/experiments/lola-bloom/video.mp4", // placeholder for your visuals
    imageUrl: "/assets/experiments/lola/lola-card-cover.webp", // Unsplash placeholder
    logoUrl: "",
  
    tags: [
      "TouchDesigner",
      "Audioreactive Visuals",
      "Experimental Music",
      "Glitch Art",
      "Brutalism"
    ],
    hoverDescription:
      "Audioreactive glitch visuals for the experimental electronic artist Lola Bloom.",
    ctaText: "View Experiment",
    ctaLink: "https://instagram.com/tuusuario",
  
    // 🎞️ Placeholder gallery (replace later with real footage)
    galleryImages: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585386959984-a4155224a1b0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617720723584-f1d1e01cf9a8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1615461066841-14a043de9b36?w=800&h=600&fit=crop"
    ]
  }
];
