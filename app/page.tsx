"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Facebook, Zap, Gift, Shield, Menu, X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getComments, addComment, type Comment } from "@/lib/comments"

let supabase: any = null

// Only create supabase client if env vars exist
if (typeof window !== "undefined") {
  try {
    // Use dynamic import in the browser only
    const mod = await import("@supabase/auth-helpers-nextjs")
    const createClientComponentClient = mod.createClientComponentClient
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (supabaseUrl && supabaseKey) {
      supabase = createClientComponentClient()
    }
  } catch (e) {
    console.warn("Supabase not configured")
  }
}

export default function ErenStoreLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [formData, setFormData] = useState({ name: "", game: "", comment: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [selectedGame, setSelectedGame] = useState<number | null>(null)
  const [isLoadingComments, setIsLoadingComments] = useState(true)
  const [commentsEnabled, setCommentsEnabled] = useState(true)
  const [commentError, setCommentError] = useState("")

  // legacy badge-hiding removed

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string) => {
    const target = e.target as HTMLImageElement
    if (target.src !== fallback) {
      target.src = fallback
    }
  }

  const safeJsonStringify = (obj: any) => {
    try {
      return JSON.stringify(obj)
    } catch (error) {
      return "{}"
    }
  }

  // Payment methods
  const paymentMethods = [
    {
      name: "InstaPay",
      logo: "/images/instapay-logo.jpg",
      fallback: "/placeholder.svg?height=64&width=120&text=InstaPay&color=blue",
      effect: "pulse-glow",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "PayPal",
      logo: "/images/paypal-logo.jpg",
      fallback: "/placeholder.svg?height=64&width=120&text=PayPal&color=blue",
      effect: "pulse-glow",
      color: "from-blue-600 to-blue-800",
    },
    {
      name: "Vodafone Cash",
      logo: "/images/vodafone-logo.jpg",
      fallback: "/placeholder.svg?height=64&width=120&text=Vodafone&color=red",
      effect: "pulse-glow",
      color: "from-red-500 to-red-700",
    },
    {
      name: "Etisalat Cash",
      logo: "/images/etisalat-logo.jpg",
      fallback: "/placeholder.svg?height=64&width=120&text=Etisalat&color=green",
      effect: "pulse-glow",
      color: "from-green-500 to-green-700",
    },
    {
      name: "Orange Cash",
      logo: "/images/orange-logo-new.png",
      fallback: "/placeholder.svg?height=64&width=120&text=Orange&color=orange",
      effect: "pulse-glow",
      color: "from-orange-500 to-orange-700",
    },
  ]

  // Games
  const games = [
    {
      name: "CrossFire ZP",
      logoImage: "/images/crossfire-new-logo.jpg",
      coinImage: "/images/crossfire-coins-new.jpg",
      logoFallback: "/placeholder.svg?height=200&width=300&text=CrossFire&color=purple",
      coinFallback: "/placeholder.svg?height=200&width=300&text=CF+ZP&color=purple",
      color: "from-purple-600 to-purple-800",
      glowColor: "shadow-purple-500/50",
      notice: "Get 50% bonus on your first top-up every month!",
      packages: [
        { amount: "5,000 ZP", price: "125 EGP" },
        { amount: "10,000 ZP", price: "245 EGP" },
        { amount: "20,000 ZP", price: "465 EGP" },
        { amount: "50,000 ZP", price: "1135 EGP" },
        { amount: "100,000 ZP", price: "2325 EGP" },
      ],
    },
    {
      name: "Valorant Points",
      logoImage: "/images/valorant-points-logo.jpg",
      coinImage: "/images/valorant-coins.jpeg",
      logoFallback: "/placeholder.svg?height=200&width=300&text=Valorant&color=red",
      coinFallback: "/placeholder.svg?height=200&width=300&text=VP&color=red",
      color: "from-red-600 to-orange-600",
      glowColor: "shadow-red-500/50",
      packages: [
        { amount: "475 VP", price: "245 EGP" },
        { amount: "1000 VP", price: "488 EGP" },
        { amount: "2050 VP", price: "974 EGP" },
        { amount: "3650 VP", price: "1720 EGP" },
        { amount: "5350 VP", price: "2440 EGP" },
        { amount: "11000 VP", price: "4900 EGP" },
      ],
    },
    {
      name: "PUBG UC",
      logoImage: "/images/pubg-logo.jpeg", // ✅ الصورة القديمة
      coinImage: "/images/pubg-coins.jpeg", // ✅ الصورة القديمة
      logoFallback: "/placeholder.svg?height=200&width=300&text=PUBG&color=yellow",
      coinFallback: "/placeholder.svg?height=200&width=300&text=UC&color=yellow",
      color: "from-yellow-600 to-orange-600",
      glowColor: "shadow-yellow-500/50",
      packages: [
        { amount: "60 UC", price: "48 EGP" },
        { amount: "300 + 25 UC", price: "242 EGP" },
        { amount: "600 + 60 UC", price: "470 EGP" },
        { amount: "1500 + 300 UC", price: "1165 EGP" },
        { amount: "3000 + 850 UC", price: "2290 EGP" },
        { amount: "6000 + 2100 UC", price: "4580 EGP" },
      ],
    },
    {
      name: "Free Fire Diamonds",
      logoImage: "/images/freefire-logo.jpg",
      coinImage: "/images/freefire-coins.jpeg",
      logoFallback: "/placeholder.svg?height=200&width=300&text=Free+Fire&color=blue",
      coinFallback: "/placeholder.svg?height=200&width=300&text=Diamonds&color=blue",
      color: "from-blue-600 to-cyan-600",
      glowColor: "shadow-blue-500/50",
      packages: [
        { amount: "100 + 10 Diamonds", price: "65 EGP" },
        { amount: "210 + 21 Diamonds", price: "130 EGP" },
        { amount: "530 + 53 Diamonds", price: "314 EGP" },
        { amount: "1080 + 108 Diamonds", price: "610 EGP" },
        { amount: "2200 + 220 Diamonds", price: "1220 EGP" },
      ],
    },
    {
      name: "8 Ball Pool Coins",
      logoImage: "/images/8ball-logo.jpg",
      coinImage: "/images/8ball-logo.jpg",
      logoFallback: "/placeholder.svg?height=200&width=300&text=8+Ball+Pool&color=green",
      coinFallback: "/placeholder.svg?height=200&width=300&text=Coins&color=green",
      color: "from-green-600 to-teal-600",
      glowColor: "shadow-green-500/50",
      packages: [
        { amount: "20,000 Coins", price: "16 EGP" },
        { amount: "52,000 Coins", price: "47 EGP" },
        { amount: "112,000 Coins", price: "90 EGP" },
        { amount: "256,000 Coins", price: "172 EGP" },
        { amount: "800,000 Coins", price: "420 EGP" },
        { amount: "2 Million Coins", price: "840 EGP" },
      ],
    },
    {
      name: "Discord Effects",
      logoImage: "/images/discord-effects.jpg",
      coinImage: "/images/discord-effects.jpg",
      logoFallback: "/placeholder.svg?height=200&width=300&text=Discord&color=indigo",
      coinFallback: "/placeholder.svg?height=200&width=300&text=Effects&color=indigo",
      color: "from-indigo-600 to-purple-600",
      glowColor: "shadow-indigo-500/50",
      isCustom: true,
      description: "Custom effects available - Send screenshot of desired effect for discounted pricing!",
    },
  ]

  const handlePurchase = (gameName: string, packageAmount: string, price: string) => {
    const message = `مرحباً! أريد شراء:\n\n🎮 اللعبة: ${gameName}\n💎 الكمية: ${packageAmount}\n💰 السعر: ${price}\n\nأرجو تأكيد الطلب وإرسال تفاصيل الدفع.`
    const whatsappUrl = `https://wa.me/201147365618?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCommentError("")

    if (!commentsEnabled) {
      setCommentError("عذراً، التعليقات معطّلة حالياً من قبل الإدارة. حاول لاحقاً!")
      return
    }

    if (!formData.name || !formData.game || !formData.comment) {
      setCommentError("الرجاء ملء جميع الحقول")
      return
    }

    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const success = await addComment(formData.name, formData.game, formData.comment)
      if (success) {
        setFormData({ name: "", game: "", comment: "" })
        setSubmitMessage("✓ تم إرسال تعليقك بنجاح! شكراً لك")
        setTimeout(() => fetchComments(), 500)
      } else {
        setCommentError("✗ حدث خطأ في إرسال التعليق - تحقق من الاتصال")
      }
    } catch (error) {
      console.error("Failed to add comment:", error)
      setCommentError("✗ حدث خطأ في إرسال التعليق - تحقق من الاتصال")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 3000)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const handleGameSelect = (gameIndex: number) => {
    setSelectedGame(gameIndex)
    scrollToSection(`game-${gameIndex}`)
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Eren Store - أفضل متجر شحن الألعاب في مصر",
    description: "متجر إيرين لشحن الألعاب - أسرع وأأمن طريقة لشحن جميع الألعاب في مصر",
    url: "https://eren-store.vercel.app",
  }

  useEffect(() => {
    fetchComments()
    fetchSettings()
  }, [])

  const fetchComments = async () => {
    setIsLoadingComments(true)
    try {
      const fetchedComments = await getComments()
      setComments(fetchedComments)
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setIsLoadingComments(false)
    }
  }

  const fetchSettings = async () => {
    if (!supabase) {
      console.warn("Supabase not connected")
      return
    }
    try {
      const { data, error } = await supabase.from("admin_settings").select("*").single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching settings:", error)
      } else if (data) {
        setCommentsEnabled(data.comments_enabled)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonStringify(jsonLd) }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/images/eren-logo.jpeg"
                alt="Eren Store"
                className="h-10 w-10 object-contain rounded-lg"
                onError={(e) => handleImageError(e, "/placeholder.svg?height=40&width=40&text=ES&color=purple")}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Eren Store
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("games")}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Games
              </button>
              <button
                onClick={() => scrollToSection("payment")}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Payment
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Contact
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-300 hover:text-white">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800 space-y-2">
              <button
                onClick={() => scrollToSection("home")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("games")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                Games
              </button>
              <button
                onClick={() => scrollToSection("payment")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                Payment
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
              >
                Contact
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Header */}
      <header id="home" className="relative overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src="/images/facebook-cover.png"
            alt=""
            className="w-full h-full object-cover opacity-60"
            onError={(e) =>
              handleImageError(e, "/placeholder.svg?height=400&width=1200&text=Gaming+Background&color=purple")
            }
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60"></div>
        </div>

        {/* Left Video Box */}
        <div className="absolute left-4 top-20 z-20 hidden lg:block">
          <div className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-2xl shadow-purple-500/30 hover:border-purple-400 transition-all duration-300">
            <video autoPlay loop muted={false} playsInline className="w-full h-full object-cover">
              <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snaptik_7542991175926549768_hd%20%28online-video-cutter.com%29-ia5K345w5Jk3fHPoGvXSJOq8Nko0Aq.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Right Video Box */}
        <div className="absolute right-4 top-20 z-20 hidden lg:block">
          <div className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-blue-500/50 shadow-2xl shadow-blue-500/30 hover:border-blue-400 transition-all duration-300">
            <video autoPlay loop muted={true} playsInline className="w-full h-full object-cover">
              <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snaptik_7542991175926549768_hd%20%28online-video-cutter.com%29-ia5K345w5Jk3fHPoGvXSJOq8Nko0Aq.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <img
                src="/images/eren-logo.jpeg"
                alt="Eren Store"
                className="h-20 w-20 object-contain rounded-xl border-2 border-purple-400/50 shadow-2xl"
                onError={(e) => handleImageError(e, "/placeholder.svg?height=80&width=80&text=ES&color=purple")}
              />
              <div className="absolute inset-0 bg-purple-400 blur-2xl opacity-40 rounded-xl"></div>
            </div>
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
                Eren Store
              </h1>
              <span className="block text-2xl md:text-4xl mt-2 text-white/90 font-bold drop-shadow-lg">متجر إيرين</span>
            </div>
          </div>
          <p className="text-center text-xl md:text-2xl text-white mt-6 font-light drop-shadow-lg">
            Your Ultimate Gaming Top-Up Destination
            <span className="block text-lg md:text-xl mt-2 text-white/80">وجهتك المثلى لشحن الألعاب</span>
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-blue-900/30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Level Up Your Gaming Experience with{" "}
              <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                Instant Top-Ups
              </span>
              <span className="block text-2xl md:text-3xl mt-4 text-white/90">ارتقِ بتجربة الألعاب مع الشحن الفوري</span>
            </h2>
            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
              Fast, secure, and reliable gaming currency for all your favorite games. Trusted by hundreds of Egyptian
              gamers.
            </p>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              شحن سريع وآمن وموثوق لجميع ألعابك المفضلة. موثوق من مئات اللاعبين المصريين.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/50 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Instant Delivery
              </Badge>
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/50 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                100% Secure
              </Badge>
              <Badge variant="secondary" className="bg-orange-600/20 text-orange-300 border-orange-500/50 px-4 py-2">
                <Gift className="w-4 h-4 mr-2" />
                Best Prices
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Game Categories Section */}
      <section id="games" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Choose Your Game
          </h2>

          {selectedGame === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {games.map((game, gameIndex) => (
                <Card
                  key={gameIndex}
                  onClick={() => handleGameSelect(gameIndex)}
                  className={`relative bg-gradient-to-br ${game.color} border-0 overflow-hidden group hover:scale-105 transition-all duration-300 hover:${game.glowColor} hover:shadow-2xl cursor-pointer h-64`}
                >
                  <div className="absolute inset-0 bg-black/5"></div>

                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <img
                      src={game.logoImage || "/placeholder.svg"}
                      alt={game.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-300 rounded-lg"
                      onError={(e) => handleImageError(e, game.logoFallback)}
                    />
                  </div>

                  <CardContent className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{game.name}</h3>
                      {!game.isCustom && (
                        <p className="text-white/80 text-sm">{game.packages?.length || 0} packages available</p>
                      )}
                    </div>

                    <Button
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 transition-all duration-300 group-hover:bg-white group-hover:text-gray-900"
                      size="sm"
                    >
                      View Packages <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              <div className="text-center">
                <Button
                  onClick={() => setSelectedGame(null)}
                  variant="outline"
                  className="mb-8 bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700"
                >
                  ← Back to Games
                </Button>
              </div>

              {games.slice(selectedGame, selectedGame + 1).map((game, gameIndex) => (
                <div key={gameIndex} id={`game-${selectedGame}`} className="relative">
                  <div className="relative mb-8 rounded-2xl overflow-hidden h-64">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <img
                        src={game.logoImage || "/placeholder.svg"}
                        alt={game.name}
                        className="w-full h-full object-cover opacity-70 rounded-lg"
                        onError={(e) => handleImageError(e, game.logoFallback)}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="relative z-10 text-center py-12 px-4 h-full flex flex-col justify-center">
                      <h3 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{game.name}</h3>
                      {game.notice && (
                        <div className="inline-block bg-gradient-to-r from-green-600/30 to-emerald-600/30 backdrop-blur-sm border border-green-500/50 rounded-full px-6 py-2 mb-6 mx-auto mt-4">
                          <p className="text-green-300 font-medium">{game.notice}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {!game.isCustom && game.packages ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {game.packages.map((pkg, pkgIndex) => (
                        <Card
                          key={pkgIndex}
                          className={`relative bg-gradient-to-br ${game.color} border-0 overflow-hidden group hover:scale-105 transition-all duration-300 hover:${game.glowColor} hover:shadow-2xl cursor-pointer`}
                        >
                          <div className="absolute inset-0 bg-black/5"></div>
                          <div className="relative z-10 h-48 overflow-hidden">
                            <img
                              src={game.coinImage || "/placeholder.svg"}
                              alt={`${game.name} coins`}
                              className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                              onError={(e) => handleImageError(e, game.coinFallback)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          </div>

                          <CardHeader className="relative z-10 pb-1">
                            <CardTitle className="text-white text-xl font-bold">
                              <span>{pkg.amount}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="relative z-10 pt-1">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-white mb-4">{pkg.price}</div>
                              <Button
                                onClick={() => handlePurchase(game.name, pkg.amount, pkg.price)}
                                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 transition-all duration-300 group-hover:bg-white group-hover:text-gray-900"
                                size="lg"
                              >
                                Order Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="max-w-2xl mx-auto">
                      <Card
                        className={`relative bg-gradient-to-br ${game.color} border-0 overflow-hidden hover:scale-105 transition-all duration-300 hover:${game.glowColor} hover:shadow-2xl cursor-pointer`}
                      >
                        <div className="absolute inset-0 bg-black/5"></div>
                        <div className="relative z-10 h-56 overflow-hidden">
                          <img
                            src={game.coinImage || "/placeholder.svg"}
                            alt={game.name}
                            className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                            onError={(e) => handleImageError(e, game.coinFallback)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>

                        <CardContent className="relative z-10 p-8 text-center">
                          <h4 className="text-2xl font-bold text-white mb-4">Custom Discord Effects</h4>
                          <p className="text-white/90 mb-6 text-lg">
                            Send us a screenshot of your desired Discord effect and get instant discounted pricing!
                          </p>
                          <Button
                            onClick={() => handlePurchase(game.name, "Custom Effect", "Contact for Price")}
                            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 transition-all duration-300 hover:bg-white hover:text-gray-900"
                            size="lg"
                          >
                            Get Custom Quote
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Payment Methods */}
      <section
        id="payment"
        className="py-20 bg-gradient-to-br from-gray-900/80 via-black to-gray-900/80 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-orange-900/20"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Payment Methods
            </h2>
            <p className="text-gray-300 text-xl mb-4">Choose your preferred payment method</p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className={`payment-logo-container logo-reveal group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 ${method.effect}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-xl`}
                  ></div>

                  <div className="relative z-10 p-8 flex flex-col items-center justify-center space-y-4 h-40">
                    <div className="relative">
                      <img
                        src={method.logo || "/placeholder.svg"}
                        alt={method.name}
                        className="h-16 w-auto max-w-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300 drop-shadow-lg"
                        onError={(e) => handleImageError(e, method.fallback)}
                      />
                    </div>

                    <span className="text-white font-bold text-sm text-center">{method.name}</span>

                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Available</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src="/images/eren-logo.jpeg"
                  alt="Eren Store"
                  className="h-24 w-24 object-contain rounded-full border-4 border-purple-400/50 shadow-2xl"
                  onError={(e) => handleImageError(e, "/placeholder.svg?height=96&width=96&text=ES&color=purple")}
                />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              About Eren Store
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-300 text-lg leading-relaxed">
                Eren Store is a trusted Egyptian platform for gamers since 2024, offering affordable, fast, and secure
                game top-ups. We pride ourselves on delivering instant gaming currency with the best prices in the
                market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Video Section */}
      <section className="py-8 lg:hidden">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Watch Our Gaming Channel
          </h3>
          <div className="relative w-full max-w-sm mx-auto rounded-xl overflow-hidden border-2 border-purple-500/50 shadow-2xl shadow-purple-500/30">
            <div className="relative w-full pb-[56.25%]">
              <video
                autoPlay={true}
                loop={true}
                muted={false}
                playsInline={true}
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snaptik_7542991175926549768_hd%20%28online-video-cutter.com%29-ia5K345w5Jk3fHPoGvXSJOq8Nko0Aq.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Request Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/30 via-black to-purple-900/30 relative overflow-hidden">
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Didn't Find What You're Looking For?
            </h2>

            <p className="text-lg text-gray-300 mb-4 leading-relaxed">
              We're constantly expanding our catalog. If you didn't find what you need, we're here to help!
            </p>

            <Link href="https://wa.me/201147365618" className="inline-block">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Contact Us on WhatsApp
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-gray-300 text-lg">Ready to top up? Contact us now!</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-md mx-auto">
            <Link href="https://wa.me/201147365618" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </Link>

            <Link href="https://www.facebook.com/share/15gnQSF2i7/" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
              >
                <Facebook className="w-5 h-5 mr-2" />
                Facebook
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comment / Feedback Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
              Share Your Feedback
            </h2>
            <p className="text-gray-300 text-lg">We'd love to hear about your gaming experience!</p>
            {!commentsEnabled && (
              <div className="mt-4 inline-block bg-red-600/20 text-red-300 border border-red-500/50 px-4 py-2 rounded-full text-sm">
                ⚠️ التعليقات معطّلة حالياً من قبل الإدارة
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Feedback Form */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                <form onSubmit={handleCommentSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your name"
                      required
                      disabled={!commentsEnabled}
                    />
                  </div>

                  <div>
                    <label htmlFor="game" className="block text-sm font-medium text-gray-300 mb-2">
                      Game
                    </label>
                    <select
                      id="game"
                      name="game"
                      value={formData.game}
                      onChange={(e) => setFormData((prev) => ({ ...prev, game: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      required
                      disabled={!commentsEnabled}
                    >
                      <option value="">Select a game</option>
                      <option value="CrossFire ZP">CrossFire ZP</option>
                      <option value="Valorant Points">Valorant Points</option>
                      <option value="PUBG UC">PUBG UC</option>
                      <option value="Free Fire Diamonds">Free Fire Diamonds</option>
                      <option value="8 Ball Pool Coins">8 Ball Pool Coins</option>
                      <option value="Discord Effects">Discord Effects</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      value={formData.comment}
                      onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Share your experience with us..."
                      required
                      disabled={!commentsEnabled}
                    ></textarea>
                  </div>

                  {commentError && (
                    <div className="bg-red-600/20 text-red-300 border border-red-500/50 px-4 py-3 rounded-lg text-sm">
                      {commentError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || !commentsEnabled}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isSubmitting ? "Submitting..." : commentsEnabled ? "Submit Feedback" : "Comments Disabled"}
                  </Button>
                  {submitMessage && (
                    <div className="mt-4 text-center p-3 rounded-lg bg-green-600/20 text-green-300 border border-green-500/50">
                      {submitMessage}
                    </div>
                  )}
                </form>
              </div>

              {/* Comments Display */}
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Recent Feedback</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {isLoadingComments ? (
                    <p className="text-gray-400 text-center py-8">Loading comments...</p>
                  ) : comments.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                      No comments yet. Be the first to share your experience!
                    </p>
                  ) : (
                    comments.map((comment, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white">{comment.name}</h4>
                          <span className="text-xs text-gray-400">
                            {new Date(comment.created_at).toLocaleDateString("ar-EG")}
                          </span>
                        </div>
                        <p className="text-sm text-purple-300 mb-2">Game: {comment.game}</p>
                        <p className="text-gray-300">{comment.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="text-gray-300 text-lg mb-2">Trusted by hundreds of Egyptian gamers</p>
            <p className="text-gray-400">© 2025 Eren Store. All Rights Reserved.</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>Designed by</span>
              <Link
                href="https://linktr.ee/Mustafa_Bemo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-medium hover:underline"
              >
                Mostafa
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
