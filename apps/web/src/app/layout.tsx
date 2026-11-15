import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Bizniss — Book trusted local services", template: "%s | Bizniss" },
  description:
    "Find doctors, salons, plumbers and more near you. Get an instant AI quote and book with JazzCash, Easypaisa or PayFast.",
};

export const viewport: Viewport = { themeColor: "#f97316" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
