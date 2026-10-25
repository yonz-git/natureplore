import type { Metadata, Viewport } from "next";
import { Comfortaa } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Cabinet Grotesk (Indian Type Foundry, Fontshare, free licence) carries all text but the headings: a
// variable face, so 100 to 900 are all true weights
const textFace = localFont({
  src: "./fonts/cabinet-grotesk-variable.woff2",
  variable: "--font-text-face",
  weight: "100 900",
  display: "swap",
  // Cabinet Grotesk draws large on its em: scaled to 86% so its capitals sit under the sizes the tokens were set for
  declarations: [{ prop: "size-adjust", value: "86%" }],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
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
    <html lang="en" className={`${textFace.variable} ${comfortaa.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
