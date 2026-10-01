export const WHATSAPP_NUMBER = "917738400373";
export const PHONE_TEL = "tel:+917738400373";
export const PHONE_DISPLAY = "+91 77384 00373";

export const WA_PRIMARY =
  "https://wa.me/917738400373?text=" +
  encodeURIComponent(
    "Hi Dev, I want to discuss an AI website or WhatsApp automation for my business."
  );

export const WA_PRIMARY_MR =
  "https://wa.me/917738400373?text=" +
  encodeURIComponent(
    "नमस्कार Dev, मला माझ्या व्यवसायासाठी AI वेबसाइट किंवा WhatsApp ऑटोमेशनबद्दल चर्चा करायची आहे."
  );

export function waPrimary(lang: "en" | "mr" = "en") {
  return lang === "mr" ? WA_PRIMARY_MR : WA_PRIMARY;
}

export function waPricing(currency: "inr" | "usd", lang: "en" | "mr") {
  const text =
    lang === "mr"
      ? `नमस्कार Dev, मी वेबसाइट आणि WhatsApp ऑटोमेशनच्या ${currency.toUpperCase()} किंमती पाहिल्या. मला माझ्या प्रोजेक्टबद्दल बोलायचे आहे.`
      : `Hi Dev, I saw your website and WhatsApp automation prices in ${currency.toUpperCase()}. I'd like to discuss a quote for my project.`;
  return `https://wa.me/917738400373?text=${encodeURIComponent(text)}`;
}

/** Live case prefill is EN-only in source; keep EN template. */
export function waCase(title: string) {
  return (
    "https://wa.me/917738400373?text=" +
    encodeURIComponent(
      `Hi Dev, I saw the ${title} concept case study. I would like to discuss a website for my business.`
    )
  );
}

/** Live demo prefill uses EN template with localized scenario name. */
export function waDemo(scenario: string) {
  return (
    "https://wa.me/917738400373?text=" +
    encodeURIComponent(
      `Hi Dev, I tried the ${scenario} automation simulation on your website. I would like to discuss a similar WhatsApp enquiry flow for my business.`
    )
  );
}

export const WA_CONTACT_PLAIN = "https://wa.me/917738400373";
