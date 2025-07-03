"use client";

import barba from '@barba/core';
import { gsap } from 'gsap';
import type { ITransitionData } from '@barba/core';

// Initialize BarbaJS with GSAP transitions
export const initBarba = () => {
  // Only initialize if we're in the browser
  if (typeof window === 'undefined') return;

  barba.init({
    transitions: [
      {
        name: 'fade-transition',
        leave(data: ITransitionData) {
          return gsap.to(data.current.container, {
            opacity: 0,
            y: 30,
            duration: 0.4,
            ease: "power2.inOut"
          });
        },
        enter(data: ITransitionData) {
          return gsap.fromTo(data.next.container, 
            {
              opacity: 0,
              y: 30
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.inOut"
            }
          );
        }
      }
    ],
    views: [
      {
        namespace: 'home',
        beforeEnter() {
          // Animate content elements on home page
          gsap.fromTo('.animate-on-enter', 
            {
              opacity: 0,
              y: 50
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.2
            }
          );
        }
      },
      {
        namespace: 'blog',
        beforeEnter() {
          // Animate blog content
          gsap.fromTo('.blog-content', 
            {
              opacity: 0,
              y: 30
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
              delay: 0.1
            }
          );
        }
      },
      {
        namespace: 'contact',
        beforeEnter() {
          // Animate contact form
          gsap.fromTo('.contact-form', 
            {
              opacity: 0,
              scale: 0.95
            },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "back.out(1.2)",
              delay: 0.1
            }
          );
        }
      },
      {
        namespace: 'projects',
        beforeEnter() {
          // Animate project cards
          gsap.fromTo('.project-card', 
            {
              opacity: 0,
              y: 40
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: "power2.out",
              delay: 0.1
            }
          );
        }
      },
      {
        namespace: 'admin',
        beforeEnter() {
          // Animate admin dashboard
          gsap.fromTo('.admin-panel', 
            {
              opacity: 0,
              x: -30
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: "power2.out",
              delay: 0.1
            }
          );
        }
      }
    ],
    preventRunning: true,
    timeout: 5000
  });

  // Add loading indicator
  barba.hooks.before(() => {
    // Optional: Add a loading indicator
    document.body.classList.add('is-transitioning');
  });

  barba.hooks.after(() => {
    // Remove loading indicator
    document.body.classList.remove('is-transitioning');
    
    // Scroll to top on page change
    window.scrollTo(0, 0);
  });

  console.log('BarbaJS initialized with GSAP transitions');
};

// Utility function to refresh barba links
export const refreshBarbaLinks = () => {
  if (typeof window !== 'undefined' && barba) {
    barba.cache.reset();
  }
};
