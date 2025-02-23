import type React from "react"
import "@/styles/globals.css"
import type { Metadata } from "next"
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
      <Providers>
          {children}
        </Providers></body>
    </html>
  )
}



import './globals.css'