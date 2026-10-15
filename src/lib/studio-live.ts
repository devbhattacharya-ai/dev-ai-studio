import { createSign } from "node:crypto";
import type { RangeKey, StudioSnapshot } from "@/lib/studio-data";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LABELS: Record<RangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};
const DAYS: Record<RangeKey, number> = { "7d": 7, "30d": 30, "90d": 90 };

type ServiceAccount = { client_email: string; private_key: string };
type GaRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type GaReport = { rows?: GaRow[] };

let tokenCache: { value: string; exp: number } | null = null;
let boardCache: { at: number; board: Record<RangeKey, StudioSnapshot> } | null = null;

function readEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function account(): ServiceAccount {
  let raw = readEnv("GA4_SERVICE_ACCOUNT");
  if (!raw) throw new Error("Google Analytics is not connected yet.");
  if (!raw.startsWith("{")) raw = Buffer.from(raw, "base64").toString("utf8");
  const parsed = JSON.parse(raw) as ServiceAccount;
  if (!parsed.client_email || !parsed.private_key) throw new Error("Google Analytics key is incomplete.");
  parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  return parsed;
}

function propertyId() {
  const id = readEnv("GA4_PROPERTY_ID").replace(/\D/g, "");
  if (!id) throw new Error("Google Analytics property is not set.");
  return id;
}

function explain(status: number, body: string) {
  if (body.includes("SERVICE_DISABLED") || body.includes("has not been used")) {
    return "The Google Analytics Data API is still off. In Google Cloud, open APIs, enable Google Analytics Data API, wait a minute, then reload.";
  }
  if (status === 403) return "Google refused this key. The service account needs Viewer access on the property.";
  return "Google Analytics did not return numbers. Reload in a minute.";
}

async function accessToken() {
  if (tokenCache && tokenCache.exp > Date.now() + 60_000) return tokenCache.value;
  const sa = account();
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: sa.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");
  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const assertion = `${header}.${payload}.${sign.sign(sa.private_key).toString("base64url")}`;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(explain(res.status, text));
  const value = (JSON.parse(text) as { access_token?: string }).access_token;
  if (!value) throw new Error("Google Analytics did not return a token.");
  tokenCache = { value, exp: Date.now() + 50 * 60 * 1000 };
  return value;
}

