import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Rubik, PT_Sans } from "next/font/google"
import FixedCartButton from "@/components/fixed-cart-button"
import { Toaster } from "@/components/ui/toaster"

// Основной фирменный шрифт - Rubik (Bold, SemiBold, Regular)
const rubik = Rubik({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"], // Regular, SemiBold, Bold
  display: "swap",
  variable: "--font-rubik",
})

// Дополнительный шрифт - PT Sans
const ptSans = PT_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-pt-sans",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${rubik.variable} ${ptSans.variable} h-full`}>
      <head>
        <title>TireShop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content" />
        <meta name="theme-color" content="#1f1f1f" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Горошина" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Горошина" />
        <meta name="description" content="Интернет-магазин шин и автотоваров" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1f1f1f" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/new-logo-512x512.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/new-logo-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/new-logo-512x512.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/new-logo-512x512.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/new-logo-512x512.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/new-logo-512x512.png" />
        <link rel="shortcut icon" href="/icons/new-logo-512x512.png" />
      </head>
      <body className="h-full overflow-y-auto">
        {" "}
        {/* Добавлены классы h-full и overflow-y-auto */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="bg-[#D9D9DD] dark:bg-[#1f1f1f] min-h-screen">
            {" "}
            {/* Удалены overflow-y-auto и flex-1, добавлен min-h-screen */}
            {children}
            <FixedCartButton />
          </div>
        </ThemeProvider>
        {/* Service Worker Registration */}
        <script src="/sw-register.js"></script>
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.dev",
}
