"use client"

import { useState } from "react"
import { Check, MessageCircle, ShieldCheck, ShoppingBag, UserRound, Zap } from "lucide-react"
import { buildWhatsAppMessage, formatPrice, type Game, type GamePackage } from "@/lib/catalog"

const whatsappNumber = "201147365618"

type Props = { game: Game }

export default function GameOrderPanel({ game }: Props) {
  const [selectedPackage, setSelectedPackage] = useState<GamePackage>(game.packages[0])
  const [mode, setMode] = useState<"site" | "whatsapp">("site")
  const [form, setForm] = useState({ customerName: "", customerContact: "", accountData: "", notes: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const updateField = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }))

  const submitOnSiteOrder = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setSuccess("")
    if (!form.customerName || !form.customerContact || !form.accountData) {
      setError("أكمل الاسم ووسيلة التواصل وبيانات الحساب أولاً")
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: game.name,
          packageLabel: selectedPackage.label,
          price: selectedPackage.price,
          customerName: form.customerName,
          customerContact: form.customerContact,
          accountData: form.accountData,
          notes: form.notes,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "تعذر تسجيل الطلب")
      setSuccess(data.message || "تم تسجيل طلبك، سيتواصل معك فريق إيرين قريباً")
      setForm({ customerName: "", customerContact: "", accountData: "", notes: "" })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "تعذر تسجيل الطلب حالياً")
    } finally {
      setIsSubmitting(false)
    }
  }

  const sendToWhatsApp = () => {
    const message = buildWhatsAppMessage(game, selectedPackage, form.accountData)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="order-panel" id="order">
      <div className="order-panel-header">
        <div>
          <p className="store-kicker">اختر ما يناسبك</p>
          <h2>ابدأ طلبك الآن</h2>
        </div>
        <div className="order-trust"><ShieldCheck /><span>تأكيد يدوي آمن</span></div>
      </div>

      <div className="package-options">
        {game.packages.map((item) => (
          <button key={item.id} type="button" className={`package-option ${selectedPackage.id === item.id ? "selected" : ""}`} onClick={() => setSelectedPackage(item)}>
            <span className="package-radio" aria-hidden="true">{selectedPackage.id === item.id ? <Check /> : null}</span>
            <span><strong>{item.label}</strong><small>{item.note}</small></span>
            <b>{formatPrice(item.price)}</b>
          </button>
        ))}
      </div>

      <div className="order-methods" role="tablist" aria-label="طريقة تنفيذ الطلب">
        <button type="button" className={mode === "site" ? "active" : ""} onClick={() => setMode("site")}><ShoppingBag /> أكمل داخل الموقع</button>
        <button type="button" className={mode === "whatsapp" ? "active" : ""} onClick={() => setMode("whatsapp")}><MessageCircle /> أرسل إلى واتساب</button>
      </div>

      {mode === "site" ? (
        <form className="order-form" onSubmit={submitOnSiteOrder}>
          <div className="order-form-intro"><UserRound /><p>سجّل طلبك وسيتواصل معك الأدمن لتأكيد الدفع والتنفيذ.</p></div>
          <div className="form-grid">
            <label>الاسم بالكامل<input value={form.customerName} onChange={(event) => updateField("customerName", event.target.value)} placeholder="مثال: محمد أحمد" /></label>
            <label>رقم الهاتف أو واتساب<input value={form.customerContact} onChange={(event) => updateField("customerContact", event.target.value)} placeholder="01xxxxxxxxx" /></label>
            <label className="wide">{game.fieldLabel}<input value={form.accountData} onChange={(event) => updateField("accountData", event.target.value)} placeholder="اكتب البيانات المطلوبة لتنفيذ الشحن" /></label>
            <label className="wide">ملاحظات إضافية <span className="optional">اختياري</span><textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="أي تفاصيل تساعدنا في تنفيذ طلبك" rows={3} /></label>
          </div>
          {error && <p className="order-feedback error">{error}</p>}
          {success && <p className="order-feedback success"><Check /> {success}</p>}
          <button className="order-submit" disabled={isSubmitting}>{isSubmitting ? "جارٍ تسجيل الطلب..." : `تأكيد طلب ${formatPrice(selectedPackage.price)}`} <Zap /></button>
        </form>
      ) : (
        <div className="whatsapp-order">
          <div className="whatsapp-order-icon"><MessageCircle /></div>
          <div><h3>تحب تخلصها برسالة؟</h3><p>سيتم فتح واتساب برسالة مجهزة باسم اللعبة والباقي المختارة. اكتب معرّف الحساب إن أحببت قبل الإرسال.</p></div>
          <input value={form.accountData} onChange={(event) => updateField("accountData", event.target.value)} placeholder={game.fieldLabel} />
          <button className="whatsapp-button" type="button" onClick={sendToWhatsApp}>إرسال الطلب إلى واتساب <MessageCircle /></button>
        </div>
      )}
    </section>
  )
}
