"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Brand } from "./Brand";
import { GhostLink } from "./GhostLink";
import { ArrowUpRight } from "./Icons";
import {
  getPricingCopy,
  WEBSITE_TIERS,
  MOTION_PRICES,
  WA_PRICES,
  dualMoneyPair,
  formatDualPrice,
  type Currency,
  type DualMoney,
} from "@/lib/pricing";
import { waPricing } from "@/lib/links";
import { useLanguage } from "@/lib/LanguageContext";
import { LanguageSwitch } from "./LanguageSwitch";

const COUNT_MS = 520;

function DualPrice({
  amounts,
  highlight,
  fromLabel,
  progress,
}: {
  amounts: { inr: number; usd: number };
  highlight: Currency;
  fromLabel: string;
  progress: number;
}) {
  const pair = dualMoneyPair(amounts, highlight, progress);
  return (
    <span className="price-dual" data-highlight={highlight}>
      <span className="price-dual-from">{fromLabel}</span>
      <span className="price-dual-primary">
        <span aria-hidden="true">{pair.primary}</span>
        <span className="sr-only">{pair.primaryFinal}</span>
      </span>
      <span className="price-dual-sep" aria-hidden="true">
        /
      </span>
      <span className="price-dual-secondary">
        <span aria-hidden="true">{pair.secondary}</span>
        <span className="sr-only">{pair.secondaryFinal}</span>
      </span>
    </span>
  );
}

/** Dual INR+USD line price with count-up; custom/null skips animation. */
function DualLinePrice({
  price,
  customLabel,
  fromLabel,
  highlight,
  progress,
}: {
  price: DualMoney;
  customLabel: string;
  fromLabel: string;
  highlight: Currency;
  progress: number;
}) {
  if (price.inr === null && price.usd === null) {
    return <>{customLabel}</>;
  }
  const running = formatDualPrice(price, customLabel, fromLabel, highlight, progress);
  const final = formatDualPrice(price, customLabel, fromLabel, highlight, 1);
  return (
    <>
      <span aria-hidden="true">{running}</span>
      <span className="sr-only">{final}</span>
    </>
  );
}

