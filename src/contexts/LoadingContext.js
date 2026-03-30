// LoadingContext.js
"use client";
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  // Loader is temporarily paused: app starts in "loaded + revealed" mode.
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [hasLoadedBefore, setHasLoadedBefore] = useState(true);
  const [isRevealComplete, setIsRevealComplete] = useState(true);

  const completeLoading = () => {
    setIsInitialLoading(false);
    setHasLoadedBefore(true);
    setIsRevealComplete(false);
  };

  const completeReveal = () => {
    setIsRevealComplete(true);
  };

  return (
    <LoadingContext.Provider value={{
      isInitialLoading,
      hasLoadedBefore,
      isRevealComplete,
      completeLoading,
      completeReveal,
    }}>
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
