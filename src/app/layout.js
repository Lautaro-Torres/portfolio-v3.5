import "./globals.css";
import CustomCursor from "../components/ui/CustomCursor";
import Navigation from "../components/ui/Navigation";
import Footer from "../components/ui/Footer";
import ScrollOptimizer from "../components/ui/ScrollOptimizer";
import DagobertoBadge from "../components/ui/DagobertoBadge";
import LoadingScreen from "../components/ui/LoadingScreen";
import { LoadingProvider } from "../contexts/LoadingContext";
import { TransitionProvider } from "../contexts/TransitionContext";

export const metadata = {
  title: "Lautaro Torres",
  description: "Mi portfolio personal",
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
      {/* Fixed elements - OUTSIDE smooth wrapper to avoid transform interference */}
      <Navigation />
      <DagobertoBadge />
      <CustomCursor />
      {/* Global performance helpers */}
      <ScrollOptimizer />
      
      {/* ScrollSmoother required structure */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          {children}
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
    <html lang="es">
      <head>
        <link rel="icon" type="image/svg+xml" href="/assets/images/logos/logo-lt-4327568.svg" />
        {/* Preload critical 3D models */}
        <link rel="preload" href="/assets/models/logo-lt.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/models/dagoberto.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/models/mate.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/models/monitor.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>
        <LoadingProvider>
          <TransitionProvider>
            <LoadingScreen />
            <LayoutContent>{children}</LayoutContent>
          </TransitionProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
