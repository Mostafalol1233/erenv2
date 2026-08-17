import { NextResponse } from "next/server"
import { deletePackage, insertPackage, isDatabaseConfigured, listPackages, updatePackage } from "@/lib/server-db"
import { isAdminSession } from "@/lib/admin-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const all = new URL(request.url).searchParams.get("all") === "1"
    const includeInactive = all && isAdminSession()
    return NextResponse.json({ packages: await listPackages(!includeInactive) })
  } catch (error) {
    console.error("Packages GET error:", error)
    return NextResponse.json({ packages: [], error: "تعذر تحميل الباقات" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    if (!isAdminSession()) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "قاعدة البيانات غير مهيأة" }, { status: 503 })
    const body = await req.json()
    const gameName = typeof body?.game_name === "string" ? body.game_name.trim().slice(0, 100) : ""
    const amount = typeof body?.amount === "string" ? body.amount.trim().slice(0, 100) : ""
    const price = Number(body?.price)
    const description = typeof body?.description === "string" ? body.description.trim().slice(0, 240) : ""
    if (!gameName || !amount || !Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "بيانات الباقة غير صالحة" }, { status: 400 })

    const row = await insertPackage({ game_name: gameName, amount, price, description })
    return NextResponse.json({ success: true, package: row })
  } catch (error) {
    console.error("Packages POST error:", error)
    return NextResponse.json({ error: "تعذر إضافة الباقة" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    if (!isAdminSession()) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "قاعدة البيانات غير مهيأة" }, { status: 503 })
    const body = await req.json()
    const id = Number(body?.id)
    const amount = typeof body?.amount === "string" ? body.amount.trim().slice(0, 100) : ""
    const price = Number(body?.price)
    const description = typeof body?.description === "string" ? body.description.trim().slice(0, 240) : ""
    const isActive = Boolean(body?.is_active)
    if (!Number.isInteger(id) || id <= 0 || !amount || !Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "بيانات الباقة غير صالحة" }, { status: 400 })

    const row = await updatePackage({ id, amount, price, description, is_active: isActive })
    return NextResponse.json({ success: true, package: row })
  } catch (error) {
    console.error("Packages PUT error:", error)
    return NextResponse.json({ error: "تعذر تعديل الباقة" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isAdminSession()) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "قاعدة البيانات غير مهيأة" }, { status: 503 })
    const body = await req.json()
    const id = Number(body?.id)
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "invalid" }, { status: 400 })

    await deletePackage(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Packages DELETE error:", error)
    return NextResponse.json({ error: "تعذر حذف الباقة" }, { status: 500 })
  }
}
