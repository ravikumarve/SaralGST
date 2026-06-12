import type { Metadata } from "next";
import {
  Space_Grotesk,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import FloatingNav from "@/components/FloatingNav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SaralGST - Sahi GST rate. Seedha jawab.",
  description:
    "India's simplest GST rate checker. Type a product, get the correct rate under GST 2.0. Built for small business owners, traders, and CA firms.",
  keywords: [
    "GST",
    "GST 2.0",
    "GST rates",
    "HSN code",
    "SAC code",
    "India GST",
    "GST calculator",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <FloatingNav />
        {children}
      </body>
    </html>
  );
}
