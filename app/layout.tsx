import type React from "react"
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

export const metadata: Metadata = {
  metadataBase: new URL("https://eren-store.vercel.app"),
  title: "Eren Game Market — اشحن أذكى، العب أكثر",
  description: "سوق ألعاب رقمي سريع وآمن لشحن PUBG وFree Fire وValorant وأكثر في مصر.",

  keywords:
    "شحن الألعاب, شحن فري فاير, شحن ببجي, شحن فالورانت, شحن كروس فاير, شحن 8 بول بول, شحن ديسكورد, gaming top up egypt, free fire diamonds, pubg uc, valorant points, crossfire zp, 8 ball pool coins, discord nitro, eren store, متجر إيرين",
  authors: [{ name: "Eren Store" }],
  creator: "Eren Store",
  publisher: "Eren Store",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: "en_US",
    url: "https://eren-store.vercel.app",
    siteName: "Eren Store - متجر إيرين",
    title: "Eren Store - أفضل متجر شحن الألعاب في مصر",
    description: "أسرع وأأمن طريقة لشحن الألعاب في مصر. شحن فوري لجميع الألعاب بأفضل الأسعار",
    images: [
      {
        url: "/images/eren-logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Eren Store Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eren Store - أفضل متجر شحن الألعاب في مصر",
    description: "أسرع وأأمن طريقة لشحن الألعاب في مصر. شحن فوري لجميع الألعاب بأفضل الأسعار",
    images: ["/images/eren-logo.jpeg"],
  },
  alternates: {
    canonical: "https://eren-store.vercel.app",
  },
  verification: {
    google: "your-google-verification-code",
  },
  generator: 'eren-store'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-D6CGZYVB86" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D6CGZYVB86');
          `}
        </Script>

        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#2b211d" />
        <meta name="msapplication-TileColor" content="#d9772a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Structured Data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Eren Store",
              description: "أفضل متجر شحن الألعاب في مصر - شحن فوري وآمن لجميع الألعاب",
              url: "https://eren-store.vercel.app",
              logo: "https://eren-store.vercel.app/images/eren-logo.jpeg",
              image: "https://eren-store.vercel.app/images/eren-logo.jpeg",
              telephone: "+201147365618",
              address: {
                "@type": "PostalAddress",
                addressCountry: "EG",
                addressRegion: "Egypt",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "30.0444",
                longitude: "31.2357",
              },
              openingHours: "Mo-Su 00:00-23:59",
              priceRange: "$$",
              paymentAccepted: ["Cash", "Credit Card", "Mobile Payment"],
              currenciesAccepted: "EGP",
              areaServed: "Egypt",
              serviceType: "Gaming Top-Up Service",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Gaming Currency",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Free Fire Diamonds",
                      description: "شحن جواهر فري فاير",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "PUBG UC",
                      description: "شحن يوسي ببجي",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Valorant Points",
                      description: "شحن نقاط فالورانت",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
