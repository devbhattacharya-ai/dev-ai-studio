"use client";

import Link from "next/link";
import { LanguageSwitch } from "./LanguageSwitch";
import { getHome } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";

export function SiteFooter() {
  const { lang } = useLanguage();
  const HOME = getHome(lang);
  const q = lang === "mr" ? "?lang=mr" : "";
  return (
    <footer className="site-footer page-shell">
      <a className="footer-wordmark" href="#top">
        <span className="footer-wordmark-inner">{HOME.footer.wordmark}</span>
      </a>
      <div className="footer-bottom">
        <p>{HOME.footer.tagline}</p>
        <div className="footer-controls">
          <Link className="ghost-link" href={`/pricing${q}`}>
            {HOME.footer.pricing}
          </Link>
          <Link className="ghost-link" href={`/project-notes?lang=${lang}`}>
            {HOME.footer.notes}
          </Link>
          <LanguageSwitch />
          <a className="ghost-link" href="#top">
            {HOME.footer.backTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
