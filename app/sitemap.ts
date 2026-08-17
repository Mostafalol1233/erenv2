import type { MetadataRoute } from "next"
import { games } from "@/lib/catalog"

const baseUrl = "https://erenv2-three.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...games.map((game) => ({ url: `${baseUrl}/games/${game.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: game.featured ? 0.9 : 0.75 })),
  ]
}
