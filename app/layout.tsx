import type { Metadata, Viewport } from "next";
import { Comfortaa } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Cabinet Grotesk: Indian Type Foundry, Fontshare, free licence
const textFace = localFont({
  src: "./fonts/cabinet-grotesk-variable.woff2",
  variable: "--font-text-face",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "size-adjust", value: "86%" }],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Natureplore", template: "%s, Natureplore" },
  description: "v1 prototype: find nature near you, understand it, help it.",
  other: { "darkreader-lock": "true" },
};

export const viewport: Viewport = {
  themeColor: "#061209",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${textFace.variable} ${comfortaa.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
