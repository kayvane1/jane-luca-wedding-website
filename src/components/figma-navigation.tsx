"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  ["Information", "/information"],
  ["RSVP", "/rsvp"],
  ["Registry", "/registry"],
  ["Our Story", "/story"],
  ["FAQ", "/faq"],
] as const;

export function FigmaNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="figma-nav">
      <Link href="/" aria-label="Jane and Luca home">
        <Image src="/assets/figma-home/vector-1.svg" alt="Jane and Luca" width={114} height={49} priority />
      </Link>
      <button
        className="figma-menu-toggle"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="figma-primary-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        <span /><span /><span />
      </button>
      <nav id="figma-primary-navigation" className={open ? "is-open" : ""} aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className={pathname === href ? "is-active" : ""} onClick={() => setOpen(false)}>{label}</Link>
        ))}
      </nav>
    </header>
  );
}
