import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sql, password } = await request.json()

    // Admin password verification
    const ADMIN_PASSWORD = "eren2025admin"
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "كلمة السر خاطئة" }, { status: 401 })
    }

    // Get database URL
    const databaseUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL

    if (!databaseUrl) {
      return NextResponse.json({ error: "بيانات قاعدة البيانات غير متوفرة" }, { status: 500 })
    }

    // Create SQL client
    const sql_client = neon(databaseUrl)

    // Execute SQL
    const result = await sql_client(sql)

    return NextResponse.json({
      success: true,
      message: "✓ تم تنفيذ الأمر بنجاح",
      data: result,
    })
  } catch (error: any) {
    console.error("SQL Error:", error)
    return NextResponse.json(
      {
        error: `خطأ في تنفيذ SQL: ${error.message || "خطأ غير معروف"}`,
      },
      { status: 400 },
    )
  }
}
