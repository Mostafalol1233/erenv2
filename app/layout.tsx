import type { Metadata } from "next"
import { Tajawal } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import Script from "next/script"
import { Suspense } from "react"
import "./globals.css"

const tajawal = Tajawal({
  subsets: ["latin", "arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://erenv2-git-main-mostafalol1233s-projects.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "إيرين ستور | شحن ألعابك بشكل واضح وسريع",
    template: "%s | إيرين ستور",
  },
  description: "إيرين ستور هو متجر شحن ألعاب مصري يقدّم باقات PUBG وFree Fire وValorant وMobile Legends والمزيد، مع دعم عربي وطريقتين للطلب.",
  keywords: ["شحن ألعاب", "شحن ببجي", "شحن فري فاير", "شحن فالورانت", "شحن موبايل ليجند", "متجر ألعاب مصر", "إيرين ستور", "gaming top up egypt"],
  authors: [{ name: "إيرين ستور" }],
  creator: "إيرين ستور",
  publisher: "إيرين ستور",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    siteName: "إيرين ستور",
    title: "إيرين ستور | مكانك لشحن الألعاب",
    description: "تصفح الألعاب، اختر باقتك، وسجّل طلبك داخل المتجر أو أرسله إلى واتساب الإدارة.",
    images: [{ url: "/images/eren-logo-cinematic-v3.svg", width: 1200, height: 630, alt: "لوجو إيرين ستور" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "إيرين ستور | شحن ألعابك بشكل واضح وسريع",
    description: "متجر ألعاب عربي بصفحات واضحة وباقات مرتبة ودعم مباشر.",
    images: ["/images/eren-logo-cinematic-v3.svg"],
  },
  alternates: { canonical: siteUrl },
  applicationName: "إيرين ستور",
  category: "ecommerce",
  generator: "Eren Store",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#eee8dc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-D6CGZYVB86" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-D6CGZYVB86');`}
        </Script>
        <Script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          name: "إيرين ستور",
          description: "متجر شحن ألعاب مصري بصفحات واضحة ودعم عربي.",
          url: siteUrl,
          logo: `${siteUrl}/images/eren-logo-cinematic-v3.svg`,
          image: `${siteUrl}/images/hero-arcade.png`,
          telephone: "+201147365618",
          address: { "@type": "PostalAddress", addressCountry: "EG", addressRegion: "Egypt" },
          openingHours: "Mo-Su 00:00-23:59",
          priceRange: "$$",
          currenciesAccepted: "EGP",
          areaServed: "EG",
          serviceType: "Gaming Top-Up Service",
        }) }} />
      </head>
      <body className={`${tajawal.variable} font-sans antialiased`}><Suspense fallback={null}>{children}</Suspense><Analytics /></body>
    </html>
  )
}
