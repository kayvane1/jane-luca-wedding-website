"use client";

import { useState } from "react";

const links = [
  ["Information", "#information"],
  ["RSVP", "#rsvp"],
  ["Registry", "#registry"],
  ["Our story", "#story"],
  ["FAQ", "#faq"],
] as const;

export function SiteNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
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
