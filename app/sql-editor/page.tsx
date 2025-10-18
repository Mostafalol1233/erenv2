"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Copy, CheckCircle } from "lucide-react"

const SQL_QUERIES = {
  createTables: `-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id BIGSERIAL PRIMARY KEY,
  game_name VARCHAR(255) NOT NULL,
  amount VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id BIGSERIAL PRIMARY KEY,
  comments_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  game VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_packages_game ON packages(game_name);
CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(is_active);
CREATE INDEX IF NOT EXISTS idx_comments_game ON comments(game);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at);

-- Insert admin settings if not exists
INSERT INTO admin_settings (comments_enabled) 
SELECT true 
WHERE NOT EXISTS (SELECT 1 FROM admin_settings);`,

  insertPackages: `-- Insert packages data
DELETE FROM packages;
INSERT INTO packages (game_name, amount, price, description, is_active) VALUES
('CrossFire ZP', '5,000 ZP', 125, 'Basic pack', true),
('CrossFire ZP', '10,000 ZP', 245, 'Standard pack', true),
('CrossFire ZP', '20,000 ZP', 465, 'Popular pack', true),
('CrossFire ZP', '50,000 ZP', 1135, 'Premium pack', true),
('CrossFire ZP', '100,000 ZP', 2325, 'Ultimate pack', true),
('Valorant Points', '475 VP', 245, 'Starter pack', true),
('Valorant Points', '1000 VP', 488, 'Standard pack', true),
('Valorant Points', '2050 VP', 974, 'Popular pack', true),
('Valorant Points', '3650 VP', 1720, 'Premium pack', true),
('Valorant Points', '5350 VP', 2440, 'Best value', true),
('Valorant Points', '11000 VP', 4900, 'Ultimate pack', true),
('PUBG UC', '60 UC', 48, 'Basic pack', true),
('PUBG UC', '300 + 25 UC', 242, 'Standard pack', true),
('PUBG UC', '600 + 60 UC', 470, 'Popular pack', true),
('PUBG UC', '1500 + 300 UC', 1165, 'Premium pack', true),
('PUBG UC', '3000 + 850 UC', 2290, 'Best value', true),
('PUBG UC', '6000 + 2100 UC', 4580, 'Ultimate pack', true),
('Free Fire Diamonds', '100 + 10 Diamonds', 65, 'Basic pack', true),
('Free Fire Diamonds', '210 + 21 Diamonds', 130, 'Standard pack', true),
('Free Fire Diamonds', '530 + 53 Diamonds', 314, 'Popular pack', true),
('Free Fire Diamonds', '1080 + 108 Diamonds', 610, 'Premium pack', true),
('Free Fire Diamonds', '2200 + 220 Diamonds', 1220, 'Best value', true),
('Free Fire Diamonds', '6000 + 2100 Diamonds', 4580, 'Ultimate pack', true),
('8 Ball Pool Coins', '20,000 Coins', 16, 'Basic pack', true),
('8 Ball Pool Coins', '52,000 Coins', 47, 'Standard pack', true),
('8 Ball Pool Coins', '112,000 Coins', 90, 'Popular pack', true),
('8 Ball Pool Coins', '256,000 Coins', 172, 'Premium pack', true),
('8 Ball Pool Coins', '800,000 Coins', 420, 'Best value', true),
('8 Ball Pool Coins', '2 Million Coins', 840, 'Ultimate pack', true);`,

  verifyTables: `-- Verify tables were created successfully
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check packages count
SELECT COUNT(*) as total_packages, COUNT(DISTINCT game_name) as total_games FROM packages;

-- Check comments
SELECT COUNT(*) as total_comments FROM comments;`,
}

