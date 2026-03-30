// PageReveal.js
"use client";
import { useEffect } from "react";
import { useLoading } from "../../contexts/LoadingContext";

export default function PageReveal({ children }) {
  const { completeReveal } = useLoading();

  useEffect(() => {
    completeReveal();
  }, [completeReveal]);

  return <>{children}</>;
}
