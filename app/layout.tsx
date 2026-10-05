import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { AppToaster } from "@/components/app/app-toaster";
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
  title: "SaaSFlow | Project management for teams",
  description: "A focused workspace for development projects, tasks, and teams.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme-preload" strategy="beforeInteractive">
          {`(() => { const savedTheme = localStorage.getItem("saasflow-theme"); const dark = savedTheme === "dark" || (!savedTheme && matchMedia("(prefers-color-scheme: dark)").matches); if (dark) document.documentElement.classList.add("dark"); })()`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
