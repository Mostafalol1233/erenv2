import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING

export async function GET() {
  try {
    if (!DB_URL) return NextResponse.json({ comments: [] })
    const sql = neon(DB_URL)
    const result = await sql`SELECT id, name, game, comment, created_at FROM comments ORDER BY created_at DESC LIMIT 10`
    return NextResponse.json({ comments: result })
  } catch (e: any) {
    console.error("Comments GET error:", e)
    return NextResponse.json({ comments: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!DB_URL) return NextResponse.json({ error: "DB not configured" }, { status: 500 })
    const body = await request.json()
    const { name, game, comment } = body
    if (!name || !game || !comment) return NextResponse.json({ error: "invalid" }, { status: 400 })

    const sql = neon(DB_URL)
    const now = new Date().toISOString()
    await sql`INSERT INTO comments (name, game, comment, created_at) VALUES (${name}, ${game}, ${comment}, ${now})`
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error("Comments POST error:", e)
    return NextResponse.json({ error: e.message || "error" }, { status: 500 })
  }
}
