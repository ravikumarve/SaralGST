import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import FloatingNav from "@/components/FloatingNav";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="%23F59E0B"/><rect x="6" y="6" width="20" height="20" rx="3" fill="%23020202"/></svg>',
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
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <FloatingNav />
        {children}
      </body>
    </html>
  );
}
