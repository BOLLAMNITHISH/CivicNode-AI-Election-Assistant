import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "CivicNode — Your Personalized Election Timeline",
  description:
    "Demystifying the US election process. Get state-specific deadlines, voting windows, and action items for the 2026 election cycle — free for all citizens.",
  openGraph: {
    title: "CivicNode — Your Personalized Election Timeline",
    description: "Get state-specific deadlines, voting windows, and action items for the 2026 election cycle.",
    url: "https://civicnode.vercel.app",
    siteName: "CivicNode",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CivicNode — Election Timelines",
    description: "Your personalized voting timeline for the 2026 cycle.",
  },
};

import { ChatAssistant } from "@/components/chat-assistant";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <ChatAssistant />
      </body>
    </html>
  );
}
