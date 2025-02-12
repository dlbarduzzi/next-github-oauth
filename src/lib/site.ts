import { env } from "@/env/client"

type SiteConfig = {
  name: string
  description: string
  url: string
}

export const siteConfig: SiteConfig = {
  name: "next-github-oauth",
  description: "GitHub Oauth sign-in example.",
  url: env.NEXT_PUBLIC_APP_URL,
}
