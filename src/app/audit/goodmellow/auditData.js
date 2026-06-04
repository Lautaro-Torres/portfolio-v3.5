// Structured audit content for GoodMellow CRO Audit
// June 2026 · Lautaro Torres
// Designed to be reusable — swap this file to create dashboards for other clients.

export const auditMeta = {
  client: "Goodmellow",
  platform: "Shopify",
  preparedBy: "Lautaro Torres",
  date: "June 4, 2026",
  ctaUrl: "https://docs.google.com/document/d/1OfYQcq-g-hAdCD78AkQ6AtLEFNqNh-wulyYJAIE9KX8/edit?usp=sharing",
  thesis:
    "Goodmellow does not need more visual identity. It needs clearer decision architecture: product first, benefit second, guidance third, proof throughout.",
};

export const businessUnderstanding = {
  executiveSummary:
    "Goodmellow has a strong brand and solid PDP education, but the conversion opportunity sits earlier in the journey. First-time visitors need product clarity before mood. The site should become a clearer, more shoppable experience — product-led, dose-guided, and trust-rich before the CTA.",
  blocks: [
    {
      label: "Business Model",
      content:
        "DTC Shopify brand selling THC-infused sparkling water across four dose tiers: Glow 0mg, Micro 2mg, Classic 5mg, Fade 10mg.",
    },
    {
      label: "Customer Psychology",
      content:
        "Users are choosing dose, expected feeling, occasion, and comfort level — not just a flavor. This is a ritual decision, not an impulse buy.",
    },
    {
      label: "Business Goal",
      content:
        "Improve first-time CVR, increase AOV through bundles and upsells, drive subscription attach, and reduce new-buyer hesitation.",
    },
    {
      label: "CRO Thesis",
      content:
        "Move product clarity, guided discovery, and trust proof earlier in the journey. Education lives in PDPs — it needs to reach the homepage.",
    },
  ],
};

export const benchmarkPatterns = [
  {
    benchmark: "Kin Euphorics",
    url: "https://www.kineuphorics.com/",
    pattern:
      "Guided discovery, quiz, clear functional beverage positioning, benefit-led mood language.",
    useForGoodmellow:
      "Useful for helping first-time users find the right product.",
  },
  {
    benchmark: "OLIPOP",
    url: "https://drinkolipop.com/",
    pattern:
      "Simple product-led ecommerce: visible cans, clear benefit line, shoppable product cards, flavors, reviews and direct CTAs.",
    useForGoodmellow:
      "Useful for making Goodmellow feel more immediately purchasable.",
  },
  {
    benchmark: "Athletic Brewing",
    url: "https://athleticbrewing.com/",
    pattern:
      "Strong PDP depth: product proof, video, reviews, FAQs, cross-sells.",
    useForGoodmellow:
      "Useful for organizing deeper education without overwhelming the first screen.",
  },
];

export const benchmarkTakeaway =
  "Goodmellow should not become more complex. It should become clearer, more product-led, and more shoppable earlier. Cart drawer upsells and free-shipping prompts should be used as ecommerce patterns, not as a separate benchmark section.";

export const impactMatrix = [
  {
    recommendation: "Hero product definition + body promo banners",
    effort: "Low",
    impact: "High",
    priority: "P0",
    effortScore: 1,
    impactScore: 3,
  },
  {
    recommendation: "Experience cards with cans / prices / dose / CTA",
    effort: "Med",
    impact: "High",
    priority: "P0",
    effortScore: 2,
    impactScore: 3,
  },
  {
    recommendation: "Performance + broken-link QA",
    effort: "Low/Med",
    impact: "High",
    priority: "P0",
    effortScore: 1.5,
    impactScore: 3,
  },
  {
    recommendation: "Cart drawer upsell + free shipping CTA",
    effort: "Med",
    impact: "High",
    priority: "P1",
    effortScore: 2,
    impactScore: 3,
  },
  {
    recommendation: "Subscription value module",
    effort: "Low",
    impact: "Med/High",
    priority: "P1",
    effortScore: 1,
    impactScore: 2.5,
  },
  {
    recommendation: "Founder / UGC video proof",
    effort: "Low/Med",
    impact: "Med",
    priority: "P1",
    effortScore: 1.5,
    impactScore: 2,
  },
  {
    recommendation: "Find Your Experience quiz",
    effort: "Med/High",
    impact: "High",
    priority: "P1",
    effortScore: 2.5,
    impactScore: 3,
  },
];

