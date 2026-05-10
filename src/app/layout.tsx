import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prafull Kotecha — Maker's Catalog",
  description: "70+ hobby projects · AI agents · Full-stack experiments. A working catalog by Prafull Kotecha.",
  openGraph: {
    title: "Prafull Kotecha — Maker's Catalog",
    description: "70+ hobby projects spanning AI, full-stack, and experimental UI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
