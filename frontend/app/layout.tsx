import type React from "react"
import "@/styles/globals.css"
import type { Metadata } from "next"
import Script from "next/script";
import Providers from "./Providers";
export const metadata: Metadata = {
  title: "AI-knows.me",
  description: "Uncover your unique strengths and unlock personalized recommendations",
    generator: 'david',
    icons: {
      icon: "/image.webp", // This tells Next.js to use the favicon from /public/favicon.ico
    },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Google Tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XNHPTWLPH5"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XNHPTWLPH5');
          `}
        </Script>
      <Providers>
          {children}
        </Providers></body>
    </html>
  )
}



import './globals.css'
