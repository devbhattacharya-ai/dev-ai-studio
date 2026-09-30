"use client";

import Link from "next/link";
import { HOME } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="site-footer page-shell">
      <a className="footer-wordmark" href="#top">
        <span className="footer-wordmark-inner">{HOME.footer.wordmark}</span>
      </a>
      <div className="footer-bottom">
        <p>{HOME.footer.tagline}</p>
        <div className="footer-controls">
          <Link className="ghost-link" href="/pricing">
            {HOME.footer.pricing}
          </Link>
          <Link className="ghost-link" href="/project-notes">
            {HOME.footer.notes}
          </Link>
          <a className="ghost-link" href="#top">
            {HOME.footer.backTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
