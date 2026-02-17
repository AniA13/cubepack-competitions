import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cubepack Competitions",
  description: "A website for aggregating and hosting competitions for the cube pack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
