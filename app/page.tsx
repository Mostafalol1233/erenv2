"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock3,
  Gamepad2,
  Gift,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react"
import { addComment, getComments, type Comment } from "@/lib/comments"

type Game = {
  id: string
  name: string
  category: string
  image: string
  description: string
  price: number
  rating: number
  buyers: string
  accent: string
  badge?: string
  delivery: string
  packages: { amount: string; price: string }[]
}

const games: Game[] = [
  {
    id: "pubg",
    name: "PUBG Mobile",
    category: "باتل رويال",
    image: "/images/pubg-logo.jpeg",
    description: "شدّ فريقك إلى المعركة واشحن UC خلال دقائق.",
    price: 48,
    rating: 4.9,
    buyers: "2.4k",
    accent: "from-amber-400/70 via-orange-500/20 to-transparent",
    badge: "الأكثر طلباً",
    delivery: "فوري",
    packages: [
      { amount: "60 UC", price: "48 ج.م" },
      { amount: "300 + 25 UC", price: "242 ج.م" },
      { amount: "600 + 60 UC", price: "470 ج.م" },
      { amount: "1500 + 300 UC", price: "1,165 ج.م" },
    ],
  },
  {
    id: "valorant",
    name: "Valorant Points",
    category: "تنافسي",
    image: "/images/valorant-points-logo.jpg",
    description: "افتح سكناتك الجديدة واصنع لحظتك في الرانك.",
    price: 245,
    rating: 4.8,
    buyers: "1.8k",
    accent: "from-rose-500/70 via-red-500/20 to-transparent",
    badge: "اختيار المحترفين",
    delivery: "2–5 دقائق",
    packages: [
      { amount: "475 VP", price: "245 ج.م" },
      { amount: "1000 VP", price: "488 ج.م" },
      { amount: "2050 VP", price: "974 ج.م" },
      { amount: "3650 VP", price: "1,720 ج.م" },
    ],
  },
  {
    id: "freefire",
    name: "Free Fire",
    category: "موبايل",
    image: "/images/freefire-logo.jpg",
    description: "جواهر أكثر، سكنات أسرع، واستعداد كامل للجولة.",
    price: 65,
    rating: 4.9,
    buyers: "3.1k",
    accent: "from-cyan-400/70 via-blue-500/20 to-transparent",
    badge: "سريع جداً",
    delivery: "فوري",
    packages: [
      { amount: "100 + 10 جوهرة", price: "65 ج.م" },
      { amount: "210 + 21 جوهرة", price: "130 ج.م" },
      { amount: "530 + 53 جوهرة", price: "314 ج.م" },
      { amount: "1080 + 108 جوهرة", price: "610 ج.م" },
    ],
  },
  {
    id: "crossfire",
    name: "CrossFire ZP",
    category: "تصويب",
    image: "/images/crossfire-new-logo.jpg",
    description: "عزّز ترسانتك واستلم ZP بأمان على مدار الساعة.",
    price: 125,
    rating: 4.7,
    buyers: "940",
    accent: "from-violet-500/70 via-purple-500/20 to-transparent",
    delivery: "5 دقائق",
    packages: [
      { amount: "5,000 ZP", price: "125 ج.م" },
      { amount: "10,000 ZP", price: "245 ج.م" },
      { amount: "20,000 ZP", price: "465 ج.م" },
      { amount: "50,000 ZP", price: "1,135 ج.م" },
    ],
  },
  {
    id: "8ball",
    name: "8 Ball Pool",
    category: "كاجوال",
    image: "/images/8ball-logo.jpg",
    description: "أظهر مهاراتك وارفع رصيدك من العملات بسهولة.",
    price: 16,
    rating: 4.8,
    buyers: "1.2k",
    accent: "from-emerald-400/70 via-teal-500/20 to-transparent",
    delivery: "فوري",
    packages: [
      { amount: "20,000 عملة", price: "16 ج.م" },
      { amount: "52,000 عملة", price: "47 ج.م" },
      { amount: "112,000 عملة", price: "90 ج.م" },
      { amount: "256,000 عملة", price: "172 ج.م" },
    ],
  },
  {
    id: "discord",
    name: "Discord Effects",
    category: "بطاقات رقمية",
    image: "/images/discord-effects.jpg",
    description: "خصّص حضورك الرقمي بتأثيرات تناسب هويتك.",
    price: 75,
    rating: 4.6,
    buyers: "680",
    accent: "from-indigo-500/70 via-fuchsia-500/20 to-transparent",
    badge: "جديد",
    delivery: "خلال 15 دقيقة",
    packages: [
      { amount: "تأثير أساسي", price: "75 ج.م" },
      { amount: "تأثير مميز", price: "125 ج.م" },
      { amount: "حزمة كاملة", price: "220 ج.م" },
    ],
  },
  {
    id: "roblox",
    name: "Roblox Credits",
    category: "موبايل",
    image: "/images/roblox-art.png",
    description: "ابنِ عالمك واشحن رصيدك بدون خطوات معقدة.",
    price: 165,
    rating: 4.8,
    buyers: "870",
    accent: "from-fuchsia-500/70 via-cyan-500/20 to-transparent",
    badge: "وصول حديث",
    delivery: "5–10 دقائق",
    packages: [
      { amount: "400 Robux", price: "165 ج.م" },
      { amount: "800 Robux", price: "315 ج.م" },
      { amount: "1700 Robux", price: "625 ج.م" },
    ],
  },
  {
    id: "mlbb",
    name: "Mobile Legends",
    category: "موبايل",
    image: "/images/mobile-legends-art.png",
    description: "ألماسات جديدة لتقود فريقك إلى القمة.",
    price: 55,
    rating: 4.9,
    buyers: "1.5k",
    accent: "from-sky-400/70 via-violet-500/20 to-transparent",
    badge: "ترند الآن",
    delivery: "فوري",
    packages: [
      { amount: "86 ألماسة", price: "55 ج.م" },
      { amount: "172 ألماسة", price: "105 ج.م" },
      { amount: "344 ألماسة", price: "198 ج.م" },
    ],
  },
  {
    id: "league",
    name: "League RP",
    category: "تنافسي",
    image: "/images/league-rp-art.png",
    description: "اختَر مظهرك القادم واصنع فرقاً في كل مباراة.",
    price: 210,
    rating: 4.7,
    buyers: "520",
    accent: "from-lime-400/70 via-violet-500/20 to-transparent",
    delivery: "10 دقائق",
    packages: [
      { amount: "575 RP", price: "210 ج.م" },
      { amount: "1380 RP", price: "465 ج.م" },
      { amount: "2800 RP", price: "880 ج.م" },
    ],
  },
  {
    id: "steam",
    name: "Steam Wallet",
    category: "بطاقات رقمية",
    image: "/images/steam-wallet-art.png",
    description: "رصيد جاهز لألعابك وعمليات الشراء الرقمية.",
    price: 300,
    rating: 4.8,
    buyers: "410",
    accent: "from-blue-400/70 via-indigo-500/20 to-transparent",
    badge: "بدون انتظار",
    delivery: "فوري",
    packages: [
      { amount: "5 USD", price: "300 ج.م" },
      { amount: "10 USD", price: "590 ج.م" },
      { amount: "20 USD", price: "1,140 ج.م" },
    ],
  },
]

