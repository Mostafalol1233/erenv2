import type { MetadataRoute } from "next"
import { games } from "@/lib/catalog"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://erenv2-git-main-mostafalol1233s-projects.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...games.map((game) => ({ url: `${baseUrl}/games/${game.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: game.featured ? 0.9 : 0.75 })),
  ]
}