export const keyFindings = [
  {
    id: 1,
    title: "Strong brand, delayed product clarity",
    detail:
      "First-time visitors may not understand quickly enough that this is a THC-infused sparkling water with dosage-based experiences.",
    priority: "P0",
    category: "Clarity",
  },
  {
    id: 2,
    title: "Hero is promotional before educational",
    detail:
      "The carousel sells before it explains. Replace with a single product-led hero: visible can, product definition, dosage context, dual CTAs.",
    priority: "P0",
    category: "Hero UX",
  },
  {
    id: 3,
    title: "Homepage should feel like ecommerce",
    detail:
      "Show cans, price, dose, expected feeling, and use case earlier. Product cards should help users decide without opening every PDP.",
    priority: "P0",
    category: "Ecommerce",
  },
  {
    id: 4,
    title: "PDP education is strong but arrives too late",
    detail:
      "PDPs explain dosage, timing, duration, and nutrition well. Simplified versions should be pulled into home, shop, and product cards.",
    priority: "P1",
    category: "Ecommerce",
  },
  {
    id: 5,
    title: "AOV and subscription levers need stronger framing",
    detail:
      "Bundles and subscriptions exist but feel transactional. Free-shipping progress should connect to a guided bundle CTA.",
    priority: "P1",
    category: "AOV/Sub",
  },
  {
    id: 6,
    title: "Trust should be more human and measurable",
    detail:
      "5 broken product links detected. Add founder/UGC video, surface authentic reviews near decision points, and run Clarity heatmaps.",
    priority: "P1",
    category: "Trust",
  },
];

export const categoryBreakdown = [
  { label: "Clarity", count: 1, color: "bg-violet-500" },
  { label: "Hero UX", count: 1, color: "bg-blue-500" },
  { label: "Ecommerce", count: 2, color: "bg-emerald-500" },
  { label: "Trust", count: 1, color: "bg-amber-500" },
  { label: "AOV/Sub", count: 1, color: "bg-rose-500" },
];

