import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AX Spec Compiler",
  description:
    "A deterministic prototype for converting CX workflow inputs into coding-agent-ready specs, QA checks, and autonomy boundaries."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
