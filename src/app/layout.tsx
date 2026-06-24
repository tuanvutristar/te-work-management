import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tristar Electrical - Work Management",
  description: "Project management dashboard for Tristar Electrical",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
