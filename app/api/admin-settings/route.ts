import { NextResponse } from "next/server"
import { createAdminSettings, getAdminSettings, isDatabaseConfigured, updateAdminSettings } from "@/lib/server-db"
import { isAdminSession } from "@/lib/admin-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    if (!isAdminSession()) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    if (!isDatabaseConfigured()) return NextResponse.json({ comments_enabled: true, storage: "unconfigured" })
    const settings = await getAdminSettings()
    if (!settings) return NextResponse.json({ comments_enabled: true, storage: "configured" })
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Admin settings GET error:", error)
    return NextResponse.json({ comments_enabled: true, error: "تعذر تحميل الإعدادات" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    if (!isAdminSession()) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "قاعدة البيانات غير مهيأة" }, { status: 503 })
    const body = await req.json()
    const commentsEnabled = Boolean(body?.comments_enabled)
    return NextResponse.json(await createAdminSettings(commentsEnabled))
  } catch (error) {
    console.error("Admin settings POST error:", error)
    return NextResponse.json({ error: "تعذر حفظ الإعدادات" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    if (!isAdminSession()) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "قاعدة البيانات غير مهيأة" }, { status: 503 })
    const body = await req.json()
    const commentsEnabled = Boolean(body?.comments_enabled)
    const existing = await getAdminSettings()
    const settings = existing ? await updateAdminSettings(commentsEnabled) : await createAdminSettings(commentsEnabled)
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Admin settings PUT error:", error)
    return NextResponse.json({ error: "تعذر تحديث الإعدادات" }, { status: 500 })
  }
}
