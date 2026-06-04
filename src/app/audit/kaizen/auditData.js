export const auditMeta = {
  client: "Kaizen",
  platform: "WordPress",
  preparedBy: "Lautaro Torres",
  date: "June 4, 2026",
  ctaUrl: "https://docs.google.com/document/d/1lW_qhqapnYdHIhMeAcahCq2RvYwv-Bq0RSwP5kghegc/edit?usp=sharing",
  issueCount: 1,
  thesis:
    "Kaizen does not need a different visual identity. It needs clearer B2B decision architecture: offer first, proof closer to CTAs, service and industry relevance throughout.",
};

export const businessUnderstanding = {
  executiveSummary:
    "Kaizen has strong brand assets, partner logos and broad service coverage. The conversion opportunity is to turn the site from a broad agency presentation into a proof-led B2B conversion path.",
  blocks: [
    {
      label: "Business Model",
      content:
        "B2B WordPress marketing agency managing 110+ client accounts across paid ads, email/SMS, organic social, web development and automations.",
    },
    {
      label: "Customer Psychology",
      content:
        "Prospects are skeptical business owners or marketing leads comparing agencies. They need fast clarity, proof, industry relevance and a low-risk next step.",
    },
    {
      label: "Business Goal",
      content:
        "Increase qualified lead submissions, improve service clarity, reduce bounce on key pages and increase consultation booking rate.",
    },
    {
      label: "CRO Thesis",
      content:
        "Turn the site from a broad agency presentation into a proof-led B2B conversion path with service and industry relevance near CTAs.",
    },
  ],
};

export const benchmarkPatterns = [
  {
    benchmark: "Digital Metrics",
    pattern:
      "Result-led service pages and case-study cards: hero metrics, platform/service context, methodology, certifications and client results by industry.",
    useForClient:
      "Useful for making Kaizen pages feel less generic and more proof-led without copying the design.",
  },
];

export const benchmarkTakeaway =
  "Kaizen should adapt the pattern, not copy the design: add compact client-result cards, a home client-logo carousel, service-specific proof and industry-specific examples near the CTAs.";

export const keyFindings = [
  {
    id: 1,
    title: "Clear identity, incomplete value proposition",
    detail:
      "“The 1% agency” is memorable, but the first screen does not immediately explain what type of agency Kaizen is, who it helps, or what growth problem it solves.",
    priority: "P0",
    category: "Clarity",
  },
  {
    id: 2,
    title: "Homepage asks for conversion before enough clarity",
    detail:
      "The CTA appears early, but users may not yet understand services, proof or expected outcome. This can reduce qualified CTA clicks and form starts.",
    priority: "P0",
    category: "CTA UX",
  },
  {
    id: 3,
    title: "Prime homepage space is used for values before decision support",
    detail:
      "Values are better suited for About. Early homepage space should explain who Kaizen helps, what it solves and why the agency is credible.",
    priority: "P0",
    category: "IA",
  },
  {
    id: 4,
    title: "Service pages explain capabilities but lack specific proof",
    detail:
      "Service pages are solid, but benefits feel generic without mini case cards showing client, service, action and result.",
    priority: "P1",
    category: "Proof",
  },
  {
    id: 5,
    title: "Industry pages reuse the service-page structure",
    detail:
      "Industry visitors need vertical-specific pain points, metrics and examples. Repeating the same layout weakens relevance and conversion intent.",
    priority: "P1",
    category: "Relevance",
  },
  {
    id: 6,
    title: "Mobile performance and lead tracking need cleanup",
    detail:
      "PageSpeed mobile is weak and form submit tracking/post-submit messaging are not clear enough for a lead-generation funnel.",
    priority: "P0",
    category: "Technical",
  },
];

export const categoryBreakdown = [
  { label: "Clarity", count: 1 },
  { label: "CTA UX", count: 1 },
  { label: "IA", count: 1 },
  { label: "Proof", count: 1 },
  { label: "Relevance", count: 1 },
  { label: "Technical", count: 1 },
];

