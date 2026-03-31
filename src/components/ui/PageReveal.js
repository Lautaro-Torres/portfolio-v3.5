// PageReveal.js
"use client";
import { useLayoutEffect } from "react";
import { useLoading } from "../../contexts/LoadingContext";

export default function PageReveal({ children }) {
  const { completeReveal, isInitialLoading } = useLoading();

  /* Layout: mark reveal before paint so hero can run intro in the same frame as isHeroReady. */
  useLayoutEffect(() => {
    if (isInitialLoading) return;
    completeReveal();
  }, [isInitialLoading, completeReveal]);

  return <>{children}</>;
}
