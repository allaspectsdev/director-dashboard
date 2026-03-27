import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DM_Serif_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Avery Bio — Director of Technology Command Center",
  description: "IT, AI, and Cybersecurity leadership command center for Avery Bio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable} antialiased`}
      >
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <MobileHeader />
              <main className="flex-1 overflow-y-auto scroll-smooth">
                <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6 md:px-10 md:py-10">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
