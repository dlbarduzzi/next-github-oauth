import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/container"

export default function Page() {
  return (
    <div className="py-8">
      <Container>
        <div className="mx-auto max-w-sm border border-gray-200 p-10">
          <div className="flex items-center justify-center">
            <Button asChild>
              <Link href="/api/login/github">Sign in with GitHub</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
