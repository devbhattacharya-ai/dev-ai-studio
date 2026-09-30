"use client";

import { useEffect, useRef, type CSSProperties } from "react";
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
import { ArrowUpRight, ArrowDown } from "./Icons";

function HeroTitle({ lines }: { lines: readonly string[] }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const label = lines.join(" ");
  let charIndex = 0;

  /* Scroll-tied letter disperse — hero H1 only; gated by data-motion + reduced-motion */
  useEffect(() => {
    const title = titleRef.current;
    const hero = title?.closest("section.hero");
    if (!title || !(hero instanceof HTMLElement)) return;

    const chars = Array.from(
      title.querySelectorAll<HTMLElement>(".hero-character"),
    );
    const masks = Array.from(
      title.querySelectorAll<HTMLElement>(".hero-line-mask"),
    );
    const mid = (chars.length - 1) / 2;

    const spreads = chars.map((el, i) => {
      const parsed = Number(el.style.getPropertyValue("--char-i"));
      const ci = Number.isFinite(parsed) ? parsed : i;
      const angle = (ci * 2.399963) % (Math.PI * 2);
      const radius = 52 + (ci % 7) * 22;
      return {
        x: Math.cos(angle) * radius + (ci - mid) * 10,
        y: Math.sin(angle) * radius - 36 - (ci % 5) * 14,
      };
    });

    let raf = 0;

    const motionAllowed = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
      }
      return document.documentElement.dataset.motion === "on";
    };

    const clearDisperse = () => {
      title.dataset.disperse = "0";
      title.style.pointerEvents = "";
      masks.forEach((m) => {
        m.style.overflow = "";
      });
      chars.forEach((el) => {
        el.style.translate = "";
        el.style.opacity = "";
      });
    };

    const applyDisperse = (progress: number) => {
      const p = Math.min(1, Math.max(0, progress));
      if (p <= 0.001) {
        clearDisperse();
        return;
      }

      /* Smoothstep so early scroll stays readable */
      const e = p * p * (3 - 2 * p);
      title.dataset.disperse = e >= 0.98 ? "1" : "active";
      title.style.pointerEvents = e >= 0.85 ? "none" : "";
      masks.forEach((m) => {
        m.style.overflow = "visible";
      });
      chars.forEach((el, i) => {
        const { x, y } = spreads[i];
        el.style.translate = `${(x * e).toFixed(2)}px ${(y * e).toFixed(2)}px`;
        el.style.opacity = String(Math.max(0, 1 - e));
      });
    };

    const tick = () => {
      raf = 0;
      if (!motionAllowed()) {
        clearDisperse();
        return;
      }
      const rect = hero.getBoundingClientRect();
      const height = Math.max(rect.height, 1);
      /* 0 at hero top in view; 1 when hero fully scrolled out */
      const progress = Math.min(1, Math.max(0, -rect.top / height));
      applyDisperse(progress);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const mo = new MutationObserver(schedule);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    const frame = document.querySelector(".site-frame");
    if (frame) {
      mo.observe(frame, { attributes: true, attributeFilter: ["data-motion"] });
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();

    return () => {
      mo.disconnect();
      mq.removeEventListener("change", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
      clearDisperse();
    };
  }, []);

  return (
    <h1
      ref={titleRef}
      id="hero-title"
      className="hero-title"
      aria-label={label}
      data-disperse="0"
    >
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


/** Scroll fade-up once — intro / work cards / services. Gated by data-motion + reduced-motion via CSS. */
function useScrollReveal() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal"),
    );
    if (!nodes.length) return;

    const motionAllowed = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
      }
      return document.documentElement.dataset.motion === "on";
    };

    const markIn = (el: Element) => {
      el.classList.add("is-in");
      observer.unobserve(el);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) markIn(entry.target);
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );

    /** When motion turns on, immediately reveal already-visible targets (avoid opacity flash). */
    const flushVisible = () => {
      const vh = window.innerHeight;
      for (const el of nodes) {
        if (el.classList.contains("is-in")) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.94 && rect.bottom > 0) markIn(el);
      }
    };

    const sync = () => {
      if (!motionAllowed()) {
        /* Static: ensure visible; keep observing for later resume */
        flushVisible();
        return;
      }
      for (const el of nodes) {
        if (!el.classList.contains("is-in")) observer.observe(el);
      }
      flushVisible();
    };

    for (const el of nodes) observer.observe(el);

    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    const frame = document.querySelector(".site-frame");
    if (frame) {
      mo.observe(frame, { attributes: true, attributeFilter: ["data-motion"] });
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", sync);
    sync();

    return () => {
      mo.disconnect();
      mq.removeEventListener("change", sync);
      observer.disconnect();
    };
  }, []);
}

export function HomePage() {
  useScrollReveal();
  return (
    <div className="site-frame" id="top" data-language="en" data-motion="off">
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
                className="work-card reveal"
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
          <div className="section-meta reveal">
            <p className="label">{HOME.services.meta}</p>
            <span className="label">{HOME.services.metaSide}</span>
          </div>
          <h2 className="display-heading reveal">
            {HOME.services.h2[0]}
            <br />
            {HOME.services.h2[1]}
          </h2>
          <p className="services-subhead reveal">{HOME.services.subhead}</p>
          <div className="service-rows">
            {HOME.services.tiers.map((tier) => (
              <article className="service-row reveal" key={tier.name}>
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
