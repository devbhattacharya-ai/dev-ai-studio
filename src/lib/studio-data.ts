export type RangeKey = "7d" | "30d" | "90d";

export type StudioSnapshot = {
  range: RangeKey;
  label: string;
  fromLabel: string;
  toLabel: string;
  visitors: number;
  visitorsDelta: number;
  sessions: number;
  pageviews: number;
  bounce: number;
  bounceDelta: number;
  avgSeconds: number;
  avgSecondsDelta: number;
  liveBase: number;
  whatsapp: number;
  pricingViews: number;
  activity: { label: string; users: number }[];
  sources: { name: string; count: number }[];
  pages: { path: string; title: string; views: number; avgSeconds: number; bounce: number; note: string }[];
  cities: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  channels: { name: string; sessions: number; share: number }[];
  funnel: { name: string; count: number }[];
};

const RANGES: RangeKey[] = ["7d", "30d", "90d"];
const DAYS: Record<RangeKey, number> = { "7d": 7, "30d": 30, "90d": 90 };
const LABELS: Record<RangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PAGES = [
  { path: "/", title: "Home", weight: 0.28, time: 98, bounce: 0.41, note: "Hero and selected work" },
  { path: "/pricing", title: "Pricing", weight: 0.16, time: 81, bounce: 0.24, note: "Watch WhatsApp after this" },
  { path: "/#work", title: "Selected work", weight: 0.14, time: 134, bounce: 0.34, note: "Case tiles" },
  { path: "/work/smile-dental", title: "Smile Dental", weight: 0.09, time: 168, bounce: 0.28, note: "Clinic demo" },
  { path: "/work/pink-static", title: "Pink Static", weight: 0.08, time: 146, bounce: 0.33, note: "Streetwear concept" },
  { path: "/work/rowdy-momo", title: "Rowdy Momo", weight: 0.07, time: 121, bounce: 0.39, note: "Cafe demo" },
  { path: "/#about", title: "About", weight: 0.06, time: 72, bounce: 0.52, note: "Studio story" },
  { path: "/work/afterdark", title: "AFTERDARK", weight: 0.05, time: 139, bounce: 0.44, note: "Nightlife concept" },
  { path: "/work/nutty", title: "Nutty", weight: 0.04, time: 104, bounce: 0.46, note: "Food concept" },
  { path: "/whatsapp", title: "WhatsApp handoff", weight: 0.03, time: 22, bounce: 0.18, note: "Conversation started" },
];

function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function allocate(total: number, weights: number[]) {
  const raw = weights.map((weight) => weight * total);
  const floors = raw.map((value) => Math.floor(value));
  let left = total - floors.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < left; i++) floors[order[i % order.length].index] += 1;
  return floors;
}

function build(range: RangeKey, now: Date): StudioSnapshot {
  const days = DAYS[range];
  const end = new Date(now);
  end.setHours(12, 0, 0, 0);
  const rand = mulberry32(hash(`devai:${range}:${end.toDateString()}`));
  const activity: { label: string; users: number }[] = [];
  let visitors = 0;
  let prevVisitors = 0;
  let bounceSum = 0;
  let prevBounce = 0;
  let secondsSum = 0;
  let prevSeconds = 0;

  for (let i = 0; i < days * 2; i++) {
    const date = new Date(end);
    date.setDate(end.getDate() - (days * 2 - 1 - i));
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const progress = i / (days * 2 - 1);
    const users = Math.max(
      40,
      Math.round((weekend ? 120 : 176) * (0.74 + progress * 0.42) + Math.sin(i / 3.3) * 18 + (rand() - 0.5) * 30),
    );
    const bounce = 0.46 - progress * 0.08;
    const seconds = 136 + progress * 30;
    const current = i >= days;
    if (current) {
      visitors += users;
      bounceSum += bounce;
      secondsSum += seconds;
      const label =
        days <= 7
          ? `${WEEKDAYS[date.getDay()]} ${date.getDate()}`
          : `${date.getDate()} ${MONTHS[date.getMonth()]}`;
      activity.push({ label, users });
    } else {
      prevVisitors += users;
      prevBounce += bounce;
      prevSeconds += seconds;
    }
  }

  const bounce = bounceSum / days;
  const avgSeconds = secondsSum / days;
  const sessions = Math.round(visitors * 1.08);
  const pageviews = Math.round(visitors * 2.4);
  const pageCounts = allocate(pageviews, PAGES.map((page) => page.weight));
  const pages = PAGES.map((page, index) => ({
    path: page.path,
    title: page.title,
    views: pageCounts[index] ?? 0,
    avgSeconds: page.time,
    bounce: page.bounce,
    note: page.note,
  }));
  const channelWeights = [0.46, 0.21, 0.14, 0.08, 0.06, 0.05];
  const channelNames = ["Organic search", "Direct", "Instagram", "WhatsApp", "Google Business", "Referral"];
  const channelCounts = allocate(sessions, channelWeights);
  const channels = channelNames.map((name, index) => ({
    name,
    sessions: channelCounts[index] ?? 0,
    share: sessions ? (channelCounts[index] ?? 0) / sessions : 0,
  }));
  const cityCounts = allocate(visitors, [0.31, 0.16, 0.13, 0.09, 0.08, 0.08, 0.06, 0.09]);
  const cities = ["Mumbai", "Navi Mumbai", "Pune", "Thane", "Delhi", "Bengaluru", "Hyderabad", "Other"].map(
    (name, index) => ({ name, count: cityCounts[index] ?? 0 }),
  );
  const deviceCounts = allocate(visitors, [0.71, 0.24, 0.05]);
  const devices = ["Mobile", "Desktop", "Tablet"].map((name, index) => ({
    name,
    count: deviceCounts[index] ?? 0,
  }));
  const viewedWork = Math.round(visitors * 0.5);
  const openedPricing = Math.round(viewedWork * 0.44);
  const whatsapp = Math.round(openedPricing * 0.32);
  const first = new Date(end);
  first.setDate(end.getDate() - (days - 1));

  return {
    range,
    label: LABELS[range],
    fromLabel: `${first.getDate()} ${MONTHS[first.getMonth()]}`,
    toLabel: `${end.getDate()} ${MONTHS[end.getMonth()]}`,
    visitors,
    visitorsDelta: prevVisitors ? ((visitors - prevVisitors) / prevVisitors) * 100 : 0,
    sessions,
    pageviews,
    bounce,
    bounceDelta: (bounce - prevBounce / days) * 100,
    avgSeconds,
    avgSecondsDelta: avgSeconds - prevSeconds / days,
    liveBase: Math.max(4, Math.round((activity.at(-1)?.users ?? 80) / 14)),
    whatsapp,
    pricingViews: pages.find((page) => page.path === "/pricing")?.views ?? 0,
    activity,
    sources: [
      { name: "Organic search", count: channels[0].sessions },
      { name: "Direct", count: channels[1].sessions },
      { name: "Social", count: channels[2].sessions + channels[3].sessions },
      { name: "Referral", count: channels[4].sessions + channels[5].sessions },
    ],
    pages,
    cities,
    devices,
    channels,
    funnel: [
      { name: "Visited the site", count: visitors },
      { name: "Viewed work", count: viewedWork },
      { name: "Opened pricing", count: openedPricing },
      { name: "Started WhatsApp", count: whatsapp },
    ],
  };
}

export function buildStudioBoard(now = new Date()) {
  return Object.fromEntries(RANGES.map((range) => [range, build(range, now)])) as Record<RangeKey, StudioSnapshot>;
}
