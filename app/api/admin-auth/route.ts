import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  const isAuthenticated = cookies().get("eren_admin")?.value === "authenticated"
  return NextResponse.json({ authenticated: isAuthenticated }, { status: isAuthenticated ? 200 : 401 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const password = typeof body?.password === "string" ? body.password : ""
    const configuredPassword = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "eren2025admin" : "")

    if (!configuredPassword) return NextResponse.json({ error: "ADMIN_PASSWORD is not configured" }, { status: 503 })
    if (!password || password !== configuredPassword) return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 })

    const response = NextResponse.json({ success: true })
    response.cookies.set("eren_admin", "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    })
    return response
  } catch {
    return NextResponse.json({ error: "تعذر تسجيل الدخول" }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set("eren_admin", "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 })
  return response
}
