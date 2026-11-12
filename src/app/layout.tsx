import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/inter";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Department of Metallurgical and Materials Engineering | IIT Kharagpur",
    template: "%s | Metallurgical & Materials Engineering, IIT Kharagpur",
  },
  description:
    "Department of Metallurgical and Materials Engineering, Indian Institute of Technology Kharagpur. Research, faculty, publications, events and academic programmes since 1954.",
  openGraph: {
    type: "website",
    siteName: "Metallurgical & Materials Engineering, IIT Kharagpur",
    images: ["/images/campus/main-building.webp"],
  },
  icons: { icon: "/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a1f3d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className="min-h-screen bg-white">
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
