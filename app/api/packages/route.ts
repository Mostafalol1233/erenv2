import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING

export async function GET() {
  try {
    if (!DB_URL) return NextResponse.json({ packages: [] })
    const sql = neon(DB_URL)
    const result = await sql`SELECT id, game_name, amount, price, description, is_active FROM packages ORDER BY game_name ASC, id ASC`
    return NextResponse.json({ packages: result })
  } catch (e: any) {
    console.error("Packages GET error:", e)
    return NextResponse.json({ packages: [] }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    if (!DB_URL) return NextResponse.json({ error: "DB not configured" }, { status: 500 })
    const body = await req.json()
    const { game_name, amount, price, description } = body
    const sql = neon(DB_URL)
    await sql`INSERT INTO packages (game_name, amount, price, description, is_active) VALUES (${game_name}, ${amount}, ${price}, ${description}, true)`
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error("Packages POST error:", e)
    return NextResponse.json({ error: e.message || "error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    if (!DB_URL) return NextResponse.json({ error: "DB not configured" }, { status: 500 })
    const body = await req.json()
    const { id, amount, price, description, is_active } = body
    const sql = neon(DB_URL)
    await sql`UPDATE packages SET amount = ${amount}, price = ${price}, description = ${description}, is_active = ${is_active}, updated_at = ${new Date().toISOString()} WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error("Packages PUT error:", e)
    return NextResponse.json({ error: e.message || "error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    if (!DB_URL) return NextResponse.json({ error: "DB not configured" }, { status: 500 })
    const body = await req.json()
    const { id } = body
    const sql = neon(DB_URL)
    await sql`DELETE FROM packages WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error("Packages DELETE error:", e)
    return NextResponse.json({ error: e.message || "error" }, { status: 500 })
  }
}
