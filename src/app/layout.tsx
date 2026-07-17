import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "Jane & Luca — Corsica 2027",
  description: "Join Jane and Luca for a Mediterranean wedding weekend in Corsica.",
  icons: { icon: "/assets/jl-monogram.png" },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
