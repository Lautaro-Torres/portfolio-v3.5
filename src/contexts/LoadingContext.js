// LoadingContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasLoadedBefore, setHasLoadedBefore] = useState(false);

  useEffect(() => {
    // Check if user has visited before (simple session check)
    const hasVisited = sessionStorage.getItem('portfolio-loaded');
    if (hasVisited) {
      setIsInitialLoading(false);
      setHasLoadedBefore(true);
    }
  }, []);

  const completeLoading = () => {
    setIsInitialLoading(false);
    setHasLoadedBefore(true);
    sessionStorage.setItem('portfolio-loaded', 'true');
  };

  return (
    <LoadingContext.Provider value={{
      isInitialLoading,
      hasLoadedBefore,
      completeLoading
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