async function ga(token: string, method: string, body: unknown) {
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId()}:${method}`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(explain(res.status, text));
  return JSON.parse(text) as { reports?: GaReport[]; rows?: GaRow[] };
}

function num(value: string | undefined) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function met(row: GaRow | undefined, index: number) {
  return num(row?.metricValues?.[index]?.value);
}

function dim(row: GaRow, index: number) {
  return row.dimensionValues?.[index]?.value ?? "";
}

function dated(yyyymmdd: string) {
  if (yyyymmdd.length < 8) return yyyymmdd;
  const day = Number(yyyymmdd.slice(6, 8));
  const month = MONTHS[Number(yyyymmdd.slice(4, 6)) - 1] ?? "";
  return `${day} ${month}`;
}

function windows(days: number) {
  return {
    current: { startDate: `${days - 1}daysAgo`, endDate: "today" },
    previous: { startDate: `${days * 2 - 1}daysAgo`, endDate: `${days}daysAgo` },
  };
}

function pair(report: GaReport | undefined, metricIndex: number) {
  const rows = report?.rows ?? [];
  const current = rows.find((row) => row.dimensionValues?.some((item) => item.value === "date_range_0"));
  const previous = rows.find((row) => row.dimensionValues?.some((item) => item.value === "date_range_1"));
  return {
    current: met(current ?? rows[0], metricIndex),
    previous: met(previous ?? rows[1], metricIndex),
  };
}

async function snapshot(token: string, range: RangeKey, liveBase: number): Promise<StudioSnapshot> {
  const days = DAYS[range];
  const { current, previous } = windows(days);
  const [core, extra] = await Promise.all([
    ga(token, "batchRunReports", {
      requests: [
        {
          dateRanges: [current, previous],
          metrics: [
            { name: "activeUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
            { name: "bounceRate" },
            { name: "averageSessionDuration" },
          ],
        },
        {
          dateRanges: [current],
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
          limit: "100",
        },
        {
          dateRanges: [current],
          dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
          metrics: [{ name: "screenPageViews" }, { name: "userEngagementDuration" }, { name: "bounceRate" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: "12",
        },
        {
          dateRanges: [current],
          dimensions: [{ name: "city" }],
          metrics: [{ name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: "8",
        },
        {
          dateRanges: [current],
          dimensions: [{ name: "deviceCategory" }],
          metrics: [{ name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        },
      ],
    }),
    ga(token, "batchRunReports", {
      requests: [
        {
          dateRanges: [current],
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: "8",
        },
        {
          dateRanges: [current],
          dimensions: [{ name: "sessionSource" }],
          metrics: [{ name: "sessions" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: "4",
        },
        {
          dateRanges: [current],
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
          dimensionFilter: {
            filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/work" } },
          },
        },
        {
          dateRanges: [current],
          metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
          dimensionFilter: {
            filter: { fieldName: "pagePath", stringFilter: { matchType: "EXACT", value: "/pricing" } },
          },
        },
      ],
    }),
  ]);
  const reports = [...(core.reports ?? []), ...(extra.reports ?? [])];
  const visitors = pair(reports[0], 0);
  const sessions = pair(reports[0], 1);
  const pageviews = pair(reports[0], 2);
  const bounce = pair(reports[0], 3);
  const duration = pair(reports[0], 4);
  const activity = (reports[1]?.rows ?? []).map((row) => ({
    label: dated(dim(row, 0)),
    users: met(row, 0),
  }));
  const pages = (reports[2]?.rows ?? [])
    .map((row) => {
      const views = met(row, 0);
      return {
        path: dim(row, 0) || "/",
        title: dim(row, 1) || "Untitled",
        views,
        avgSeconds: views ? met(row, 1) / views : 0,
        bounce: met(row, 2),
        note: "",
      };
    })
    .filter((page) => !page.path.startsWith("/studio"));
  const cities = (reports[3]?.rows ?? []).map((row) => ({ name: dim(row, 0) || "Unknown", count: met(row, 0) }));
  const devices = (reports[4]?.rows ?? []).map((row) => {
    const raw = dim(row, 0) || "Unknown";
    return { name: raw.charAt(0).toUpperCase() + raw.slice(1), count: met(row, 0) };
  });
  const channelRows = reports[5]?.rows ?? [];
  const channelTotal = channelRows.reduce((sum, row) => sum + met(row, 0), 0);
  const channels = channelRows.map((row) => {
    const sessions = met(row, 0);
    return {
      name: dim(row, 0) || "Unassigned",
      sessions,
      share: channelTotal ? sessions / channelTotal : 0,
    };
  });
  const sources = (reports[6]?.rows ?? []).map((row) => ({ name: dim(row, 0) || "Unknown", count: met(row, 0) }));
  const workViews = (reports[7]?.rows ?? []).reduce((sum, row) => sum + met(row, 0), 0);
  const pricingViews = (reports[8]?.rows ?? []).reduce((sum, row) => sum + met(row, 0), 0);
  const whatsapp = await whatsappClicks(token, current);

  return {
    range,
    label: LABELS[range],
    fromLabel: activity[0]?.label ?? LABELS[range],
    toLabel: activity.at(-1)?.label ?? "Today",
    visitors: visitors.current,
    visitorsDelta: visitors.previous ? ((visitors.current - visitors.previous) / visitors.previous) * 100 : 0,
    sessions: sessions.current,
    pageviews: pageviews.current,
    bounce: bounce.current,
    bounceDelta: (bounce.current - bounce.previous) * 100,
    avgSeconds: duration.current,
    avgSecondsDelta: duration.current - duration.previous,
    liveBase,
    whatsapp,
    pricingViews,
    activity,
    sources,
    pages,
    cities,
    devices,
    channels,
    funnel: [
      { name: "Visited the site", count: visitors.current },
      { name: "Viewed work", count: workViews },
      { name: "Opened pricing", count: pricingViews },
      { name: "Clicked out", count: whatsapp },
    ],
  };
}

async function eventCount(
  token: string,
  current: { startDate: string; endDate: string },
  extra?: { fieldName: string; value: string },
) {
  const expressions = [
    { filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "click" } } },
  ];
  if (extra) {
    expressions.push({
      filter: { fieldName: extra.fieldName, stringFilter: { matchType: "CONTAINS", value: extra.value } },
    });
  }
  const report = await ga(token, "runReport", {
    dateRanges: [current],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: { andGroup: { expressions } },
  });
  return met(report.rows?.[0], 0);
}

async function whatsappClicks(token: string, current: { startDate: string; endDate: string }) {
  try {
    return await eventCount(token, current, { fieldName: "customEvent:link_url", value: "wa.me" });
  } catch {
    try {
      return await eventCount(token, current);
    } catch {
      return 0;
    }
  }
}

export async function realtimeUsers() {
  const token = await accessToken();
  const report = await ga(token, "runRealtimeReport", { metrics: [{ name: "activeUsers" }] });
  return met(report.rows?.[0], 0);
}

export async function buildStudioBoard() {
  if (boardCache && Date.now() - boardCache.at < 5 * 60 * 1000) return boardCache.board;
  const token = await accessToken();
  const liveBase = await realtimeUsers().catch(() => 0);
  const entries = await Promise.all(
    (Object.keys(DAYS) as RangeKey[]).map(async (range) => [range, await snapshot(token, range, liveBase)] as const),
  );
  const board = Object.fromEntries(entries) as Record<RangeKey, StudioSnapshot>;
  boardCache = { at: Date.now(), board };
  return board;
}
