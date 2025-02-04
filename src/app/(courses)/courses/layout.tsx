import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

function Sidebar() {
  return (
    <div className="fixed inset-y-0 z-40 flex w-72 flex-col bg-white">
      <div
        className={cn(
          "flex flex-1 flex-col gap-y-4 overflow-y-auto",
          "border-r border-r-gray-200 px-4 pt-16"
        )}
      >
        <nav className="flex h-full flex-col gap-y-4 pt-4">
          <div className="flex flex-1 flex-col gap-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "flex h-11 w-full items-center rounded-md bg-gray-200",
                  "px-4 py-2 text-sm transition-colors hover:bg-gray-300"
                )}
              >
                button {index + 1}
              </button>
            ))}
          </div>
          <div className="pb-4">
            <button
              type="button"
              className={cn(
                "flex h-11 w-full items-center rounded-md bg-gray-200",
                "px-4 py-2 text-sm transition-colors hover:bg-gray-300"
              )}
            >
              bottom
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="fixed z-50 h-16 w-full border-b border-b-gray-200 bg-white">
      <div className="flex h-full items-center justify-between gap-x-4 px-4">
        <div className="flex items-center">Logo</div>
        <div className="flex items-center">User</div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-t-gray-200 bg-white pl-72">
      <div className="p-4">Footer</div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <Header />
      <main className="grid flex-1 pl-72 pt-16">{children}</main>
      <Footer />
    </div>
  )
}
