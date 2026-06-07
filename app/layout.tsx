import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apply Digital AX Spec Compiler",
  description:
    "A boardroom-ready agentic delivery studio for converting ACx workflow inputs into governed coding-agent task packets, architecture plans, QA gates, and pilot evidence."
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
