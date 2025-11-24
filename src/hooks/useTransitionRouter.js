// usePageTransition.js - Main transition hook
"use client";
import { useTransition } from "../contexts/TransitionContext";

export function usePageTransition() {
  const { startTransition, isTransitioning, transitionProgress } = useTransition();

  const navigateTo = (route) => {
    if (isTransitioning) {
      console.log('Transition already in progress, skipping...');
      return;
    }
    startTransition(route);
  };

  return {
    navigateTo,
    isTransitioning,
    transitionProgress
  };
}

// Legacy hook for compatibility
export function useTransitionRouter() {
  const { navigateTo, isTransitioning } = usePageTransition();

  const push = (href) => {
    navigateTo(href);
  };

  const replace = (href) => {
    navigateTo(href);
  };

  return {
    push,
    replace,
    isTransitioning
  };
}
