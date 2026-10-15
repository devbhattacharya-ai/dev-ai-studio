"use client";

import { useEffect, useMemo, useState } from "react";
import { lockStudio } from "./actions";
import type { RangeKey, StudioSnapshot } from "@/lib/studio-data";

const NOTES_KEY = "devai-studio-notes";
const SOURCE_COLORS = ["#ffd700", "#52525b", "#d4d4d8", "#4ade80"];

function formatNumber(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function formatClock(seconds: number) {
  const safe = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function formatDuration(seconds: number) {
  const safe = Math.max(0, Math.round(seconds));
  return `${Math.floor(safe / 60)}m ${String(safe % 60).padStart(2, "0")}s`;
}

function signed(value: number, digits = 1) {
  const rounded = Number(value.toFixed(digits));
  const abs = Math.abs(rounded).toFixed(digits);
  if (rounded > 0) return `+${abs}`;
  if (rounded < 0) return `−${abs}`;
  return abs;
}

function Delta({ value, good, kind }: { value: number; good: "up" | "down"; kind: "percent" | "points" | "seconds" }) {
  const improved = good === "up" ? value > 0 : value < 0;
  const text = kind === "percent" ? `${signed(value)}%` : kind === "points" ? `${signed(value)} pp` : `${signed(value, 0)}s`;
  return <p className={improved ? "bd-up" : "bd-down"}>{text} vs prior period</p>;
}

export function StudioDashboard({ board }: { board: Record<RangeKey, StudioSnapshot> }) {
  const [range, setRange] = useState<RangeKey>("30d");
  const [view, setView] = useState<"overview" | "audience" | "traffic" | "behavior">("overview");
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");
  const data = board[range];
  const [live, setLive] = useState(data.liveBase);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
      const next: Record<string, string> = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === "string") next[key] = value;
      }
      setNotes(next);
    } catch {
      /* ignore broken local notes */
    }
  }, []);

  useEffect(() => {
    let stop = false;
    async function pull() {
      try {
        const res = await fetch("/studio/live", { cache: "no-store" });
        if (!res.ok) return;
        const body = (await res.json()) as { active?: number };
        if (!stop && typeof body.active === "number") setLive(body.active);
      } catch {
        /* keep the last real count */
      }
    }
    void pull();
    const id = window.setInterval(pull, 30000);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const pages = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.pages.filter((page) => {
      const note = notes[page.path] ?? page.note;
      return !q || `${page.path} ${page.title} ${note}`.toLowerCase().includes(q);
    });
  }, [data.pages, notes, query]);

  function saveNote(path: string, value: string) {
    const next = { ...notes, [path]: value };
    setNotes(next);
    localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    setToast("Note saved");
  }

  function exportCsv() {
    const rows =
      view === "audience"
        ? [["city", "visitors"], ...data.cities.map((city) => [city.name, String(city.count)])]
        : view === "traffic"
          ? [["channel", "sessions", "share"], ...data.channels.map((channel) => [channel.name, String(channel.sessions), formatPercent(channel.share, 0)])]
          : view === "behavior"
            ? [["step", "count"], ...data.funnel.map((step) => [step.name, String(step.count)])]
            : [
                ["path", "title", "views", "avg_time", "bounce", "note"],
                ...data.pages.map((page) => [
                  page.path,
                  page.title,
                  String(page.views),
                  formatClock(page.avgSeconds),
                  formatPercent(page.bounce),
                  notes[page.path] ?? page.note,
                ]),
              ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `devaistudio-${view}-${range}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setToast("CSV downloaded");
  }

  const maxActivity = Math.max(...data.activity.map((point) => point.users), 1);
  const chartWidth = 640;
  const chartHeight = 220;
  const points = data.activity.map((point, index) => {
    const x = (index / Math.max(1, data.activity.length - 1)) * chartWidth;
    const y = chartHeight - (point.users / maxActivity) * (chartHeight - 16);
    return `${x},${y}`;
  });

  return (
    <div className="bd">
      <header className="bd-top">
        <div>
          <p className="bd-kicker">DevAI.</p>
          <h1>Website overview</h1>
          <p className="bd-muted">
            {data.fromLabel} – {data.toLabel}. Real Google Analytics for devaistudio.in. Only you can open this page.
          </p>
        </div>
        <div className="bd-actions">
          <label className="bd-search">
            <span className="sr-only">Search</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pages or cities" />
          </label>
          <div className="bd-ranges" role="group" aria-label="Date range">
            {(["7d", "30d", "90d"] as RangeKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={range === key} onClick={() => setRange(key)}>
                {board[key].label}
              </button>
            ))}
          </div>
          <button className="bd-primary" type="button" onClick={exportCsv}>
            Export
          </button>
          <form action={lockStudio}>
            <button className="bd-ghost" type="submit">
              Lock
            </button>
          </form>
        </div>
      </header>

      <nav className="bd-nav" aria-label="Studio">
        {(
          [
            ["overview", "Overview"],
            ["audience", "Audience"],
            ["traffic", "Traffic"],
            ["behavior", "Behavior"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" aria-current={view === id ? "page" : undefined} onClick={() => setView(id)}>
            {label}
          </button>
        ))}
      </nav>

      {view === "overview" ? (
        <>
          <section className="bd-kpis">
            <article>
              <p>Total visitors</p>
              <strong>{formatNumber(data.visitors)}</strong>
              <Delta value={data.visitorsDelta} good="up" kind="percent" />
            </article>
            <article className="bd-live">
              <p>Active now</p>
              <strong>{formatNumber(live)}</strong>
              <span>{live > 0 ? "On the site right now" : "Nobody on the site right now"}</span>
            </article>
            <article>
              <p>Bounce rate</p>
              <strong>{formatPercent(data.bounce)}</strong>
              <Delta value={data.bounceDelta} good="down" kind="points" />
            </article>
            <article>
              <p>Avg. session</p>
              <strong>{formatDuration(data.avgSeconds)}</strong>
              <Delta value={data.avgSecondsDelta} good="up" kind="seconds" />
            </article>
          </section>
          <section className="bd-signals">
            <p>Pageviews <strong>{formatNumber(data.pageviews)}</strong></p>
            <p>Outbound clicks <strong>{formatNumber(data.whatsapp)}</strong></p>
            <p>Pricing views <strong>{formatNumber(data.pricingViews)}</strong></p>
          </section>
          <section className="bd-grid">
            <article className="bd-panel">
              <h2>Visitor activity</h2>
              <svg className="bd-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Visitors over time">
                <polyline fill="none" stroke="#ffd700" strokeWidth="3" points={points.join(" ")} />
              </svg>
              <div className="bd-axis">
                <span>{data.activity[0]?.label}</span>
                <span>{data.activity.at(-1)?.label}</span>
              </div>
            </article>
            <article className="bd-panel">
              <h2>Traffic sources</h2>
              <ul className="bd-sources">
                {data.sources.map((source, index) => (
                  <li key={source.name}>
                    <i style={{ background: SOURCE_COLORS[index] }} />
                    <span>{source.name}</span>
                    <b>{formatPercent(data.sessions ? source.count / data.sessions : 0, 0)}</b>
                  </li>
                ))}
              </ul>
            </article>
          </section>
          <section className="bd-panel">
            <h2>Top pages</h2>
            <div className="bd-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Views</th>
                    <th>Avg. time</th>
                    <th>Bounce</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <tr key={page.path}>
                      <td>
                        <b>{page.path}</b>
                        <small>{page.title}</small>
                      </td>
                      <td>{formatNumber(page.views)}</td>
                      <td>{formatClock(page.avgSeconds)}</td>
                      <td>{formatPercent(page.bounce)}</td>
                      <td>
                        <input
                          aria-label={`Note for ${page.path}`}
                          defaultValue={notes[page.path] ?? page.note}
                          key={`${page.path}-${notes[page.path] ?? page.note}`}
                          onBlur={(event) => {
                            const value = event.target.value;
                            if (value !== (notes[page.path] ?? page.note)) saveNote(page.path, value);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pages.length === 0 ? <p className="bd-muted">No pages match that search.</p> : null}
          </section>
        </>
      ) : null}

      {view === "audience" ? (
        <section className="bd-grid">
          <article className="bd-panel">
            <h2>Cities</h2>
            <ul className="bd-bars">
              {data.cities
                .filter((city) => city.name.toLowerCase().includes(query.trim().toLowerCase()))
                .map((city) => (
                  <li key={city.name}>
                    <span>{city.name}</span>
                    <b>{formatNumber(city.count)}</b>
                    <div>
                      <i style={{ width: `${data.cities[0]?.count ? (city.count / data.cities[0].count) * 100 : 0}%` }} />
                    </div>
                  </li>
                ))}
            </ul>
          </article>
          <article className="bd-panel">
            <h2>Devices</h2>
            <ul className="bd-sources">
              {data.devices.map((device) => (
                <li key={device.name}>
                  <span>{device.name}</span>
                  <b>{formatPercent(data.visitors ? device.count / data.visitors : 0, 0)}</b>
                </li>
              ))}
            </ul>
          </article>
        </section>
      ) : null}

      {view === "traffic" ? (
        <section className="bd-panel">
          <h2>Channels</h2>
          <ul className="bd-bars">
            {data.channels
              .filter((channel) => channel.name.toLowerCase().includes(query.trim().toLowerCase()))
              .map((channel) => (
                <li key={channel.name}>
                  <span>{channel.name}</span>
                  <b>{formatNumber(channel.sessions)}</b>
                  <div>
                    <i style={{ width: `${channel.share * 100}%` }} />
                  </div>
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {view === "behavior" ? (
        <section className="bd-panel">
          <h2>Enquiry path</h2>
          <ol className="bd-funnel">
            {data.funnel.map((step, index) => (
              <li key={step.name}>
                <span>
                  {index + 1}. {step.name}
                </span>
                <b>{formatNumber(step.count)}</b>
                <div>
                  <i style={{ width: `${data.funnel[0].count ? (step.count / data.funnel[0].count) * 100 : 0}%` }} />
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {toast ? (
        <p className="bd-toast" role="status">
          {toast}
        </p>
      ) : null}
    </div>
  );
}
