import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'desktop-wide';

export function useBreakpoint(): {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
} {
  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280,
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let breakpoint: Breakpoint = 'desktop-wide';
  if (width < 768) {
    breakpoint = 'mobile';
  } else if (width < 1024) {
    breakpoint = 'tablet';
  } else if (width < 1440) {
    breakpoint = 'desktop';
  }

  return {
    breakpoint,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}
