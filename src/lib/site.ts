import { env } from "@/env/client"

type SiteConfig = {
  name: string
  description: string
  url: string
}

export const siteConfig: SiteConfig = {
  name: "PlatVids",
  description: "A video platform designed to help you develop new skills.",
  url: env.NEXT_PUBLIC_APP_URL,
}
