import { CASES } from "./cases";

export type Lang = "en" | "mr";

export const META = {
  title: "Dev AI Websites & WhatsApp Automation",
  description:
    "AI-powered websites and WhatsApp enquiry automation for businesses in Kharghar, Navi Mumbai and across India. Work directly with Dev from idea to launch.",
  ogTitle: "Dev AI Websites & WhatsApp Automation",
  ogDescription: "Websites that earn attention. Automation that keeps it.",
  ogSiteName: "DEV / AI STUDIO",
  ogImageAlt: "DEV / AI STUDIO — AI websites and WhatsApp automation",
};

export const HOME = {
  skip: "Skip to main content",
  nav: { work: "Work", services: "Services", demo: "Demo", pricing: "Pricing", talk: "Let's talk" },
  motion: { resume: "Resume motion", pause: "Pause motion", reduced: "Reduced motion" },
  fab: "Plan your project",
  waChip: "Chat on WhatsApp",
  hero: {
    eyebrow: "AI websites + WhatsApp automation",
    location: "KHARGHAR, INDIA / WORKING EVERYWHERE",
    lines: ["GOOD DESIGN.", "REAL", "CONVERSATIONS."] as const,
    coordinate: "DESIGN + AUTOMATE",
    ctaWork: "Explore the work",
    body: "AI-powered websites and WhatsApp automation. Built to make your business easier to choose — and easier to reach.",
    ctaPrimary: "Start a conversation",
    scroll: "Scroll to explore",
  },
  about: {
    label: "INDEPENDENT STUDIO.\nCONNECTED THINKING.",
    cta: "What I can build",
    h2: "Your website makes the first impression. What happens next matters just as much.",
    body: "I'm Devroop. I build websites and WhatsApp journeys that turn interest into enquiries. You work directly with me—from idea to launch.",
  },
  work: {
    meta: "01 / SELECTED DEMOS",
    year: "2026",
    h2: "Selected Works",
    subtitle: "Designed websites. Clear purpose.",
    description:
      "Five concept websites. Different businesses, the same attention to how people discover, explore and enquire.",
    footnote: "CONCEPT WORK / EXPLORE THE LIVE SITES",
    badgeConcept: "CONCEPT PROJECT",
    badgeNew: "NEW",
    cards: CASES.map((c, i) => ({
      slug: c.slug,
      number: `${String(i + 1).padStart(2, "0")} / CONCEPT PROJECT`,
      title: c.homeTitle,
      blurb: c.homeCard.en,
      image: c.image,
      isNew: c.slug === "nutty",
    })),
  },
  bridge: {
    h2: "A good website starts the conversation.",
    body: "Clear design helps people understand your business. A simpler enquiry journey helps them take the next step.",
  },
  services: {
    meta: "02 / WHAT I BUILD",
    metaSide: "WEB + WHATSAPP",
    h2: ["GOOD ON THEIR OWN.", "BETTER TOGETHER."] as const,
    subhead: "A website that earns attention. A conversation that moves it forward.",
    tiers: [
      {
        number: "01",
        name: "AI-powered websites",
        body: "Fast, modern websites designed to turn visitors into enquiries—not just sit online looking pretty.",
        items: ["Landing pages", "Business websites", "Appointment & lead flows"],
        cta: "Start a conversation",
      },
      {
        number: "02",
        name: "WhatsApp automation",
        body: "Automated conversations that answer questions, qualify leads and follow up while you focus on the business.",
        items: ["Instant lead replies", "FAQs & qualification", "Reminders & follow-ups"],
        cta: "Start a conversation",
      },
    ],
    pricingLink: "See starting prices",
  },
  outcomes: {
    label: "WHY IT WORKS",
    h3: "Designed around the next step.",
    items: [
      ["Look credible", "Give customers a clear, premium first impression on every screen."],
      ["Capture intent", "Guide visitors towards one simple action instead of making them search."],
      ["Reply instantly", "Keep warm leads moving even when you are busy or offline."],
    ] as [string, string][],
  },
  demo: {
    meta: "IN PRACTICE / INTERACTIVE DEMO",
    metaSide: "NO PERSONAL DETAILS NEEDED",
    h2: ["ONE ENQUIRY.", "A CLEAR NEXT STEP."] as const,
    body: "See how a customer question becomes an organised enquiry. Choose a business and try a short customer conversation.",
    steps: ["Understand the enquiry", "Ask relevant questions", "Prepare a team handoff"],
    disclaimer:
      "Browser simulation—not a connected WhatsApp bot. Nothing is sent or saved, and no appointment is booked. A live service requires a separate WhatsApp setup.",
    pickerAria: "Choose a business",
    scenarios: ["Clinic", "Restaurant", "Local service"] as const,
    panelSub: "SAMPLE CONVERSATION",
    panelTitle: "From question to request",
    restartAria: "Restart demo",
    automatedLabel: "AUTOMATED REPLY",
    youLabel: "YOU",
    handoffLabel: "ENQUIRY READY FOR THE TEAM",
    handoffH3: "Next: a human conversation.",
    handoffNote:
      "The team would confirm availability and arrange the next step. This is a demo request only.",
    cta: "Discuss this flow with Dev",
    ctaNote: "Opens WhatsApp. Review the message before sending.",
    trees: [
      [
        {
          question: "Hello! What would you like to enquire about?",
          choices: ["Routine check-up", "Teeth cleaning", "Treatment information"],
        },
        {
          question: "Will this be your first visit?",
          choices: ["Yes, first visit", "No, returning patient"],
        },
        {
          question: "When would you prefer a callback?",
          choices: ["Morning", "Afternoon", "Evening"],
        },
      ],
      [
        {
          question: "What can we help you with?",
          choices: ["Explore the menu", "Table enquiry", "Takeaway"],
        },
        {
          question: "How many people is this for?",
          choices: ["1–2 people", "3–4 people", "5 or more"],
        },
        {
          question: "When are you planning for?",
          choices: ["Today", "Tomorrow", "Just exploring"],
        },
      ],
      [
        {
          question: "What would you like help with?",
          choices: ["A new service", "A quote", "Help with existing work"],
        },
        {
          question: "Where do you need the service?",
          choices: ["Kharghar", "Navi Mumbai", "Another area"],
        },
        {
          question: "When would you like to start?",
          choices: ["This week", "This month", "Exploring options"],
        },
      ],
    ],
  },
  process: {
    meta: "03 / A SIMPLE PROCESS",
    metaSide: "DIRECT. COLLABORATIVE. CLEAR.",
    h2: ["FROM FIRST IDEA", "TO OPEN FOR BUSINESS."] as const,
    steps: [
      ["Understand", "A short call to map your business, customers and the result you need."],
      ["Build", "Your website and WhatsApp flow are designed, written and connected."],
      ["Launch", "You review the experience, then we go live with a clean handover."],
    ] as [string, string][],
  },
  scope: {
    label: "WHAT YOUR PROJECT INCLUDES",
    h3: "Every detail, agreed.",
    intro:
      "Your proposal defines the work before payment, so you know what is included, what happens next and which costs sit outside the project.",
    items: [
      ["Focused website", "Responsive pages, clear copy structure and one primary enquiry action."],
      [
        "Lead-ready WhatsApp flow",
        "Prepared enquiry messages and qualifying questions designed around your business.",
      ],
      [
        "Launch & handover",
        "Launch guidance, final project files and account ownership agreed in writing.",
      ],
      [
        "Scope before payment",
        "Timeline, revision rounds, support and any paid tools confirmed in your proposal.",
      ],
    ] as [string, string][],
    note: "Domain, hosting, WhatsApp Business Platform/API usage and paid third-party tools are separate when your project needs them.",
  },
  faq: {
    meta: "04 / CLEAR ANSWERS",
    h2: ["BEFORE", "WE BEGIN."] as const,
    items: [
      [
        "What will I receive?",
        "Before work begins, your proposal lists the pages, website features, WhatsApp flow, copy responsibilities, integrations and handover items included in your project.",
      ],
      [
        "How long will the project take?",
        "Timing depends on the page count, content readiness and automation complexity. You receive a written delivery timeline before payment.",
      ],
      [
        "How do revisions work?",
        "Revision rounds and what counts as a revision are defined in the proposal, so the scope stays clear for both of us.",
      ],
      [
        "Will I own the website?",
        "Ownership of the approved final files and the accounts used for your domain, hosting and tools is confirmed in the proposal and handover.",
      ],
      [
        "Are there additional costs?",
        "Domain, hosting, WhatsApp Business Platform/API usage and paid third-party tools are separate when required. Every known cost is disclosed before you approve the project.",
      ],
      [
        "How is payment handled?",
        "The proposal lists the payment amount, milestones and due dates. Work begins only after you approve the scope and the agreed first payment is received.",
      ],
      [
        "What happens after launch?",
        "Your proposal states the launch-support period and any ongoing update or maintenance plan. Continued support is included only when it is written into the scope.",
      ],
    ] as [string, string][],
  },
  contact: {
    meta: "05 / READY WHEN YOU ARE",
    h2: ["LET'S MAKE", "SOMETHING", "USEFUL."] as const,
    body: "Tell me what you sell and where you're getting stuck. I'll help you find the simplest useful solution.",
    ctaWhatsapp: "Chat with Dev on WhatsApp",
    ctaCall: "Call Dev",
    phone: "+91 77384 00373",
  },
  footer: {
    wordmark: "DEV / AI STUDIO",
    tagline: "Independent web & automation studio",
    pricing: "Pricing",
    notes: "Privacy & project notes",
    backTop: "Back to top ↑",
  },
  assistant: {
    label: "PROJECT GUIDE",
    title: "Let's find your starting point.",
    close: "Close project guide",
    description: "Answer three quick questions and I'll prepare your WhatsApp enquiry.",
    needPrompt: "What do you need help with?",
    needs: [
      "A new business website",
      "Website redesign",
      "WhatsApp automation",
      "Website + automation",
    ],
    timelinePrompt: "When would you like to get started?",
    timelines: ["As soon as possible", "Within 2–4 weeks", "Just exploring"],
    detailsPrompt: "Last step — where can Dev reach you?",
    nameLabel: "Your name",
    phoneLabel: "Your phone number",
    prepare: "Continue on WhatsApp",
    back: "Back",
    disclaimer: "No spam. Your details stay in this browser until you continue on WhatsApp.",
    stepLabel: "Step",
    nameError: "Please enter your name.",
    phoneError: "Enter a valid phone number with 10–15 digits.",
  },
};

