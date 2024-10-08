import Provider from '@/app/provider'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AuthWrapper from '@/components/wrapper/auth-wrapper'
import { Analytics } from "@vercel/analytics/react"
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'
import RandomGradientBackground from '@/components/RandomGradientBackground'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL("https://shotbeautifier.com/"),
  title: {
    default: 'Shot Beautifier',
    template: `%s | Shot Beautifier`
  },
  description: 'Make Screenshot stand out with Dynamic Effects in Seconds!'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}