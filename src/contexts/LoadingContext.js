// LoadingContext.js
"use client";
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasLoadedBefore, setHasLoadedBefore] = useState(false);
  const [isRevealComplete, setIsRevealComplete] = useState(false);

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
