"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const selector = [
  "main#top article",
  "main#top h1",
  "main#top h2",
  "main#top h3",
  "main#top p",
  "main#top .figma-photo",
  "main#top .story-grid > div",
  "main#top .figma-actions",
  "main#top .figma-signoff",
  "main#top .rsvp-form > *",
  "main#top .faq-page details",
].join(",");

export function SiteScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((element) => {
      if (element.closest(".figma-nav, .figma-footer")) return false;
      if (element.matches("h1, h2, h3, p") && element.closest("article, .rsvp-form, details")) return false;
      return true;
    });

    elements.forEach((element, index) => {
      element.classList.remove("is-motion-visible");
      element.classList.add("motion-item");
      element.dataset.motionSide = index % 2 === 0 ? "left" : "right";
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-motion-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -6%", threshold: 0.12 });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
