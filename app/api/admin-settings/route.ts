import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING

export async function GET() {
  try {
    if (!DB_URL) return NextResponse.json({}, { status: 500 })
    const sql = neon(DB_URL)
    const result = await sql`SELECT id, comments_enabled, created_at, updated_at FROM admin_settings ORDER BY id LIMIT 1`
    const row = result && result[0] ? result[0] : null
    if (!row) return NextResponse.json({}, { status: 404 })
    return NextResponse.json({ ...row })
  } catch (e: any) {
    console.error("Admin settings GET error:", e)
    return NextResponse.json({}, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    if (!DB_URL) return NextResponse.json({ error: "DB not configured" }, { status: 500 })
    const body = await req.json()
    const { comments_enabled } = body
    const sql = neon(DB_URL)
    const result = await sql`INSERT INTO admin_settings (comments_enabled, created_at, updated_at) VALUES (${comments_enabled}, ${new Date().toISOString()}, ${new Date().toISOString()}) RETURNING *`
    return NextResponse.json(result[0] || {})
  } catch (e: any) {
    console.error("Admin settings POST error:", e)
    return NextResponse.json({ error: e.message || "error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    if (!DB_URL) return NextResponse.json({ error: "DB not configured" }, { status: 500 })
    const body = await req.json()
    const { comments_enabled } = body
    const sql = neon(DB_URL)
    const result = await sql`UPDATE admin_settings SET comments_enabled = ${comments_enabled}, updated_at = ${new Date().toISOString()} WHERE id = 1 RETURNING *`
    return NextResponse.json(result[0] || {})
  } catch (e: any) {
    console.error("Admin settings PUT error:", e)
    return NextResponse.json({ error: e.message || "error" }, { status: 500 })
  }
}