export const homepageProductAuditRows = [
  {
    area: "First impression / value prop",
    friction:
      "Hero says “We are Kaizen, the 1% agency,” but does not explain fast enough what Kaizen does or for whom.",
    fix:
      "Rewrite the hero around a concrete B2B offer: “Performance marketing agency helping brands grow through paid ads, email/SMS, web and automation.” Keep “1% agency” as support claim.",
    metric: "Hero CTR, bounce, homepage->service CTR",
    priority: "P0",
  },
  {
    area: "Hero effectiveness",
    friction:
      "CTA asks for a free growth plan before the visitor has enough service clarity or proof.",
    fix:
      "Keep primary CTA, but add a secondary path such as “View Services” or “See Client Results.” Add microcopy explaining what the growth call gives the prospect.",
    metric: "CTA CTR, scroll depth, form starts",
    priority: "P0",
  },
  {
    area: "Homepage information order",
    friction:
      "Values appear before the site fully proves offer, services and outcomes.",
    fix:
      "Move values lower or to About. Replace early space with “Who we help / What we solve / How we grow revenue or leads.”",
    metric: "Bounce, service CTR, scroll depth",
    priority: "P0",
  },
  {
    area: "Services preview",
    friction:
      "Service cards exist, but copy can feel capability-led instead of outcome-led.",
    fix:
      "Rewrite cards as “We do X to help you achieve Y.” Example: “Google Ads - capture high-intent demand and turn search traffic into qualified leads or sales.”",
    metric: "Service card CTR, service visits",
    priority: "P1",
  },
  {
    area: "Client proof / logos",
    friction:
      "Homepage lacks a compact client-logo strip before the user reaches the form.",
    fix:
      "Add a simple client-logo carousel/marquee near the top and again before the form. Use real companies or industries served to reduce perceived risk quickly.",
    metric: "CTA CTR after proof, form starts",
    priority: "P0",
  },
  {
    area: "Reviews / testimonials",
    friction:
      "Reviews look manually added and repeat across pages, which can feel less verifiable.",
    fix:
      "If available, pull verified reviews from Google, Clutch, Trustpilot or TrustIndex. If not, add full name, role, company, logo and linked case result.",
    metric: "Review interaction, form CVR",
    priority: "P1",
  },
  {
    area: "Mobile layout density",
    friction:
      "Service and testimonial cards stack vertically and create too much scroll before the form.",
    fix:
      "Compress mobile cards, remove empty height, and use horizontal carousels for reviews/client logos so proof stays visible without pushing CTA too far down.",
    metric: "Mobile scroll, mobile CTA CTR",
    priority: "P1",
  },
  {
    area: "Service pages",
    friction:
      "Service pages explain the offer, but still feel generic without client-specific proof.",
    fix:
      "Add 2-3 compact case-study cards per service: client/industry, service used, action taken, measurable result and CTA to request a service-specific review.",
    metric: "Service CTA CTR, lead quality",
    priority: "P1",
  },
  {
    area: "Industry pages",
    friction:
      "Industry pages reuse service-page logic instead of speaking to industry-specific problems.",
    fix:
      "Rebuild each industry page around vertical pain points, KPIs and examples. Ecommerce should speak to AOV, ROAS, retention and Shopify; home services to local leads/bookings.",
    metric: "Industry bounce, form starts",
    priority: "P1",
  },
  {
    area: "About / authenticity",
    friction:
      "Team section builds trust, but generic or AI-looking imagery weakens authenticity.",
    fix:
      "Use real founder/team/client-work visuals. Keep Kaizen philosophy on About, but avoid AI/stock images where the page is trying to prove partnership and trust.",
    metric: "About engagement, assisted CVR",
    priority: "P1",
  },
];

