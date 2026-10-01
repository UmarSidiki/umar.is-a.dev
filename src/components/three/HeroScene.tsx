"use client";

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uScroll;
  uniform float uAmp;
  varying vec3  vNormal;
  varying vec3  vPos;
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

  void main() {
    vNormal = normalize(normalMatrix * normal);

    float n1 = snoise(position * 1.35 + vec3(0.0, 0.0, uTime * 0.22));
    float n2 = snoise(position * 2.9 + vec3(uTime * 0.16, uPointer.x * 0.8, uPointer.y * 0.8));
    float n3 = snoise(position * 5.5 + vec3(uTime * 0.1));

    float disp = n1 * uAmp + n2 * uAmp * 0.42 + n3 * uAmp * 0.14;
    disp += (uPointer.x * 0.14) + (uPointer.y * 0.12);
    disp += uScroll * 0.5;

    vDisp = disp;

    vec3 displaced = position + normal * disp;
    vPos = displaced;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uRim;
  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vDisp;

  void main() {
    vec3 base = mix(uColorA, uColorB, smoothstep(-0.55, 0.65, vDisp));

    vec3 viewDir = normalize(-vPos);
    float fres = pow(1.0 - clamp(dot(normalize(vNormal), viewDir), 0.0, 1.0), 2.4);
    vec3 col = mix(base, uRim, fres * 0.9);

    // subtle signal contour where displacement crosses zero
    float contour = smoothstep(0.03, 0.0, abs(vDisp));
    col = mix(col, uRim, contour * 0.25);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

function Blob({
  quality,
  pointerRef,
  scrollRef,
}: {
  quality: "high" | "low";
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  scrollRef: React.MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uAmp: { value: quality === "low" ? 0.32 : 0.4 },
      uColorA: { value: new THREE.Color("#17140f") },
      uColorB: { value: new THREE.Color("#e8391b") },
      uRim: { value: new THREE.Color("#f6e7c8") },
    }),
    [quality]
  );

  useFrame((state, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    const d = Math.min(delta, 0.05);
    mat.uniforms.uTime.value += d;
    mat.uniforms.uPointer.value.x +=
      (pointerRef.current.x - mat.uniforms.uPointer.value.x) * 0.06;
    mat.uniforms.uPointer.value.y +=
      (pointerRef.current.y - mat.uniforms.uPointer.value.y) * 0.06;
    mat.uniforms.uScroll.value +=
      (scrollRef.current - mat.uniforms.uScroll.value) * 0.06;

    if (meshRef.current) {
      meshRef.current.rotation.y += d * 0.12;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={Math.min(viewport.width, viewport.height) * 0.34}
    >
      <icosahedronGeometry args={[1.15, quality === "low" ? 14 : 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
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
      dpr={quality === "low" ? [1, 1] : [1, 1.5]}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 3.4], fov: 42 }}
      style={{ pointerEvents: "none" }}
    >
      <Blob quality={quality} pointerRef={pointerRef} scrollRef={scrollRef} />
    </Canvas>
  );
}
