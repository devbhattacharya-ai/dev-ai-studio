"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CASE_CHROME } from "@/lib/content";
import { GhostLink } from "./GhostLink";

type Status = "checking" | "ok" | "unavailable";

function isAuthWalledHost(url: string) {
  try {
    const host = new URL(url).hostname;
    return host.endsWith("chatgpt.site") || host.includes("chatgpt.com");
  } catch {
    return false;
  }
}

/**
 * Resilient “View live website” pattern:
 * - Local screenshot stays the primary preview (rendered by parent).
 * - Never iframe external demos (auth-walled chatgpt.site returns 401).
 * - Soft reachability; protected hosts skip fetch and show liveFallback.
 */
export function CaseLiveExplore({ liveUrl }: { liveUrl: string }) {
  const chrome = CASE_CHROME;
  const protectedHost = isAuthWalledHost(liveUrl);
  const [status, setStatus] = useState<Status>(
    protectedHost ? "unavailable" : "checking",
  );

  useEffect(() => {
    if (protectedHost) {
      setStatus("unavailable");
      return;
    }

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
  }, [liveUrl, protectedHost]);

  return (
    <div className="case-live-explore">
      {status === "unavailable" ? (
        <p className="case-live-fallback" role="status">
          {chrome.liveFallback}
        </p>
      ) : null}
      {!protectedHost ? (
        <GhostLink href={liveUrl} external srHint={chrome.exploreLiveSr}>
          {chrome.exploreLive}
        </GhostLink>
      ) : (
        <p className="case-live-note">
          <span className="label">{chrome.exploreLive}</span>
          {" — "}
          external demo is protected; use the screenshot above.
        </p>
      )}
      <Link className="ghost-link" href="/#automation-demo">
        {chrome.exploreDemo}
      </Link>
    </div>
  );
}