export default function SQLEditor() {
  const [password, setPassword] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sqlQuery, setSqlQuery] = useState(SQL_QUERIES.createTables)
  const [isExecuting, setIsExecuting] = useState(false)
  const [result, setResult] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const ADMIN_PASSWORD = "eren2025admin"

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordInput("")
    } else {
      setPasswordError("كلمة السر خاطئة! حاول مرة أخرى.")
      setPasswordInput("")
    }
  }

  const handleExecuteSQL = async () => {
    if (!sqlQuery.trim()) {
      setError("الرجاء إدخال SQL query")
      return
    }

    setIsExecuting(true)
    setError("")
    setResult("")

    try {
      const response = await fetch("/api/execute-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: sqlQuery,
          password: ADMIN_PASSWORD,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "حدث خطأ في تنفيذ SQL")
      } else {
        setResult(`✓ تم التنفيذ بنجاح!\n\nالبيانات المرجعة:\n${JSON.stringify(data.data, null, 2)}`)
      }
    } catch (err) {
      console.error("Fetch error:", err)
      setError(`خطأ في الاتصال: ${err instanceof Error ? err.message : "خطأ غير معروف"}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            <CardTitle className="text-2xl">SQL Editor</CardTitle>
            <p className="text-gray-400 text-sm mt-2">Eren Store - SQL Manager</p>
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

  // SQL Editor
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                💾 SQL Editor
              </h1>
              <p className="text-gray-400 text-sm">Eren Store - تنفيذ SQL Commands</p>
            </div>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
            >
              الرجوع للرئيسية
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Templates */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-300">📋 SQL Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSqlQuery(SQL_QUERIES.createTables)}
              className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-500/30 p-4 rounded-lg hover:border-blue-500/60 transition-all duration-300 text-left"
            >
              <h3 className="font-bold text-blue-300 mb-2">✨ إنشاء الجداول</h3>
              <p className="text-sm text-gray-400">إنشاء جميع الجداول المطلوبة (packages, comments, admin_settings)</p>
            </button>

            <button
              onClick={() => setSqlQuery(SQL_QUERIES.insertPackages)}
              className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-500/30 p-4 rounded-lg hover:border-green-500/60 transition-all duration-300 text-left"
            >
              <h3 className="font-bold text-green-300 mb-2">📦 إدراج البيانات</h3>
              <p className="text-sm text-gray-400">إدراج جميع البيانات الأولية للـ packages</p>
            </button>

            <button
              onClick={() => setSqlQuery(SQL_QUERIES.verifyTables)}
              className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 border border-purple-500/30 p-4 rounded-lg hover:border-purple-500/60 transition-all duration-300 text-left"
            >
              <h3 className="font-bold text-purple-300 mb-2">✅ التحقق</h3>
              <p className="text-sm text-gray-400">التحقق من إنشاء الجداول والبيانات</p>
            </button>
          </div>
        </div>

        {/* Editor */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 mb-8">
          <CardHeader className="border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <CardTitle>SQL Query Editor</CardTitle>
              <Button
                size="sm"
                onClick={() => copyToClipboard(sqlQuery)}
                className="bg-gray-600 hover:bg-gray-700 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    تم النسخ
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    نسخ
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full h-96 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-green-300 font-mono text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="أدخل SQL query هنا..."
              spellCheck={false}
            />
            <div className="mt-4 flex gap-4">
              <Button
                onClick={handleExecuteSQL}
                disabled={isExecuting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 disabled:opacity-50"
                size="lg"
              >
                {isExecuting ? "جاري التنفيذ..." : "▶ تنفيذ الأمر"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="bg-gradient-to-br from-green-900/30 to-green-900/10 border-green-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-green-300">✅ النتيجة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-300 bg-green-900/20 p-4 rounded-lg font-mono">{result}</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="bg-gradient-to-br from-red-900/30 to-red-900/10 border-red-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-red-300">❌ خطأ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-300 bg-red-900/20 p-4 rounded-lg font-mono">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-blue-300">📖 التعليمات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div>
              <h4 className="font-bold text-blue-300 mb-2">الخطوة 1️⃣: إنشاء الجداول</h4>
              <p>اضغط على "✨ إنشاء الجداول" ثم "▶ تنفيذ الأمر" لإنشاء جميع الجداول المطلوبة</p>
            </div>
            <div>
              <h4 className="font-bold text-blue-300 mb-2">الخطوة 2️⃣: إدراج البيانات</h4>
              <p>اضغط على "📦 إدراج البيانات" ثم "▶ تنفيذ الأمر" لإدراج جميع البيانات</p>
            </div>
            <div>
              <h4 className="font-bold text-blue-300 mb-2">الخطوة 3️⃣: التحقق</h4>
              <p>اضغط على "✅ التحقق" ثم "▶ تنفيذ الأمر" للتحقق من أن كل شيء تم بنجاح</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
