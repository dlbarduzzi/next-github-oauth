import type { ReactNode } from "react"

import Link from "next/link"

import { Calendar, ChartPie, FileText, FolderOpen, House, Settings } from "lucide-react"

import { SiteLogo, SiteLogoFull } from "@/components/site-logo"

import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site"
import { Button } from "@/components/ui/button"

const sidebarNav = [
  {
    name: "Dashboard",
    icon: House,
  },
  {
    name: "Projects",
    icon: FolderOpen,
  },
  {
    name: "Calendar",
    icon: Calendar,
  },
  {
    name: "Documents",
    icon: FileText,
  },
  {
    name: "Reports",
    icon: ChartPie,
  },
]

function Sidebar() {
  return (
    <div
      className={cn(
        "hidden bg-white sm:fixed sm:inset-y-0 sm:z-40 sm:flex",
        "sm:w-20 sm:flex-col lg:w-64"
      )}
    >
      <div
        className={cn(
          "flex flex-1 flex-col gap-y-4 overflow-hidden",
          "border-r border-r-gray-200 px-4 pt-16"
        )}
      >
        <nav className="flex h-full flex-col gap-y-4 pt-4">
          <div className="flex flex-1 flex-col gap-y-4">
            {sidebarNav.map((item, index) => (
              <div key={index} className="lg:flex lg:items-center lg:gap-x-3">
                <button
                  type="button"
                  className={cn(
                    "group flex h-11 w-[2.95rem] items-center justify-center",
                    "rounded-md bg-transparent text-sm transition-colors",
                    "hover:bg-gray-200 lg:bg-gray-100"
                  )}
                >
                  <item.icon
                    className={cn("size-5 text-gray-600 group-hover:text-gray-800")}
                  />
                </button>
                <span className="hidden lg:inline">{item.name}</span>
              </div>
            ))}
          </div>
          <div className="pb-4 lg:flex lg:items-center lg:gap-x-3">
            <button
              type="button"
              className={cn(
                "group flex h-11 w-[2.95rem] items-center justify-center",
                "rounded-md bg-transparent text-sm transition-colors",
                "hover:bg-gray-200 lg:bg-gray-100"
              )}
            >
              <Settings className="size-5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <span className="hidden lg:inline">Settings</span>
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
        <div className="flex items-center">
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-x-3 rounded-full",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-black focus-visible:ring-offset-2 md:rounded-none"
            )}
          >
            <SiteLogo className="md:hidden" />
            <SiteLogoFull className="hidden md:inline" />
            <span className="sr-only">Link to home page.</span>
          </Link>
        </div>
        <div className="flex items-center gap-x-3">
          <Button type="button">Sign in</Button>
          <Button type="button">Theme</Button>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-t-gray-200 bg-white sm:pl-20 lg:pl-64">
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {siteConfig.name} - All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />
      <Header />
      <main className="grid flex-1 pt-16 sm:pl-20 lg:pl-64">{children}</main>
      <Footer />
    </div>
  )
}
