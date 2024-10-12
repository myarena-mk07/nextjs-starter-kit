import { ReactNode } from "react"
import DashboardTopNav from "./_components/dashbord-top-nav"

import { GoogleAnalytics } from '@next/third-parties/google'

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId="G-DMW4HBE3JH" />
      </body>
    </html>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardTopNav />
      <main>
        {children}
      </main>
    </div>
  )
}
