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
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
    const sectionAnimations = ["fade-right", "fade-left", "fade-up"] as const;

    sections.forEach((section, index) => {
      const hasExplicitAnimation = section.matches("[data-aos]") || section.querySelector("[data-aos]");

      if (!hasExplicitAnimation) {
        section.dataset.aos = sectionAnimations[index % sectionAnimations.length];
        section.dataset.aosDelay = String(Math.min(index * 80, 240));
        section.dataset.aosDuration = "800";
      }
    });

    document.querySelectorAll<HTMLElement>("main section .card-hover").forEach((card, index) => {
      if (!card.matches("[data-aos]")) {
        card.dataset.aos = "fade-up";
        card.dataset.aosDelay = String(Math.min((index % 4) * 100, 300));
        card.dataset.aosDuration = "700";
      }
    });

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