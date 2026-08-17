"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, ChevronDown, Clock3, Gamepad2, Menu, MessageCircle, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Users, X } from "lucide-react"
import { addComment, getComments, type Comment } from "@/lib/comments"
import { categories, formatPrice, games, type Game } from "@/lib/catalog"

const testimonials = [
  { name: "محمد ع.", game: "PUBG Mobile", text: "الأسعار واضحة والطلب اتأكد معايا بسرعة.", score: 5 },
  { name: "سارة م.", game: "Free Fire", text: "اختارت الباقة والدعم رجع لي خلال دقائق.", score: 5 },
  { name: "عمر ك.", game: "Valorant Points", text: "صفحة اللعبة وفرت عليّ أسئلة كتير.", score: 5 },
]

function Logo() {
  return <Link className="eren-logo" href="/" aria-label="إيرين ستور - الصفحة الرئيسية"><span className="eren-logo-mark">E</span><span><strong>إيرين</strong><small>متجر اللاعبين</small></span></Link>
}

function ProductTile({ game, featured = false }: { game: Game; featured?: boolean }) {
  return <Link href={`/games/${game.slug}`} className={`xbv-product-tile ${featured ? "is-featured" : ""}`}>
    <img src={game.image} alt={game.name} />
    <span className="xbv-product-shade" />
    <span className="xbv-product-chip">{game.category}</span>
    <span className="xbv-product-name">{game.name}</span>
    <span className="xbv-product-price">من {formatPrice(game.price)}</span>
    {game.badge && <span className="xbv-product-badge">{game.badge}</span>}
  </Link>
}

function SectionTitle({ label, title, id }: { label: string; title: string; id?: string }) {
  return <div className="xbv-section-title" id={id}><div><span className="xbv-section-label"><span className="xbv-label-icon">✦</span>{label}</span><h2>{title}</h2></div><Link href="#all-products" className="xbv-view-all">عرض الكل <ArrowLeft /></Link></div>
}

