import type { Metadata, Viewport } from "next"
import { Outfit, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Delivx | Logística de Última Milla - Envíos Same-Day en GBA y CABA",
  description:
    "Somos tu operador Flex en el Gran Buenos Aires. Flota propia de Sprinter, GPS en tiempo real y 97% de entregas a tiempo. Envíos same-day para MercadoLibre, Tiendanube y Shopify.",
  keywords: [
    "envíos same day",
    "logística última milla",
    "envíos flex",
    "GBA",
    "CABA",
    "MercadoLibre",
    "Tiendanube",
    "Shopify",
    "entregas rápidas",
    "Buenos Aires",
  ],
  authors: [{ name: "Delivx" }],
  openGraph: {
    title: "Delivx | Logística de Última Milla",
    description: "Tus envíos llegan hoy. Siempre. Flota propia de Sprinter en GBA y CABA.",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delivx | Logística de Última Milla",
    description: "Tus envíos llegan hoy. Siempre.",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0F",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
