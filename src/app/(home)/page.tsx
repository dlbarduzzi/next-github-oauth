import type { UserSchema } from "@/db/schemas/users"

import Link from "next/link"

import { Container } from "@/components/container"
import { Courses } from "@/features/courses/components/courses"

import { getCurrentSession } from "@/features/auth/actions/sessions"
import { Button } from "@/components/ui/button"
import { logout } from "@/features/auth/actions/users"

export default async function Page() {
  const session = await getCurrentSession()
  if (!session.ok) {
    return <LoginForm />
  }

  if (!session.isAuthenticated) {
    return <LoginForm />
  }

  return (
    <div className="py-8">
      <Container className="space-y-8">
        <UserInfo user={session.user} />
        <Courses />
      </Container>
    </div>
  )
}

function UserInfo({ user }: { user: UserSchema }) {
  return (
    <div>
      <div className="max-w-3xl rounded-md bg-gray-100 px-5 py-4 text-sm">
        <h1 className="font-bold text-black">User</h1>
        <p>ID: {user.id}</p>
        <p>Email: {user.email}</p>
      </div>
      <div className="pt-2">
        <Button onClick={logout}>Sign out</Button>
      </div>
    </div>
  )
}

function LoginForm() {
  return (
    <div className="py-8">
      <Container className="space-y-8">
        <div>
          <Button asChild>
            <Link href="/api/login/github">Sign in with GitHub</Link>
          </Button>
        </div>
        <Courses />
      </Container>
    </div>
  )
}
