"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";

interface ScrollRevealProps {
  children: React.ReactNode;
}

export default function ScrollReveal({ children }: ScrollRevealProps) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      offset: 100,
      once: false,
      mirror: true,
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });

    const refreshTimer = window.setTimeout(() => AOS.refreshHard(), 50);

    return () => window.clearTimeout(refreshTimer);
  }, [pathname]);

  return <>{children}</>;
}