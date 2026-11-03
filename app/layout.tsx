import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_CONFIG } from "@/data/projects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.ownerName} — ${SITE_CONFIG.titleRole}`,
  description: SITE_CONFIG.heroDescription,
  keywords: [
    SITE_CONFIG.ownerName,
    "Video Editor",
    "Graphic Designer",
    "Brand Design",
    "Digital Content",
  ],
  authors: [{ name: SITE_CONFIG.ownerName }],
  openGraph: {
    title: `${SITE_CONFIG.ownerName} — ${SITE_CONFIG.titleRole}`,
    description: SITE_CONFIG.heroDescription,
    siteName: SITE_CONFIG.brandName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.ownerName} — ${SITE_CONFIG.titleRole}`,
    description: SITE_CONFIG.heroDescription,
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-black text-[#F5F5F5] antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-black text-[#F5F5F5] selection:bg-[#D7FF64] selection:text-black">
        {children}
      </body>
    </html>
  );
}