export const funnelTrustAuditRows = [
  {
    area: "Lead form structure",
    friction: "The service field is a single select, but prospects may need multiple services.",
    fix:
      "Change “Services you are looking for” to multi-select checkboxes: Google Ads, Meta Ads, Email/SMS, Web Design, Social Media, Automations, Not sure yet.",
    metric: "Form completion, lead quality",
    priority: "P1",
  },
  {
    area: "Post-submit UX",
    friction:
      "After submitting, confirmation says “We appreciate your feedback,” which feels like a survey, not a consultation request.",
    fix:
      "Replace with: “Thanks for contacting Kaizen. We received your request and will reach out shortly to schedule your free 15-minute growth call.”",
    metric: "Form confidence, lead trust",
    priority: "P0",
  },
  {
    area: "Lead confirmation",
    friction: "No confirmation email was observed after form submission.",
    fix:
      "Add an autoresponder confirming receipt, next steps, expected response time and optional links to case studies/services.",
    metric: "Show-up rate, reply rate",
    priority: "P1",
  },
  {
    area: "Tracking / analytics",
    friction:
      "GTM and GA4 are installed, but a clear form_submit/generate_lead event was not observed in the spot-check.",
    fix:
      "Configure named events for form start, form submit, service CTA clicks, phone/email/WhatsApp clicks and bookings. Mark lead submit as key conversion.",
    metric: "Event coverage, attribution",
    priority: "P0",
  },
  {
    area: "Mobile performance",
    friction:
      "PageSpeed mobile scored 29 with LCP 16.6s, Speed Index 10.4s and TBT 2,250ms in a quick external test.",
    fix:
      "Prioritize mobile cleanup: image compression, responsive sizes, lazy loading, critical hero preload and JS/plugin review.",
    metric: "Mobile LCP, TBT, bounce",
    priority: "P0",
  },
  {
    area: "Image optimization",
    friction:
      "Large JPG/PNG assets were found, including images around 700KB to 1.6MB+.",
    fix:
      "Convert large images to WebP/AVIF, resize to actual display size and compress aggressively. Target lightweight hero/support assets.",
    metric: "Page weight, LCP, Speed Index",
    priority: "P0",
  },
  {
    area: "Accessibility / image metadata",
    friction: "SEO check showed 27 images without ALT/title attributes.",
    fix:
      "Add meaningful ALT to informative images/logos and empty ALT for decorative visuals. Supports accessibility and basic SEO quality.",
    metric: "Accessibility score, SEO hygiene",
    priority: "P1",
  },
  {
    area: "SEO title clarity",
    friction: "Homepage title “Kaizen Marketing” is too generic and mirrors the hero clarity issue.",
    fix:
      "Use a clearer title such as “Kaizen Marketing | Performance Marketing Agency” or “Paid Ads, Shopify & Email Growth Agency.”",
    metric: "Organic CTR, SERP clarity",
    priority: "P1",
  },
  {
    area: "Broken links",
    friction: "A quick check found one 404 social link pointing to a YouTube profile.",
    fix:
      "Fix or remove the broken YouTube link and review footer/social links. Small but visible trust cleanup for an agency site.",
    metric: "404 count, trust consistency",
    priority: "P0",
  },
  {
    area: "Privacy / cookies",
    friction:
      "No cookie notice was observed; legal requirements depend on region and tracking setup.",
    fix:
      "Validate privacy requirements internally. Keep Privacy Policy accessible near the form and consider cookie disclosure if ad/analytics pixels are used.",
    metric: "Form trust, compliance readiness",
    priority: "P1",
  },
  {
    area: "Blog / content quality",
    friction:
      "Blog is active, but some formatting choices feel overly AI-generated, such as icons inside headings.",
    fix:
      "Use AI as workflow support, but apply human editorial judgment: remove heading icons, improve hierarchy, add examples and connect posts to service CTAs.",
    metric: "Blog->service CTR, content quality",
    priority: "P1",
  },
  {
    area: "Behavior validation",
    friction:
      "External review can identify friction, but cannot quantify where users hesitate or drop off.",
    fix:
      "Use GA4/CRM to quantify funnel performance and Clarity/Hotjar to explain behavior with heatmaps, scroll depth, rage/dead clicks and recordings.",
    metric: "Funnel visibility, behavior insights",
    priority: "P1",
  },
];

export const conversionFlow = [
  {
    step: 1,
    label: "Homepage",
    sublabel: "First screen",
    friction: "Offer and audience are not clear enough in the first screen.",
    severity: "high",
  },
  {
    step: 2,
    label: "Offer Clarity",
    sublabel: "Service meaning",
    friction: "Prospects need faster understanding of what Kaizen does and for whom.",
    severity: "high",
  },
  {
    step: 3,
    label: "Proof & Relevance",
    sublabel: "Results + industries",
    friction: "Proof and industry examples are not close enough to CTAs.",
    severity: "high",
  },
  {
    step: 4,
    label: "CTA Decision",
    sublabel: "Growth plan",
    friction: "CTA asks for a free growth plan before enough service clarity or proof.",
    severity: "high",
  },
  {
    step: 5,
    label: "Lead Form",
    sublabel: "Qualification",
    friction: "Service field is too narrow for multi-service prospects.",
    severity: "medium",
  },
  {
    step: 6,
    label: "Post-submit",
    sublabel: "Trust after form",
    friction: "Confirmation copy and autoresponder do not fully support a consultation request.",
    severity: "medium",
  },
  {
    step: 7,
    label: "Measurement",
    sublabel: "Attribution",
    friction: "Lead-submit events and behavior validation need QA.",
    severity: "high",
  },
];

