import "./globals.css";
import CustomCursor from "../components/ui/CustomCursor";
import Navigation from "../components/ui/Navigation";
import Footer from "../components/ui/Footer";
import DagobertoBadge from "../components/ui/DagobertoBadge";
import ScrollOptimizer from "../components/ui/ScrollOptimizer";
import PageReveal from "../components/ui/PageReveal";
import LoadingScreen from "../components/ui/LoadingScreen";
import { LoadingProvider } from "../contexts/LoadingContext";
import { TransitionProvider } from "../contexts/TransitionContext";
import {
  DEFAULT_OG_IMAGE,
  SHARE_DESCRIPTION,
  SHARE_TITLE,
  SITE_URL,
} from "../config/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SHARE_TITLE,
    template: "%s | Lautaro Torres",
  },
  description: SHARE_DESCRIPTION,
  keywords: [
    "Lautaro Torres",
    "portfolio",
    "digital designer",
    "creative director",
    "creative developer",
    "desarrollador creativo",
    "frontend developer",
    "web design",
    "motion",
    "3D",
    "Next.js",
    "React",
    "WordPress",
  ],
  authors: [{ name: "Lautaro Torres", url: SITE_URL }],
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    url: "/",
    siteName: "Lautaro Torres",
    locale: "en_US",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
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
          {/* After rest of UI in DOM so equal z-index stacks above nav/badge; must stay inside LoadingProvider */}
          <LoadingScreen />
        </LoadingProvider>
      </body>
    </html>
  );
}
