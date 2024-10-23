import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { AI } from "@/app/ai";
import { ViewTransitions } from "next-view-transitions";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toast } from "@/components/ui/toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Phantomnary",
  description: "Editas imagenes con IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>
            <AI>
              <Toast position="bottom-left" />
              {children}
              <Analytics />
            </AI>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}
