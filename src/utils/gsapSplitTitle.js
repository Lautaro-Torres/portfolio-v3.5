export function splitTextToClippedChars(element, options = {}) {
  if (!element) {
    return { chars: [], restore: () => {} };
  }

  const source = element.textContent || "";
  const {
    fontFamily = "Anton, sans-serif",
    preserveSpaces = true,
  } = options;

  element.textContent = "";
  const chars = [];

  for (const ch of source) {
    const clip = document.createElement("span");
    clip.style.display = "inline-block";
    clip.style.overflow = "hidden";
    clip.style.height = "1em";
    clip.style.lineHeight = "1";
    clip.style.verticalAlign = "bottom";
    clip.style.fontFamily = fontFamily;
    clip.style.color = "inherit";

    const inner = document.createElement("span");
    inner.textContent = preserveSpaces && ch === " " ? "\u00A0" : ch;
    inner.style.display = "inline-block";
    inner.style.lineHeight = "1";
    inner.style.willChange = "transform";
    inner.style.fontFamily = fontFamily;
    inner.style.color = "inherit";

    clip.appendChild(inner);
    element.appendChild(clip);
    chars.push(inner);
  }

  return {
    chars,
    restore: () => {
      element.textContent = source;
    },
  };
}

