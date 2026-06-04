import "./globals.css";
import { LoadingProvider } from "../contexts/LoadingContext";
import { TransitionProvider } from "../contexts/TransitionContext";
import ScrollOptimizer from "../components/ui/ScrollOptimizer";
import PageReveal from "../components/ui/PageReveal";
import LoadingScreen from "../components/ui/LoadingScreen";
import PortfolioChrome from "./PortfolioChrome";
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

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/images/logos/logo-lt-4327568.svg" />
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
              <PortfolioChrome>
                {children}
              </PortfolioChrome>
            </PageReveal>
          </TransitionProvider>
          <LoadingScreen />
        </LoadingProvider>
      </body>
    </html>
  );
}
