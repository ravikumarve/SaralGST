import type { Metadata } from "next";
import {
  Instrument_Serif,
  Outfit,
  JetBrains_Mono,
} from "next/font/google";
import FloatingNav from "@/components/FloatingNav";
import LiquidCanvas from "@/components/LiquidCanvas";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SaralGST | GST 2.0 Intelligence Engine",
  description:
    "India's simplest, most powerful GST rate checker. Type any product in Hindi or English, and our NLP engine maps it to 551 official tax brackets instantly. Built for MSMEs and CA firms.",
  keywords: [
    "GST",
    "GST 2.0",
    "GST rates",
    "HSN code",
    "SAC code",
    "India GST",
    "GST calculator",
    "GST rate checker",
  ],
  metadataBase: new URL("https://saralgst.in"),
  openGraph: {
    title: "SaralGST — Sahi rate. Seedha jawab.",
    description:
      "India's simplest GST rate checker. 551 official tax brackets. NLP-powered. Free tier available.",
    type: "website",
    url: "https://saralgst.in",
    siteName: "SaralGST",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaralGST — GST 2.0 Intelligence Engine",
    description:
      "India's simplest GST rate checker. Type any product in Hindi or English. Free tier available.",
  },
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="%236366F1"/><rect x="6" y="6" width="20" height="20" rx="3" fill="%23000000"/></svg>',
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <CustomCursor />
        <LiquidCanvas />
        <div className="dot-matrix" aria-hidden="true" />
        <FloatingNav />
        {children}
      </body>
    </html>
  );
}
