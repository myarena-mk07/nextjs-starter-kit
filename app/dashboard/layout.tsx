import { ReactNode } from "react"
import DashboardTopNav from "./_components/dashbord-top-nav"

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