export default function ErenStoreLanding() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("الكل")
  const [sortBy, setSortBy] = useState("featured")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [formData, setFormData] = useState({ name: "", game: "", comment: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState("")

  useEffect(() => { getComments().then((data) => setComments(data.slice(0, 3))) }, [])

  const filteredGames = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = games.filter((game) => {
      const matchesQuery = !normalizedQuery || `${game.name} ${game.category} ${game.tags.join(" ")}`.toLowerCase().includes(normalizedQuery)
      const matchesCategory = activeCategory === "الكل" || game.category === activeCategory || (activeCategory === "الأكثر طلباً" && game.featured)
      return matchesQuery && matchesCategory
    })
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    })
  }, [activeCategory, query, sortBy])

  const featuredGames = games.filter((game) => game.featured).slice(0, 6)
  const digitalGames = games.filter((game) => ["بطاقات رقمية", "مغامرات", "رياضة", "كاجوال"].includes(game.category)).slice(0, 6)
  const mosaicGames = games.slice(0, 10)

  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3200) }
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setIsMenuOpen(false) }

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!formData.name || !formData.game || !formData.comment) { showToast("أكمل بيانات المراجعة أولاً"); return }
    setIsSubmitting(true)
    const success = await addComment(formData.name, formData.game, formData.comment)
    setIsSubmitting(false)
    if (!success) { showToast("تعذر إرسال المراجعة حالياً"); return }
    setFormData({ name: "", game: "", comment: "" })
    showToast("تم إرسال مراجعتك بنجاح")
    const latest = await getComments()
    setComments(latest.slice(0, 3))
  }

  return <main className="xbv-store-shell">
    <div className="xbv-topbar"><div className="container xbv-topbar-inner"><span><span className="xbv-live-dot" /> تنفيذ الطلبات مستمر اليوم حتى منتصف الليل</span><span className="xbv-topbar-divider">|</span><span>نقاط ومكافآت لكل عملية شراء</span><div className="xbv-topbar-actions"><span>ج.م</span><a href="https://wa.me/201147365618" target="_blank" rel="noreferrer">الدعم والمساعدة</a><span>تسجيل الدخول / إنشاء حساب</span></div></div></div>

    <header className="xbv-header"><div className="container xbv-header-inner"><Logo /><nav className="xbv-main-nav"><button onClick={() => scrollTo("home")}>الرئيسية</button><button onClick={() => scrollTo("trending")}>المنتجات الرائجة</button><button onClick={() => scrollTo("digital")}>الألعاب الرقمية</button><button onClick={() => scrollTo("all-products")}>كل المنتجات</button><button onClick={() => scrollTo("how-it-works")}>كيف نعمل؟</button></nav><div className="xbv-header-actions"><a className="xbv-account" href="#reviews"><Users /><span>حساب اللاعب<br /><small>آراء ومكافآت</small></span></a><button className="xbv-menu-button" onClick={() => setIsMenuOpen((value) => !value)} aria-label="فتح القائمة">{isMenuOpen ? <X /> : <Menu />}</button></div></div>{isMenuOpen && <div className="xbv-mobile-menu"><button onClick={() => scrollTo("home")}>الرئيسية</button><button onClick={() => scrollTo("trending")}>المنتجات الرائجة</button><button onClick={() => scrollTo("digital")}>الألعاب الرقمية</button><button onClick={() => scrollTo("all-products")}>كل المنتجات</button><a href="https://wa.me/201147365618" target="_blank" rel="noreferrer">الدعم عبر واتساب</a></div>}</header>

    <section className="xbv-quick-strip" aria-label="أشهر المنتجات">{games.slice(0, 18).map((game) => <Link href={`/games/${game.slug}`} key={game.slug}><img src={game.image} alt="" /><span>{game.name}</span></Link>)}</section>

    <section id="home" className="xbv-hero"><div className="xbv-hero-mosaic">{mosaicGames.map((game, index) => <img key={game.slug} className={`xbv-mosaic-image mosaic-${index + 1}`} src={game.image} alt="" />)}</div><div className="xbv-hero-overlay" /><div className="container xbv-hero-content"><span className="xbv-hero-kicker"><Sparkles /> متجر إيرين للاعبين</span><h1>كل شيء يحتاجه<br /><em>اللاعب.</em></h1><p>شحن سريع، بطاقات رقمية، وباقات واضحة لكل ألعابك المفضلة.</p><div className="xbv-hero-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن لعبة أو بطاقة رقمية" aria-label="البحث عن لعبة أو بطاقة رقمية" /><button onClick={() => scrollTo("all-products")} aria-label="ابدأ البحث"><ArrowLeft /></button></div><div className="xbv-trending-searches"><span>عمليات البحث الرائجة</span>{featuredGames.slice(0, 5).map((game) => <button key={game.slug} onClick={() => { setQuery(game.name); scrollTo("all-products") }}>{game.name}</button>)}</div></div></section>

    <section className="container xbv-promos"><div className="xbv-rewards-card"><div className="xbv-reward-top"><span className="xbv-reward-icon">★</span><div><span>مرحباً أيها اللاعب</span><strong>مكافآت إيرين</strong></div><b>جديد</b></div><div className="xbv-progress-line"><span>البرونزي</span><strong>0 XP</strong><span>تقدّم البداية</span></div><div className="xbv-progress"><span /></div><div className="xbv-reward-foot"><small>اجمع نقاطاً مع كل طلب</small><a href="#reviews">اعرف المزيد</a></div></div><Link href="/games/fortnite" className="xbv-promo-banner"><img src="/images/fortnite-art-v2.png" alt="Fortnite" /><span className="xbv-promo-shade" /><div><span>عرض الأسبوع</span><h2>استعد للجولة<br /><em>واشحن الآن.</em></h2><strong>اكتشف الباقات <ArrowLeft /></strong></div></Link></section>

    <section id="trending" className="container xbv-store-section"><SectionTitle label="اختيارات اللاعبين" title="المنتجات الرائجة" /><div className="xbv-product-rail">{featuredGames.map((game) => <ProductTile key={game.slug} game={game} featured />)}</div><div className="xbv-load-more"><span /> <button onClick={() => scrollTo("all-products")}>تحميل المزيد <ChevronDown /></button><span /></div></section>

    <section id="digital" className="container xbv-store-section"><SectionTitle label="ألعاب وبطاقات" title="الألعاب الرقمية" /><div className="xbv-product-rail">{digitalGames.map((game) => <ProductTile key={game.slug} game={game} />)}</div><div className="xbv-load-more"><span /> <button onClick={() => scrollTo("all-products")}>عرض كل الألعاب <ArrowLeft /></button><span /></div></section>

    <section id="all-products" className="container xbv-store-section xbv-all-products"><div className="xbv-all-header"><SectionTitle label="كتالوج إيرين" title="كل المنتجات" /><div className="xbv-catalog-count"><strong>{games.length}</strong><span>منتج متاح</span></div></div><div className="xbv-catalog-controls"><div className="xbv-catalog-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم اللعبة أو النوع" aria-label="البحث في المنتجات" /></div><label className="xbv-catalog-sort"><span>ترتيب</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="ترتيب المنتجات"><option value="featured">الأكثر طلباً</option><option value="rating">الأعلى تقييماً</option><option value="price-low">الأقل سعراً</option><option value="price-high">الأعلى سعراً</option></select><ChevronDown /></label></div><div className="xbv-category-pills">{categories.map((category) => <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="xbv-all-grid">{filteredGames.map((game) => <ProductTile key={game.slug} game={game} />)}</div>{filteredGames.length === 0 && <div className="catalog-empty"><Gamepad2 /><h3>لم نجد المنتج بهذا الاسم</h3><p>جرّب كلمة أخرى أو اختر تصنيفاً مختلفاً.</p></div>}</section>

    <section id="how-it-works" className="xbv-how-section"><div className="container"><div className="xbv-section-title"><div><span className="xbv-section-label"><span className="xbv-label-icon">✦</span>خدمة إيرين</span><h2>تجربة شراء واضحة.</h2></div></div><div className="xbv-how-grid"><div><span>01</span><Gamepad2 /><strong>اختار لعبتك</strong><small>منتجات كثيرة في مكان واحد</small></div><div><span>02</span><ShoppingBag /><strong>حدد الباقة</strong><small>السعر والتفاصيل ظاهرين</small></div><div><span>03</span><ShieldCheck /><strong>اطلب بأمان</strong><small>داخل المتجر أو عبر واتساب</small></div><div><span>04</span><MessageCircle /><strong>تابع مع الإدارة</strong><small>دعم عربي حتى الاستلام</small></div></div></div></section>

    <section id="reviews" className="container xbv-reviews-section"><div className="xbv-section-title"><div><span className="xbv-section-label"><span className="xbv-label-icon">✦</span>مجتمع إيرين</span><h2>آراء اللاعبين.</h2></div><div className="xbv-rating-summary"><span>★★★★★</span><strong>4.9</strong><small>تجارب موثقة</small></div></div><div className="xbv-reviews-grid">{(comments.length ? comments : testimonials).map((review, index) => <article className="xbv-review-card" key={`${review.name}-${index}`}><div><span className="xbv-review-avatar">{review.name.slice(0, 1)}</span><div><strong>{review.name}</strong><small>{review.game}</small></div><span className="xbv-stars">{"★".repeat(review.score || 5)}</span></div><p>“{review.comment || review.text}”</p><small><Check /> تجربة موثقة من لاعب</small></article>)}</div><form className="xbv-review-form" onSubmit={handleCommentSubmit}><div><span className="xbv-section-label">شارك تجربتك</span><h3>مراجعتك تساعد لاعباً آخر.</h3></div><input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="اسمك" /><input value={formData.game} onChange={(event) => setFormData({ ...formData, game: event.target.value })} placeholder="اللعبة" /><input value={formData.comment} onChange={(event) => setFormData({ ...formData, comment: event.target.value })} placeholder="اكتب مراجعة قصيرة" /><button className="xbv-primary-button" disabled={isSubmitting}>{isSubmitting ? "جارٍ الإرسال" : "أرسل المراجعة"}</button></form></section>

    <footer className="xbv-footer"><div className="container xbv-footer-inner"><Logo /><p>كل شيء يحتاجه اللاعب، في متجر واحد.</p><div><a href="https://wa.me/201147365618" target="_blank" rel="noreferrer">واتساب الدعم</a><Link href="/admin">إدارة المتجر</Link></div><span>© 2026 إيرين ستور</span></div></footer>
    {toast && <div className="store-toast"><Check /> {toast}</div>}
  </main>
}
