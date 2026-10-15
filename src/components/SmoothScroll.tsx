/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/SmoothScroll.js

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "@studio-freight/lenis";

function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Adjust for scroll speed
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScroll;