export const homepageProductAuditRows = [
  {
    area: "First impression / value prop",
    friction:
      "Strong brand world, but product definition arrives too late. Users see mood and campaign before they understand what the product is.",
    fix:
      "Replace the carousel-first hero with a single product-led hero: large can image or short real video, headline, product definition, dosage microcopy (0/2/5/10mg), and two CTAs: “Shop Goodmellow” + “Find Your Experience”.",
    metric: "Hero CTR, bounce rate, homepage->PDP CTR, first-time CVR",
    priority: "P0",
  },
  {
    area: "Hero effectiveness",
    friction:
      "Hero currently tries to sell before explaining. Promo slides repeat sale messages and some image text is not responsive.",
    fix:
      "Move sale/variety pack creative into body banners after product education. Do not bake important copy into images; use HTML text over responsive backgrounds so mobile can adapt margins, hierarchy and legibility.",
    metric: "Hero CTR, scroll depth, mobile CVR",
    priority: "P0",
  },
  {
    area: "Navigation / UX flow",
    friction:
      "Top nav is too reduced for a first-time THC/wellness product. Important education is buried in footer pages like About, The Experience, What’s Inside and FAQs.",
    fix:
      "Add lightweight nav/body entry points: Shop, Find Your Experience, What’s Inside, The Experience, FAQ. Keep shop focus, but give users an education path before purchase.",
    metric: "Find Experience CTR, homepage->PDP CTR",
    priority: "P0",
  },
  {
    area: "Mobile responsiveness",
    friction:
      "Mobile still feels more like a brand presentation than a fast ecommerce guide. The hero/campaign uses space before product clarity.",
    fix:
      "Prioritize a mobile-first flow: hero -> product/experience cards -> benefit explanation -> social proof -> bundle/subscription. Reduce repeated carousel logic and tighten CTA hierarchy.",
    metric: "Mobile CTR, mobile ATC, readability",
    priority: "P0",
  },
  {
    area: "Trust / credibility",
    friction:
      "Press logos appear early, before the product is fully understood. Reviews are authentic, but mostly show later in the PDP.",
    fix:
      "Move press lower as validation after product education. Surface short real review snippets near product cards/PDP CTA. Add founder/customer videos from Instagram to build human trust.",
    metric: "Review interaction, video engagement, first-time CVR",
    priority: "P1",
  },
  {
    area: "CTA placement",
    friction:
      "Shop Now appears before enough product confidence exists; later CTAs can feel disconnected from decision support.",
    fix:
      "Use dual CTA in hero: “Shop Goodmellow” for ready users and “Find Your Experience” for unsure users. Repeat CTAs after product cards, benefits, reviews and bundle prompts.",
    metric: "CTA CTR, ATC rate, bundle attach",
    priority: "P0",
  },
  {
    area: "Product presentation",
    friction:
      "The “Select Your Experience” section is visually strong but too abstract. Product cans, prices and use cases are not visible enough.",
    fix:
      "Turn experience blocks into ecommerce cards with can image, tier name, dose, price/pack, expected feeling, best use case, review badge if available, and CTA (“Shop Micro”, “Shop Classic”).",
    metric: "Product card CTR, PDP visits, ATC rate",
    priority: "P0",
  },
  {
    area: "Product copy / persuasion",
    friction:
      "Copy uses mood language but often does not translate ingredients/dosage into practical user outcomes.",
    fix:
      "For each tier, add one clear outcome: Glow = THC-free calm; Micro = first-time/light social ease; Classic = balanced social mood; Fade = stronger evening wind-down. Translate GABA, L-theanine, ashwagandha into benefits.",
    metric: "Tier CTR, first-time CVR",
    priority: "P1",
  },
  {
    area: "Pricing / pack clarity",
    friction:
      "PDP price is visible, but users should understand earlier what pack/quantity they are buying and why the price makes sense.",
    fix:
      "Show pack quantity and price directly on product cards/PDP summary. Add a compact purchase summary near CTA: experience, dose, flavor, pack, expected effect, shipping timeframe.",
    metric: "PDP ATC, cart abandonment",
    priority: "P1",
  },
  {
    area: "Reviews / social proof",
    friction:
      "Product reviews are a strength: they feel real and support trust around taste/effect.",
    fix:
      "Pull the strongest review snippets closer to PDP CTA, product cards, and first-time buyer decision sections. Add UGC-style video modules when available.",
    metric: "Review interaction, PDP CVR",
    priority: "P1",
  },
];

