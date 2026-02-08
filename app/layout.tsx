import type { Metadata } from "next"
import "./globals.css"
import Providers from "./providers"
import { RegisterSW } from "@/components/pwa/register-sw"
import { Suspense } from "react"
import { AuthInitializer } from "@/components/auth/auth-initializer"

export const metadata: Metadata = {
  title: 'Pakur Mart | Fresh Grocery & More',
  description: 'Order fresh groceries and more from Pakur Mart.',
  generator: "v0.app",
}

export const viewport = {
  themeColor: "#0D7377",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0D7377" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Pakur Mart" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <Providers>
          <AuthInitializer />
          <Suspense fallback={null}>{children}</Suspense>
        </Providers>
        <RegisterSW />
      </body>
    </html>
  )
}
