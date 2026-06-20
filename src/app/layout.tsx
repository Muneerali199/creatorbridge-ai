import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatorBridge AI — API",
  description: "Backend API for CreatorBridge AI platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
