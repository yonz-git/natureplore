import type { Metadata, Viewport } from "next";
import { Shantell_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Alpino is a Fontshare face, not on Google Fonts, so Next self-hosts the four weights from app/fonts
// (700 only sets the spot numbers).
const alpino = localFont({
  variable: "--font-alpino",
  src: [
    { path: "./fonts/alpino-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/alpino-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/alpino-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/alpino-700.woff2", weight: "700", style: "normal" },
  ],
});

// the title face: titles in boxes and sheets, and the welcome's route stops (app/globals.css)
const shantell = Shantell_Sans({
  variable: "--font-shantell",
  subsets: ["latin"],
  weight: "300",
});

export const metadata: Metadata = {
  title: { default: "Natureplore", template: "%s, Natureplore" },
  description: "v1 prototype: find nature near you, understand it, help it.",
  // the app is dark already: dark-mode extensions such as Dark Reader leave it alone, rather than
  // rewriting the page before React hydrates it, which shows as a hydration error in development
  other: { "darkreader-lock": "true" },
};

export const viewport: Viewport = {
  themeColor: "#061209",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // extensions mark <html> before React loads (Dark Reader's data-darkreader-* attributes)
    <html lang="en" className={`${alpino.variable} ${shantell.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
