import { Suspense } from "react";

import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";

import { Toaster } from "react-hot-toast";

import { MswInitializer } from "@/components/dev/msw-initializer";
import { GlobalLoading } from "@/components/Loading";
import MuiThemeProvider from "@/components/MuiThemeProvider";
import { MSW_ENABLED } from "@/lib/constants/environments";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sale-eApp-support service",
  description: "A support service for sale-eApp, providing template management and other features to enhance user experience.",
};

export default function BackofficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MswInitializer isActive={MSW_ENABLED}>
          <MuiThemeProvider>
            <Suspense fallback={<GlobalLoading />}>
              {children}
            </Suspense>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4caf50',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#f44336',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </MuiThemeProvider>
        </MswInitializer>
      </body>
    </html>
  );
}
