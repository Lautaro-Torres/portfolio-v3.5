"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { markRouteReady, normalizeRoutePath } from "../utils/routeReadyGate";

/**
 * Marks the current route ready after fonts + two animation frames (layout paint).
 * For pages without a dedicated multimedia readiness signal.
 */
export function useSimpleRouteReady() {
  const pathname = usePathname();
  const path = normalizeRoutePath(pathname);
  const reportedRef = useRef(false);

  useEffect(() => {
    reportedRef.current = false;
  }, [path]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        /* ignore */
      }
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (!cancelled && !reportedRef.current) {
        reportedRef.current = true;
        markRouteReady(path);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [path]);
}
