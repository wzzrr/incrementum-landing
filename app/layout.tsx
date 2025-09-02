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
  themeColor: "#ffffff", // color de la barra en móviles
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Preload del video y del poster */}
        <link
          rel="preload"
          href="/videos/automations.mp4"
          as="video"
          type="video/mp4"
        />
        <link
          rel="preload"
          href="/videos/automations-poster.jpg"
          as="image"
          type="image/jpeg"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* Fallback para navegadores sin soporte de video */}
        <noscript>
          <div
            style={{
              textAlign: "center",
              padding: "1rem",
              backgroundColor: "#f9fafb",
            }}
          >
            <p>
              Tu navegador no soporta video HTML5.{" "}
              <a href="/videos/automations.mp4" download>
                Descárgalo aquí
              </a>
              .
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
