"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock3, Gamepad2, Menu, MessageCircle, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Tag, Users, X } from "lucide-react"
import { addComment, getComments, type Comment } from "@/lib/comments"
import { categories, formatPrice, games } from "@/lib/catalog"

const testimonials = [
  { name: "محمد ع.", game: "PUBG Mobile", text: "الأسعار واضحة والطلب اتأكد معايا بسرعة. أحسن من اللف بين صفحات كتير.", score: 5 },
  { name: "سارة م.", game: "Free Fire", text: "اختارت الباقة وبعت البيانات، والدعم رجع لي خلال دقائق.", score: 5 },
  { name: "عمر ك.", game: "Valorant Points", text: "صفحة اللعبة وفرت عليّ أسئلة كتير. كل شيء ظاهر قبل ما أطلب.", score: 5 },
]

function Logo() {
  return <Link className="eren-logo" href="/" aria-label="إيرين ستور - الصفحة الرئيسية"><span className="eren-logo-mark">E</span><span><strong>إيرين</strong><small>متجر اللاعبين</small></span></Link>
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

  const featuredGames = games.filter((game) => game.featured).slice(0, 3)

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 3200)
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

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

  return (
    <main className="store-shell">
      <div className="store-announcement"><span className="live-dot" /> شحنات رقمية بتأكيد سريع <span>•</span> تواصل مباشر مع الإدارة عبر واتساب</div>
      <header className="store-nav">
        <div className="store-nav-inner">
          <Logo />
          <nav className="store-nav-links"><button onClick={() => scrollTo("home")}>الرئيسية</button><button onClick={() => scrollTo("games")}>كل الألعاب</button><button onClick={() => scrollTo("how-it-works")}>كيف نعمل؟</button><button onClick={() => scrollTo("reviews")}>آراء اللاعبين</button></nav>
          <div className="store-nav-actions"><a className="nav-support" href="https://wa.me/201147365618" target="_blank" rel="noreferrer"><MessageCircle /> الدعم</a><button className="menu-toggle" onClick={() => setIsMenuOpen((value) => !value)} aria-label="فتح القائمة">{isMenuOpen ? <X /> : <Menu />}</button></div>
        </div>
        {isMenuOpen && <div className="mobile-store-menu"><button onClick={() => scrollTo("home")}>الرئيسية</button><button onClick={() => scrollTo("games")}>كل الألعاب</button><button onClick={() => scrollTo("how-it-works")}>كيف نعمل؟</button><button onClick={() => scrollTo("reviews")}>آراء اللاعبين</button><a href="https://wa.me/201147365618" target="_blank" rel="noreferrer">تواصل مع الإدارة</a></div>}
      </header>

      <section id="home" className="store-hero">
        <div className="hero-backdrop" />
        <div className="hero-ornament hero-ornament-one" /><div className="hero-ornament hero-ornament-two" />
        <div className="container store-hero-grid">
          <div className="store-hero-copy"><div className="store-kicker"><Sparkles /> متجر ألعاب يعرف ماذا تحتاج</div><h1>اشحن لعبتك.<br /><em>كمّل الجولة.</em></h1><p>رصيدك، بطاقتك، وباقتك المفضلة في مكان واحد. ابحث عن لعبتك، افتح المنتج، وخذ قرارك خلال ثوانٍ.</p><div className="hero-search-topup"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن لعبة أو بطاقة رقمية" aria-label="البحث السريع عن لعبة" /><button onClick={() => scrollTo("games")} aria-label="ابدأ البحث"><ArrowLeft /></button></div><div className="hero-trending"><span>الأكثر بحثاً</span>{games.filter((game) => game.featured).slice(0, 4).map((game) => <button key={game.slug} onClick={() => { setQuery(game.name); scrollTo("games") }}>{game.name}</button>)}</div><div className="hero-actions"><button className="solid-cta" onClick={() => scrollTo("games")}>تصفح الألعاب <ArrowLeft /></button><a className="text-cta" href="https://wa.me/201147365618" target="_blank" rel="noreferrer">اسأل الإدارة <MessageCircle /></a></div><div className="hero-proof"><div className="proof-avatars"><span>م</span><span>س</span><span>ع</span><span>+</span></div><div><div className="rating-line"><span>★★★★★</span><b>4.9</b></div><small>ثقة أكثر من 12,000 لاعب</small></div></div></div>
          <div className="hero-feature-card"><div className="feature-card-image"><img src="/images/codm-art-v2.png" alt="Call of Duty Mobile" /><span>اختيار الأسبوع</span></div><div className="feature-card-content"><div><small>الأكثر نشاطاً الآن</small><h2>Call of Duty Mobile</h2></div><div className="feature-card-price"><small>يبدأ من</small><strong>{formatPrice(210)}</strong></div></div><Link href="/games/call-of-duty-mobile" className="feature-card-link">عرض اللعبة <ArrowLeft /></Link></div>
        </div>
      </section>

      <section className="container proof-strip"><div><span className="proof-icon"><ZapIcon /></span><p><strong>تسليم واضح</strong><small>كل لعبة لها وقت تنفيذ معلن</small></p></div><div><span className="proof-icon"><ShieldCheck /></span><p><strong>بدون كلمات مرور</strong><small>نطلب بيانات الشحن فقط</small></p></div><div><span className="proof-icon"><MessageCircle /></span><p><strong>طريقان للطلب</strong><small>داخل الموقع أو واتساب</small></p></div><div><span className="proof-icon"><Users /></span><p><strong>دعم من الإدارة</strong><small>متابعة بشرية حتى الاستلام</small></p></div></section>

      <section id="games" className="container games-store-section"><div className="section-heading-store"><div><p className="store-kicker">كتالوج إيرين</p><h2>اختار عالمك.</h2><p>ألعاب موبايل، تنافسية، بطاقات رقمية وأكثر — كل لعبة لها صفحة وباقات واضحة.</p></div><div className="catalog-count"><strong>{games.length}</strong><span>لعبة متاحة</span></div></div><div className="featured-row">{featuredGames.map((game) => <Link href={`/games/${game.slug}`} className="featured-mini" key={game.slug}><img src={game.image} alt={game.name} /><div><span>{game.badge || "مختارة"}</span><strong>{game.name}</strong><small>من {formatPrice(game.price)}</small></div><ArrowLeft /></Link>)}</div><div className="catalog-tools"><div className="catalog-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم اللعبة أو نوعها" aria-label="البحث في الألعاب" /></div><label className="catalog-sort"><span>ترتيب</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="ترتيب الألعاب"><option value="featured">المختارة أولاً</option><option value="rating">الأعلى تقييماً</option><option value="price-low">الأقل سعراً</option><option value="price-high">الأعلى سعراً</option></select><ChevronDown /></label></div><div className="category-tabs">{categories.map((category) => <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="store-game-grid">{filteredGames.map((game, index) => <article className="store-game-card" style={{ "--card-delay": `${Math.min(index, 8) * 35}ms` } as React.CSSProperties} key={game.slug}><Link className="store-game-image" href={`/games/${game.slug}`}><img src={game.image} alt={game.name} /><span className="game-image-shade" /><span className="game-chip">{game.category}</span>{game.badge && <span className="game-badge">{game.badge}</span>}<span className="image-arrow"><ArrowLeft /></span></Link><div className="store-game-body"><div className="topup-card-label"><span><span className="tiny-live-dot" /> شحن مباشر</span><b>{game.badge || "سعر مميز"}</b></div><div className="game-card-top"><div><Link href={`/games/${game.slug}`}><h3>{game.name}</h3></Link><p>{game.description}</p></div><span className="game-rating"><Star /> {game.rating}</span></div><div className="topup-card-meta"><span><Clock3 /> {game.delivery}</span><span><Users /> {game.buyers} طلب</span><span>من {formatPrice(game.price)}</span></div><div className="game-card-footer"><div><small>ابدأ من</small><strong>{formatPrice(game.price)}</strong></div><Link className="small-buy" href={`/games/${game.slug}`}>اختار الباقة <ArrowLeft /></Link></div></div></article>)}</div>{filteredGames.length === 0 && <div className="catalog-empty"><Gamepad2 /><h3>لم نجد اللعبة بهذا الاسم</h3><p>جرّب كلمة أخرى أو افتح كل الألعاب.</p></div>}</section>

      <section id="how-it-works" className="how-section"><div className="container"><div className="section-heading-store"><div><p className="store-kicker">كيف تعمل إيرين؟</p><h2>من الاختيار إلى التأكيد<br />بدون لف.</h2></div><p className="section-description">صممنا المتجر ليكون مثل محل ألعاب حقيقي: تشوف المنتج، تعرف سعره، ثم تختار كيف تريد أن يتابع معك فريق الإدارة.</p></div><div className="how-grid"><div className="how-step"><span>01</span><Gamepad2 /><h3>افتح صفحة لعبتك</h3><p>كل لعبة لها صفحة خاصة فيها الصور والباقات ووقت التنفيذ والبيانات المطلوبة.</p></div><div className="how-step"><span>02</span><ShoppingBag /><h3>اختار الباقة</h3><p>لا توجد أسعار مخفية. اختر الباقة ثم راجع التفاصيل قبل الإرسال.</p></div><div className="how-step"><span>03</span><MessageCircle /><h3>اطلب بالطريقة المناسبة</h3><p>سجّل طلبك داخل الموقع ليتواصل معك الأدمن، أو أرسله كرسالة واتساب جاهزة.</p></div></div></div></section>

      <section id="reviews" className="container reviews-store-section"><div className="section-heading-store"><div><p className="store-kicker">من مجتمع إيرين</p><h2>لاعبون رجعوا للجولة.</h2></div><div className="review-summary"><span>★★★★★</span><strong>4.9</strong><small>تجارب موثقة</small></div></div><div className="reviews-store-grid">{(comments.length ? comments : testimonials).map((review, index) => <article className="store-review-card" key={`${review.name}-${index}`}><div className="review-card-head"><span className="review-avatar-new">{review.name.slice(0, 1)}</span><div><strong>{review.name}</strong><small>{review.game}</small></div><span className="review-stars">{"★".repeat(review.score || 5)}</span></div><p>“{review.comment || review.text}”</p><small className="verified-label"><Check /> تجربة موثقة من لاعب</small></article>)}</div><form className="review-store-form" onSubmit={handleCommentSubmit}><div><p className="store-kicker">شارك تجربتك</p><h3>مراجعتك تساعد لاعباً آخر.</h3></div><input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="اسمك" /><input value={formData.game} onChange={(event) => setFormData({ ...formData, game: event.target.value })} placeholder="اللعبة" /><input value={formData.comment} onChange={(event) => setFormData({ ...formData, comment: event.target.value })} placeholder="اكتب مراجعة قصيرة" /><button className="solid-cta" disabled={isSubmitting}>{isSubmitting ? "جارٍ الإرسال" : "أرسل المراجعة"}</button></form></section>

      <footer className="store-footer"><div className="container store-footer-inner"><Logo /><p>شحن ألعابك، بشكل واضح وسريع.</p><div><a href="https://wa.me/201147365618" target="_blank" rel="noreferrer">واتساب الدعم</a><Link href="/admin">إدارة المتجر</Link></div><span>© 2026 إيرين ستور</span></div></footer>
      {toast && <div className="store-toast"><Check /> {toast}</div>}
    </main>
  )
}

function ZapIcon() { return <span className="zap-symbol">✦</span> }
