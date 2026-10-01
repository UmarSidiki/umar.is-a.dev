"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------
   One object, one silhouette, fully opaque.

   Displacement is radial and low frequency — two octaves of simplex at a
   small amplitude — so it reads as a breathing pebble rather than noise.
   Normals are recomputed analytically from the displaced surface using a
   finite-difference tangent basis; that is what keeps the shading crisp
   instead of the cracked, self-shadowed mud a naive displaced normal gives.

   Framing: the object is sized from the canvas frustum, not from a guess.
   RADIUS + MAX_DISPLACE is the largest radius the vertex shader can ever
   produce, and FIT is the share of the canvas' shortest side it is allowed to
   fill, so the silhouette stays inside the frame with room for the breathe,
   the pointer parallax and the scroll drift — at any viewport size.

   Shading: ink black on a four-step ramp with a crease/dome contrast term, one
   tight specular streak, and a vermilion fresnel rim that warms to a single
   thin-film edge highlight at the outermost edge. No cool hue anywhere, so the
   body never drifts purple.
 ------------------------------------------------------------------- */

const RADIUS = 1.12;
/** (1 + 0.35) * uAmp + uBulgeAmt — the vertex shader's ceiling. */
const MAX_DISPLACE = 0.2;
/** Highest the object drifts on scroll, in world units. */
const MAX_RISE = 0.12;
/** Share of the canvas' shortest side the silhouette may fill. */
const FIT = 0.78;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uBulge;
  uniform float uBulgeAmt;
  uniform float uAmp;

  varying vec3  vNormal;
  varying vec3  vViewPos;
  varying float vDisp;

  // Ashima simplex noise (3D)
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Local swelling of the surface toward the cursor.
  float bulgeAt(vec3 dir){
    float facing = max(dot(dir, normalize(uBulge + vec3(0.0001))), 0.0);
    return pow(facing, 5.0) * uBulgeAmt;
  }

  float dispAt(vec3 dir){
    float slow = snoise(dir * 1.1 + vec3(0.0, 0.0, uTime * 0.16));
    float form = snoise(dir * 2.2 + vec3(uTime * 0.11, 0.0, 0.0));
    return (slow + form * 0.35) * uAmp + bulgeAt(dir);
  }

  vec3 surfAt(vec3 dir){ return dir * (${RADIUS.toFixed(3)} + dispAt(dir)); }

  void main() {
    vec3 dir = normalize(position);

    float e = 0.05;
    vec3 helper = abs(dir.y) < 0.985 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 t1 = normalize(cross(helper, dir));
    vec3 t2 = cross(dir, t1);

    vec3 p0 = surfAt(dir);
    vec3 p1 = surfAt(normalize(dir + t1 * e));
    vec3 p2 = surfAt(normalize(dir + t2 * e));

    vec3 N = normalize(cross(p1 - p0, p2 - p0));

    vDisp = dispAt(dir);
    vNormal = normalize(normalMatrix * N);
    vec4 mv = modelViewMatrix * vec4(p0, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3  uInk;
  uniform vec3  uSignal;
  uniform float uTime;

  varying vec3  vNormal;
  varying vec3  vViewPos;
  varying float vDisp;

  float hash21(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(-vViewPos);

    float dither = hash21(gl_FragCoord.xy + uTime) - 0.5;

    // Key light, stepped into four ink bands so the form reads graphically:
    // near-black in the shadow, warm grey where the light lands.
    vec3 L = normalize(vec3(-0.42, 0.78, 0.52));
    float ndl = dot(N, L) * 0.5 + 0.5;
    float band = floor(clamp(ndl, 0.0, 0.999) * 4.0) / 4.0 + dither * 0.03;

    vec3 col = mix(uInk * 0.30, uInk * 5.2, pow(band, 1.45));

    // Bump-versus-crease contrast, so the silhouette has hard interior edges.
    float crease = smoothstep(-0.05, 0.06, vDisp);
    col *= mix(0.80, 1.10, crease);

    // A warm bounce off the paper below: keeps the shadow side warm ink
    // instead of the cool purple a neutral fill tends to drift to.
    col += vec3(0.055, 0.021, 0.010) * pow(1.0 - ndl, 2.0);

    // One tight specular streak: the "liquid" in liquid metal.
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 140.0);
    col += vec3(1.0, 0.94, 0.88) * spec * 1.9;

    // Rim: a tight vermilion fresnel, then a single warm thin-film flash at the
    // outermost edge of the silhouette.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.4);
    col += uSignal * fres * 1.35;
    float edge = smoothstep(0.68, 1.0, fres);
    col += vec3(1.0, 0.55, 0.22) * edge * (0.55 + 0.12 * sin(uTime * 0.5));

    col += dither * (2.0 / 255.0);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const InkCoreMaterial = /* @__PURE__ */ shaderMaterial(
  {
    uTime: 0,
    uBulge: new THREE.Vector3(0, 0, 1),
    uBulgeAmt: 0,
    uAmp: 0.085,
    uInk: new THREE.Color("#151210"),
    uSignal: new THREE.Color("#ee4520"),
  },
  vertexShader,
  fragmentShader
);

function Core({
  quality,
  pointerRef,
  scrollRef,
}: {
  quality: "high" | "low";
  pointerRef: React.RefObject<{ x: number; y: number }>;
  scrollRef: React.RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const scaleRef = useRef(0);
  const { viewport } = useThree();

  const material = useMemo(() => new InkCoreMaterial(), []);

  React.useEffect(() => () => material.dispose(), [material]);

  useFrame((_state, delta) => {
    const d = Math.min(delta, 0.05);
    timeRef.current += d;

    const pointer = pointerRef.current ?? { x: 0, y: 0 };
    const scroll = scrollRef.current ?? 0;
    const u = material.uniforms;

    u.uTime.value = timeRef.current;

    const bulge = u.uBulge.value as THREE.Vector3;
    bulge.x += (pointer.x - bulge.x) * 0.06;
    bulge.y += (pointer.y - bulge.y) * 0.06;
    bulge.z += (0.85 - bulge.z) * 0.06;
    u.uBulgeAmt.value += (0.08 - u.uBulgeAmt.value) * 0.06;

    const group = groupRef.current;
    if (!group) return;

    // Pointer parallax over a slow idle turn; scroll adds twist and drift.
    group.rotation.y +=
      (pointer.x * 0.5 + timeRef.current * 0.09 - group.rotation.y) * 0.045;
    group.rotation.x +=
      (-pointer.y * 0.32 + Math.sin(timeRef.current * 0.24) * 0.06 -
        group.rotation.x) *
      0.05;
    group.rotation.z += (scroll * 0.55 - group.rotation.z) * 0.05;

    // Size from the frustum: the full silhouette — radius plus the displacement
    // ceiling — takes FIT of the canvas' shortest side, leaving margin for the
    // breathe and the scroll drift.
    const fit =
      (Math.min(viewport.width, viewport.height) * FIT) /
      (2 * (RADIUS + MAX_DISPLACE));

    const breathe = 1 + Math.sin(timeRef.current * 0.62) * 0.018;
    const target = fit * breathe * (1 - scroll * 0.22);

    scaleRef.current =
      scaleRef.current === 0
        ? target
        : scaleRef.current + (target - scaleRef.current) * 0.09;
    group.scale.setScalar(scaleRef.current);
    group.position.y += (scroll * MAX_RISE - group.position.y) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[RADIUS, quality === "low" ? 11 : 22]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}

export default function HeroScene({
  quality = "high",
  frameloop = "always",
}: {
  quality?: "high" | "low";
  frameloop?: "always" | "never" | "demand";
}) {
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  React.useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Canvas
      frameloop={frameloop}
      dpr={quality === "low" ? [1, 1] : [1, 1.75]}
      gl={{
        antialias: quality === "high",
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      camera={{ position: [0, 0, 4.4], fov: 32 }}
      style={{ pointerEvents: "none" }}
    >
      <Core quality={quality} pointerRef={pointerRef} scrollRef={scrollRef} />
    </Canvas>
  );
}
