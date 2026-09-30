"use client";

import Link from "next/link";
import { Brand } from "./Brand";
import { ArrowUpRight } from "./Icons";
import { HOME } from "@/lib/content";
import { WA_PRIMARY } from "@/lib/links";

export function SiteHeader() {
  return (
    <header className="site-header page-shell">
      <Brand href="/#top" />
      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/#work">{HOME.nav.work}</Link>
        <Link href="/#services">{HOME.nav.services}</Link>
        <Link href="/#automation-demo">{HOME.nav.demo}</Link>
        <Link href="/pricing">{HOME.nav.pricing}</Link>
      </nav>
      <div className="header-actions">
        <a
          className="ghost-link header-contact"
          href={WA_PRIMARY}
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
