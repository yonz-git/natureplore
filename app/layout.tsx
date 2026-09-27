import type { Metadata, Viewport } from "next";
import { Comfortaa, Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Natureplore",
  description: "v1 prototype: find nature near you, understand it, help it.",
};

export const viewport: Viewport = {
  themeColor: "#061209",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jost.variable} ${comfortaa.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
