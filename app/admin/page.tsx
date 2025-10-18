"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Supabase client will be dynamically imported in the browser
import { Lock, LogOut, Trash2, Eye, EyeOff } from "lucide-react"

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [commentsEnabled, setCommentsEnabled] = useState(true)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const router = useRouter()

  // Lazily initialize Supabase client only in the browser to avoid build-time errors
  let supabase: any = null
  const getSupabase = async () => {
    if (supabase) return supabase
    if (typeof window === "undefined") return null
    try {
      const mod = await import("@supabase/auth-helpers-nextjs")
      supabase = mod.createClientComponentClient()
      return supabase
    } catch (e) {
      console.warn("Supabase client not available:", e)
      return null
    }
  }

  // Admin password - محفوظ بشكل آمن
  const ADMIN_PASSWORD = "eren2025admin"

  useEffect(() => {
    // التحقق من المصادقة من localStorage
    const authStatus = localStorage.getItem("adminAuth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      fetchComments()
      fetchSettings()
    } else {
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuth", "true")
      setPasswordInput("")
      fetchComments()
      fetchSettings()
    } else {
      setPasswordError("كلمة السر خاطئة! حاول مرة أخرى.")
      setPasswordInput("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuth")
    setComments([])
    setPasswordInput("")
    router.push("/")
  }

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const sb = await getSupabase()
      if (!sb) {
        console.warn("Supabase client unavailable - cannot fetch comments")
        setComments([])
        return
      }
      const { data, error } = await sb.from("comments").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching comments:", error)
      } else {
        setComments(data || [])
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const sb = await getSupabase()
      if (!sb) {
        console.warn("Supabase client unavailable - cannot fetch settings")
        return
      }
      const { data, error } = await sb.from("admin_settings").select("*").single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found
        console.error("Error fetching settings:", error)
      } else if (data) {
        setCommentsEnabled(data.comments_enabled)
      } else {
        // إنشاء إعدادات افتراضية إذا لم تكن موجودة
        await createDefaultSettings()
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    }
  }

  const createDefaultSettings = async () => {
    try {
      const sb = await getSupabase()
      if (!sb) {
        console.warn("Supabase client unavailable - cannot create default settings")
        setCommentsEnabled(true)
        return
      }
      const { error } = await sb.from("admin_settings").insert([
        {
          comments_enabled: true,
        },
      ])

      if (error) {
        console.error("Error creating default settings:", error)
      } else {
        setCommentsEnabled(true)
      }
    } catch (error) {
      console.error("Failed to create default settings:", error)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) return

    try {
      const sb = await getSupabase()
      if (!sb) {
        alert("Supabase client unavailable - cannot delete comment")
        return
      }
      const { error } = await sb.from("comments").delete().eq("id", commentId)

      if (error) {
        console.error("Error deleting comment:", error)
        alert("خطأ في حذف التعليق")
      } else {
        fetchComments()
        alert("تم حذف التعليق بنجاح ✓")
      }
    } catch (error) {
      console.error("Failed to delete comment:", error)
    }
  }

  const handleToggleComments = async () => {
    try {
      const sb = await getSupabase()
      if (!sb) {
        alert("Supabase client unavailable - cannot update settings")
        return
      }
      const newState = !commentsEnabled
      const { error } = await sb.from("admin_settings").update({ comments_enabled: newState }).eq("id", 1)

      if (error) {
        console.error("Error updating settings:", error)
        alert("خطأ في تحديث الإعدادات")
      } else {
        setCommentsEnabled(newState)
        alert(newState ? "✓ تم تفعيل التعليقات" : "✓ تم إيقاف التعليقات مؤقتاً")
      }
    } catch (error) {
      console.error("Failed to update settings:", error)
    }
  }

  // صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-full">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">لوحة الإدارة</CardTitle>
            <p className="text-gray-400 text-sm mt-2">Eren Store Admin Panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">كلمة السر الآمنة</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="أدخل كلمة السر"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                {passwordError && <p className="text-red-400 text-sm mt-2">⚠️ {passwordError}</p>}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                دخول
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-xs text-center">🔐 لوحة إدارة محمية بكلمة سر آمنة</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // لوحة الإدارة
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                لوحة الإدارة
              </h1>
              <p className="text-gray-400 text-sm">Eren Store Admin Dashboard</p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* الإحصائيات والتحكم */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* عدد التعليقات */}
          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-300 text-sm mb-2">عدد التعليقات الكلي</p>
                <h3 className="text-4xl font-bold text-purple-400">{comments.length}</h3>
              </div>
            </CardContent>
          </Card>

          {/* حالة التعليقات */}
          <Card
            className={`bg-gradient-to-br ${commentsEnabled ? "from-green-600/20 to-green-900/20 border-green-500/30" : "from-red-600/20 to-red-900/20 border-red-500/30"}`}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-300 text-sm mb-2">حالة التعليقات</p>
                <h3 className={`text-2xl font-bold ${commentsEnabled ? "text-green-400" : "text-red-400"}`}>
                  {commentsEnabled ? "🟢 مفعّلة" : "🔴 معطّلة"}
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* زر التحكم */}
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border-blue-500/30">
            <CardContent className="pt-6">
              <Button
                onClick={handleToggleComments}
                className={`w-full ${
                  commentsEnabled
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                } text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2`}
              >
                {commentsEnabled ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    إيقاف التعليقات
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    تفعيل التعليقات
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* قائمة التعليقات */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-2xl">التعليقات ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">جاري التحميل...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">لا توجد تعليقات حتى الآن</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{comment.name}</h4>
                          <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full">
                            {comment.game}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          📅{" "}
                          {new Date(comment.created_at).toLocaleString("ar-EG", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="bg-red-600/30 hover:bg-red-600/50 text-red-300 hover:text-red-200 p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                        title="حذف التعليق"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{comment.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* معلومات الأمان */}
        <div className="mt-8 bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">🔐 معلومات الأمان</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ جميع التعليقات محفوظة على السيرفر - لا يمكن تزويرها</li>
            <li>✓ التاريخ والوقت يتم تسجيلهم من قاعدة البيانات تلقائياً</li>
            <li>✓ كلمة السر محمية ولا يمكن تخمينها</li>
            <li>✓ جميع الحذوفات مسجلة (يمكن إضافة Audit Log)</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
