import { neon } from "@neondatabase/serverless"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const productionSupabaseUrl = "https://haebzkvuchjczrfrihcp.supabase.co"
const productionSupabasePublishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZWJ6a3Z1Y2hqY3pyZnJpaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxODA0OTksImV4cCI6MjA2Nzc1NjQ5OX0.LiZ2qwdch_SX7KWYkvAt7WoR6N904dwJW97Nts1BSjA"
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || (process.env.NODE_ENV === "production" ? productionSupabaseUrl : "")
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (process.env.NODE_ENV === "production" ? productionSupabasePublishableKey : "")
const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING

const commentsTable = "eren_marketplace_comments"
const packagesTable = "eren_marketplace_packages"
const settingsTable = "eren_marketplace_settings"

type DatabaseAdapter =
  | { kind: "supabase"; client: SupabaseClient }
  | { kind: "neon"; sql: ReturnType<typeof neon> }
  | null

export const database: DatabaseAdapter = supabaseUrl && supabaseServiceKey
  ? { kind: "supabase", client: createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false, autoRefreshToken: false } }) }
  : postgresUrl
    ? { kind: "neon", sql: neon(postgresUrl) }
    : null

export function isDatabaseConfigured() {
  return Boolean(database)
}

export async function listComments() {
  if (!database) return []
  if (database.kind === "supabase") {
    const { data, error } = await database.client.from(commentsTable).select("id, name, game, comment, created_at").order("created_at", { ascending: false }).limit(100)
    if (error) throw error
    return data || []
  }
  return database.sql`SELECT id, name, game, comment, created_at FROM eren_marketplace_comments ORDER BY created_at DESC LIMIT 100`
}

export async function insertComment(input: { name: string; game: string; comment: string }) {
  if (!database) throw new Error("Database not configured")
  if (database.kind === "supabase") {
    const { data, error } = await database.client.from(commentsTable).insert(input).select("id, name, game, comment, created_at").single()
    if (error) throw error
    return data
  }
  const result = await database.sql`INSERT INTO eren_marketplace_comments (name, game, comment) VALUES (${input.name}, ${input.game}, ${input.comment}) RETURNING id, name, game, comment, created_at`
  return result[0]
}

export async function deleteComment(id: number) {
  if (!database) throw new Error("Database not configured")
  if (database.kind === "supabase") {
    const { error } = await database.client.from(commentsTable).delete().eq("id", id)
    if (error) throw error
    return
  }
  await database.sql`DELETE FROM eren_marketplace_comments WHERE id = ${id}`
}

export async function listPackages() {
  if (!database) return []
  if (database.kind === "supabase") {
    const { data, error } = await database.client.from(packagesTable).select("id, game_name, amount, price, description, is_active").order("game_name", { ascending: true }).order("id", { ascending: true }).limit(250)
    if (error) throw error
    return data || []
  }
  return database.sql`SELECT id, game_name, amount, price, description, is_active FROM eren_marketplace_packages ORDER BY game_name ASC, id ASC LIMIT 250`
}

export async function insertPackage(input: { game_name: string; amount: string; price: number; description?: string }) {
  if (!database) throw new Error("Database not configured")
  const row = { game_name: input.game_name, amount: input.amount, price: input.price, description: input.description || null, is_active: true }
  if (database.kind === "supabase") {
    const { data, error } = await database.client.from(packagesTable).insert(row).select("id, game_name, amount, price, description, is_active").single()
    if (error) throw error
    return data
  }
  const result = await database.sql`INSERT INTO eren_marketplace_packages (game_name, amount, price, description, is_active) VALUES (${row.game_name}, ${row.amount}, ${row.price}, ${row.description}, true) RETURNING id, game_name, amount, price, description, is_active`
  return result[0]
}

export async function updatePackage(input: { id: number; amount: string; price: number; description?: string; is_active: boolean }) {
  if (!database) throw new Error("Database not configured")
  const row = { amount: input.amount, price: input.price, description: input.description || null, is_active: input.is_active, updated_at: new Date().toISOString() }
  if (database.kind === "supabase") {
    const { data, error } = await database.client.from(packagesTable).update(row).eq("id", input.id).select("id, game_name, amount, price, description, is_active").single()
    if (error) throw error
    return data
  }
  const result = await database.sql`UPDATE eren_marketplace_packages SET amount = ${row.amount}, price = ${row.price}, description = ${row.description}, is_active = ${row.is_active}, updated_at = ${row.updated_at} WHERE id = ${input.id} RETURNING id, game_name, amount, price, description, is_active`
  return result[0]
}

export async function deletePackage(id: number) {
  if (!database) throw new Error("Database not configured")
  if (database.kind === "supabase") {
    const { error } = await database.client.from(packagesTable).delete().eq("id", id)
    if (error) throw error
    return
  }
  await database.sql`DELETE FROM eren_marketplace_packages WHERE id = ${id}`
}

export async function getAdminSettings() {
  if (!database) return null
  if (database.kind === "supabase") {
    const { data, error } = await database.client.from(settingsTable).select("id, comments_enabled, created_at, updated_at").order("id", { ascending: true }).limit(1).maybeSingle()
    if (error) throw error
    return data
  }
  const result = await database.sql`SELECT id, comments_enabled, created_at, updated_at FROM eren_marketplace_settings ORDER BY id LIMIT 1`
  return result[0] || null
}

export async function createAdminSettings(commentsEnabled: boolean) {
  if (!database) throw new Error("Database not configured")
  const now = new Date().toISOString()
  if (database.kind === "supabase") {
    const { data, error } = await database.client.from(settingsTable).insert({ id: 1, comments_enabled: commentsEnabled, created_at: now, updated_at: now }).select("id, comments_enabled, created_at, updated_at").single()
    if (error) throw error
    return data
  }
  const result = await database.sql`INSERT INTO eren_marketplace_settings (id, comments_enabled, created_at, updated_at) VALUES (1, ${commentsEnabled}, ${now}, ${now}) RETURNING id, comments_enabled, created_at, updated_at`
  return result[0]
}

export async function updateAdminSettings(commentsEnabled: boolean) {
  if (!database) throw new Error("Database not configured")
  const now = new Date().toISOString()
  if (database.kind === "supabase") {
    const { data, error } = await database.client.from(settingsTable).update({ comments_enabled: commentsEnabled, updated_at: now }).eq("id", 1).select("id, comments_enabled, created_at, updated_at").single()
    if (error) throw error
    return data
  }
  const result = await database.sql`UPDATE eren_marketplace_settings SET comments_enabled = ${commentsEnabled}, updated_at = ${now} WHERE id = 1 RETURNING id, comments_enabled, created_at, updated_at`
  return result[0]
}
