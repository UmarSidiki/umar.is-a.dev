"use client";

import { useEffect, useState } from 'react';

export default function BarbaWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Dynamically import and initialize BarbaJS only on client side
    const initializeBarba = async () => {
      if (typeof window !== 'undefined') {
        try {
          const { initBarba } = await import('@/lib/barba');
          await initBarba();
        } catch (error) {
          console.error('Failed to initialize BarbaJS:', error);
        }
      }
    };

    initializeBarba();
  }, []);

  // Don't render barba wrapper during SSR
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <div id="barba-wrapper" data-barba="wrapper">
      <div data-barba="container" data-barba-namespace="default">
        {children}
      </div>
    </div>
  );
}
