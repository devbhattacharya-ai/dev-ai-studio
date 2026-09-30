"use client";

import Image from "next/image";
import Link from "next/link";
import { HOME } from "@/lib/content";
import { WA_PRIMARY, PHONE_TEL } from "@/lib/links";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { GhostLink } from "./GhostLink";
import { FaqAccordion } from "./FaqAccordion";
import { AutomationDemo } from "./AutomationDemo";
import { ProjectGuideFab } from "./ProjectGuideFab";
import { ArrowUpRight } from "./Icons";

export function HomePage() {
  return (
    <div className="site-frame" id="top" data-language="en">
      <a className="skip-link" href="#main-content">
        {HOME.skip}
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="hero page-shell">
          <div className="hero-topline">
            <p className="label">{HOME.hero.eyebrow}</p>
            <p className="label hero-location">{HOME.hero.location}</p>
          </div>
          <div className="hero-stage">
            <div className="hero-orbit" aria-hidden="true">
              <span className="ring-outer" />
              <span className="ring-inner" />
              <span className="iridescent-sphere" />
            </div>
            <h1 className="hero-title">
              <span className="hero-line">{HOME.hero.lines[0]}</span>
              <span className="hero-line hero-line-2">{HOME.hero.lines[1]}</span>
              <span className="hero-line">{HOME.hero.lines[2]}</span>
            </h1>
          </div>
          <div className="hero-bottom">
            <div>
              <p className="label">{HOME.hero.coordinate}</p>
              <a className="ghost-link underlined" href="#work">
                {HOME.hero.ctaWork}
                <ArrowUpRight />
              </a>
            </div>
            <div>
              <p className="hero-summary">{HOME.hero.body}</p>
              <GhostLink href={WA_PRIMARY} className="underlined" external>
                {HOME.hero.ctaPrimary}
              </GhostLink>
            </div>
            <a className="scroll-indicator label" href="#about">
              {HOME.hero.scroll}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section id="about" className="page-shell section-space intro-section">
          <div className="section-meta">
            <p className="label" style={{ whiteSpace: "pre-line" }}>
              {HOME.about.label}
            </p>
            <a className="ghost-link" href="#services">
              {HOME.about.cta}
              <ArrowUpRight />
            </a>
          </div>
          <div className="intro-copy">
            <h2>{HOME.about.h2}</h2>
            <p>{HOME.about.body}</p>
          </div>
        </section>

        <section id="work" className="page-shell section-space work-section">
          <div className="section-meta">
            <p className="label">{HOME.work.meta}</p>
            <span className="label">{HOME.work.year}</span>
          </div>
          <div className="work-heading">
            <div>
              <h2 className="display-heading work-display">{HOME.work.h2}</h2>
              <p className="work-subtitle">{HOME.work.subtitle}</p>
            </div>
            <p>{HOME.work.description}</p>
          </div>
          <div className="work-grid">
            {HOME.work.cards.map((card) => (
              <Link
                key={card.slug}
                href={`/work/${card.slug}`}
                className="work-card"
                aria-label={`Read case study: ${card.title}`}
              >
                <div className="work-card-visual">
                  <Image
                    src={card.image}
                    alt={`${card.title} — website screenshot`}
                    width={960}
                    height={600}
                    sizes="(max-width: 760px) 100vw, 50vw"
                  />
                  <div className="work-card-badges">
                    {card.isNew ? (
                      <span className="work-card-badge">{HOME.work.badgeNew}</span>
                    ) : null}
                    <span className="work-card-badge">{HOME.work.year}</span>
                  </div>
                </div>
                <div className="work-card-copy">
                  <p className="label">{card.number}</p>
                  <div className="work-card-title-row">
                    <h3>{card.title}</h3>
                    <ArrowUpRight size={22} />
                  </div>
                  <p>{card.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
          <p className="label work-footnote">{HOME.work.footnote}</p>
        </section>

        <section className="page-shell section-space bridge-section">
          <h2 className="depth-title">{HOME.bridge.h2}</h2>
          <p>{HOME.bridge.body}</p>
        </section>

        <section id="services" className="page-shell section-space services-section">
          <div className="section-meta">
            <p className="label">{HOME.services.meta}</p>
            <span className="label">{HOME.services.metaSide}</span>
          </div>
          <h2 className="display-heading">
            {HOME.services.h2[0]}
            <br />
            {HOME.services.h2[1]}
          </h2>
          <p className="services-subhead">{HOME.services.subhead}</p>
          <div className="service-rows">
            {HOME.services.tiers.map((tier) => (
              <article className="service-row" key={tier.name}>
                <p className="label">{tier.number}</p>
                <div>
                  <h3>{tier.name}</h3>
                </div>
                <div>
                  <p>{tier.body}</p>
                  <ul>
                    {tier.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <GhostLink href={WA_PRIMARY} className="underlined" external>
                    {tier.cta}
                  </GhostLink>
                </div>
              </article>
            ))}
          </div>
          <Link className="ghost-link underlined" href="/pricing">
            {HOME.services.pricingLink}
            <ArrowUpRight />
          </Link>
          <div className="outcomes-block">
            <p className="label">{HOME.outcomes.label}</p>
            <h3>{HOME.outcomes.h3}</h3>
            <div className="outcomes-grid">
              {HOME.outcomes.items.map(([title, body], i) => (
                <article key={title}>
                  <p className="label">0{i + 1}</p>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <AutomationDemo />

        <section id="process" className="page-shell section-space process-section">
          <div className="section-meta">
            <p className="label">{HOME.process.meta}</p>
            <span className="label">{HOME.process.metaSide}</span>
          </div>
          <h2 className="display-heading">
            {HOME.process.h2[0]}
            <br />
            {HOME.process.h2[1]}
          </h2>
          <div className="process-grid">
            {HOME.process.steps.map(([title, body], i) => (
              <article key={title}>
                <p className="process-number">0{i + 1}</p>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="scope" className="page-shell section-space scope-section">
          <div className="scope-layout">
            <div>
              <p className="label">{HOME.scope.label}</p>
              <h3>{HOME.scope.h3}</h3>
              <p>{HOME.scope.intro}</p>
            </div>
            <div className="scope-list">
              {HOME.scope.items.map(([title, body]) => (
                <article key={title}>
                  <h4>{title}</h4>
                  <p>{body}</p>
                </article>
              ))}
              <p className="scope-note">{HOME.scope.note}</p>
            </div>
          </div>
        </section>

        <section className="page-shell section-space faq-section" aria-labelledby="faq-title">
          <div className="faq-layout">
            <div>
              <p className="label">{HOME.faq.meta}</p>
              <h2 id="faq-title" className="display-heading">
                {HOME.faq.h2[0]}
                <br />
                {HOME.faq.h2[1]}
              </h2>
            </div>
            <FaqAccordion />
          </div>
        </section>

        <section id="contact" className="page-shell section-space contact-section">
          <div className="section-meta">
            <p className="label">{HOME.contact.meta}</p>
          </div>
          <div className="contact-layout">
            <h2 className="contact-title">
              {HOME.contact.h2[0]}
              <br />
              {HOME.contact.h2[1]}
              <br />
              {HOME.contact.h2[2]}
            </h2>
            <div className="contact-aside">
              <p>{HOME.contact.body}</p>
              <GhostLink href={WA_PRIMARY} className="contact-whatsapp underlined" external>
                {HOME.contact.ctaWhatsapp}
              </GhostLink>
              <a className="ghost-link" href={PHONE_TEL}>
                {HOME.contact.ctaCall}{" "}
                <span className="muted-phone">{HOME.contact.phone}</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ProjectGuideFab />
    </div>
  );
}
