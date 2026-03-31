// LoadingContext.js
"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasLoadedBefore, setHasLoadedBefore] = useState(false);
  const [isRevealComplete, setIsRevealComplete] = useState(false);

  const completeLoading = useCallback(() => {
    setIsInitialLoading(false);
    setHasLoadedBefore(true);
    setIsRevealComplete(false);
  }, []);

  const completeReveal = useCallback(() => {
    setIsRevealComplete(true);
  }, []);

  const value = useMemo(
    () => ({
      isInitialLoading,
      hasLoadedBefore,
      isRevealComplete,
      completeLoading,
      completeReveal,
    }),
    [isInitialLoading, hasLoadedBefore, isRevealComplete, completeLoading, completeReveal]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
