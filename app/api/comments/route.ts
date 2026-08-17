import { NextResponse } from "next/server"
import { deleteComment, insertComment, isDatabaseConfigured, listComments } from "@/lib/server-db"
import { isAdminSession } from "@/lib/admin-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const comments = await listComments()
    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Comments GET error:", error)
    return NextResponse.json({ comments: [], error: "تعذر تحميل المراجعات" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "قاعدة البيانات غير مهيأة" }, { status: 503 })
    const body = await request.json()
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : ""
    const game = typeof body?.game === "string" ? body.game.trim().slice(0, 80) : ""
    const comment = typeof body?.comment === "string" ? body.comment.trim().slice(0, 800) : ""
    if (!name || !game || !comment) return NextResponse.json({ error: "بيانات المراجعة غير صالحة" }, { status: 400 })

    await insertComment({ name, game, comment })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Comments POST error:", error)
    return NextResponse.json({ error: "تعذر حفظ المراجعة" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isAdminSession()) return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
    if (!isDatabaseConfigured()) return NextResponse.json({ error: "قاعدة البيانات غير مهيأة" }, { status: 503 })
    const body = await request.json()
    const id = Number(body?.id)
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "بيانات المراجعة غير صالحة" }, { status: 400 })

    await deleteComment(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Comments DELETE error:", error)
    return NextResponse.json({ error: "تعذر حذف المراجعة" }, { status: 500 })
  }
}
