// app/layout.tsx
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
  description: "Automatizaciones y tecnología para tu negocio",
  icons: {
    icon: "/favicon.ico",                 // favicon clásico
    shortcut: "/favicon.ico",             // fallback para navegadores antiguos
    apple: "/apple-touch-icon.png",       // soporte iOS/Safari
  },
  manifest: "/site.webmanifest",          // opcional si luego quieres PWA
  themeColor: "#ffffff",                  // color de la barra en móviles
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
