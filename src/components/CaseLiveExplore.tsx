"use client";

import Link from "next/link";
import { getCaseChrome } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";
import { GhostLink } from "./GhostLink";

/**
 * Case studies always expose Explore → case.url (chatgpt.site demos) in a new tab.
 * Screenshot + case copy stay in the parent. External demos may still 401 for
 * anonymous visitors — the link remains clickable either way.
 */
export function CaseLiveExplore({ liveUrl }: { liveUrl: string }) {
  const { lang } = useLanguage();
  const chrome = getCaseChrome(lang);
  const demoHref = lang === "mr" ? "/?lang=mr#automation-demo" : "/#automation-demo";

  return (
    <div className="case-live-explore">
      <GhostLink href={liveUrl} external srHint={chrome.exploreLiveSr}>
        {chrome.exploreLive}
      </GhostLink>
      <Link className="ghost-link" href={demoHref}>
        {chrome.exploreDemo}
      </Link>
    </div>
  );
}
