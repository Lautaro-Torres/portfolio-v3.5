import "./globals.css";
import CustomCursor from "../components/ui/CustomCursor";
import Navigation from "../components/ui/Navigation";
import Footer from "../components/ui/Footer";
import DagobertoBadge from "../components/ui/DagobertoBadge";
import ScrollOptimizer from "../components/ui/ScrollOptimizer";
import PageReveal from "../components/ui/PageReveal";
import { LoadingProvider } from "../contexts/LoadingContext";
import { TransitionProvider } from "../contexts/TransitionContext";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.lautor.dev"),
  title: {
    default: "Lautaro Torres — Creative Developer & Designer",
    template: "%s | Lautaro Torres",
  },
  description:
    "Portfolio de Lautaro Torres, Creative Developer & Designer desde Argentina. Proyectos web distintivos que combinan código, diseño y motion.",
  keywords: [
    "Lautaro Torres",
    "portfolio",
    "creative developer",
    "creative developer & designer",
    "desarrollador creativo",
    "frontend developer",
    "web design",
    "motion",
    "3D",
    "Next.js",
    "React",
    "WordPress",
  ],
  authors: [{ name: "Lautaro Torres", url: "https://www.linkedin.com/in/lautarotorres/" }],
  openGraph: {
    title: "Lautaro Torres — Creative Developer & Designer",
    description:
      "Portfolio de Lautaro Torres, Creative Developer & Designer desde Argentina. Proyectos web distintivos que combinan código, diseño y motion.",
    url: "/",
    siteName: "Lautaro Torres Portfolio",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/assets/images/logos/logo-lt-4327568.svg",
        width: 512,
        height: 512,
        alt: "Logo monograma LT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lautaro Torres — Creative Developer & Designer",
    description:
      "Portfolio de Lautaro Torres, Creative Developer & Designer desde Argentina. Experimentos, proyectos y trabajo comercial.",
    images: ["/assets/images/logos/logo-lt-4327568.svg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0a",
};

function LayoutContent({ children }) {
  return (
    <>
      <Navigation />
      <DagobertoBadge />
      <CustomCursor />
      <div id="smooth-wrapper" className="relative w-full">
        <div id="smooth-content" className="relative w-full">
          {/* Single transition target for all routes (loading.tsx has no <main>). Keep nav/badge outside. */}
          <div id="page-transition-root" className="relative w-full">
            {children}
          </div>
          <div id="contact">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/images/logos/logo-lt-4327568.svg" />
        {/* Preload critical 3D models */}
        {/* Preload solo assets críticos above-the-fold (mate = hero, fuente Anton) */}
        <link rel="preload" href="/fonts/General%20Sans/fonts/GeneralSans-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/anton/Anton-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/models/mate.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>
        <LoadingProvider>
          <TransitionProvider>
            <ScrollOptimizer />
            <PageReveal>
              <LayoutContent>{children}</LayoutContent>
            </PageReveal>
          </TransitionProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