export const funnelTrustAuditRows = [
  {
    area: "Cart optimization",
    friction: "Cart is clear, but does not fully use final AOV opportunity.",
    fix:
      "Add a cart drawer quick upsell: selected product summary, free-shipping progress bar (“You are $X away”), one contextual CTA (“Add another experience” / “Complete your bundle”), payment icons, trust proof, dominant checkout CTA.",
    metric: "AOV, cart upsell CTR, bundle attach, cart->checkout",
    priority: "P1",
  },
  {
    area: "Checkout friction",
    friction: "Checkout appears functional; main risk is users arriving with weak confidence.",
    fix:
      "Improve pre-checkout confidence before cart: dose, pack, flavor, expected effect, delivery, why bundle/subscription makes sense.",
    metric: "PDP->cart, checkout completion",
    priority: "P1",
  },
  {
    area: "Forms / account",
    friction:
      "Broken-link scan found several dead PDP links and account redirect errors. This can break flavor/category discovery and reduce trust before checkout.",
    fix:
      "Fix or 301-redirect dead product URLs: /products/classic-5mg-copy, /products/grapefruit-habanero, /products/strawberry-hibiscus, /products/white-peach-tea, /products/meyer-lemon-limonata. Review account redirect (406) plus affiliate/API errors; make sure homepage cards and CTAs never point to dead PDPs.",
    metric: "Broken-link count, 404 sessions, product card CTR, account success",
    priority: "P0",
  },
  {
    area: "Payment / trust badges",
    friction:
      "Payment methods appear clear. No need for generic badge clutter in Shopify checkout if trust is already credible.",
    fix:
      "Show payment methods in cart drawer and keep policy/shipping links accessible. Use product-specific trust instead of badge overload.",
    metric: "Cart abandonment, checkout completion",
    priority: "P1",
  },
  {
    area: "Shipping clarity",
    friction:
      "Free shipping messaging exists, but value can be tied more directly to bundle behavior.",
    fix:
      "Pair free-shipping threshold with a bundle prompt: “Add another experience to unlock free shipping.” Make the CTA actionable, not only informational.",
    metric: "Free shipping completion, AOV",
    priority: "P1",
  },
  {
    area: "Exit / lead capture",
    friction:
      "20% off is useful, but the first modal can interrupt users before they understand the product.",
    fix:
      "Keep the small bottom-left “Get 20% off” re-open tab. If using a popup, make it cookie-banner style at the bottom, with stronger contrast and a clear first-purchase/subscription message.",
    metric: "Popup CVR, email signup, discount redemption",
    priority: "P1",
  },
  {
    area: "Performance",
    friction:
      "Lighthouse/PageSpeed shows weak lab performance, especially mobile, and the age gate/popup may affect measurement.",
    fix:
      "Run PageSpeed/Lighthouse on home, collection and PDP. Optimize age gate, hero/carousel scripts, app embeds, fonts and responsive images. Replace carousel-heavy hero with simpler product-led hero.",
    metric: "Mobile LCP, TBT, Speed Index, bounce, mobile CVR",
    priority: "P0",
  },
  {
    area: "Accessibility",
    friction:
      "Some image-based text and overlays may reduce readability and responsiveness.",
    fix:
      "Move important copy out of images and into HTML. Review contrast, alt text, focus states, button labels and mobile tap targets.",
    metric: "Accessibility score, mobile readability",
    priority: "P1",
  },
  {
    area: "Information architecture",
    friction: "Education is too passive/deep: footer/PDP instead of journey.",
    fix:
      "Make homepage an indexer: what it is, which tier fits me, what it feels like, why it beats alcohol, where to buy. Add What’s Inside / The Experience to nav/body.",
    metric: "Homepage->PDP, scroll depth, CVR",
    priority: "P0",
  },
  {
    area: "Search / filters",
    friction:
      "Catalog is small, but choice is complex because it is based on dose/effect. Heavy search is not needed.",
    fix:
      "Use lightweight chips: 0mg, 2mg, 5mg, 10mg, first-time friendly, social, relax, stronger, THC-free.",
    metric: "Filter clicks, tier CTR",
    priority: "P1",
  },
  {
    area: "Trust & social proof",
    friction:
      "Brand is visually credible, but product-specific trust can be stronger.",
    fix:
      "Use real Instagram/founder clips in home/PDP: founder explains benefits, real person drinking product, occasion-based clips, Q&A-style content.",
    metric: "Video engagement, first-time CVR",
    priority: "P1",
  },
  {
    area: "Tracking / analytics",
    friction:
      "A quick external spot-check detected Google tags and some core ecommerce events, but not a full QA.",
    fix:
      "Use GA4/Shopify to quantify funnel metrics. Use Microsoft Clarity heatmaps/session recordings to validate where users scroll, click, hesitate, ignore carousel/CTAs, or drop off.",
    metric: "Event coverage, funnel metrics, behavior insights",
    priority: "P1",
  },
];

