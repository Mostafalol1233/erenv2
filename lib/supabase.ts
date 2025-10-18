// Supabase client removed. The project now uses server-side Neon/Postgres APIs.
// If you still need Supabase client-side features, re-add initialization here.

export const supabase = null

export type Comment = {
  id: number
  name: string
  game: string
  comment: string
  created_at: string
}
