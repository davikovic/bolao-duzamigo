import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutDynamic } from "@/components/layout/layout-dynamic";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Melhora performance de carregamento de fontes
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BOLÃO DUZAMIGO | World Cup 2026",
  description: "O dashboard de apostas definitivo da Copa",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col md:flex-row bg-[#0a0a0a] text-white">
        <Providers>
          <LayoutDynamic>
            {children}
          </LayoutDynamic>
        </Providers>
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
