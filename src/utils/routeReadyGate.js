/**
 * Coordinates SPA transition overlay with real page readiness.
 * No fake percentages — the transition waits for markRouteReady(path) or a timeout.
 */

let waiter = null;
const pendingMarks = new Set();

export function normalizeRoutePath(pathname) {
  if (!pathname || typeof pathname !== "string") return "/";
  try {
    const u = new URL(pathname, "http://_");
    let p = u.pathname || "/";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p || "/";
  } catch {
    let p = pathname.split("?")[0] || "/";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p || "/";
  }
}

function clearWaiter() {
  if (waiter?.timer) clearTimeout(waiter.timer);
  waiter = null;
}

/**
 * Call when a route's main content is ready to show (assets / layout / hero).
 * Ignored if it doesn't match the path the transition is waiting for.
 */
export function markRouteReady(pathname) {
  const n = normalizeRoutePath(pathname);
  if (waiter) {
    if (waiter.expected === n) {
      waiter.resolve("ready");
      clearWaiter();
    }
    return;
  }
  pendingMarks.add(n);
}

/**
 * Begin waiting for markRouteReady(expectedPathname). Resolves with "ready" | "timeout".
 * If the route was already marked before arming, resolves immediately.
 */
export function armRouteReadyWait(expectedPathname, timeoutMs = 25000) {
  const expected = normalizeRoutePath(expectedPathname);
  return new Promise((resolve) => {
    clearWaiter();
    if (pendingMarks.has(expected)) {
      pendingMarks.delete(expected);
      resolve("ready");
      return;
    }
    waiter = {
      expected,
      resolve,
      timer: setTimeout(() => {
        if (waiter?.expected === expected) {
          resolve("timeout");
          clearWaiter();
        }
      }, timeoutMs),
    };
  });
}
