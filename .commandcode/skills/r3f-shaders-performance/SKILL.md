---
name: r3f-shaders-performance
description: React Three Fiber + drei + custom GLSL shaders in Next.js App Router, with performance budgets (lazy-load, DPR caps, pause off-screen, mobile/low-power/reduced-motion fallbacks). Use when building or reviewing any WebGL/3D/Canvas/shader code, hero 3D objects, shader backgrounds, or three.js in this project.
license: MIT
---

# React Three Fiber, shaders and performance

## Loading (Next.js App Router)
- The Canvas lives in a client component (`"use client"`) that is imported with `next/dynamic(() => import('./HeroScene'), { ssr: false, loading: () => <Poster/> })`. Never import `three`/`@react-three/*` from a server component or from a module that is part of the initial route bundle.
- The poster/fallback must occupy the exact same box as the canvas (fixed aspect or absolute inset-0) so there is zero layout shift when WebGL mounts. Fade the canvas in (opacity) once `onCreated` fires.
- Mount the canvas only once per app if it is persistent (root layout), or per page if it is page-local; never remount it during a page transition.

## Canvas settings
```tsx
<Canvas
  dpr={[1, isMobile ? 1.25 : 1.5]}          // cap DPR
  gl={{ antialias: !isMobile, powerPreference: 'high-performance', alpha: true }}
  frameloop={visible && !reduced ? 'always' : 'never'}   // pause off-screen
  camera={{ position: [0, 0, 4], fov: 35 }}
  flat                                         // no tone mapping surprises for shader colors
/>
```
- Pause off-screen with an IntersectionObserver on the wrapper, and pause on `document.visibilitychange` hidden.
- `prefers-reduced-motion: reduce` → render one static frame (`frameloop="demand"` + no time uniform updates) or show the poster.
- Low power: `navigator.hardwareConcurrency <= 4`, `deviceMemory <= 4`, or coarse pointer + small viewport → fewer segments (e.g. icosahedron detail 32 instead of 96/128), no postprocessing, DPR 1.
- No WebGL (`!document.createElement('canvas').getContext('webgl2')`) → poster only.
- drei `<PerformanceMonitor onDecline={() => setDpr(1)} />` and `<AdaptiveDpr pixelated={false} />` are good safety nets.

## Shaders with character
- Prefer a custom `THREE.ShaderMaterial` (or drei `shaderMaterial` + `extend`) with uniforms: `uTime`, `uMouse` (vec2, -1..1, lerped), `uScroll` (0..1), `uColorA/B/C`, `uIntensity`.
- Vertex: displace along normal with 3D simplex/curl noise (include a compact snoise implementation in the GLSL string), amplitude driven by `uMouse` distance and `uScroll`.
- Fragment: fresnel rim, iridescent/thin-film or stepped toon ramp, grain (`fract(sin(dot(gl_FragCoord.xy, …)))`), palette from the site tokens (pass hex → THREE.Color). Avoid purple/blue gradient clichés unless the palette is genuinely that.
- Update uniforms in `useFrame((state, delta) => { mat.uniforms.uTime.value += delta; mouse.lerp(target, 1 - Math.pow(0.001, delta)); })` — never call setState inside useFrame.
- Read scroll from a ref (Lenis/ScrollTrigger progress written to a mutable ref), not React state.
- Memoize geometry/material (`useMemo`) and dispose on unmount (R3F disposes automatically for JSX-created objects; dispose manually for objects created imperatively).

## Pointer
- Use window-level `pointermove` (passive) to compute normalized mouse so the object reacts even when the canvas is behind text; on touch devices use gentle auto-motion or device-tilt-free idle animation instead of pointer.
- Keep the canvas `pointer-events: none` unless it must be interactive, so it never blocks links/scrolling on mobile.

## Budget
- Target 60fps on a mid laptop, ≤ 2–3 draw calls for the hero, < 200 KB gz extra JS for three+fiber+drei on the route that uses it (import only what you need from drei: `import { shaderMaterial } from '@react-three/drei'`).
- Never block LCP: the hero headline is HTML text rendered on the server; the canvas is decoration behind/next to it.
