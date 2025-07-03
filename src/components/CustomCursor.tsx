"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const popRingRef = useRef<HTMLDivElement>(null);
  const magnetRef = useRef<HTMLDivElement>(null);

  const [isMoving, setIsMoving] = useState(false);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    // Check if it's a mobile device
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    // Hide the default cursor
    document.body.style.cursor = "none";

    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;
    const popElement = popRef.current;
    const popRing = popRingRef.current;
    const magnet = magnetRef.current;

    if (!cursor || !cursorRing || !popElement || !popRing || !magnet) return;

    // Set initial positions
    gsap.set([cursor, cursorRing, popElement, popRing, magnet], {
      xPercent: -50,
      yPercent: -50,
      transformOrigin: "center",
    });

    gsap.set([popElement, popRing, magnet], { scale: 0, opacity: 0 });

    let moveTimeout: NodeJS.Timeout;

    // Mouse movement animation with improved performance
    const moveCallback = (e: MouseEvent) => {
      // Set moving state
      setIsMoving(true);
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => setIsMoving(false), 100);

      // Animate main cursor with immediate response
      gsap.set(cursor, {
        x: e.clientX,
        y: e.clientY,
      });

      // Animate cursor ring with slight delay for smooth follow
      gsap.to(cursorRing, {
        duration: 0.01,
        x: e.clientX,
        y: e.clientY,
        ease: "power2.out",
      });
    };

    // Enhanced click animation with multiple effects
    const clickCallback = (e: MouseEvent) => {
      // Position the pop elements at click position
      gsap.set([popElement, popRing], {
        x: e.clientX,
        y: e.clientY,
      });

      // Enhanced cursor shrink and bounce with better timing
      gsap
        .timeline()
        .to(cursor, {
          scale: 0.5,
          duration: 0.06,
          ease: "power3.out",
        })
        .to(
          cursor,
          {
            scale: 1.2,
            duration: 0.12,
            ease: "back.out(3)",
          },
          0.06
        )
        .to(
          cursor,
          {
            scale: 1,
            duration: 0.1,
            ease: "power2.out",
          },
          0.18
        );

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

      // Slight cursor scale on hover
      gsap.to(cursor, {
        scale: 0.8,
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

      gsap.to(cursor, {
        scale: 1,
        duration: 0.2,
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
      clearTimeout(moveTimeout);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleHoverOut);
      });
    };
  }, []);

  return (
    <>
      {/* Main cursor dot with dynamic scaling and gradient */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none top-0 left-0 w-5 h-5 bg-gradient-to-br from-amber-500/95 to-amber-600/95 rounded-full mix-blend-difference transition-all duration-200 shadow-lg ${
          isMoving ? "scale-110 shadow-amber-500/60" : "scale-100"
        }`}
        style={{ zIndex: 999999 }}
      />

      {/* Enhanced cursor ring with animated gradient border */}
      <div
        ref={cursorRingRef}
        className="fixed pointer-events-none top-0 left-0 w-10 h-10 rounded-full border-2 border-amber-400/85 mix-blend-difference backdrop-blur-sm"
        style={{
          zIndex: 999998,
        //   background:
        //     "linear-gradient(45deg, transparent, rgba(251, 191, 36, 0.15), transparent)",
          boxShadow: "0 0 20px rgba(251, 191, 36, 0.2)",
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
    </>
  );
};

export default CustomCursor;
