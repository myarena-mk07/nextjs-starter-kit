import { ReactNode } from "react"
import DashboardTopNav from "./_components/dashbord-top-nav"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <DashboardTopNav />
      <main className="p-4">
        {children}
      </main>
    </div>
  )
}
