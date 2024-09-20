"use client"

import { usePathname } from 'next/navigation'
import { ThemeProvider } from "@/components/theme-provider"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={isDashboard ? "system" : "dark"}
      enableSystem={isDashboard}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}