export function PricingPage() {
  const { lang } = useLanguage();
  const copy = getPricingCopy(lang);
  const q = lang === "mr" ? "?lang=mr" : "";
  const [highlight, setHighlight] = useState<Currency>("inr");
  const [progress, setProgress] = useState(1);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem("dev-studio-pricing-currency") === "usd") {
        setHighlight("usd");
      }
    } catch {}
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (mq.matches) {
        if (rafRef.current !== null) {
          window.cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        setProgress(1);
      }
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  /** Matches live pricing `b()` — cancel prior rAF; reduced-motion → 1; else 0→1 over 520ms ease. */
  function setCurrency(next: Currency) {
    if (next === highlight) return;
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHighlight(next);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
    } else {
      setProgress(0);
      const start = window.performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / COUNT_MS, 1);
        setProgress(1 - (1 - t) ** 3);
        rafRef.current = t < 1 ? window.requestAnimationFrame(tick) : null;
      };
      rafRef.current = window.requestAnimationFrame(tick);
    }
    try {
      window.localStorage.setItem("dev-studio-pricing-currency", next);
    } catch {}
  }

  const featured = WEBSITE_TIERS[0];

  return (
    <div className="pricing-page site-frame" data-language={lang}>
      <a className="skip-link" href="#pricing-main">
        {copy.skip}
      </a>
      <header className="pricing-header page-shell">
        <Brand href={lang === "mr" ? "/?lang=mr" : "/"} />
        <nav className="pricing-header-links" aria-label="Main navigation">
          <Link href="/#work" className="ghost-link">
            {copy.nav.work}
          </Link>
          <Link href="/#services" className="ghost-link">
            {copy.nav.services}
          </Link>
          <span aria-current="page">{copy.nav.pricing}</span>
        </nav>
        <LanguageSwitch />
      </header>
      <main id="pricing-main" tabIndex={-1} className="page-shell">
        <section id="websites" className="pricing-section pricing-websites">
          <div className="pricing-first-heading">
            <div>
              <p className="label">{copy.webLabel}</p>
              <h1 id="pricing-web-title">{copy.webTitle}</h1>
            </div>
            <div className="pricing-first-controls">
              <p>{copy.webIntro}</p>
              <div
                className="pricing-currency-toggle"
                role="group"
                aria-label={copy.currencyLabel}
              >
                <button
                  type="button"
                  onClick={() => setCurrency("inr")}
                  aria-pressed={highlight === "inr"}
                >
                  INR
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("usd")}
                  aria-pressed={highlight === "usd"}
                >
                  USD
                </button>
              </div>
            </div>
          </div>

          <div className="pricing-featured-grid">
            <article className="pricing-featured">
              <p className="label">
                {copy.onePage} / {copy.standard}
              </p>
              <p className="pricing-featured-price">
                <DualPrice
                  amounts={featured.standard!}
                  highlight={highlight}
                  fromLabel={copy.from}
                  progress={progress}
                />
              </p>
              <h2>{copy.standardTitle}</h2>
              <p>{copy.standardText}</p>
            </article>
            <article className="pricing-featured pricing-featured-alt">
              <p className="label">
                {copy.onePage} / {copy.animated}
              </p>
              <p className="pricing-featured-price">
                <DualPrice
                  amounts={featured.animated!}
                  highlight={highlight}
                  fromLabel={copy.from}
                  progress={progress}
                />
              </p>
              <h2>{copy.animatedTitle}</h2>
              <p>{copy.animatedText}</p>
            </article>
          </div>

          <h2 className="pricing-more-heading">{copy.morePages}</h2>
          <div className="pricing-table-wrap">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th scope="col">{copy.pages}</th>
                  <th scope="col">{copy.standard}</th>
                  <th scope="col">{copy.animated}</th>
                </tr>
              </thead>
              <tbody>
                {WEBSITE_TIERS.slice(1).map((row) => (
                  <tr key={row.pages}>
                    <th scope="row">{row.pages}</th>
                    <td>
                      {row.standard ? (
                        <DualPrice
                          amounts={row.standard}
                          highlight={highlight}
                          fromLabel={copy.from}
                          progress={progress}
                        />
                      ) : (
                        <span className="price-quote">{copy.quoted}</span>
                      )}
                    </td>
                    <td>
                      {row.animated ? (
                        <DualPrice
                          amounts={row.animated}
                          highlight={highlight}
                          fromLabel={copy.from}
                          progress={progress}
                        />
                      ) : (
                        <span className="price-quote">{copy.quoted}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="pricing-fineprint">{copy.tableNote}</p>
          <p className="pricing-fineprint pricing-currency-note">{copy.usdNote}</p>
        </section>

        <section className="pricing-section">
          <div className="section-meta">
            <p className="label">{copy.motionLabel}</p>
            <span className="label">{copy.motionSide}</span>
          </div>
          <div className="pricing-section-heading">
            <h2>{copy.motionTitle}</h2>
            <p>{copy.motionIntro}</p>
          </div>
          <div className="pricing-lines">
            {copy.motionRows.map(([name, body], i) => (
              <article className="pricing-line" key={name}>
                <span className="label">0{i + 1}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{body}</p>
                </div>
                <p className="pricing-line-price">
                  <DualLinePrice
                    price={MOTION_PRICES[i]}
                    customLabel={copy.custom}
                    fromLabel={copy.from}
                    highlight={highlight}
                    progress={progress}
                  />
                </p>
              </article>
            ))}
          </div>
          <p className="pricing-fineprint">{copy.motionNote}</p>
        </section>

        <section className="pricing-section">
          <div className="section-meta">
            <p className="label">{copy.waLabel}</p>
            <span className="label">{copy.waSide}</span>
          </div>
          <div className="pricing-section-heading">
            <h2>{copy.waTitle}</h2>
            <p>{copy.waIntro}</p>
          </div>
          <div className="pricing-lines">
            {copy.waRows.map(([name, body], i) => (
              <article className="pricing-line" key={name}>
                <span className="label">0{i + 1}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{body}</p>
                </div>
                <p className="pricing-line-price">
                  <DualLinePrice
                    price={WA_PRICES[i]}
                    customLabel={copy.custom}
                    fromLabel={copy.from}
                    highlight={highlight}
                    progress={progress}
                  />
                </p>
              </article>
            ))}
          </div>
          <p className="pricing-fineprint">{copy.waNote}</p>
        </section>

        <section className="pricing-end">
          <p className="label">{copy.ctaLabel}</p>
          <div className="pricing-end-grid">
            <h2>{copy.ctaTitle}</h2>
            <div>
              <p>{copy.ctaText}</p>
              <GhostLink
                href={waPricing(highlight, lang)}
                className="underlined"
                external
                srHint={copy.ctaSr}
              >
                {copy.ctaLink}
              </GhostLink>
            </div>
          </div>
        </section>
      </main>
      <footer className="pricing-footer page-shell">
        <Link className="footer-wordmark" href="/">
          <span className="footer-wordmark-inner">DEV / AI STUDIO</span>
        </Link>
        <div className="footer-bottom">
          <p>{copy.footer}</p>
          <div className="footer-controls">
            <Link className="ghost-link" href={`/project-notes?lang=${lang}`}>
              {copy.notes}
            </Link>
            <LanguageSwitch />
            <Link className="ghost-link" href={lang === "mr" ? "/?lang=mr" : "/"}>
              <ArrowUpRight />
              {copy.back}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
