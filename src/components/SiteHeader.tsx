"use client";

import Link from "next/link";
import { Brand } from "./Brand";
import { ArrowUpRight } from "./Icons";
import { LanguageSwitch } from "./LanguageSwitch";
import { RollingLabel } from "./RollingLabel";
import { getHome } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";
import { waPrimary } from "@/lib/links";

export function SiteHeader() {
  const { lang } = useLanguage();
  const HOME = getHome(lang);
  const q = lang === "mr" ? "?lang=mr" : "";
  return (
    <header className="site-header page-shell">
      <Brand href="/#top" />
      <nav className="main-nav" aria-label={HOME.nav.aria}>
        <Link href="/#work">
          <RollingLabel>{HOME.nav.work}</RollingLabel>
        </Link>
        <Link href="/#services">
          <RollingLabel>{HOME.nav.services}</RollingLabel>
        </Link>
        <Link href="/#automation-demo">
          <RollingLabel>{HOME.nav.demo}</RollingLabel>
        </Link>
        <Link href={`/pricing${q}`}>
          <RollingLabel>{HOME.nav.pricing}</RollingLabel>
        </Link>
      </nav>
      <div className="header-actions">
        <LanguageSwitch />
        <a
          className="ghost-link header-contact"
          href={waPrimary(lang)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {HOME.nav.talk}
          <ArrowUpRight />
        </a>
      </div>
    </header>
  );
}
