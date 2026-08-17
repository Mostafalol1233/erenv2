import { NextResponse } from "next/server"
import { createOrder, isDatabaseConfigured } from "@/lib/server-db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function clean(value: unknown, max = 180) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "الخدمة غير متاحة حالياً" }, { status: 503 })
    const body = await request.json()
    const gameName = clean(body?.gameName, 100)
    const packageLabel = clean(body?.packageLabel, 100)
    const customerName = clean(body?.customerName, 100)
    const customerContact = clean(body?.customerContact, 120)
    const accountData = clean(body?.accountData, 180)
    const notes = clean(body?.notes, 300)
    const price = Number(body?.price)

    if (!gameName || !packageLabel || !customerName || !customerContact || !accountData || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "أكمل بيانات الطلب أولاً" }, { status: 400 })
    }

    const order = await createOrder({ gameName, packageLabel, price, customerName, customerContact, accountData, notes })
    return NextResponse.json({ order, message: "تم تسجيل طلبك. سيتواصل معك فريق إيرين قريباً." }, { status: 201 })
  } catch (error) {
    console.error("orders POST failed", error)
    return NextResponse.json({ error: "تعذر تسجيل الطلب حالياً" }, { status: 500 })
  }
}