const categories = ["الكل", "الأكثر طلباً", "موبايل", "باتل رويال", "تنافسي", "بطاقات رقمية"]

const testimonials = [
  { name: "محمد ع.", game: "PUBG Mobile", text: "أول مرة أجرب المتجر والطلب وصل أسرع مما توقعت. تجربة مرتبة جداً.", score: 5 },
  { name: "سارة م.", game: "Free Fire", text: "الأسعار واضحة والدعم رد عليّ فوراً. أكيد هكرر التجربة.", score: 5 },
  { name: "عمر ك.", game: "Valorant Points", text: "واجهة جديدة ممتازة والتنفيذ كان سلساً من أول رسالة لحد الاستلام.", score: 5 },
]

function StatCard({ icon: Icon, label, value, detail, accent }: { icon: typeof Zap; label: string; value: string; detail: string; accent: string }) {
  return (
    <div className="stat-card group">
      <div className={`stat-icon ${accent}`}><Icon className="h-5 w-5" /></div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-black text-white">{value}</p>
        <p className="mt-1 text-xs text-emerald-300">{detail}</p>
      </div>
    </div>
  )
}

export default function ErenStoreLanding() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("الكل")
  const [sortBy, setSortBy] = useState("featured")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [toast, setToast] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [formData, setFormData] = useState({ name: "", game: "", comment: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getComments().then((data) => setComments(data.slice(0, 3)))
  }, [])

  const filteredGames = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = games.filter((game) => {
      const matchesQuery = !normalizedQuery || `${game.name} ${game.category}`.toLowerCase().includes(normalizedQuery)
      const matchesCategory = activeCategory === "الكل" || game.category === activeCategory || (activeCategory === "الأكثر طلباً" && ["pubg", "freefire", "mlbb"].includes(game.id))
      return matchesQuery && matchesCategory
    })

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      return Number(Boolean(b.badge)) - Number(Boolean(a.badge))
    })
  }, [activeCategory, query, sortBy])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 3200)
  }

  const handlePurchase = (game: Game, packageAmount: string, price: string) => {
    const message = `مرحباً! أريد شراء ${packageAmount} من ${game.name} بسعر ${price}. أرجو تأكيد الطلب.`
    window.open(`https://wa.me/201147365618?text=${encodeURIComponent(message)}`, "_blank")
  }

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!formData.name || !formData.game || !formData.comment) {
      showToast("أكمل بيانات المراجعة أولاً")
      return
    }
    setIsSubmitting(true)
    const success = await addComment(formData.name, formData.game, formData.comment)
    setIsSubmitting(false)
    if (success) {
      setFormData({ name: "", game: "", comment: "" })
      showToast("تم إرسال مراجعتك بنجاح")
      const latest = await getComments()
      setComments(latest.slice(0, 3))
    } else {
      showToast("تعذر إرسال المراجعة حالياً")
    }
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050711] text-slate-100">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="announcement-bar">
        <span className="announcement-dot" />
        <span>عرض الإطلاق: شحنات مختارة برسوم صفرية هذا الأسبوع</span>
        <button onClick={() => scrollTo("games")} className="announcement-link">استكشف العروض <ArrowUpRight className="h-3.5 w-3.5" /></button>
      </div>

      <nav className="site-nav">
        <div className="nav-inner">
          <button className="brand" onClick={() => scrollTo("home")} aria-label="العودة إلى الرئيسية">
            <span className="brand-mark"><span>E</span></span>
            <span><strong>EREN</strong><small>GAME MARKET</small></span>
          </button>
          <div className="nav-links">
            <button className="nav-link active" onClick={() => scrollTo("home")}>الرئيسية</button>
            <button className="nav-link" onClick={() => scrollTo("games")}>الألعاب</button>
            <button className="nav-link" onClick={() => scrollTo("benefits")}>لماذا نحن</button>
            <button className="nav-link" onClick={() => scrollTo("reviews")}>آراء اللاعبين</button>
          </div>
          <div className="nav-actions">
            <Link href="/admin" className="nav-admin"><LayoutDashboard className="h-4 w-4" /> لوحة الإدارة</Link>
            <button className="mobile-menu-button" onClick={() => setIsMenuOpen((value) => !value)} aria-label="فتح القائمة">{isMenuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {isMenuOpen && <div className="mobile-menu"><button onClick={() => scrollTo("home")}>الرئيسية</button><button onClick={() => scrollTo("games")}>الألعاب</button><button onClick={() => scrollTo("benefits")}>لماذا نحن</button><button onClick={() => scrollTo("reviews")}>آراء اللاعبين</button><Link href="/admin">لوحة الإدارة</Link></div>}
      </nav>

      <section id="home" className="hero-section">
        <div className="hero-image" />
        <div className="hero-grid" />
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles className="h-4 w-4" /> سوق الألعاب الأسرع في مصر</div>
            <h1>العب أكثر.<br /><span>اشحن أذكى.</span></h1>
            <p>كل ما تحتاجه لعالمك الرقمي في مكان واحد. شحن آمن، تسليم سريع، وأسعار مصممة للاعبين الحقيقيين.</p>
            <div className="hero-actions"><button className="primary-button" onClick={() => scrollTo("games")}>ابدأ الشحن الآن <ArrowRight className="h-4 w-4" /></button><button className="ghost-button" onClick={() => scrollTo("benefits")}>كيف نعمل؟</button></div>
            <div className="hero-trust"><div className="avatar-stack"><span>م</span><span>س</span><span>ع</span><span>+</span></div><div><div className="stars">★★★★★ <span>4.9/5</span></div><p>موثوق من أكثر من 12,000 لاعب</p></div></div>
          </div>
          <div className="hero-console glass-panel">
            <div className="console-top"><span className="live-pill"><span /> مباشر الآن</span><span className="text-xs text-slate-500">تحديث لحظي</span></div>
            <div className="console-feature"><div className="console-game-art" style={{ backgroundImage: "url('/images/mobile-legends-art.png')" }} /><div><p className="text-xs text-slate-400">آخر طلب</p><h3>Mobile Legends</h3><p className="text-sm text-slate-400">172 ألماسة <span className="text-emerald-300">تم التسليم</span></p></div><Check className="ml-auto h-5 w-5 text-emerald-300" /></div>
            <div className="console-divider" />
            <div className="console-stats"><div><p>متوسط التسليم</p><strong>03:42</strong><span>دقيقة</span></div><div><p>طلبات اليوم</p><strong>248</strong><span className="text-emerald-300">+18%</span></div></div>
            <div className="console-progress"><div><span>حالة الخدمة</span><b>متاحة 24/7</b></div><div className="progress-track"><span /></div></div>
          </div>
        </div>
        <div className="hero-scroll"><span /> مرر لاكتشاف المزيد</div>
      </section>

      <section className="container stats-grid"><StatCard icon={Zap} label="سرعة التسليم" value="03:42" detail="أسرع من الأمس بـ 12%" accent="lime" /><StatCard icon={ShieldCheck} label="أمان الدفع" value="100%" detail="حماية مشفرة لكل طلب" accent="cyan" /><StatCard icon={Users} label="لاعبون نشطون" value="12.4K" detail="ينضمون إلى مجتمعنا" accent="violet" /><StatCard icon={TrendingUp} label="طلبات مكتملة" value="98.7%" detail="معدل رضا استثنائي" accent="orange" /></section>

      <section id="games" className="container games-section">
        <div className="section-heading"><div><div className="eyebrow">مكتبة الألعاب <span className="eyebrow-line" /></div><h2>اختر عالمك القادم</h2><p>ابحث عن لعبتك، اختر الباقة، وخليك داخل الجولة.</p></div><div className="section-count"><strong>{filteredGames.length.toString().padStart(2, "0")}</strong><span>عناوين متاحة</span></div></div>
        <div className="category-row">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`category-chip ${activeCategory === category ? "selected" : ""}`}>{category}</button>)}</div>
        <div className="games-toolbar"><div className="search-box"><Search className="h-4 w-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن لعبة أو نوع..." /></div><div className="sort-box"><SlidersHorizontal className="h-4 w-4" /><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">ترتيب مميز</option><option value="rating">الأعلى تقييماً</option><option value="price-low">السعر: الأقل أولاً</option><option value="price-high">السعر: الأعلى أولاً</option></select><ChevronDown className="h-4 w-4" /></div></div>
        {filteredGames.length ? <div className="game-grid">{filteredGames.map((game, index) => <article key={game.id} className="game-card" style={{ "--delay": `${index * 40}ms` } as React.CSSProperties}>
          <button className="game-visual" onClick={() => setSelectedGame(game)} aria-label={`عرض ${game.name}`}><img src={game.image} alt="" /><div className={`game-wash bg-gradient-to-br ${game.accent}`} /><div className="game-visual-top"><span className="game-category">{game.category}</span>{game.badge && <span className="game-badge"><Sparkles className="h-3 w-3" /> {game.badge}</span>}</div><span className="visual-arrow"><ArrowUpRight className="h-4 w-4" /></span></button>
          <div className="game-card-body"><div className="game-title-row"><div><h3>{game.name}</h3><p>{game.description}</p></div><div className="rating"><Star className="h-3.5 w-3.5 fill-current" /> {game.rating}</div></div><div className="game-meta"><span><Clock3 className="h-3.5 w-3.5" /> {game.delivery}</span><span><Users className="h-3.5 w-3.5" /> {game.buyers} لاعب</span></div><div className="game-buy-row"><div><small>يبدأ من</small><strong>{game.price} <em>ج.م</em></strong></div><button onClick={() => setSelectedGame(game)} className="buy-button">عرض الباقات <ArrowRight className="h-3.5 w-3.5" /></button></div></div>
        </article>)}</div> : <div className="empty-state"><Search className="h-8 w-8" /><h3>لم نجد هذه اللعبة</h3><p>جرّب كلمة بحث أخرى أو اختر تصنيفاً مختلفاً.</p></div>}
      </section>

      <section className="container spotlight-section"><div className="spotlight-copy"><div className="eyebrow">وصول جديد <span className="eyebrow-line" /></div><h2>تجربة جديدة<br /><span>كل أسبوع.</span></h2><p>نضيف الألعاب التي يحبها مجتمعنا أولاً. اترك لنا ترشيحك وسنخبرك عند الإطلاق.</p><button className="outline-button" onClick={() => showToast("تم تسجيل اهتمامك بالإصدارات الجديدة")}>سجّل اهتمامي <ArrowUpRight className="h-4 w-4" /></button></div><div className="spotlight-art" style={{ backgroundImage: "url('/images/hero-arcade.png')" }}><div className="spotlight-card"><span>قادم قريباً</span><strong>مفاجآت للاعبين</strong><p>خصومات موسمية + باقات حصرية</p></div></div></section>

      <section id="benefits" className="container benefits-section"><div className="section-heading compact"><div><div className="eyebrow">لماذا إيرين؟ <span className="eyebrow-line" /></div><h2>مصمم حول وقتك.</h2></div><p>لا نبيع شحناً فقط؛ نبني لك تجربة واضحة وسريعة من أول نقرة حتى نهاية المباراة.</p></div><div className="benefits-grid"><div className="benefit-card"><div className="benefit-icon cyan"><Zap /></div><h3>تسليم فوري</h3><p>الطلبات الرقمية تصلك تلقائياً أو عبر فريق الدعم خلال دقائق قليلة.</p><span>01</span></div><div className="benefit-card"><div className="benefit-icon lime"><ShieldCheck /></div><h3>أمان بلا تنازلات</h3><p>بياناتك وعمليات الدفع محمية، مع متابعة لكل طلب حتى الاستلام.</p><span>02</span></div><div className="benefit-card"><div className="benefit-icon violet"><MessageCircle /></div><h3>دعم يفهم اللاعبين</h3><p>فريق متاح طوال اليوم عبر واتساب ليرد على سؤالك بلغتك.</p><span>03</span></div></div></section>

      <section id="reviews" className="container reviews-section"><div className="section-heading compact"><div><div className="eyebrow">آراء اللاعبين <span className="eyebrow-line" /></div><h2>أصوات من داخل اللعبة.</h2></div><div className="review-score"><strong>4.9</strong><div><div className="stars">★★★★★</div><span>من 1,284 مراجعة</span></div></div></div><div className="reviews-grid">{(comments.length ? comments : testimonials).map((review, index) => <div className="review-card" key={`${review.name}-${index}`}><div className="review-top"><div className="review-avatar">{review.name.slice(0, 1)}</div><div><strong>{review.name}</strong><span>{review.game}</span></div><div className="stars small">{"★".repeat(review.score || 5)}</div></div><p>“{review.comment || review.text}”</p><span className="review-date">تجربة موثقة من لاعب</span></div>)}</div><form onSubmit={handleCommentSubmit} className="review-form"><div><p className="eyebrow">شارك تجربتك</p><h3>كلمة منك تساعد لاعباً آخر.</h3></div><input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="اسمك" /><input value={formData.game} onChange={(event) => setFormData({ ...formData, game: event.target.value })} placeholder="اللعبة" /><input value={formData.comment} onChange={(event) => setFormData({ ...formData, comment: event.target.value })} placeholder="اكتب مراجعة قصيرة" /><button className="primary-button" disabled={isSubmitting}>{isSubmitting ? "جارٍ الإرسال" : "أرسل المراجعة"}</button></form></section>

      <footer className="site-footer"><div className="container footer-inner"><div className="brand"><span className="brand-mark"><span>E</span></span><span><strong>EREN</strong><small>GAME MARKET</small></span></div><p>مكانك المفضل لشحن الألعاب بسرعة وأمان.</p><div className="footer-links"><button onClick={() => scrollTo("games")}>كتالوج الألعاب</button><Link href="/admin">إدارة المتجر</Link><button onClick={() => showToast("الدعم متاح عبر واتساب 24/7")}>تواصل معنا</button></div></div><div className="container footer-bottom"><span>© 2026 Eren Game Market</span><span>صُنع للاعبين، من لاعبين.</span></div></footer>

      {selectedGame && <div className="modal-backdrop" onClick={() => setSelectedGame(null)}><div className="purchase-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedGame(null)} aria-label="إغلاق"><X /></button><div className="modal-art" style={{ backgroundImage: `url('${selectedGame.image}')` }}><div className={`game-wash bg-gradient-to-br ${selectedGame.accent}`} /><div><span>{selectedGame.category}</span><h2>{selectedGame.name}</h2></div></div><div className="modal-content"><div className="modal-heading"><div><p className="eyebrow">اختر باقتك</p><h3>جاهز للانطلاق؟</h3></div><span className="delivery-tag"><Zap className="h-3.5 w-3.5" /> {selectedGame.delivery}</span></div><div className="package-list">{selectedGame.packages.map((item) => <button key={item.amount} onClick={() => handlePurchase(selectedGame, item.amount, item.price)} className="package-row"><span><strong>{item.amount}</strong><small>تسليم آمن ومتابعة كاملة</small></span><b>{item.price}<ArrowUpRight className="h-4 w-4" /></b></button>)}</div><p className="modal-note"><ShieldCheck className="h-4 w-4" /> الدفع والتأكيد يتمان عبر فريق الدعم الرسمي.</p></div></div></div>}
      {toast && <div className="toast"><Check className="h-4 w-4" /> {toast}</div>}
    </main>
  )
}
