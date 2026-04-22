import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Car Shortlist Copilot",
  description: "A quick shortlist tool for Indian car buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
