import Link from "next/link"

import { Button } from "@/components/ui/button"
import { SiteLogo } from "@/components/site-logo"
import { Container } from "@/components/container"

import { cn } from "@/lib/utils"

export function MainHeader() {
  return (
    <header className="border-b border-b-gray-200 bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between gap-x-4">
          <div className="flex items-center">
            <Link
              href="/"
              className={cn(
                "rounded-full focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-black focus-visible:ring-offset-2"
              )}
            >
              <SiteLogo />
              <span className="sr-only">Link to home page.</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}
