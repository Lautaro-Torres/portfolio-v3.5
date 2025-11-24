export default function GlassSurface({
  children,
  className = "",
  borderRadius = 100,
  backgroundOpacity = 0.06,
  blur = 12,
  style = {},
  width,
  height,
  mode = "container", // 'container' | 'layer'
  contentFill = false, // when true, children fill the container area
}) {
  const wrapperStyle = {
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    width: width || undefined,
    height: height || undefined,
    ...style,
  };

  const glassStyle = {
    backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(150%)`,
    backdropFilter: `blur(${blur}px) saturate(150%)`,
    border: "1px solid rgba(255,255,255,0.10)",
    inset: 0,
    position: "absolute",
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    pointerEvents: "none",
  };

  // Layer mode: apply glass effect directly on wrapper instead of inner overlay
  if (mode === "layer") {
    const layerWrapperStyle = {
      ...wrapperStyle,
      backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
      WebkitBackdropFilter: `blur(${blur}px) saturate(150%)`,
      backdropFilter: `blur(${blur}px) saturate(150%)`,
      border: "1px solid rgba(255,255,255,0.10)",
    };
    return (
      <div className={`relative overflow-hidden ${className}`} style={layerWrapperStyle}>
        {/* Subtle highlight gradients */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(120% 60% at 0% 0%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
        <div className={`${contentFill ? "absolute inset-0" : "relative"} z-10`}>
          {children}
        </div>
      </div>
    );
  }

  // Default: container mode
  return (
    <div className={`relative overflow-hidden ${className}`} style={wrapperStyle}>
      <div style={glassStyle} />
      {/* Subtle highlight gradients */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(120% 60% at 0% 0%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
      <div className={`${contentFill ? "absolute inset-0" : "relative"} z-10`}>
        {children}
      </div>
    </div>
  );
}