export const CASE_CHROME = {
  selectedWork: "Selected work",
  label: "PROJECT STORY / CONCEPT",
  badgeSelf: "Self-initiated demo",
  previewLabel: "DESKTOP PREVIEW / ORIGINAL COLOURS",
  problemLabel: "01 / BUSINESS PROBLEM",
  problemH: "Make the first step easier.",
  solutionLabel: "02 / SOLUTION & FEATURES",
  solutionH: "Every detail has a job.",
  exploreLabel: "03 / EXPLORE THE EXPERIENCE",
  exploreH: "Take a closer look.",
  exploreBody:
    "Open the original website on your phone or desktop to explore the layout and interactions.",
  exploreLive: "View live website",
  exploreLiveSr: " (opens in a new tab)",
  liveFallback: "Preview only — live demo unavailable",
  exploreDemo: "Try the automation demo →",
  outcomeLabel: "04 / EXPECTED OUTCOME",
  outcomeH: "A clear goal. An honest baseline.",
  disclaimer:
    "This is a concept project. These are design goals, not a client endorsement or measured business results.",
  nextLabel: "YOUR BUSINESS / NEXT",
  nextH: "Let's talk about your project.",
  nextCta: "Start a conversation",
  nextCtaSr: " (opens WhatsApp in a new tab)",
  back: "Back to all work →",
};

export const NOTES = {
  back: "← Back to home",
  label: "GOOD TO KNOW",
  h1: "PRIVACY & PROJECT NOTES.",
  sections: [
    [
      "Your enquiry details",
      "Details entered in the project form are used to prepare a WhatsApp message. You can review it before sending. The form does not create an enquiry database on this website.",
    ],
    [
      "Demos and preferences",
      "Sample conversation answers are temporary browser state. You can pause decorative motion using the motion control.",
    ],
    [
      "WhatsApp and external websites",
      "Opening WhatsApp or a live demo takes you to another service with its own privacy practices. Please keep sensitive personal or health information out of sample conversations.",
    ],
    [
      "Before a project starts",
      "Scope, timing, revision rounds, handover, support and any third-party tools will be agreed in the proposal. Information on this website is not itself a contract or a guaranteed delivery timeline.",
    ],
    [
      "Concept projects",
      "Portfolio demos illustrate design and interaction. They do not represent client endorsements or verified business results.",
    ],
    [
      "Questions or requests",
      "For questions about information you have shared in an enquiry or about a project, contact Dev using the WhatsApp link below.",
    ],
  ] as [string, string][],
  cta: "Contact Dev ↗",
};
