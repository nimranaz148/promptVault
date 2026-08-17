import type { Metadata } from "next";
import { Bricolage_Grotesque, Spline_Sans, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Spline_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "PromptVault — Your prompt library",
    template: "%s · PromptVault",
  },
  description:
    "Save, organize, and run AI prompts — or discover and reuse prompts from the community.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`grain min-h-screen ${display.variable} ${sans.variable} ${mono.variable}`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
