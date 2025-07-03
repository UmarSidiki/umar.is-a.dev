"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const popRingRef = useRef<HTMLDivElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);

  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    // Enhanced mobile detection
    const isMobile = () => {
      return (
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };

    if (isMobile()) return;

    // Hide the default cursor
    document.body.style.cursor = "none";

    const cursorRing = cursorRingRef.current;
    const popElement = popRef.current;
    const popRing = popRingRef.current;
    const magnet = magnetRef.current;

    if (!cursorRing || !popElement || !popRing || !magnet) return;

    // Set initial positions
    gsap.set([cursorRing, popElement, popRing, magnet], {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "center",
    });

    gsap.set([popElement, popRing, magnet], { scale: 0, opacity: 0 });

    // Mouse movement animation with improved performance
    const moveCallback = (e: MouseEvent) => {
      // Animate cursor ring with smooth follow
      gsap.to(cursorRing, {
        duration: 0.08,
        x: e.clientX,
        y: e.clientY,
        ease: "power1.out",
      });
    };

    // Enhanced click animation with multiple effects
    const clickCallback = (e: MouseEvent) => {
      // Position the pop elements at click position
      gsap.set([popElement, popRing], {
        x: e.clientX,
        y: e.clientY,
      });

      // Enhanced pulse animation for the ring with elastic effect
      gsap
        .timeline()
        .to(cursorRing, {
          scale: 1.3,
          opacity: 0.85,
          duration: 0.1,
          ease: "power2.out",
        })
        .to(
          cursorRing,
          {
            scale: 1,
            opacity: 0.9,
            duration: 0.25,
            ease: "power2.out",
          },
          0.1
        );

      // Multi-wave pop animation
      gsap
        .timeline()
        .to(popElement, {
          scale: 1.2,
          opacity: 0.7,
          duration: 0.12,
          ease: "power2.out",
        })
        .to(
          popElement,
          {
            scale: 2,
            opacity: 0,
            duration: 0.3,
            ease: "power3.out",
          },
          0.08
        );

      // Enhanced pop ring animation with delayed start
      gsap
        .timeline()
        .to(popRing, {
          scale: 1.1,
          opacity: 0.5,
          duration: 0.1,
          ease: "power2.out",
        })
        .to(
          popRing,
          {
            scale: 2.8,
            opacity: 0,
            duration: 0.4,
            ease: "power3.out",
          },
          0.1
        );
    };

    // Enhanced hover states with magnetic attraction
    const handleHover = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Enhanced ring animation with smooth scaling
      gsap.to(cursorRing, {
        scale: 1.6,
        opacity: 0.7,
        duration: 0.3,
        ease: "power2.out",
      });

      // Show magnetic attraction effect
      gsap.to(magnet, {
        x: centerX,
        y: centerY,
        scale: 1.8,
        opacity: 0.15,
        duration: 0.3,
        ease: "power2.out",
      });

      // Get cursor text from data attribute
      const text = target.getAttribute("data-cursor-text");
      if (text) {
        setCursorText(text);
      }
    };

    const handleHoverOut = () => {
      setCursorText("");

      // Smooth return to normal state
      gsap.to(cursorRing, {
        scale: 1,
        opacity: 0.9,
        duration: 0.3,
        ease: "power2.out",
      });

      // Hide magnet effect
      gsap.to(magnet, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, [role="button"], .cursor-pointer'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleHoverOut);
    });

    // Add event listeners
    window.addEventListener("mousemove", moveCallback);
    window.addEventListener("click", clickCallback);

    // Cleanup function
    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", moveCallback);
      window.removeEventListener("click", clickCallback);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleHoverOut);
      });
    };
  }, []);

  return (
    <div className="hidden md:block">
      {/* Enhanced cursor ring with liquid glass effect */}
      <div
        ref={cursorRingRef}
        className="fixed pointer-events-none top-0 left-0 w-8 h-8 rounded-full border border-white/20 backdrop-blur-xl"
        style={{
          zIndex: 999998,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(251, 191, 36, 0.15) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(251, 191, 36, 0.2) 75%, rgba(255, 255, 255, 0.15) 100%)",
          backdropFilter: "blur(20px) saturate(1.8)",
          boxShadow: 
            "0 0 25px rgba(251, 191, 36, 0.3), " +
            "inset 0 1px 1px rgba(255, 255, 255, 0.3), " +
            "inset 0 -1px 1px rgba(0, 0, 0, 0.1), " +
            "0 4px 15px rgba(0, 0, 0, 0.1)",
          filter: "drop-shadow(0 0 10px rgba(251, 191, 36, 0.4))",
          border: "1px solid transparent",
          backgroundClip: "padding-box",
        }}
      />

      {/* Magnetic attraction element with radial gradient */}
      <div
        ref={magnetRef}
        className="fixed pointer-events-none top-0 left-0 w-24 h-24 rounded-full mix-blend-screen"
        style={{
          zIndex: 999994,
          background:
            "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* Enhanced pop animation element with gradient */}
      <div
        ref={popRef}
        className="fixed pointer-events-none top-0 left-0 w-16 h-16 rounded-full mix-blend-screen backdrop-blur-sm"
        style={{
          zIndex: 999997,
          background:
            "radial-gradient(circle, rgba(251, 191, 36, 0.7) 0%, rgba(245, 158, 11, 0.5) 50%, transparent 80%)",
          filter: "blur(2px)",
        }}
      />

      {/* Enhanced pop ring with animated border */}
      <div
        ref={popRingRef}
        className="fixed pointer-events-none top-0 left-0 w-20 h-20 rounded-full border-2 border-amber-400/75 mix-blend-screen"
        style={{
          zIndex: 999996,
          background:
            "radial-gradient(circle, transparent 60%, rgba(251, 191, 36, 0.15) 80%, transparent)",
          boxShadow: "0 0 30px rgba(251, 191, 36, 0.3)",
        }}
      />

      {/* Enhanced cursor text tooltip with arrow */}
      {cursorText && (
        <div
          className="fixed pointer-events-none top-0 left-0 bg-gradient-to-r from-neutral-900/98 to-neutral-800/98 text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transform -translate-x-1/2 -translate-y-full -mt-4 shadow-2xl border border-amber-500/30 backdrop-blur-md"
          style={{
            zIndex: 1000000,
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(251, 191, 36, 0.2)",
          }}
        >
          {cursorText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-neutral-800/98"></div>
        </div>
      )}
    </div>
  );
};

export default CustomCursor;
