"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { HOME } from "@/lib/content";
import { WA_PRIMARY, PHONE_TEL } from "@/lib/links";
import { useStudioMotion } from "@/hooks/useStudioMotion";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { GhostLink } from "./GhostLink";
import { FaqAccordion } from "./FaqAccordion";
import { AutomationDemo } from "./AutomationDemo";
import { ProjectGuideFab } from "./ProjectGuideFab";
import { ArrowUpRight, ArrowDown } from "./Icons";

function HeroTitle({ lines }: { lines: readonly string[] }) {
  const label = lines.join(" ");
  let charIndex = 0;

  return (
    <h1 id="hero-title" className="hero-title" aria-label={label}>
      {lines.map((line, lineIndex) => {
        const chars = Array.from(line);
        const start = charIndex;
        charIndex += chars.length;
        return (
          <span
            key={lineIndex}
            className={`hero-line hero-line-${lineIndex}`}
            aria-hidden="true"
          >
            <span className="hero-line-mask">
              {chars.map((ch, i) => (
                <span
                  key={i}
                  className="hero-character"
                  style={{ "--char-i": start + i } as CSSProperties}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </h1>
  );
}

function IridescentOrb() {
  return (
    <div className="hero-orbit" aria-hidden="true">
      <span className="orbit-ring ring-outer" />
      <span className="orbit-ring ring-inner" />
      <div className="orb-scroll">
        <div className="orb-pointer">
          <div className="orb-surface">
            <span className="iridescent-sphere" />
            <span className="sphere-sheen" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MotionLines({
  lines,
  as: Tag = "h2",
  className,
  id,
}: {
  lines: readonly string[];
  as?: "h2";
  className: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={className}>
      {lines.map((line) => (
        <span className="motion-mask" key={line}>
          <span className="motion-line">{line}</span>
        </span>
      ))}
    </Tag>
  );
}

function StatementHeading({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <h2 aria-label={text}>
      {words.map((word, i) => (
        <span className="statement-word" aria-hidden="true" key={`${word}-${i}`}>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h2>
  );
}

export function HomePage() {
  const frameRef = useRef<HTMLDivElement>(null);
  useStudioMotion(frameRef);

  return (
    <div
      ref={frameRef}
      className="site-frame"
      id="top"
      data-language="en"
      data-motion="off"
    >
      <a className="skip-link" href="#main-content">
        {HOME.skip}
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <div className="hero-scroll">
          <section className="hero page-shell" aria-labelledby="hero-title">
            <div className="hero-topline">
              <p className="label">{HOME.hero.eyebrow}</p>
              <p className="label hero-location">{HOME.hero.location}</p>
            </div>
            <div className="hero-stage">
              <IridescentOrb />
              <HeroTitle lines={HOME.hero.lines} />
              <span className="hero-coordinate label" aria-hidden="true">
                {HOME.hero.coordinate}
              </span>
            </div>
            <div className="hero-bottom">
              <div>
                <a className="ghost-link hero-work underlined" href="#work">
                  {HOME.hero.ctaWork}
                  <ArrowDown />
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
                <ArrowDown size={18} />
              </a>
            </div>
          </section>
        </div>

        <section id="about" className="page-shell section-space intro-section">
          <div className="section-meta reveal">
            <p className="label" style={{ whiteSpace: "pre-line" }}>
              {HOME.about.label}
            </p>
            <a className="ghost-link" href="#services">
              {HOME.about.cta}
              <ArrowUpRight />
            </a>
          </div>
          <div className="intro-copy reveal">
            <StatementHeading text={HOME.about.h2} />
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

        <section
          className="editorial-bridge page-shell"
          aria-labelledby="bridge-title"
        >
          <div className="bridge-rule" aria-hidden="true" />
          <div className="bridge-content">
            <h2 id="bridge-title">{HOME.bridge.h2}</h2>
            <p>{HOME.bridge.body}</p>
          </div>
        </section>

        <section id="services" className="page-shell section-space services-section">
          <div className="section-meta reveal">
            <p className="label">{HOME.services.meta}</p>
            <span className="label">{HOME.services.metaSide}</span>
          </div>
          <header className="section-heading reveal">
            <MotionLines
              className="display-heading"
              lines={HOME.services.h2}
              id="services-title"
            />
            <p className="services-subhead">{HOME.services.subhead}</p>
          </header>
          <div className="service-list">
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
          <div className="outcomes-block reveal">
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
          <MotionLines
            className="display-heading"
            lines={HOME.process.h2}
            id="process-title"
          />
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
              <MotionLines
                className="display-heading"
                lines={HOME.faq.h2}
                id="faq-title"
              />
            </div>
            <FaqAccordion />
          </div>
        </section>

        <section id="contact" className="page-shell section-space contact-section">
          <div className="section-meta">
            <p className="label">{HOME.contact.meta}</p>
          </div>
          <div className="contact-layout">
            <MotionLines
              className="contact-title"
              lines={HOME.contact.h2}
              id="contact-title"
            />
            <div className="contact-aside">
              <div className="contact-mark" aria-hidden="true">
                <span className="contact-colour">
                  <span className="iridescent-sphere" />
                  <span className="sphere-sheen" />
                </span>
              </div>
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
