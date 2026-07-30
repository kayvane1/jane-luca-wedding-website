import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteScrollMotion } from "@/components/site-scroll-motion";

import "./globals.css";

export const metadata: Metadata = {
  title: "Jane & Luca — A Wedding in Corsica",
  description: "Join Jane and Luca for a Mediterranean wedding weekend in Corsica on 10 July 2027.",
  icons: { icon: "/assets/jl-monogram.png" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body><SiteScrollMotion />{children}</body>
    </html>
  );
}
