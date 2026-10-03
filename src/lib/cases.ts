import { CASE_MR, HOME_CARD_MR } from "./mr-packs";

export type CaseCopy = {
  sector: string;
  deck: string;
  problem: string;
  solution: string;
  features: [string, string][];
  outcome: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  homeTitle: string;
  image: string;
  url: string;
  homeCard: { en: string };
  en: CaseCopy;
};

export const CASES: CaseStudy[] = [
  {
    slug: "rowdy-momo",
    title: "ROWDY MOMO.",
    homeTitle: "Rowdy Momo Cafe",
    image: "/demo-rowdy-momo.jpg",
    url: "https://rowdy-momo-cafe.vercel.app/",
    homeCard: {
      en: "A dark café site. The steamer leads, the menu scrolls with you, and order or reserve is one tap.",
    },
    en: {
      sector: "Nepali café / Bandra West",
      deck: "A loud, food-first café site. Steam, plates, and a table you can book.",
      problem:
        "A momo counter gets lost when the menu, the story, and the way to order sit on different pages. People on a phone want the plate first, then a way to order or find the room.",
      solution:
        "A dark, poster-led website puts the steamer up front, then a scroll-linked menu, the café story, and a reserve form in one journey.",
      features: [
        ["Food-led identity", "Studio plates of steam, jhol, crisp, and cold coffee carry the brand."],
        ["Scroll menu", "The platter moves with the scroll, so the menu feels like a counter, not a list."],
        ["Order and reserve", "One red Order button and a reserve form keep the next step obvious."],
      ],
      outcome:
        "The aim is to take someone from the hero plate to an order or a reserved table. Menu opens, order taps, and reserve sends would be the live measures.",
    },
  },
  {
    slug: "smile-dental",
    title: "SMILE DENTAL CLINIC.",
    homeTitle: "Smile Dental Clinic",
    image: "/demo-smile-dental.jpg",
    url: "https://smile-dental-dev-eaee.vercel.app/",
    homeCard: {
      en: "A bilingual clinic site with a clear appointment journey.",
    },
    en: {
      sector: "Healthcare / Kharghar",
      deck: "From treatment research to a clearer appointment enquiry.",
      problem:
        "Someone exploring dental care needs to understand the treatments, find clinic information and know how to request an appointment. Scattered information can make that first step harder than it needs to be.",
      solution:
        "A bilingual clinic website brings treatment information and a guided enquiry into one journey, with contact actions close at hand.",
      features: [
        ["Treatment discovery", "Organised treatment information gives visitors a useful starting point."],
        ["English + Marathi", "The same journey supports two reading preferences."],
        [
          "Guided enquiry",
          "A structured request continues on WhatsApp. The clinic confirms availability separately.",
        ],
      ],
      outcome:
        "The design aims to make treatment research easier and enquiries more useful to the clinic. In a client project, enquiry completion and confirmed appointments would help evaluate the result.",
    },
  },
  {
    slug: "afterdark",
    title: "AFTERDARK.",
    homeTitle: "AFTERDARK",
    image: "/demo-afterdark.jpg",
    url: "https://afterdark-dev-eaee.vercel.app/",
    homeCard: {
      en: "A cinematic product story for a dark chocolate concept.",
    },
    en: {
      sector: "Chocolate / Brand concept",
      deck: "A product story you can feel as you scroll.",
      problem:
        "A premium chocolate concept needs to communicate character before a visitor can taste it. The challenge is to make the product memorable while keeping its story and choices readable.",
      solution:
        "A cinematic, dark product experience uses chocolate imagery, restrained typography and scroll-led storytelling to introduce the brand and its flavours.",
      features: [
        ["Product-first imagery", "Chocolate remains the focal point throughout the experience."],
        [
          "Scroll storytelling",
          "Motion introduces the product in stages instead of competing with every line of copy.",
        ],
        [
          "Distinct flavour profiles",
          "Bold, roasted and silky profiles give visitors clear points of comparison.",
        ],
      ],
      outcome:
        "The aim is stronger product understanding and a memorable brand impression. Product exploration and onward actions would be useful measures in a live commercial project.",
    },
  },
  {
    slug: "pink-static",
    title: "PINK STATIC.",
    homeTitle: "Pink Static",
    image: "/demo-pink-static.jpg",
    url: "https://pink-static-dev-eaee.vercel.app/",
    homeCard: {
      en: "A graphic streetwear storefront with a campaign-led collection.",
    },
    en: {
      sector: "Streetwear / Storefront concept",
      deck: "An oversized streetwear drop with a visual identity that refuses to blend in.",
      problem:
        "A fashion concept needs to show the clothes and establish its character at a glance. Visitors should still be able to browse the collection, inspect a piece and understand how the demo bag works.",
      solution:
        "A graphic campaign hero leads into a browsable collection, product previews, category routes and a colour selector. The bag is a demo interaction; the site does not collect payments.",
      features: [
        [
          "Campaign-led first impression",
          "Oversized type and model photography give the streetwear concept a clear identity.",
        ],
        [
          "Collection discovery",
          "Visitors can explore eight concept pieces, categories and product previews.",
        ],
        [
          "Demo shopping journey",
          "A colour selector and shopping bag let visitors try the flow without making a payment.",
        ],
      ],
      outcome:
        "The goal is to make the brand memorable while keeping product exploration understandable. Collection engagement and onward actions would be useful measures if this were developed into a live store.",
    },
  },
  {
    slug: "nutty",
    title: "NUTTY.",
    homeTitle: "Nutty",
    image: "/demo-nutty.jpg",
    url: "https://nutty-dev-eaee.vercel.app/",
    homeCard: {
      en: "A bold peanut butter concept with product storytelling and a demo cart.",
    },
    en: {
      sector: "Food / Product concept",
      deck: "A bright peanut butter identity built around the breakfast moment.",
      problem:
        "A product concept needs to show what it is, why someone might try it and where to explore the jar. The first screen has to make the product visible while keeping the path to its details clear.",
      solution:
        "A bold yellow and black homepage presents the jar, key product information and breakfast ideas. A separate product page gives the Creamy variant its own space, with a local cart preview.",
      features: [
        [
          "Product-led hero",
          "The jar and a direct path to the product page anchor the first screen.",
        ],
        [
          "Responsive storytelling",
          "Breakfast imagery, ingredient information and serving ideas adapt across screen sizes.",
        ],
        [
          "Demo product journey",
          "INR pricing, quantity controls and a local cart preview demonstrate the flow without payment collection.",
        ],
      ],
      outcome:
        "The goal is to make the concept memorable and product exploration straightforward. A real brand would need to verify product claims and pricing before using this as a commercial store.",
    },
  },
];


export function getCase(slug: string) {
  return CASES.find((c) => c.slug === slug);
}

export function getCaseCopy(study: CaseStudy, lang: "en" | "mr"): CaseCopy {
  const mr = CASE_MR[study.slug];
  if (lang === "mr" && mr) return mr;
  return study.en;
}

export function homeCardBlurb(study: CaseStudy, lang: "en" | "mr"): string {
  if (lang === "mr" && HOME_CARD_MR[study.slug]) return HOME_CARD_MR[study.slug];
  return study.homeCard.en;
}

export const CASE_SLUGS = CASES.map((c) => c.slug);
