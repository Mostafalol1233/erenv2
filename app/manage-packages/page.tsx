"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Using server API endpoints instead of Supabase client
import { Lock, LogOut, Trash2, Edit2, Plus, Save, X } from "lucide-react"

type Package = {
  id: number
  game_name: string
  amount: string
  price: number
  description: string
  is_active: boolean
}

export default function ManagePackages() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<Package>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPackage, setNewPackage] = useState({
    game_name: "",
    amount: "",
    price: "",
    description: "",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  // supabase client removed; we'll call server endpoints below

  const ADMIN_PASSWORD = "eren2025admin"

  const games = [
    "CrossFire ZP",
    "Valorant Points",
    "PUBG UC",
    "Free Fire Diamonds",
    "8 Ball Pool Coins",
    "Discord Effects",
  ]

  useEffect(() => {
    const authStatus = localStorage.getItem("packageManagerAuth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      fetchPackages()
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
      localStorage.setItem("packageManagerAuth", "true")
      setPasswordInput("")
      fetchPackages()
    } else {
      setPasswordError("كلمة السر خاطئة! حاول مرة أخرى.")
      setPasswordInput("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("packageManagerAuth")
    setPackages([])
    setPasswordInput("")
    router.push("/")
  }

  const fetchPackages = async () => {
    setIsLoading(true)
    setErrorMessage("")
    try {
      const res = await fetch(`/api/packages`)
      if (!res.ok) throw new Error("Failed to fetch packages")
      const json = await res.json()
      setPackages(json.packages || [])
    } catch (error) {
      console.error("Failed to fetch packages:", error)
      setErrorMessage("❌ فشل تحميل البيانات")
      setPackages([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (pkg: Package) => {
    setEditingId(pkg.id)
    setEditData({ ...pkg })
  }

  const handleSaveEdit = async () => {
    if (!editData.id) return

    try {
      const res = await fetch(`/api/packages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })

      if (!res.ok) {
        const txt = await res.text()
        setErrorMessage("❌ خطأ: " + txt)
      } else {
        setSuccessMessage("✓ تم حفظ التغييرات بنجاح")
        setEditingId(null)
        fetchPackages()
        setTimeout(() => setSuccessMessage(""), 2000)
      }
    } catch (error) {
      console.error("Failed to save:", error)
      setErrorMessage("❌ فشل حفظ البيانات")
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الـ package؟")) return

    try {
      const res = await fetch(`/api/packages`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const txt = await res.text()
        setErrorMessage("❌ خطأ: " + txt)
      } else {
        setSuccessMessage("✓ تم حذف البيانات بنجاح")
        fetchPackages()
        setTimeout(() => setSuccessMessage(""), 2000)
      }
    } catch (error) {
      console.error("Failed to delete:", error)
      setErrorMessage("❌ فشل حذف البيانات")
    }
  }

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!newPackage.game_name || !newPackage.amount || !newPackage.price) {
      setErrorMessage("الرجاء ملء جميع الحقول المطلوبة")
      return
    }

    try {
      const res = await fetch(`/api/packages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_name: newPackage.game_name,
          amount: newPackage.amount,
          price: Number.parseFloat(newPackage.price),
          description: newPackage.description,
        }),
      })

      if (!res.ok) {
        const txt = await res.text()
        setErrorMessage("❌ خطأ: " + txt)
      } else {
        setSuccessMessage("✓ تم إضافة البيانات بنجاح")
        setNewPackage({ game_name: "", amount: "", price: "", description: "" })
        setShowAddForm(false)
        fetchPackages()
        setTimeout(() => setSuccessMessage(""), 2000)
      }
    } catch (error) {
      console.error("Failed to add:", error)
      setErrorMessage("❌ فشل إضافة البيانات")
    }
  }

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-full">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">🔐 Package Manager</CardTitle>
            <p className="text-gray-400 text-sm mt-2">Eren Store - إدارة البيانات</p>
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {passwordError && <p className="text-red-400 text-sm mt-2">⚠️ {passwordError}</p>}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                دخول
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                📦 Package Manager
              </h1>
              <p className="text-gray-400 text-sm">Eren Store - إدارة الـ Packages والأسعار</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push("/sql-editor")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                💾 SQL Editor
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-600/20 text-green-300 border border-green-500/50 rounded-lg">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-600/20 text-red-300 border border-red-500/50 rounded-lg">{errorMessage}</div>
        )}

        {/* Add New Package Button */}
        <div className="mb-8">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            إضافة Package جديد
          </Button>
        </div>

        {/* Add Package Form */}
        {showAddForm && (
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 mb-8">
            <CardHeader>
              <CardTitle>إضافة Package جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPackage} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">اختر اللعبة</label>
                    <select
                      value={newPackage.game_name}
                      onChange={(e) => setNewPackage({ ...newPackage, game_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">اختر لعبة</option>
                      {games.map((game) => (
                        <option key={game} value={game}>
                          {game}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">الكمية</label>
                    <input
                      type="text"
                      value={newPackage.amount}
                      onChange={(e) => setNewPackage({ ...newPackage, amount: e.target.value })}
                      placeholder="مثال: 1000 VP"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">السعر (EGP)</label>
                    <input
                      type="number"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                      placeholder="245"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">الوصف (اختياري)</label>
                    <input
                      type="text"
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                      placeholder="مثال: Best value"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setErrorMessage("")
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Packages Table */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 mb-8">
          <CardHeader>
            <CardTitle>Packages ({packages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">⏳ جاري التحميل...</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">❌ لا توجد packages حالياً</p>
                <p className="text-gray-500 text-sm">استخدم SQL Editor لإنشاء الجداول والبيانات الأولية</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold">اللعبة</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold">الكمية</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold">السعر</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold">الوصف</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold">الحالة</th>
                      <th className="text-left px-4 py-3 text-gray-300 font-semibold">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr
                        key={pkg.id}
                        className="border-b border-gray-700 hover:bg-gray-800/30 transition-colors duration-200"
                      >
                        {editingId === pkg.id ? (
                          <>
                            <td className="px-4 py-3">{pkg.game_name}</td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={editData.amount || ""}
                                onChange={(e) => setEditData((prev) => ({ ...prev, amount: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                value={editData.price || ""}
                                onChange={(e) =>
                                  setEditData((prev) => ({
                                    ...prev,
                                    price: Number.parseFloat(e.target.value),
                                  }))
                                }
                                step="0.01"
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={editData.description || ""}
                                onChange={(e) =>
                                  setEditData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() =>
                                  setEditData((prev) => ({
                                    ...prev,
                                    is_active: !prev.is_active,
                                  }))
                                }
                                className={`px-3 py-1 rounded text-sm ${
                                  editData.is_active ? "bg-green-600/30 text-green-300" : "bg-red-600/30 text-red-300"
                                }`}
                              >
                                {editData.is_active ? "✓ مفعّل" : "✕ معطّل"}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={handleSaveEdit}
                                  className="bg-green-600/30 hover:bg-green-600/50 text-green-300 p-2 rounded transition-colors"
                                  title="حفظ"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="bg-red-600/30 hover:bg-red-600/50 text-red-300 p-2 rounded transition-colors"
                                  title="إلغاء"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-gray-200 font-medium">{pkg.game_name}</td>
                            <td className="px-4 py-3 text-gray-300">{pkg.amount}</td>
                            <td className="px-4 py-3 text-gray-300 font-semibold text-blue-400">{pkg.price} EGP</td>
                            <td className="px-4 py-3 text-gray-400 text-sm">{pkg.description || "-"}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  pkg.is_active ? "bg-green-600/30 text-green-300" : "bg-red-600/30 text-red-300"
                                }`}
                              >
                                {pkg.is_active ? "🟢 مفعّل" : "🔴 معطّل"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(pkg)}
                                  className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 p-2 rounded transition-colors"
                                  title="تعديل"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(pkg.id)}
                                  className="bg-red-600/30 hover:bg-red-600/50 text-red-300 p-2 rounded transition-colors"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-blue-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-blue-300 text-sm mb-2">📊 إجمالي الـ Packages</p>
                <h3 className="text-4xl font-bold text-blue-400">{packages.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-900/10 border-green-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-green-300 text-sm mb-2">✅ الـ Packages المفعلة</p>
                <h3 className="text-4xl font-bold text-green-400">{packages.filter((p) => p.is_active).length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-purple-300 text-sm mb-2">🎮 عدد الألعاب</p>
                <h3 className="text-4xl font-bold text-purple-400">{new Set(packages.map((p) => p.game_name)).size}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
