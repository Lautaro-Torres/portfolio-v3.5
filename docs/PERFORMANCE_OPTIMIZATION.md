# Three.js Performance Optimization Guide

## Implemented Optimizations

### 1. FPS Monitoring with Stats.js
- ✅ Added stats.js CDN to layout
- ✅ Created PerformanceMonitor component
- ✅ Integrated monitoring across all scenes

### 2. Canvas Optimizations

#### Renderer Settings
```javascript
gl={{ 
  antialias: true, 
  alpha: true,
  powerPreference: "high-performance",
  logarithmicDepthBuffer: false, // Disable for better performance
  stencil: false, // Disable if not needed
  depth: true,
  preserveDrawingBuffer: false, // Reduce memory usage
  pixelRatio: Math.min(window.devicePixelRatio, 2) // Cap pixel ratio
}}
```

#### Performance Settings
```javascript
dpr={[1, 1.5]} // Device pixel ratio range
frameloop="demand" // Only render when needed
performance={{ min: 0.5 }} // Adaptive performance
```

### 3. Component Optimizations

#### React.memo for Components
```javascript
const OptimizedComponent = React.memo(function OptimizedComponent() {
  // Component logic
});
```

#### useMemo for Expensive Calculations
```javascript
const config = useMemo(() => ({
  // Expensive calculations
}), [dependencies]);
```

### 4. Geometry & Material Optimizations

#### Text Component
```javascript
<Text 
  // Performance flags
  castShadow={false}
  receiveShadow={false}
  frustumCulled={true}
/>
```

#### Model Loading
- Use Draco compression for GLB/GLTF models
- Implement LOD (Level of Detail) for complex models
- Use instancing for repeated geometries

### 5. Lighting Optimizations

#### Reduced Light Count
- Single ambient light instead of multiple directional lights
- Optimized light positions and intensities
- Disabled shadows where not needed

#### Environment Optimization
```javascript
<Environment 
  resolution={isMobile ? 64 : 128} // Lower resolution on mobile
  frames={1} // Single frame environment
  blur={isMobile ? 0.6 : 0.5} // More blur on mobile
/>
```

## Additional Optimization Recommendations

### 1. Model Optimization
- **Draco Compression**: Compress all GLB/GLTF models using Draco
- **Texture Optimization**: Use compressed textures (KTX2, DDS)
- **LOD System**: Implement Level of Detail for complex models
- **Instancing**: Use instanced meshes for repeated objects

### 2. Memory Management
- **Dispose Resources**: Properly dispose of geometries, materials, and textures
- **Texture Pooling**: Reuse textures across components
- **Geometry Merging**: Merge static geometries to reduce draw calls

### 3. Rendering Optimizations
- **Frustum Culling**: Enable for all objects
- **Occlusion Culling**: Implement for complex scenes
- **LOD Rendering**: Different detail levels based on distance
- **Batch Rendering**: Group similar materials together

### 4. Mobile-Specific Optimizations
- **Lower Resolution**: Reduce texture and model resolutions
- **Simplified Materials**: Use basic materials instead of complex shaders
- **Reduced Polygon Count**: Optimize models for mobile
- **Adaptive Quality**: Dynamic quality adjustment based on device performance

### 5. Code Splitting
- **Dynamic Imports**: Lazy load Three.js components
- **Bundle Optimization**: Split vendor and app bundles
- **Tree Shaking**: Remove unused Three.js features

## Performance Monitoring

### Stats.js Integration
- FPS monitoring in real-time
- Memory usage tracking
- Render time analysis

### Browser DevTools
- Performance tab for frame analysis
- Memory tab for memory leaks
- Network tab for asset loading

## Implementation Checklist

- [x] Add stats.js for FPS monitoring
- [x] Optimize Canvas renderer settings
- [x] Implement React.memo for components
- [x] Optimize lighting setup
- [x] Add performance flags to Text components
- [ ] Implement Draco compression for models
- [ ] Add LOD system for complex models
- [ ] Optimize texture loading and caching
- [ ] Implement proper resource disposal
- [ ] Add mobile-specific optimizations
- [ ] Set up bundle analysis and optimization

## Performance Targets

- **Desktop**: 60 FPS stable
- **Mobile**: 30+ FPS minimum
- **Load Time**: < 3 seconds
- **Memory Usage**: < 100MB for 3D scenes
- **Bundle Size**: < 2MB for Three.js components

## Monitoring Commands

```bash
# Bundle analysis
npm run build
npx @next/bundle-analyzer

# Performance testing
npm run lighthouse

# Memory profiling
# Use Chrome DevTools Memory tab
```

## Future Optimizations

1. **WebGL 2.0 Features**: Use compute shaders for complex calculations
2. **Web Workers**: Offload heavy computations to background threads
3. **WebAssembly**: Use WASM for performance-critical operations
4. **Progressive Loading**: Load models progressively based on viewport
5. **Predictive Loading**: Preload assets based on user behavior
