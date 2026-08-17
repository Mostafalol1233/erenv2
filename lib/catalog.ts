export type GamePackage = {
  id: string
  label: string
  price: number
  note: string
}

export type Game = {
  slug: string
  name: string
  category: string
  image: string
  description: string
  longDescription: string
  price: number
  rating: number
  buyers: string
  delivery: string
  badge?: string
  featured?: boolean
  packages: GamePackage[]
  tags: string[]
  fieldLabel: string
}

const pkg = (game: string, index: number, label: string, price: number, note: string): GamePackage => ({
  id: `${game}-${index}`,
  label,
  price,
  note,
})

export const games: Game[] = [
  {
    slug: "pubg-mobile",
    name: "PUBG Mobile",
    category: "باتل رويال",
    image: "/images/pubg-uc-points.jpeg",
    description: "شدّ فريقك إلى المعركة واشحن UC خلال دقائق.",
    longDescription: "رصيد UC جاهز لموسمك القادم، مع تأكيد يدوي سريع ومتابعة من فريق إيرين حتى وصول الطلب إلى حسابك.",
    price: 48,
    rating: 4.9,
    buyers: "2.4k",
    delivery: "فوري",
    badge: "الأكثر طلباً",
    featured: true,
    fieldLabel: "معرّف اللاعب",
    tags: ["موبايل", "فوري", "الأكثر طلباً"],
    packages: [pkg("pubg", 1, "60 UC", 48, "باقة البداية"), pkg("pubg", 2, "300 + 25 UC", 242, "الأفضل للقيمة"), pkg("pubg", 3, "600 + 60 UC", 470, "للجلسات الطويلة"), pkg("pubg", 4, "1500 + 300 UC", 1165, "باقة المحترفين")],
  },
  {
    slug: "free-fire",
    name: "Free Fire",
    category: "موبايل",
    image: "/images/freefire-coins.jpeg",
    description: "جواهر أكثر، سكنات أسرع، واستعداد كامل للجولة.",
    longDescription: "اشحن جواهر فري فاير بسهولة، وأرسل لنا معرّف اللاعب فقط ليتم تنفيذ طلبك خلال دقائق.",
    price: 65,
    rating: 4.9,
    buyers: "3.1k",
    delivery: "فوري",
    badge: "سريع جداً",
    featured: true,
    fieldLabel: "معرّف اللاعب",
    tags: ["موبايل", "فوري", "الأعلى طلباً"],
    packages: [pkg("freefire", 1, "100 + 10 جوهرة", 65, "باقة البداية"), pkg("freefire", 2, "210 + 21 جوهرة", 130, "الأفضل للقيمة"), pkg("freefire", 3, "530 + 53 جوهرة", 314, "باقة متوسطة"), pkg("freefire", 4, "1080 + 108 جوهرة", 610, "باقة كبيرة")],
  },
  {
    slug: "valorant-points",
    name: "Valorant Points",
    category: "تنافسي",
    image: "/images/valorant-points-logo.jpg",
    description: "افتح سكناتك الجديدة واصنع لحظتك في الرانك.",
    longDescription: "نقاط فالورانت لحسابك بسرعة، مع خيارات دفع واضحة وتحديث من الإدارة بعد تسجيل الطلب.",
    price: 245,
    rating: 4.8,
    buyers: "1.8k",
    delivery: "2–5 دقائق",
    badge: "اختيار المحترفين",
    fieldLabel: "معرّف الحساب أو البريد",
    tags: ["تنافسي", "سكنات", "محترفون"],
    packages: [pkg("valorant", 1, "475 VP", 245, "باقة البداية"), pkg("valorant", 2, "1000 VP", 488, "الأفضل للقيمة"), pkg("valorant", 3, "2050 VP", 974, "للترقية"), pkg("valorant", 4, "3650 VP", 1720, "باقة المحترفين")],
  },
  {
    slug: "mobile-legends",
    name: "Mobile Legends",
    category: "موبايل",
    image: "/images/mobile-legends-art.png",
    description: "ألماسات جديدة لتقود فريقك إلى القمة.",
    longDescription: "ألماسات Mobile Legends بتسليم سريع ومتابعة مباشرة من فريق إيرين، لكل لاعب يريد العودة إلى الميدان فوراً.",
    price: 55,
    rating: 4.9,
    buyers: "1.5k",
    delivery: "فوري",
    badge: "ترند الآن",
    featured: true,
    fieldLabel: "معرّف اللاعب + المنطقة",
    tags: ["موبايل", "فوري", "ترند"],
    packages: [pkg("mlbb", 1, "86 ألماسة", 55, "باقة البداية"), pkg("mlbb", 2, "172 ألماسة", 105, "الأفضل للقيمة"), pkg("mlbb", 3, "344 ألماسة", 198, "للترقية"), pkg("mlbb", 4, "706 ألماسة", 380, "باقة كبيرة")],
  },
  {
    slug: "roblox",
    name: "Roblox Credits",
    category: "موبايل",
    image: "/images/roblox-art.png",
    description: "ابنِ عالمك واشحن رصيدك بدون خطوات معقدة.",
    longDescription: "رصيد روبلوكس للشراء داخل عالمك، مع تنفيذ منظم يناسب اللاعبين الصغار والكبار.",
    price: 165,
    rating: 4.8,
    buyers: "870",
    delivery: "5–10 دقائق",
    badge: "جديد",
    fieldLabel: "اسم المستخدم أو البريد",
    tags: ["موبايل", "جديد", "رصيد"],
    packages: [pkg("roblox", 1, "400 Robux", 165, "باقة البداية"), pkg("roblox", 2, "800 Robux", 315, "الأفضل للقيمة"), pkg("roblox", 3, "1700 Robux", 625, "باقة كبيرة")],
  },
  {
    slug: "steam-wallet",
    name: "Steam Wallet",
    category: "بطاقات رقمية",
    image: "/images/steam-wallet-art.png",
    description: "رصيد جاهز لألعابك وعمليات الشراء الرقمية.",
    longDescription: "بطاقات Steam Wallet بقيم مختلفة، مناسبة للهدايا أو لإضافة رصيد مباشر إلى مكتبتك.",
    price: 300,
    rating: 4.8,
    buyers: "410",
    delivery: "فوري",
    badge: "بدون انتظار",
    fieldLabel: "البريد الإلكتروني",
    tags: ["بطاقات رقمية", "هدايا", "فوري"],
    packages: [pkg("steam", 1, "5 USD", 300, "قيمة صغيرة"), pkg("steam", 2, "10 USD", 590, "الأفضل للقيمة"), pkg("steam", 3, "20 USD", 1140, "قيمة كبيرة")],
  },
  {
    slug: "crossfire-zp",
    name: "CrossFire ZP",
    category: "تصويب",
    image: "/images/crossfire-coins-new.jpg",
    description: "عزّز ترسانتك واستلم ZP بأمان على مدار الساعة.",
    longDescription: "نقاط ZP لمن يريد تحسين عتاده في CrossFire، مع تأكيد الطلب عبر الإدارة.",
    price: 125,
    rating: 4.7,
    buyers: "940",
    delivery: "5 دقائق",
    fieldLabel: "معرّف اللاعب",
    tags: ["تصويب", "منافسة", "سريع"],
    packages: [pkg("crossfire", 1, "5,000 ZP", 125, "باقة البداية"), pkg("crossfire", 2, "10,000 ZP", 245, "الأفضل للقيمة"), pkg("crossfire", 3, "20,000 ZP", 465, "باقة كبيرة"), pkg("crossfire", 4, "50,000 ZP", 1135, "للمحترفين")],
  },
  {
    slug: "8-ball-pool",
    name: "8 Ball Pool",
    category: "كاجوال",
    image: "/images/8ball-logo.jpg",
    description: "أظهر مهاراتك وارفع رصيدك من العملات بسهولة.",
    longDescription: "عملات 8 Ball Pool لتدخل المنافسة بثقة وتحافظ على إيقاع لعبك.",
    price: 16,
    rating: 4.8,
    buyers: "1.2k",
    delivery: "فوري",
    fieldLabel: "معرّف اللاعب",
    tags: ["كاجوال", "فوري", "عملات"],
    packages: [pkg("8ball", 1, "20,000 عملة", 16, "باقة البداية"), pkg("8ball", 2, "52,000 عملة", 47, "الأفضل للقيمة"), pkg("8ball", 3, "112,000 عملة", 90, "باقة متوسطة"), pkg("8ball", 4, "256,000 عملة", 172, "باقة كبيرة")],
  },
  {
    slug: "discord-effects",
    name: "Discord Effects",
    category: "بطاقات رقمية",
    image: "/images/discord-effects.jpg",
    description: "خصّص حضورك الرقمي بتأثيرات تناسب هويتك.",
    longDescription: "تأثيرات رقمية تضيف لمسة مختلفة لحضورك على Discord، مع تسليم عبر رسالة التأكيد.",
    price: 75,
    rating: 4.6,
    buyers: "680",
    delivery: "خلال 15 دقيقة",
    badge: "جديد",
    fieldLabel: "اسم المستخدم أو البريد",
    tags: ["بطاقات رقمية", "جديد", "هدايا"],
    packages: [pkg("discord", 1, "تأثير أساسي", 75, "اختيار بسيط"), pkg("discord", 2, "تأثير مميز", 125, "الأكثر طلباً"), pkg("discord", 3, "حزمة كاملة", 220, "قيمة أكبر")],
  },
  {
    slug: "league-rp",
    name: "League RP",
    category: "تنافسي",
    image: "/images/league-rp-art.png",
    description: "اختَر مظهرك القادم واصنع فرقاً في كل مباراة.",
    longDescription: "نقاط RP لمحبي League، مع ترتيب واضح للباقات ودعم يرد عليك بالعربية.",
    price: 210,
    rating: 4.7,
    buyers: "520",
    delivery: "10 دقائق",
    fieldLabel: "معرّف Riot والبريد",
    tags: ["تنافسي", "سكنات", "دعم عربي"],
    packages: [pkg("league", 1, "575 RP", 210, "باقة البداية"), pkg("league", 2, "1380 RP", 465, "الأفضل للقيمة"), pkg("league", 3, "2800 RP", 880, "للمحترفين")],
  },
  {
    slug: "call-of-duty-mobile",
    name: "Call of Duty Mobile",
    category: "باتل رويال",
    image: "/images/codm-art-v2.png",
    description: "CP ومحتوى الموسم الجديد لمحبي اللعب السريع.",
    longDescription: "اشحن CP في Call of Duty Mobile وأكمل الموسم الجديد بمحتوى يناسب أسلوب لعبك.",
    price: 210,
    rating: 4.8,
    buyers: "760",
    delivery: "5–10 دقائق",
    badge: "وصول جديد",
    featured: true,
    fieldLabel: "معرّف اللاعب",
    tags: ["باتل رويال", "جديد", "موسم جديد"],
    packages: [pkg("codm", 1, "420 CP", 210, "باقة البداية"), pkg("codm", 2, "880 CP", 410, "الأفضل للقيمة"), pkg("codm", 3, "2400 CP", 1030, "باقة كبيرة")],
  },
  {
    slug: "fortnite",
    name: "Fortnite",
    category: "باتل رويال",
    image: "/images/fortnite-art-v2.png",
    description: "V-Bucks وملحقات الموسم لعالمك الخاص.",
    longDescription: "اشحن V-Bucks وأضف لمساتك إلى عالم Fortnite من خلال طلب واضح وسريع.",
    price: 260,
    rating: 4.8,
    buyers: "640",
    delivery: "10 دقائق",
    badge: "مميز",
    fieldLabel: "البريد أو معرّف الحساب",
    tags: ["باتل رويال", "مميز", "سكنات"],
    packages: [pkg("fortnite", 1, "1,000 V-Bucks", 260, "باقة البداية"), pkg("fortnite", 2, "2,800 V-Bucks", 650, "الأفضل للقيمة"), pkg("fortnite", 3, "5,000 V-Bucks", 1100, "باقة كبيرة")],
  },
  {
    slug: "ea-fc-mobile",
    name: "EA FC Mobile",
    category: "رياضة",
    image: "/images/eafc-art-v2.png",
    description: "نقاط وموارد لفريقك قبل صافرة البداية.",
    longDescription: "جهّز فريقك للموسم الجديد مع باقات EA FC Mobile وتسليم منظم من فريق إيرين.",
    price: 155,
    rating: 4.7,
    buyers: "480",
    delivery: "10–15 دقيقة",
    fieldLabel: "معرّف اللاعب",
    tags: ["رياضة", "موسم جديد", "فريقك"],
    packages: [pkg("eafc", 1, "100 نقطة", 155, "باقة البداية"), pkg("eafc", 2, "520 نقطة", 510, "الأفضل للقيمة"), pkg("eafc", 3, "1,050 نقطة", 980, "للمنافسة")],
  },
  {
    slug: "genshin-impact",
    name: "Genshin Impact",
    category: "مغامرات",
    image: "/images/genshin-art-v2.png",
    description: "Genesis Crystals لرحلتك القادمة بين العوالم.",
    longDescription: "أضف رصيداً جديداً إلى مغامرتك مع باقات Genshin Impact بخيارات بسيطة وواضحة.",
    price: 190,
    rating: 4.8,
    buyers: "390",
    delivery: "10 دقائق",
    fieldLabel: "معرّف اللاعب والمنطقة",
    tags: ["مغامرات", "جديد", "عالم مفتوح"],
    packages: [pkg("genshin", 1, "300 Crystal", 190, "باقة البداية"), pkg("genshin", 2, "980 Crystal", 520, "الأفضل للقيمة"), pkg("genshin", 3, "1980 Crystal", 980, "للمغامرة الطويلة")],
  },
  {
    slug: "brawl-stars",
    name: "Brawl Stars",
    category: "موبايل",
    image: "/images/brawl-stars-art-v2.png",
    description: "Gems وPass للجولات السريعة والمنافسة اليومية.",
    longDescription: "رصيد Brawl Stars للاعبين الذين يريدون فتح محتوى جديد والاستمرار في التحدي.",
    price: 120,
    rating: 4.8,
    buyers: "530",
    delivery: "5–10 دقائق",
    badge: "جديد",
    fieldLabel: "معرّف اللاعب",
    tags: ["موبايل", "جديد", "منافسة"],
    packages: [pkg("brawl", 1, "170 Gems", 120, "باقة البداية"), pkg("brawl", 2, "360 Gems", 230, "الأفضل للقيمة"), pkg("brawl", 3, "950 Gems", 530, "باقة كبيرة")],
  },
]

export const categories = ["الكل", "الأكثر طلباً", "موبايل", "باتل رويال", "تنافسي", "بطاقات رقمية", "رياضة", "مغامرات", "كاجوال"]

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug)
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("ar-EG").format(value)} ج.م`
}

export function buildWhatsAppMessage(game: Game, pack: GamePackage, customerField = "") {
  return `مرحباً فريق إيرين، أريد طلب ${pack.label} من ${game.name} بسعر ${formatPrice(pack.price)}.${customerField ? ` بيانات الحساب: ${customerField}.` : ""} أرجو تأكيد الطلب وطريقة التسليم.`
}
