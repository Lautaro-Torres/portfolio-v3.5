// PageReveal.js
"use client";
import { useEffect } from "react";
import { useLoading } from "../../contexts/LoadingContext";

export default function PageReveal({ children }) {
  const { completeReveal, isInitialLoading } = useLoading();

  useEffect(() => {
    if (isInitialLoading) return;
    completeReveal();
  }, [isInitialLoading, completeReveal]);

  return <>{children}</>;
}
