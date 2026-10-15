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