export const conversionFlow = [
  {
    step: 1,
    label: "Homepage",
    sublabel: "First impression",
    friction: "Hero/product definition arrives late; mood and campaign appear before the product is understood.",
    severity: "high",
  },
  {
    step: 2,
    label: "Offer Clarity",
    sublabel: "Education path",
    friction: "Education is too deep/passive in footer/PDP content instead of guiding the journey.",
    severity: "high",
  },
  {
    step: 3,
    label: "Product Understanding",
    sublabel: "Cards + tiers",
    friction: "Product cards lack visible cans, price, dose, expected feeling and use case.",
    severity: "high",
  },
  {
    step: 4,
    label: "Proof & Trust",
    sublabel: "Credibility signals",
    friction: "Trust appears after product understanding; reviews and human proof arrive too late.",
    severity: "medium",
  },
  {
    step: 5,
    label: "CTA Decision",
    sublabel: "Intent to buy",
    friction: "CTA asks for purchase before enough product confidence exists.",
    severity: "high",
  },
  {
    step: 6,
    label: "Cart & Bundle",
    sublabel: "AOV & checkout",
    friction: "Cart misses AOV/free-shipping upsell opportunity and contextual bundle prompts.",
    severity: "medium",
  },
  {
    step: 7,
    label: "Post-Submit",
    sublabel: "Retention & loyalty",
    friction: "Post-purchase and subscription value needs stronger framing for retention.",
    severity: "medium",
  },
];

export const roadmap = [
  {
    phase: "Week 1–2",
    tag: "Quick Wins",
    priority: "P0",
    color: "text-emerald-400",
    borderColor: "border-emerald-400/30",
    bgColor: "bg-emerald-400/8",
    items: [
      "Replace carousel hero with one product-led hero (can image, headline, dual CTAs)",
      "Move sale/promo creative into body banners after product education",
      "Add nav/body entry points: What's Inside, The Experience, FAQ",
      "Add can, price, dose, and use-case microcopy to experience cards",
      "Improve subscription copy and 20% offer contrast",
      "Fix 5 broken product links (Classic 5mg copy, Grapefruit Habanero, etc.)",
      "Run PageSpeed cleanup on home, collection, and PDP",
      "Surface top review snippets near PDP CTA and product cards",
    ],
  },
  {
    phase: "Week 3–6",
    tag: "Medium Improvements",
    priority: "P1",
    color: "text-blue-400",
    borderColor: "border-blue-400/30",
    bgColor: "bg-blue-400/8",
    items: [
      "Redesign experience cards: can image, tier, dose, price, benefit, use case, CTA",
      "Add cart drawer upsell tied to free-shipping threshold",
      "Build simple bundle prompt inside cart",
      "Restructure PDP purchase summary (dose, flavor, pack, effect, shipping)",
      "Add founder and UGC video sections on home and PDP",
      "Redesign ingredient section as benefit-led copy per tier",
      "Improve mobile layout: hero → cards → benefits → proof → bundle",
    ],
  },
  {
    phase: "Month 2–3",
    tag: "Strategic Enhancements",
    priority: "P1",
    color: "text-violet-400",
    borderColor: "border-violet-400/30",
    bgColor: "bg-violet-400/8",
    items: [
      "Measure all changes with GA4/Shopify and Microsoft Clarity",
      "Run A/B tests: hero copy, product cards, 20% offer, subscription module",
      "Launch 'Find Your Experience' guided quiz if not already built",
      "Create simple reporting dashboard for funnel metrics",
      "Define retention opportunities: subscriber perks, repeat-purchase offers, loyalty",
    ],
  },
];

