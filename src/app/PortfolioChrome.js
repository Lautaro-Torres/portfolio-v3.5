"use client";

import { usePathname } from "next/navigation";
import CustomCursor from "../components/ui/CustomCursor";
import Navigation from "../components/ui/Navigation";
import Footer from "../components/ui/Footer";
import DagobertoBadge from "../components/ui/DagobertoBadge";

export default function PortfolioChrome({ children }) {
  const pathname = usePathname();
  const isAuditRoute = pathname?.startsWith("/audit");

  return (
    <>
      {!isAuditRoute && (
        <>
          <Navigation />
          <DagobertoBadge />
          <CustomCursor />
        </>
      )}
      <div id="smooth-wrapper" className="relative w-full">
        <div id="smooth-content" className="relative w-full">
          <div id="page-transition-root" className="relative w-full">
            {children}
          </div>
          {!isAuditRoute && (
            <div id="contact">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
