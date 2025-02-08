import type { ReactNode } from "react"

import { MainHeader } from "@/components/main-header"
import { MainFooter } from "@/components/main-footer"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <main className="grid flex-1">{children}</main>
      <MainFooter />
    </div>
  )
}
