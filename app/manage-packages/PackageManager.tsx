"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { games, formatPrice, type Game } from "@/lib/catalog"
import { Check, ChevronLeft, Edit3, LogOut, Plus, Save, Search, ShieldCheck, Trash2, X } from "lucide-react"

type PackageRow = {
  id: number
  game_name: string
  amount: string
  price: number
  description: string
  is_active: boolean
}

type PackageManagerProps = {
  initialGameSlug?: string
}

export default function PackageManager({ initialGameSlug }: PackageManagerProps) {
  const router = useRouter()
  const initialGame = games.find((game) => game.slug === initialGameSlug) ?? games[0]
  const [authenticated, setAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [selectedSlug, setSelectedSlug] = useState(initialGame.slug)
  const [search, setSearch] = useState("")
  const [rows, setRows] = useState<PackageRow[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<PackageRow>>({})
  const [showAdd, setShowAdd] = useState(false)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [newPackage, setNewPackage] = useState({ amount: "", price: "", description: "" })

  const selectedGame = games.find((game) => game.slug === selectedSlug) ?? games[0]
  useEffect(() => {
    let active = true
    const verifySession = async () => {
      const response = await fetch("/api/admin-auth", { cache: "no-store" }).catch(() => null)
      if (!active) return
      const valid = Boolean(response?.ok)
      setAuthenticated(valid)
      setAuthChecked(true)
      if (valid) {
        window.localStorage.setItem("packageManagerAuth", "true")
        void loadPackages()
      } else {
        window.localStorage.removeItem("packageManagerAuth")
      }
    }
    void verifySession()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (authenticated) void loadPackages()
  }, [selectedSlug, authenticated])

  async function loadPackages() {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/packages?all=1", { cache: "no-store" })
      if (response.status === 401) {
        setAuthenticated(false)
        window.localStorage.removeItem("packageManagerAuth")
        return
      }
      const data = await response.json()
      setRows(Array.isArray(data.packages) ? data.packages : [])
    } catch {
      setError("تعذر تحميل الباقات. حاول مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault()
    setLoginError("")
    const response = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (!response.ok) {
      setLoginError("كلمة المرور غير صحيحة أو غير مهيأة في بيئة الإنتاج.")
      return
    }
    window.localStorage.setItem("packageManagerAuth", "true")
    setAuthenticated(true)
    setPassword("")
  }

  async function logout() {
    await fetch("/api/admin-auth", { method: "DELETE" })
    window.localStorage.removeItem("packageManagerAuth")
    setAuthenticated(false)
    router.push("/")
  }

  async function mutate(method: "POST" | "PUT" | "DELETE", body: unknown) {
    setError("")
    const response = await fetch("/api/packages", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      if (!response.ok) {
        if (response.status === 401) {
          setAuthenticated(false)
          window.localStorage.removeItem("packageManagerAuth")
        }
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "تعذر حفظ التغيير")
      }
    await loadPackages()
    setNotice("تم حفظ التعديل بنجاح")
    window.setTimeout(() => setNotice(""), 2200)
  }

  async function seedCatalogPackages() {
    if (dbHasSelected) return
    setError("")
    try {
      await Promise.all(selectedGame.packages.map((pack) => fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_name: selectedGame.name, amount: pack.label, price: pack.price, description: pack.note }),
      }).then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.error || "تعذر اعتماد الباقات")
        }
      })))
      await loadPackages()
      setNotice("تم اعتماد جميع باقات الكتالوج وأصبحت قابلة للتعديل")
      window.setTimeout(() => setNotice(""), 2600)
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر اعتماد الباقات")
    }
  }

  async function addPackage(event: React.FormEvent) {
    event.preventDefault()
    if (!newPackage.amount || !newPackage.price) {
      setError("أدخل كمية الباقة وسعرها أولاً.")
      return
    }
    try {
      await mutate("POST", {
        game_name: selectedGame.name,
        amount: newPackage.amount,
        price: Number(newPackage.price),
        description: newPackage.description,
      })
      setNewPackage({ amount: "", price: "", description: "" })
      setShowAdd(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إضافة الباقة")
    }
  }

  async function savePackage() {
    if (!draft.id) return
    try {
      await mutate("PUT", { ...draft, price: Number(draft.price) })
      setEditingId(null)
      setDraft({})
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تعديل الباقة")
    }
  }

  async function deletePackage(id: number) {
    if (!window.confirm("هل تريد حذف هذه الباقة نهائياً؟")) return
    try {
      await mutate("DELETE", { id })
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حذف الباقة")
    }
  }

    if (!authChecked) {
    return (
      <main className="package-admin-shell package-admin-login" dir="rtl">
        <div className="package-admin-login-card"><div className="package-brand-lockup"><img src="/images/eren-logo-cinematic-v3.svg" alt="Eren" /><span>جارٍ التحقق من جلسة الإدارة…</span></div></div>
      </main>
    )
  }

  if (!authenticated) {
    return (
      <main className="package-admin-shell package-admin-login" dir="rtl">
        <div className="package-admin-login-card">
          <div className="package-brand-lockup"><img src="/images/eren-logo-cinematic-v3.svg" alt="Eren" /><span>لوحة ألعاب إيرين</span></div>
          <div className="package-login-icon"><ShieldCheck size={22} /></div>
          <p className="eyebrow">إدارة آمنة</p>
          <h1>مركز إدارة الباقات</h1>
          <p>اختر أي لعبة بعد الدخول لتعديل عروضها وأسعارها ومحتواها من لوحة مستقلة.</p>
          <form onSubmit={handleLogin} className="package-login-form">
            <label htmlFor="admin-password">كلمة مرور الإدارة</label>
            <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="أدخل كلمة المرور" />
            {loginError && <span className="package-form-error">{loginError}</span>}
            <button className="package-primary-button" type="submit">دخول إلى مركز الألعاب</button>
          </form>
        </div>
      </main>
    )
  }

  const filteredGames = games.filter((game) => game.name.includes(search) || game.category.includes(search))
  const selectedRows = rows.filter((row) => row.game_name === selectedGame.name)
  const dbHasSelected = selectedRows.length > 0
  const visibleRows = selectedRows.filter((row) => row.is_active)

  return (
    <main className="package-admin-shell" dir="rtl">
      <header className="package-admin-topbar">
        <div className="package-brand-lockup"><img src="/images/eren-logo-cinematic-v3.svg" alt="Eren" /><span>مركز التجارة والألعاب</span></div>
        <div className="package-admin-actions"><button className="package-ghost-button" onClick={() => router.push("/admin")}><ChevronLeft size={16} /> لوحة التحكم</button><button className="package-logout-button" onClick={logout}><LogOut size={16} /> خروج</button></div>
      </header>
      <div className="package-admin-layout">
        <aside className="package-game-sidebar">
          <div className="package-sidebar-heading"><div><p className="eyebrow">كتالوج إيرين</p><h2>الألعاب</h2></div><span>{games.length}</span></div>
          <div className="package-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث عن لعبة" /></div>
          <div className="package-game-list">
            {filteredGames.map((game) => {
              const count = rows.filter((row) => row.game_name === game.name).length || game.packages.length
              const active = selectedSlug === game.slug
              return <button key={game.slug} className={`package-game-item ${active ? "is-selected" : ""}`} onClick={() => { setSelectedSlug(game.slug); router.replace(`/admin/games/${game.slug}`) }}><img src={game.image} alt="" /><span><strong>{game.name}</strong><small>{game.category} · {count} باقات</small></span><ChevronLeft size={15} /></button>
            })}
          </div>
        </aside>
        <section className="package-admin-content">
          <div className="package-game-hero"><img src={selectedGame.image} alt="" /><div className="package-game-hero-copy"><p className="eyebrow">لوحة اللعبة المستقلة</p><h1>{selectedGame.name}</h1><p>{selectedGame.longDescription}</p><div className="package-game-meta"><span><Check size={14} /> {selectedGame.packages.length} باقات مدققة في الكتالوج</span><span><ShieldCheck size={14} /> جاهز للطلب</span></div></div></div>
          {notice && <div className="package-success">{notice}</div>}
          {error && <div className="package-error">{error}</div>}
          <div className="package-toolbar"><div><p className="eyebrow">إدارة العرض</p><h2>باقات {selectedGame.name}</h2><p>{dbHasSelected ? `${selectedRows.length} باقات محفوظة في قاعدة البيانات` : "لم تحفظ هذه اللعبة في قاعدة البيانات بعد؛ استخدم الباقات المدققة كمرجع وأضف عروضك الآن."}</p></div><button className="package-primary-button" onClick={() => setShowAdd((value) => !value)}><Plus size={18} /> إضافة باقة</button></div>
          {!dbHasSelected && <div className="package-catalog-reference"><div><strong>مرجع الكتالوج المدقق</strong><span>هذه الفئات معروضة في المتجر حالياً. اعتمدها مرة واحدة لتصبح قابلة للتعديل والحذف من هذه اللوحة.</span></div><div className="package-reference-chips">{selectedGame.packages.map((pack) => <span key={pack.id}>{pack.label} · {formatPrice(pack.price)}</span>)}</div><button className="package-primary-button" type="button" onClick={seedCatalogPackages}><Check size={16} /> اعتماد الباقات المدققة</button></div>}
          {showAdd && <form className="package-add-card" onSubmit={addPackage}><div><label>الكمية أو اسم الباقة</label><input value={newPackage.amount} onChange={(event) => setNewPackage({ ...newPackage, amount: event.target.value })} placeholder="مثال: 600 + 60 UC" /></div><div><label>السعر بالجنيه</label><input type="number" min="0" value={newPackage.price} onChange={(event) => setNewPackage({ ...newPackage, price: event.target.value })} placeholder="470" /></div><div><label>ملاحظة البيع</label><input value={newPackage.description} onChange={(event) => setNewPackage({ ...newPackage, description: event.target.value })} placeholder="الأفضل للقيمة" /></div><div className="package-add-actions"><button className="package-primary-button" type="submit"><Save size={16} /> حفظ</button><button className="package-ghost-button" type="button" onClick={() => setShowAdd(false)}><X size={16} /> إلغاء</button></div></form>}
          <div className="package-table-card"><div className="package-table-head"><span>الباقة</span><span>سعر البيع</span><span>ملاحظة</span><span>الحالة</span><span>إجراء</span></div>{loading ? <div className="package-empty">جاري تحميل الباقات…</div> : selectedRows.length === 0 ? <div className="package-empty">لا توجد باقات محفوظة بعد لهذه اللعبة.</div> : selectedRows.map((pack) => editingId === pack.id ? <div className="package-table-row package-edit-row" key={pack.id}><input value={draft.amount ?? ""} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} /><input type="number" value={draft.price ?? ""} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} /><input value={draft.description ?? ""} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /><label className="package-switch"><input type="checkbox" checked={Boolean(draft.is_active)} onChange={(event) => setDraft({ ...draft, is_active: event.target.checked })} /><span /></label><div className="package-row-actions"><button onClick={savePackage} title="حفظ"><Save size={16} /></button><button onClick={() => setEditingId(null)} title="إلغاء"><X size={16} /></button></div></div> : <div className="package-table-row" key={pack.id}><strong>{pack.amount}</strong><b>{formatPrice(pack.price)}</b><span>{pack.description || "—"}</span><span className={pack.is_active ? "package-status-active" : "package-status-off"}>{pack.is_active ? "نشطة" : "مخفية"}</span><div className="package-row-actions"><button onClick={() => { setEditingId(pack.id); setDraft(pack) }} title="تعديل"><Edit3 size={16} /></button><button onClick={() => deletePackage(pack.id)} title="حذف"><Trash2 size={16} /></button></div></div>)}</div>
          <div className="package-audit-grid"><div><span>باقات الكتالوج</span><strong>{selectedGame.packages.length}</strong></div><div><span>الباقات المحفوظة</span><strong>{selectedRows.length}</strong></div><div><span>النشطة حالياً</span><strong>{visibleRows.length}</strong></div><div><span>أقل سعر</span><strong>{formatPrice(selectedGame.packages[0]?.price ?? 0)}</strong></div></div>
        </section>
      </div>
    </main>
  )
}

export function isKnownGameName(value: string) {
  return games.some((game) => game.name === value)
}

export type { Game }
