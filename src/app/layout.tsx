import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Marcellus, Tiro_Devanagari_Hindi } from "next/font/google";
import { wedding } from "@/data/wedding";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const label = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-label",
  display: "swap",
});

const hindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-hindi",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${wedding.bride.first} & ${wedding.groom.first}`,
  description: `You are warmly invited to the wedding of ${wedding.bride.first} and ${wedding.groom.full} — ${wedding.date.longForm}, ${wedding.venue.city}.`,
  openGraph: {
    title: `${wedding.bride.first} & ${wedding.groom.first} · ${wedding.date.display}`,
    description: `Shubh Vivah · ${wedding.date.longForm} · ${wedding.venue.city}`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#140b2b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${label.variable} ${hindi.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