export const roadmap = [
  {
    phase: "Week 1–2",
    tag: "Quick Wins",
    priority: "P0",
    items: [
      "Rewrite hero value proposition",
      "Add secondary CTA to services/results",
      "Move values lower",
      "Add client-logo carousel",
      "Fix YouTube 404",
      "Improve form confirmation copy",
      "Add autoresponder",
      "Configure clear form_submit/generate_lead event",
      "Compress critical images and add ALT text",
    ],
  },
  {
    phase: "Week 3–6",
    tag: "Medium Improvements",
    priority: "P1",
    items: [
      "Add service-specific case-study cards",
      "Restructure industry pages around vertical problems/KPIs",
      "Convert reviews into compact verified-review or stronger testimonial carousel",
      "Improve mobile card density",
      "Change service field to multi-select",
      "Add service-specific CTA framing",
    ],
  },
  {
    phase: "Month 2–3",
    tag: "Strategic Enhancements",
    priority: "P1",
    items: [
      "Build full case-studies/results hub",
      "Create landing-page variants by service and industry",
      "Run A/B tests for hero/CTA/proof placement",
      "Connect GA4 + CRM reporting",
      "Use Clarity/Hotjar to validate scroll, clicks, form hesitation and CTA behavior",
    ],
  },
];

export const expectedImpactMatrix = [
  {
    recommendation: "Hero value proposition + CTA hierarchy",
    effort: "Low",
    impact: "High",
    priority: "P0",
    successMetric: "Hero CTR, bounce, homepage->service CTR",
    effortScore: 1,
    impactScore: 3,
  },
  {
    recommendation: "Client-logo carousel + proof near CTAs",
    effort: "Low/Med",
    impact: "High",
    priority: "P0",
    successMetric: "CTA CTR after proof, form starts",
    effortScore: 1.5,
    impactScore: 3,
  },
  {
    recommendation: "Service-specific case-study cards",
    effort: "Med",
    impact: "High",
    priority: "P1",
    successMetric: "Service-page CTA CTR, lead quality",
    effortScore: 2,
    impactScore: 3,
  },
  {
    recommendation: "Industry pages rebuilt by vertical",
    effort: "Med",
    impact: "High",
    priority: "P1",
    successMetric: "Industry-page bounce, qualified leads",
    effortScore: 2,
    impactScore: 3,
  },
  {
    recommendation: "Mobile performance + image cleanup",
    effort: "Low/Med",
    impact: "High",
    priority: "P0",
    successMetric: "LCP, TBT, Speed Index, mobile CVR",
    effortScore: 1.5,
    impactScore: 3,
  },
  {
    recommendation: "Lead-submit tracking + confirmation UX",
    effort: "Low",
    impact: "High",
    priority: "P0",
    successMetric: "Form submit events, attribution quality",
    effortScore: 1,
    impactScore: 3,
  },
  {
    recommendation: "Verified review / testimonial system",
    effort: "Low/Med",
    impact: "Med/High",
    priority: "P1",
    successMetric: "Review interaction, form CVR",
    effortScore: 1.5,
    impactScore: 2.5,
  },
];

export const validationInputs = [
  {
    label: "Internal Metrics",
    icon: "BarChart2",
    items: [
      "Homepage bounce",
      "Homepage->service CTR",
      "Service-page CTA clicks",
      "Form starts/submits",
      "Consultation booking rate",
      "Lead source by page",
      "Lead quality by service/industry",
      "Mobile vs desktop CVR",
    ],
  },
  {
    label: "Behavioral Analytics",
    icon: "MousePointer",
    items: [
      "Clarity/Hotjar heatmaps and recordings",
      "Hero visibility",
      "Mobile scroll depth",
      "Services card clicks",
      "Testimonial engagement",
      "Form hesitation",
      "Dead/rage clicks",
      "Drop-off before form",
    ],
  },
  {
    label: "Customer Voice",
    icon: "MessageSquare",
    items: [
      "Sales objections",
      "Common prospect questions",
      "Reasons leads do not book",
      "Industries with highest close rate",
      "Client proof/case data available for service and industry pages",
    ],
  },
  {
    label: "Testing Plan",
    icon: "FlaskConical",
    items: [
      "A/B test hero clarity",
      "CTA framing",
      "Proof placement",
      "Service case cards",
      "Industry page structure",
      "Review carousel",
      "Form multi-select",
      "Prioritize P0/P1 by impact vs effort",
    ],
  },
];

export const measurementNote =
  "A quick external spot-check found GTM and GA4 installed, but lead-submit measurement should be validated internally. Analytics should quantify the opportunity; heatmaps/session recordings should explain the behavior. Recommended tools: GA4 and CRM for funnel/lead quality metrics; Microsoft Clarity or Hotjar for behavior validation; PageSpeed/Lighthouse for mobile performance; Google Tag Assistant for tracking QA; Check My Links for broken links; SEO Meta in 1 Click/Detailed SEO for metadata and image checks.";