export const expectedImpactMatrix = [
  {
    recommendation: "Hero product definition + body promo banners",
    effort: "Low",
    impact: "High",
    priority: "P0",
    successMetric: "Hero CTR, bounce, homepage->PDP CTR, first-time CVR",
    effortScore: 1,
    impactScore: 3,
  },
  {
    recommendation: "Experience cards with cans/prices/dose/CTA",
    effort: "Med",
    impact: "High",
    priority: "P0",
    successMetric: "Product card CTR, PDP visits, ATC rate",
    effortScore: 2,
    impactScore: 3,
  },
  {
    recommendation: "Cart drawer upsell + free shipping CTA",
    effort: "Med",
    impact: "High",
    priority: "P1",
    successMetric: "AOV, bundle attach, cart upsell CTR",
    effortScore: 2,
    impactScore: 3,
  },
  {
    recommendation: "Subscription value module",
    effort: "Low",
    impact: "Med/High",
    priority: "P1",
    successMetric: "Subscription attach, repeat purchase",
    effortScore: 1,
    impactScore: 2.5,
  },
  {
    recommendation: "Founder/UGC video proof",
    effort: "Low/Med",
    impact: "Med",
    priority: "P1",
    successMetric: "Video engagement, first-time CVR",
    effortScore: 1.5,
    impactScore: 2,
  },
  {
    recommendation: "Find Your Experience quiz",
    effort: "Med/High",
    impact: "High",
    priority: "P1",
    successMetric: "Quiz start/complete, quiz->cart, CVR",
    effortScore: 2.5,
    impactScore: 3,
  },
  {
    recommendation: "Performance + broken-link QA",
    effort: "Low/Med",
    impact: "High",
    priority: "P0",
    successMetric: "LCP/TBT, 404 rate, attribution quality",
    effortScore: 1.5,
    impactScore: 3,
  },
];

export const validationInputs = [
  {
    label: "Internal Metrics",
    icon: "BarChart2",
    items: [
      "First-time vs returning CVR",
      "Homepage->PDP CTR",
      "PDP ATC by tier",
      "Subscription attach",
      "Bundle attach",
      "AOV by order type",
      "Cart abandonment",
      "Checkout completion",
      "Repeat purchase rate",
    ],
  },
  {
    label: "Behavioral Analytics",
    icon: "MousePointer",
    items: [
      "Microsoft Clarity heatmaps/session recordings",
      "Hero visibility",
      "Carousel usage",
      "Product card clicks",
      "Scroll depth",
      "Subscription confusion",
      "Cart upsell interaction",
      "Age-gate drop-off",
    ],
  },
  {
    label: "Customer Voice",
    icon: "MessageSquare",
    items: [
      "Top support questions",
      "Review themes around taste/effect/dosage/shipping",
      "Reasons users choose one-time vs subscription",
      "Most confusing THC tier for new users",
    ],
  },
  {
    label: "Testing Plan",
    icon: "FlaskConical",
    items: [
      "A/B test hero copy",
      "Product card structure",
      "20% offer placement",
      "Subscription module",
      "Cart drawer upsell",
      "Quiz entry point",
      "Prioritize P0/P1 by impact vs effort",
    ],
  },
];

export const measurementNote =
  "A quick external Tag Assistant spot-check detected Google tracking infrastructure and core ecommerce events during the tested session. This is useful, but should be treated as a spot-check, not a full tracking QA. Use GA4/Shopify to quantify the funnel and Microsoft Clarity to visually validate behavior. Recommended tools: GA4 for funnel metrics, PageSpeed/Lighthouse for performance/accessibility, Tag Assistant for Google tag spot-checks, Check My Links for broken links, SEO Meta in 1 Click/Detailed SEO for basic metadata/headings checks.";
