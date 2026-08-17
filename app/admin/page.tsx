"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Eye,
  EyeOff,
  FileText,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react"

type Review = { id: number; name: string; game: string; comment: string; created_at: string }

type NavItem = { id: string; label: string; icon: typeof LayoutDashboard }

const navItems: NavItem[] = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "catalog", label: "كتالوج الألعاب", icon: Gamepad2 },
  { id: "orders", label: "الطلبات", icon: Package },
  { id: "reviews", label: "المراجعات", icon: MessageSquareText },
  { id: "settings", label: "الإعدادات", icon: Settings2 },
]

const catalog = [
  { slug: "pubg-mobile", name: "PUBG Mobile", category: "باتل رويال", image: "/images/pubg-logo.jpeg", sales: "2,418", revenue: "184,920 ج.م", status: "نشطة", color: "amber" },
  { slug: "free-fire", name: "Free Fire", category: "موبايل", image: "/images/freefire-logo.jpg", sales: "3,108", revenue: "162,440 ج.م", status: "نشطة", color: "cyan" },
  { slug: "valorant-points", name: "Valorant Points", category: "تنافسي", image: "/images/valorant-points-logo.jpg", sales: "1,842", revenue: "318,700 ج.م", status: "نشطة", color: "rose" },
  { slug: "roblox-credits", name: "Roblox Credits", category: "موبايل", image: "/images/roblox-art.png", sales: "870", revenue: "74,320 ج.م", status: "جديد", color: "violet" },
  { slug: "mobile-legends", name: "Mobile Legends", category: "موبايل", image: "/images/mobile-legends-art.png", sales: "1,510", revenue: "122,680 ج.م", status: "نشطة", color: "blue" },
]

const activity = [
  { title: "طلب جديد مكتمل", detail: "PUBG Mobile · 600 UC", amount: "+470 ج.م", time: "منذ 3 دقائق", icon: Check, tone: "green" },
  { title: "مراجعة جديدة", detail: "سارة م. · Free Fire", amount: "5.0", time: "منذ 12 دقيقة", icon: Star, tone: "purple" },
  { title: "منتج جديد مضاف", detail: "Roblox Credits", amount: "جاهز", time: "منذ 28 دقيقة", icon: Sparkles, tone: "cyan" },
  { title: "طلب يحتاج متابعة", detail: "Discord Effects · #ER-2081", amount: "مفتوح", time: "منذ ساعة", icon: Clock3, tone: "orange" },
]

