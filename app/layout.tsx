import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AIAssistant } from "@/components/ai-assistant"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Authentiq - AI-Powered Plagiarism & Content Detection",
  description:
    "Detect copied content, understand originality, and generate clean reports in seconds with our advanced AI plagiarism checker.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/Authentiq_logo.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/Authentiq_logo.svg",
  },
}

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${inter.className}`}>
        {children}
        <AIAssistant />
        <Analytics />
      </body>
    </html>
  )
}
