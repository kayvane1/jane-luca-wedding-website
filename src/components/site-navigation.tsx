"use client";

import { useEffect, useState } from "react";

const links = [
  ["Information", "#information"],
  ["RSVP", "#rsvp"],
  ["Registry", "#registry"],
  ["Our story", "#story"],
  ["FAQ", "#faq"],
] as const;

export function SiteNavigation() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let animationFrame = 0;

    const updateVisibility = () => {
      animationFrame = 0;
      const information = document.getElementById("information");
      setVisible(Boolean(information && information.getBoundingClientRect().top <= 72));
    };

    const queueVisibilityUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener("scroll", queueVisibilityUpdate, { passive: true });
    window.addEventListener("resize", queueVisibilityUpdate);
    updateVisibility();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", queueVisibilityUpdate);
      window.removeEventListener("resize", queueVisibilityUpdate);
    };
  }, []);

  return (
    <header
      className={visible ? "site-header is-visible" : "site-header"}
      aria-hidden={!visible}
      inert={!visible}
    >
      <a className="wordmark" href="#home" aria-label="Jane and Luca, home">
        J<span>&amp;</span>L
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{open ? "Close" : "Menu"}</span>
        <span className="menu-toggle__mark" aria-hidden="true">{open ? "×" : "+"}</span>
      </button>
      <nav id="primary-navigation" className={open ? "site-nav is-open" : "site-nav"} aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
