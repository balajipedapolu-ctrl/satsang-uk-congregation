import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { EVENT } from "@/lib/event";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://satsanguk.org"),
  title: {
    default: `${EVENT.title} · ${EVENT.organisation}`,
    template: `%s · ${EVENT.organisation}`,
  },
  description: `${EVENT.occasion}. Join us on ${EVENT.dateLabel} at ${EVENT.venue.name}, ${EVENT.venue.address}.`,
  keywords: [
    "Satsang",
    "Satsang UK",
    "Sree Sree Thakur Anukulchandra",
    "National Congregation",
    "Congregation 2026",
  ],
  openGraph: {
    title: `${EVENT.title} · ${EVENT.organisation}`,
    description: EVENT.occasion,
    type: "website",
    locale: "en_GB",
  },
};

export const viewport: Viewport = {
  themeColor: "#c05f16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
