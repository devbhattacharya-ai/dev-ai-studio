import type { Lang } from "./content";
import { localize } from "./localize";
import { PRICING_MR } from "./mr-packs";

export type Currency = "inr" | "usd";

export const WEBSITE_TIERS = [
  { pages: "01", standard: { inr: 9999, usd: 109 }, animated: { inr: 14999, usd: 159 } },
  { pages: "03", standard: { inr: 19900, usd: 219 }, animated: { inr: 34900, usd: 369 } },
  { pages: "05", standard: { inr: 27900, usd: 299 }, animated: { inr: 49900, usd: 529 } },
  { pages: "06+", standard: null, animated: null },
] as const;

export const MOTION_PRICES = [
  { inr: [3000, 5000] as [number, number], usd: [35, 55] as [number, number] },
  { inr: [8000, 15000] as [number, number], usd: [89, 159] as [number, number] },
  { inr: null, usd: null },
] as const;

export const WA_PRICES = [
  { inr: 2900, usd: 35, from: false },
  { inr: 12900, usd: 139, from: true },
  { inr: 19900, usd: 219, from: true },
  { inr: null, usd: null, from: false },
] as const;

export type MoneyValue = number | [number, number] | null;

export type DualMoney = {
  inr: MoneyValue;
  usd: MoneyValue;
  from?: boolean;
};

export const PRICING_COPY = {
  skip: "Skip to pricing",
  nav: { work: "Selected work", services: "Services", pricing: "Pricing" },
  webLabel: "WEBSITE PRICES",
  webTitle: "Website pricing.",
  webIntro: "Starting prices for websites. Choose the size and style that fit your project.",
  currencyLabel: "Highlight currency",
  usdNote:
    "USD amounts are fixed starting prices, not live exchange conversions. The final quote confirms the currency and any applicable taxes or third-party costs.",
  from: "from",
  quoted: "Quoted to scope",
  custom: "Custom quote",
  onePage: "ONE PAGE",
  morePages: "More pages",
  pages: "Pages",
  standard: "Standard",
  animated: "Animated",
  standardTitle: "Standard website",
  standardText:
    "A clear business presence with responsive design, essential search setup and a working enquiry path.",
  animatedTitle: "Animated website",
  animatedText:
    "A tailored hero and planned scroll moments where motion helps explain the product or service.",
  tableNote:
    "Starting prices for standard brochure pages. Custom booking systems, commerce, multilingual copy and 3D assets need a separate quote.",
  motionLabel: "02 / EXTRA MOTION",
  motionSide: "ADDITIONS / MOTION",
  motionTitle: "One more moment, if it earns its place.",
  motionIntro:
    "Every animated build includes the agreed motion scenes. If you want another sequence later, these are the starting ranges.",
  motionRows: [
    ["Additional animated section", "A distinct reveal, transition or interaction in one section."],
    ["Complex scroll sequence", "A longer, carefully timed story across a section."],
    [
      "Interactive 3D",
      "Priced after the model, interactions and mobile fallback are agreed.",
    ],
  ] as [string, string][],
  motionNote:
    "Simple fades and button hovers are part of the site price. A bespoke 3D model, video or paid asset is scoped separately.",
  waLabel: "03 / WHATSAPP AUTOMATION",
  waSide: "SETUP / SEPARATE",
  waTitle: "The conversation is its own project.",
  waIntro:
    "Website prices include a WhatsApp chat link if you want one. Automated replies and lead flows are quoted separately.",
  waRows: [
    ["Business App setup", "Profile, greeting, away message and quick replies. No chatbot."],
    [
      "FAQ + lead capture",
      "Answers agreed questions, collects enquiry details and hands off to a person.",
    ],
    [
      "Booking + follow-up",
      "An agreed appointment or lead journey with reminders or follow-ups.",
    ],
    [
      "Custom AI / CRM flow",
      "Quoted after the data, provider and support needs are clear.",
    ],
  ] as [string, string][],
  waNote:
    "These are one-time setup prices. Ongoing management, WhatsApp Business Platform message charges and any software subscription are separate when required.",
  ctaLabel: "YOUR PROJECT / NEXT STEP",
  ctaTitle: "Need an exact quote?",
  ctaText: "Tell me what you need. I'll confirm the scope and final price.",
  ctaLink: "Discuss my project",
  ctaSr: " (opens WhatsApp in a new tab)",
  footer: "Independent web & automation studio",
  notes: "Privacy & project notes",
  back: "Back to studio",
};

export type PricingCopy = typeof PRICING_COPY;

export function getPricingCopy(lang: Lang): PricingCopy {
  return localize(lang, PRICING_COPY, PRICING_MR) as PricingCopy;
}

export function formatMoney(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "inr" ? "en-IN" : "en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Animated visible amount — Math.round(amount * progress). */
export function formatMoneyProgress(amount: number, currency: Currency, progress: number) {
  return formatMoney(Math.round(amount * progress), currency);
}

function formatOne(
  value: MoneyValue,
  currency: Currency,
  customLabel: string,
  progress = 1
) {
  if (value === null) return customLabel;
  if (Array.isArray(value)) {
    return `${formatMoneyProgress(value[0], currency, progress)}–${formatMoneyProgress(value[1], currency, progress)}`;
  }
  return formatMoneyProgress(value, currency, progress);
}

export function formatPrice(
  price: DualMoney,
  currency: Currency,
  customLabel: string,
  fromLabel: string
) {
  const formatted = formatOne(price[currency], currency, customLabel);
  if (price[currency] === null) return formatted;
  return price.from ? `${fromLabel} ${formatted}` : formatted;
}

/** Live-style single-currency price with optional count-up progress. */
export function formatPriceWithProgress(
  price: DualMoney,
  currency: Currency,
  customLabel: string,
  fromLabel: string,
  progress = 1
) {
  const value = price[currency];
  if (value === null) return customLabel;
  const formatted = formatOne(value, currency, customLabel, progress);
  return price.from ? `${fromLabel} ${formatted}` : formatted;
}

/**
 * Both currencies visible — e.g. "from ₹9,999 / $109".
 * When progress < 1, both sides count up (ranges: both ends × progress).
 * Custom/null: no animation, show custom label.
 */
export function formatDualPrice(
  price: DualMoney,
  customLabel: string,
  fromLabel: string,
  highlight: Currency = "inr",
  progress = 1
) {
  if (price.inr === null && price.usd === null) return customLabel;
  const inr = formatOne(price.inr, "inr", customLabel, progress);
  const usd = formatOne(price.usd, "usd", customLabel, progress);
  const ordered = highlight === "usd" ? `${usd} / ${inr}` : `${inr} / ${usd}`;
  if (price.from) return `${fromLabel} ${ordered}`;
  return ordered;
}

export function dualMoneyPair(
  amounts: { inr: number; usd: number },
  highlight: Currency = "inr",
  progress = 1
) {
  const inr = formatMoneyProgress(amounts.inr, "inr", progress);
  const usd = formatMoneyProgress(amounts.usd, "usd", progress);
  const inrFinal = formatMoney(amounts.inr, "inr");
  const usdFinal = formatMoney(amounts.usd, "usd");
  return highlight === "usd"
    ? {
        primary: usd,
        secondary: inr,
        primaryFinal: usdFinal,
        secondaryFinal: inrFinal,
        primaryCurrency: "usd" as const,
        secondaryCurrency: "inr" as const,
      }
    : {
        primary: inr,
        secondary: usd,
        primaryFinal: inrFinal,
        secondaryFinal: usdFinal,
        primaryCurrency: "inr" as const,
        secondaryCurrency: "usd" as const,
      };
}
