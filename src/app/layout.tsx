import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteScrollMotion } from "@/components/site-scroll-motion";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jane-luca-wedding-website-theta.vercel.app"),
  title: "Come Celebrate with us: 10th July 2027",
  description: "Jane & Luca’s wedding in Lumio, Corsica.",
  icons: { icon: "/assets/jl-monogram.png" },
  openGraph: {
    title: "Come Celebrate with us: 10th July 2027",
    description: "Jane & Luca’s wedding in Lumio, Corsica.",
    type: "website",
    locale: "en_GB",
    siteName: "Jane & Luca",
  },
  twitter: {
    card: "summary_large_image",
    title: "Come Celebrate with us: 10th July 2027",
    description: "Jane & Luca’s wedding in Lumio, Corsica.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body><SiteScrollMotion />{children}</body>
    </html>
  );
}
