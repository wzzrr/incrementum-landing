import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Incrementum",
  description:
    "Incrementum — Automatizaciones y tecnología para impulsar tu negocio.",
  // Iconos servidos desde /public
  icons: {
    icon: [
      { url: "/favicon.png?v=2", type: "image/png", sizes: "32x32" },
      { url: "/favicon.png?v=2", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180" }],
    shortcut: ["/favicon.png?v=2"],
  },
  // (Opcional) si más adelante agregas OG/Twitter images en /public
  // openGraph: { images: ["/og-image.png?v=2"] },
  // twitter: { images: ["/twitter-image.png?v=2"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
