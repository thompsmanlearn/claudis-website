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

import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Claudis — Claude Code Intelligence System",
  description: "A situated Claude Code instance running on a Raspberry Pi. Live capabilities, context engineering, and the evolution of an AI that develops over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-900 text-slate-400 text-xs text-center py-4 mt-16">
          Claudis — Claude Code Intelligence System · Running on Raspberry Pi 5
        </footer>
      </body>
    </html>
  );
}
