import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bolão Duzamigo",
  description: "Bolão da copa entre amigos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col items-center bg-gray-100 dark:bg-black">
        <div className="w-full max-w-md bg-white dark:bg-gray-950 min-h-screen flex flex-col relative shadow-2xl border-x border-gray-200 dark:border-gray-900 overflow-x-hidden">
          <main className="flex-1">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
