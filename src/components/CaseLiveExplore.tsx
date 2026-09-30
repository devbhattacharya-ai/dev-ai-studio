"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CASE_CHROME } from "@/lib/content";
import { GhostLink } from "./GhostLink";

type Status = "checking" | "ok" | "unavailable";

/**
 * Resilient “View live website” pattern:
 * - Local screenshot stays the primary preview (rendered by parent).
 * - External link kept with rel=noopener noreferrer.
 * - Soft reachability check; on failure show preview-only note (no invented demo URLs).
 */
export function CaseLiveExplore({ liveUrl }: { liveUrl: string }) {
  const chrome = CASE_CHROME;
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4500);

    fetch(liveUrl, {
      method: "HEAD",
      mode: "no-cors",
      signal: controller.signal,
      cache: "no-store",
    })
      .then(() => {
        if (!cancelled) setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      })
      .finally(() => {
        window.clearTimeout(timer);
      });

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [liveUrl]);

  return (
    <div className="case-live-explore">
      <GhostLink href={liveUrl} external srHint={chrome.exploreLiveSr}>
        {chrome.exploreLive}
      </GhostLink>
      {status === "unavailable" ? (
        <p className="case-live-fallback" role="status">
          {chrome.liveFallback}
        </p>
      ) : null}
      <Link className="ghost-link" href="/#automation-demo">
        {chrome.exploreDemo}
      </Link>
    </div>
  );
}
