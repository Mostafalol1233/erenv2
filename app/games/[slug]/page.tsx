import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Check, Clock3, Gamepad2, MessageCircle, ShieldCheck, Star, Tag, Users } from "lucide-react"
import GameOrderPanel from "./GameOrderPanel"
import { formatPrice, games, getGame } from "@/lib/catalog"

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const game = getGame(params.slug)
  if (!game) return { title: "اللعبة غير موجودة | إيرين" }
  return {
    title: `${game.name} — شحن سريع | إيرين ستور`,
    description: `${game.description} اطلب ${game.name} من إيرين ستور بتسليم سريع ودعم عربي.`,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: { title: `${game.name} | إيرين ستور`, description: game.longDescription, images: [game.image] },
  }
}

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = getGame(params.slug)
  if (!game) notFound()
  const related = games.filter((item) => item.slug !== game.slug && item.category === game.category).slice(0, 3)

  return (
    <main className="store-shell game-detail-page">
      <div className="store-announcement"><span className="live-dot" /> تنفيذ الطلبات مستمر اليوم حتى منتصف الليل <span>•</span> دعم مباشر بالعربية</div>
      <header className="store-nav">
        <div className="store-nav-inner">
          <Link className="eren-logo" href="/" aria-label="إيرين ستور - الرئيسية"><img className="eren-logo-image" src="/images/eren-logo-premium-transparent.png" alt="إيرين" /><span><strong>إيرين</strong><small>متجر اللاعبين</small></span></Link>
          <nav className="store-nav-links"><Link href="/">الرئيسية</Link><Link href="/#games">كل الألعاب</Link><Link href="/#how-it-works">كيف نعمل؟</Link></nav>
          <Link className="nav-support" href="https://wa.me/201147365618" target="_blank" rel="noreferrer"><MessageCircle /> الدعم</Link>
        </div>
      </header>

      <div className="container breadcrumb-row"><Link href="/">الرئيسية</Link><span>/</span><Link href="/#games">الألعاب</Link><span>/</span><strong>{game.name}</strong></div>

      <section className="container game-detail-hero">
        <div className="game-detail-art"><img src={game.image} alt={game.name} /><div className="detail-art-overlay" /><div className="detail-art-label"><span>{game.category}</span><span><Star /> {game.rating}</span></div></div>
        <div className="game-detail-copy">
          <div className="detail-kicker"><Tag /> {game.badge || "اختيار اللاعبين"}</div>
          <h1>{game.name}</h1>
          <p className="detail-lead">{game.longDescription}</p>
          <div className="detail-meta"><span><Clock3 /> التسليم: <b>{game.delivery}</b></span><span><Users /> طلبها <b>{game.buyers} لاعب</b></span><span><ShieldCheck /> دفع آمن</span></div>
          <div className="detail-price"><small>الباقات تبدأ من</small><strong>{formatPrice(game.price)}</strong></div>
          <a href="#order" className="detail-cta">اختر باقتك <ArrowRight /></a>
        </div>
      </section>

      <section className="container detail-benefits"><div><span><Check /></span><p><strong>تأكيد واضح</strong><small>تعرف حالة طلبك خطوة بخطوة</small></p></div><div><span><Clock3 /></span><p><strong>تسليم سريع</strong><small>نبدأ التنفيذ بمجرد تأكيد البيانات</small></p></div><div><span><MessageCircle /></span><p><strong>دعم عربي</strong><small>الأدمن يتابعك حتى الاستلام</small></p></div></section>

      <div className="container"><GameOrderPanel game={game} /></div>

      <section className="container game-info-section"><div><p className="store-kicker">قبل التأكيد</p><h2>تجربة شراء مفهومة من أول خطوة.</h2></div><div className="info-copy"><p>اختر الباقة التي تناسبك، ثم قرر إذا كنت تريد تسجيل الطلب داخل الموقع أو فتح رسالة واتساب جاهزة. في الحالتين، فريق إيرين يراجع الطلب ويتواصل معك قبل التنفيذ.</p><div className="info-list"><span><Check /> لا نطلب كلمة المرور</span><span><Check /> بياناتك تستخدم لتنفيذ الطلب فقط</span><span><Check /> السعر ظاهر قبل الإرسال</span></div></div></section>

      {related.length > 0 && <section className="container related-section"><div className="section-heading-store"><div><p className="store-kicker">قد يناسبك أيضاً</p><h2>من نفس التصنيف.</h2></div><Link href="/#games">عرض الكل <ArrowRight /></Link></div><div className="related-grid">{related.map((item) => <Link href={`/games/${item.slug}`} className="related-card" key={item.slug}><img src={item.image} alt={item.name} /><div><span>{item.category}</span><strong>{item.name}</strong><small>يبدأ من {formatPrice(item.price)}</small></div><ArrowRight /></Link>)}</div></section>}

      <footer className="store-footer"><div className="container store-footer-inner"><Link className="eren-logo" href="/"><img className="eren-logo-image" src="/images/eren-logo-premium-transparent.png" alt="إيرين" /><span><strong>إيرين</strong><small>متجر اللاعبين</small></span></Link><p>شحن ألعابك، بشكل واضح وسريع.</p><span>© 2026 إيرين ستور</span></div></footer>
    </main>
  )
}