export default function AdminPanel() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [activeSection, setActiveSection] = useState("overview")
  const [search, setSearch] = useState("")
  const [comments, setComments] = useState<Review[]>([])
  const [commentsEnabled, setCommentsEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState("")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const filteredCatalog = useMemo(() => catalog.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())), [search])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2800)
  }, [])

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [commentsResponse, settingsResponse] = await Promise.all([fetch("/api/comments", { cache: "no-store" }), fetch("/api/admin-settings", { cache: "no-store" })])
      if (commentsResponse.ok) {
        const data = await commentsResponse.json()
        setComments(data.comments || [])
      }
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json()
        if (typeof settings?.comments_enabled !== "undefined") setCommentsEnabled(Boolean(settings.comments_enabled))
      }
    } catch {
      showToast("تعذر تحديث بعض بيانات اللوحة")
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    let active = true
    const verifySession = async () => {
      const response = await fetch("/api/admin-auth", { cache: "no-store" }).catch(() => null)
      if (!active) return
      if (response?.ok) {
        window.localStorage.setItem("adminAuth", "true")
        setIsAuthenticated(true)
        void loadDashboardData()
      } else {
        window.localStorage.removeItem("adminAuth")
        setIsAuthenticated(false)
        setIsLoading(false)
      }
      setAuthChecked(true)
    }
    void verifySession()
    return () => { active = false }
  }, [loadDashboardData])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setPasswordError("")
    try {
      const response = await fetch("/api/admin-auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: passwordInput }) })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setPasswordError(data?.error || "تعذر تسجيل الدخول")
        setPasswordInput("")
        return
      }
      window.localStorage.setItem("adminAuth", "true")
      setIsAuthenticated(true)
      setPasswordInput("")
      void loadDashboardData()
    } catch {
      setPasswordError("تعذر الاتصال بمركز التحكم")
      setPasswordInput("")
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin-auth", { method: "DELETE" }).catch(() => undefined)
    window.localStorage.removeItem("adminAuth")
    setIsAuthenticated(false)
    router.push("/")
  }

  const handleDeleteComment = async (id: number) => {
    if (!window.confirm("هل تريد حذف هذه المراجعة؟")) return
    const response = await fetch("/api/comments", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    if (response.ok) {
      setComments((items) => items.filter((comment) => comment.id !== id))
      showToast("تم حذف المراجعة")
    } else showToast("تعذر حذف المراجعة")
  }

  const toggleComments = async () => {
    const nextValue = !commentsEnabled
    const response = await fetch("/api/admin-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ comments_enabled: nextValue }) })
    if (response.ok) {
      setCommentsEnabled(nextValue)
      showToast(nextValue ? "تم تفعيل المراجعات" : "تم إيقاف المراجعات")
    } else showToast("تعذر تحديث الإعداد")
  }

  if (!authChecked) {
    return <div className="admin-login-page"><div className="admin-login-card"><div className="login-brand"><img className="admin-brand-logo" src="/images/eren-logo-premium-transparent.png" alt="إيرين ستور" /><span><strong>EREN</strong><small>CONTROL CENTER</small></span></div><p className="eyebrow">جارٍ التحقق من جلسة الإدارة…</p></div></div>
  }

  if (!isAuthenticated) {
    return <div className="admin-login-page"><div className="admin-login-glow" /><form onSubmit={handleLogin} className="admin-login-card"><div className="login-brand"><img className="admin-brand-logo" src="/images/eren-logo-premium-transparent.png" alt="إيرين ستور" /><span><strong>EREN</strong><small>CONTROL CENTER</small></span></div><div className="login-icon"><ShieldCheck /></div><p className="eyebrow">مساحة محمية</p><h1>مرحباً بك في مركز التحكم</h1><p>أدر الكتالوج، راقب الأداء، وابقَ قريباً من مجتمع اللاعبين.</p><label>كلمة المرور</label><div className="password-input"><ShieldCheck className="h-4 w-4" /><input type="password" value={passwordInput} onChange={(event) => setPasswordInput(event.target.value)} placeholder="أدخل كلمة المرور" autoFocus /></div>{passwordError && <div className="login-error"><X className="h-4 w-4" /> {passwordError}</div>}<button className="primary-button w-full" type="submit">دخول آمن <ChevronDown className="h-4 w-4 -rotate-90" /></button><button className="back-link" type="button" onClick={() => router.push("/")}>العودة إلى المتجر</button></form></div>
  }

  const currentLabel = navItems.find((item) => item.id === activeSection)?.label

  return <div className="admin-shell" dir="rtl">
    <aside className={`admin-sidebar ${mobileNavOpen ? "open" : ""}`}>
      <div className="admin-sidebar-top"><div className="brand"><img className="admin-brand-logo" src="/images/eren-logo-premium-transparent.png" alt="إيرين ستور" /><span><strong>EREN</strong><small>CONTROL CENTER</small></span></div><button className="sidebar-close" onClick={() => setMobileNavOpen(false)}><X /></button></div>
      <div className="workspace-switch"><img className="workspace-avatar workspace-logo" src="/images/eren-logo-premium-transparent.png" alt="إيرين ستور" /><div><strong>Eren Store</strong><span>مساحة العمل الرئيسية</span></div><ChevronDown className="h-4 w-4 text-slate-500" /></div>
      <p className="sidebar-label">الإدارة</p><nav className="admin-nav">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => { setActiveSection(item.id); setMobileNavOpen(false) }} className={activeSection === item.id ? "active" : ""}><Icon className="h-[18px] w-[18px]" /><span>{item.label}</span>{item.id === "reviews" && comments.length > 0 && <b>{comments.length}</b>}</button> })}</nav>
      <div className="sidebar-bottom"><div className="sidebar-pulse"><span className="status-dot" /><div><strong>كل الأنظمة تعمل</strong><span>آخر فحص منذ دقيقة</span></div></div><button className="sidebar-logout" onClick={handleLogout}><LogOut className="h-4 w-4" /> تسجيل الخروج</button></div>
    </aside>
    {mobileNavOpen && <button className="sidebar-overlay" aria-label="إغلاق القائمة" onClick={() => setMobileNavOpen(false)} />}

    <section className="admin-content"><header className="admin-header"><div className="header-left"><button className="sidebar-menu" onClick={() => setMobileNavOpen(true)}><LayoutDashboard className="h-5 w-5" /></button><div><p className="header-kicker">مركز التحكم / {currentLabel}</p><h1>{currentLabel}</h1></div></div><div className="header-actions"><button className="icon-button" onClick={() => showToast("لا توجد تنبيهات جديدة")} aria-label="التنبيهات"><Bell className="h-4 w-4" /><span /></button><div className="admin-profile"><div className="profile-avatar">م</div><div><strong>Mostafa</strong><span>مدير النظام</span></div><ChevronDown className="h-4 w-4 text-slate-500" /></div></div></header>
      <main className="admin-main">
        {activeSection === "overview" && <><div className="admin-welcome"><div><div className="eyebrow"><span className="status-dot" /> نظرة اليوم</div><h2>أهلاً بك، مصطفى.</h2><p>أداؤك يبدو ممتازاً. إليك ما يحدث في متجر إيرين الآن.</p></div><button className="outline-button" onClick={() => showToast("تم تجهيز تقرير الأداء للتحميل")}><FileText className="h-4 w-4" /> تصدير التقرير</button></div><div className="admin-stat-grid"><div className="admin-stat-card"><div className="stat-card-top"><span>إجمالي الإيرادات</span><CircleDollarSign className="text-lime-300" /></div><strong>284,920 <small>ج.م</small></strong><p className="stat-positive"><TrendingUp className="h-3.5 w-3.5" /> 18.4% <span>مقابل الشهر الماضي</span></p><div className="mini-bars lime"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="admin-stat-card"><div className="stat-card-top"><span>الطلبات المكتملة</span><Package className="text-cyan-300" /></div><strong>8,492</strong><p className="stat-positive"><TrendingUp className="h-3.5 w-3.5" /> 12.8% <span>معدل نمو مستمر</span></p><div className="mini-bars cyan"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="admin-stat-card"><div className="stat-card-top"><span>العملاء النشطون</span><Users className="text-violet-300" /></div><strong>12,408</strong><p className="stat-positive"><TrendingUp className="h-3.5 w-3.5" /> 9.2% <span>لاعب جديد هذا الشهر</span></p><div className="mini-bars violet"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="admin-stat-card"><div className="stat-card-top"><span>متوسط التقييم</span><Star className="text-amber-300" /></div><strong>4.9 <small>/ 5</small></strong><p className="stat-positive"><Sparkles className="h-3.5 w-3.5" /> ممتاز <span>من 1,284 مراجعة</span></p><div className="rating-line"><span style={{ width: "98%" }} /></div></div></div><div className="dashboard-columns"><div className="dashboard-panel performance-panel"><div className="panel-heading"><div><h3>الأداء خلال الشهر</h3><p>صافي الإيرادات والطلبات المنجزة</p></div><button className="period-select" onClick={() => showToast("اخترنا آخر 30 يوماً")}>آخر 30 يوماً <ChevronDown className="h-3.5 w-3.5" /></button></div><div className="chart-legend"><span><i className="legend-dot lime" /> الإيرادات</span><span><i className="legend-dot violet" /> الطلبات</span></div><div className="fake-chart"><div className="chart-y"><span>300k</span><span>200k</span><span>100k</span><span>0</span></div><div className="chart-main"><div className="chart-grid-lines"><i /><i /><i /><i /></div><svg viewBox="0 0 800 230" preserveAspectRatio="none" className="chart-svg"><defs><linearGradient id="areaLime" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#c8ff4a" stopOpacity=".28" /><stop offset="1" stopColor="#c8ff4a" stopOpacity="0" /></linearGradient></defs><path d="M0,205 C55,190 72,170 122,182 S190,150 230,162 S286,115 330,128 S385,120 425,135 S480,85 530,105 S595,65 635,95 S700,55 800,38 L800,230 L0,230 Z" fill="url(#areaLime)" /><path d="M0,205 C55,190 72,170 122,182 S190,150 230,162 S286,115 330,128 S385,120 425,135 S480,85 530,105 S595,65 635,95 S700,55 800,38" fill="none" stroke="#c8ff4a" strokeWidth="3" /><path d="M0,220 C60,212 80,208 125,214 S188,185 230,196 S290,164 330,180 S385,160 425,176 S480,140 530,158 S595,112 635,138 S700,118 800,106" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="7 8" /></svg><div className="chart-x"><span>01 مايو</span><span>07 مايو</span><span>14 مايو</span><span>21 مايو</span><span>28 مايو</span></div></div></div></div><div className="dashboard-panel activity-panel"><div className="panel-heading"><div><h3>آخر النشاطات</h3><p>تحديثات مباشرة من المتجر</p></div><button className="text-link" onClick={() => setActiveSection("orders")}>عرض الكل <ArrowUpRight className="h-3.5 w-3.5" /></button></div><div className="activity-list">{activity.map((item) => { const Icon = item.icon; return <div className="activity-item" key={item.title}><div className={`activity-icon ${item.tone}`}><Icon className="h-4 w-4" /></div><div><strong>{item.title}</strong><span>{item.detail}</span></div><div className="activity-right"><b>{item.amount}</b><small>{item.time}</small></div></div> })}</div></div></div><div className="dashboard-panel quick-panel"><div className="panel-heading"><div><h3>إجراءات سريعة</h3><p>أدوات تستخدمها كثيراً</p></div></div><div className="quick-actions"><button onClick={() => setActiveSection("catalog")}><span className="quick-icon lime"><Plus /></span><span><strong>إضافة لعبة</strong><small>أضف عنواناً جديداً للكتالوج</small></span><ArrowUpRight /></button><button onClick={() => setActiveSection("reviews")}><span className="quick-icon violet"><MessageSquareText /></span><span><strong>مراجعة التعليقات</strong><small>{comments.length} مراجعات بانتظارك</small></span><ArrowUpRight /></button><button onClick={() => setActiveSection("settings")}><span className="quick-icon cyan"><Settings2 /></span><span><strong>تحديث الإعدادات</strong><small>تحكم في تجربة المتجر</small></span><ArrowUpRight /></button></div></div></>}

        {activeSection === "catalog" && <div className="section-view"><div className="view-heading"><div><div className="eyebrow">المخزون الرقمي</div><h2>كتالوج الألعاب</h2><p>إدارة العناوين والباقات والأسعار من مكان واحد.</p></div><button className="primary-button" onClick={() => router.push("/manage-packages")}><Plus className="h-4 w-4" /> إدارة الباقات</button></div><div className="catalog-toolbar"><div className="search-box"><Search className="h-4 w-4" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث في الكتالوج..." /></div><button className="outline-button" onClick={() => void loadDashboardData()}>تحديث البيانات <Zap className="h-4 w-4" /></button></div><div className="catalog-table"><div className="catalog-row table-head"><span>اللعبة</span><span>التصنيف</span><span>المبيعات</span><span>الإيرادات</span><span>الحالة</span><span /></div>{filteredCatalog.map((item) => <div className="catalog-row" key={item.name}><Link href={`/admin/games/${item.slug}`} className="catalog-game"><img src={item.image} alt={item.name} /><span><strong>{item.name}</strong><small>فتح لوحة اللعبة والباقات</small></span></Link><span className="muted-cell">{item.category}</span><span className="strong-cell">{item.sales}</span><span className="strong-cell">{item.revenue}</span><span><b className={`catalog-status ${item.status === "جديد" ? "new" : "active"}`}>{item.status}</b></span><button className="row-menu" onClick={() => router.push(`/admin/games/${item.slug}`)} aria-label={`فتح لوحة ${item.name}`}><MoreHorizontal /></button></div>)}</div></div>}

        {activeSection === "orders" && <div className="section-view"><div className="view-heading"><div><div className="eyebrow">التشغيل اليومي</div><h2>الطلبات</h2><p>متابعة حالة الطلبات وتدفق التسليم.</p></div><button className="outline-button" onClick={() => showToast("تم تحديث الطلبات")}>تحديث الآن <Zap className="h-4 w-4" /></button></div><div className="orders-grid"><div className="order-summary green"><Check /><span>طلبات مكتملة</span><strong>8,492</strong><small>+12.8% هذا الشهر</small></div><div className="order-summary orange"><Clock3 /><span>قيد المتابعة</span><strong>18</strong><small>متوسط الانتظار 04:12</small></div><div className="order-summary purple"><BarChart3 /><span>معدل التحويل</span><strong>68.4%</strong><small>+6.2% عن الأسبوع الماضي</small></div></div><div className="dashboard-panel orders-list-panel"><div className="panel-heading"><div><h3>الطلبات الأخيرة</h3><p>بيانات تجريبية متصلة بتدفق المتجر الحالي</p></div><span className="live-pill"><span /> تحديث مباشر</span></div>{["ER-2084", "ER-2083", "ER-2082", "ER-2081"].map((id, index) => <div className="order-row" key={id}><span className="order-id">{id}</span><span>{["PUBG Mobile", "Free Fire", "Valorant Points", "Discord Effects"][index]}</span><span>{["600 + 60 UC", "530 جوهرة", "1000 VP", "تأثير مميز"][index]}</span><b>{["470 ج.م", "314 ج.م", "488 ج.م", "125 ج.م"][index]}</b><span className={`order-status ${index === 3 ? "pending" : "complete"}`}>{index === 3 ? "قيد المراجعة" : "مكتمل"}</span><button className="row-menu" onClick={() => showToast(`تم فتح الطلب ${id}`)}><ArrowUpRight /></button></div>)}</div></div>}

        {activeSection === "reviews" && <div className="section-view"><div className="view-heading"><div><div className="eyebrow">صوت المجتمع</div><h2>المراجعات</h2><p>تابع آراء اللاعبين واحمِ جودة التجربة.</p></div><button className={`outline-button ${commentsEnabled ? "danger-outline" : "success-outline"}`} onClick={toggleComments}>{commentsEnabled ? <><EyeOff className="h-4 w-4" /> إيقاف المراجعات</> : <><Eye className="h-4 w-4" /> تفعيل المراجعات</>}</button></div><div className="review-admin-stats"><div><strong>{comments.length}</strong><span>مراجعات منشورة</span></div><div><strong>4.9</strong><span>متوسط التقييم</span></div><div><strong>96%</strong><span>إيجابية</span></div></div><div className="dashboard-panel reviews-admin-panel">{isLoading ? <div className="loading-state">جارٍ تحميل المراجعات...</div> : comments.length === 0 ? <div className="empty-admin"><MessageSquareText /><h3>لا توجد مراجعات بعد</h3><p>عند وصول أول مراجعة ستظهر هنا.</p></div> : comments.map((comment) => <div className="admin-review-row" key={comment.id}><div className="review-avatar">{comment.name.slice(0, 1)}</div><div className="admin-review-copy"><div><strong>{comment.name}</strong><span>{comment.game}</span></div><p>{comment.comment}</p><small>{new Date(comment.created_at).toLocaleDateString("ar-EG")}</small></div><div className="stars small">★★★★★</div><button className="delete-button" onClick={() => handleDeleteComment(comment.id)}><Trash2 className="h-4 w-4" /></button></div>)}</div></div>}

        {activeSection === "settings" && <div className="section-view"><div className="view-heading"><div><div className="eyebrow">تفضيلات المتجر</div><h2>الإعدادات</h2><p>تحكم في النقاط المهمة لتجربة اللاعبين.</p></div><span className="saved-pill"><Check className="h-3.5 w-3.5" /> آخر حفظ تلقائي منذ دقيقة</span></div><div className="settings-grid"><div className="dashboard-panel settings-panel"><div className="panel-heading"><div><h3>تجربة المجتمع</h3><p>إدارة نقاط التفاعل والظهور</p></div><MessageSquareText className="text-violet-300" /></div><div className="setting-row"><div><strong>المراجعات العامة</strong><span>السماح للاعبين بإرسال مراجعات جديدة</span></div><button className={`toggle ${commentsEnabled ? "on" : ""}`} onClick={toggleComments}><span /></button></div><div className="setting-row"><div><strong>تنبيهات الطلبات</strong><span>تلقي تنبيه عند وصول طلب جديد</span></div><button className="toggle on" onClick={() => showToast("تنبيهات الطلبات مفعلة")}><span /></button></div><div className="setting-row"><div><strong>الوضع السريع</strong><span>إظهار الباقات ذات التسليم الفوري أولاً</span></div><button className="toggle on" onClick={() => showToast("الوضع السريع مفعّل")}><span /></button></div></div><div className="dashboard-panel settings-panel"><div className="panel-heading"><div><h3>حالة المنصة</h3><p>مراقبة الخدمات الأساسية</p></div><ShieldCheck className="text-lime-300" /></div><div className="health-row"><span className="status-dot" /><div><strong>واجهة المتجر</strong><small>تعمل بشكل طبيعي</small></div><b>99.99%</b></div><div className="health-row"><span className="status-dot" /><div><strong>نظام المراجعات</strong><small>{commentsEnabled ? "مفتوح للاعبين" : "متوقف مؤقتاً"}</small></div><b>{commentsEnabled ? "متاح" : "متوقف"}</b></div><div className="health-row"><span className="status-dot" /><div><strong>قناة الدعم</strong><small>واتساب · استجابة سريعة</small></div><b>متاح</b></div></div></div></div>}
      </main></section>
    {toast && <div className="toast"><Check className="h-4 w-4" /> {toast}</div>}
  </div>
}
