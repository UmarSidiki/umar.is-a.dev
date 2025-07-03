"use client";

import { useEffect } from 'react';
import { initBarba } from '@/lib/barba';

export default function BarbaWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize BarbaJS when component mounts
    initBarba();
    
    // Cleanup function
    return () => {
      // Optional: Add cleanup logic if needed
    };
  }, []);

  return (
    <div id="barba-wrapper" data-barba="wrapper">
      <div data-barba="container" data-barba-namespace="default">
        {children}
      </div>
    </div>
  );
}
