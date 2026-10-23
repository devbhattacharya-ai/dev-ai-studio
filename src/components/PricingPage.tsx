"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand } from "./Brand";
import { GhostLink } from "./GhostLink";
import { ArrowUpRight } from "./Icons";
import { RunningText } from "./RunningText";
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

function DualPrice({
  amounts,
  highlight,
  fromLabel,
}: {
  amounts: { inr: number; usd: number };
  highlight: Currency;
  fromLabel: string;
}) {
  const pair = dualMoneyPair(amounts, highlight, 1);
  return (
    <span className="price-dual" data-highlight={highlight}>
      <span className="price-dual-from">{fromLabel}</span>
      <span className="price-dual-primary">
        <RunningText text={pair.primaryFinal} />
      </span>
      <span className="price-dual-sep" aria-hidden="true">
        /
      </span>
      <span className="price-dual-secondary">
        <RunningText text={pair.secondaryFinal} />
      </span>
    </span>
  );
}

function DualLinePrice({
  price,
  customLabel,
  fromLabel,
  highlight,
}: {
  price: DualMoney;
  customLabel: string;
  fromLabel: string;
  highlight: Currency;
}) {
  if (price.inr === null && price.usd === null) {
    return <>{customLabel}</>;
  }
  const final = formatDualPrice(price, customLabel, fromLabel, highlight, 1);
  return <RunningText text={final} />;
}

export function PricingPage() {
  const { lang } = useLanguage();
  const copy = getPricingCopy(lang);
  const q = lang === "mr" ? "?lang=mr" : "";
  const [highlight, setHighlight] = useState<Currency>("inr");

  useEffect(() => {
    try {
      if (window.localStorage.getItem("dev-studio-pricing-currency") === "usd") {
        setHighlight("usd");
      }
    } catch {}
  }, []);

  function setCurrency(next: Currency) {
    if (next === highlight) return;
    setHighlight(next);
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
        <LanguageSwitch pin />
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
                    <th scope="row">
                      <RunningText text={row.pages} />
                    </th>
                    <td>
                      <span className="pricing-cell-label">{copy.standard}</span>
                      {row.standard ? (
                        <DualPrice
                          amounts={row.standard}
                          highlight={highlight}
                          fromLabel={copy.from}
                        />
                      ) : (
                        <span className="price-quote">{copy.quoted}</span>
                      )}
                    </td>
                    <td>
                      <span className="pricing-cell-label">{copy.animated}</span>
                      {row.animated ? (
                        <DualPrice
                          amounts={row.animated}
                          highlight={highlight}
                          fromLabel={copy.from}
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
            <p className="label">
              <RunningText text={copy.motionLabel} />
            </p>
            <span className="label">{copy.motionSide}</span>
          </div>
          <div className="pricing-section-heading">
            <h2>{copy.motionTitle}</h2>
            <p>{copy.motionIntro}</p>
          </div>
          <div className="pricing-lines">
            {copy.motionRows.map(([name, body], i) => (
              <article className="pricing-line" key={name}>
                <span className="label">
                  <RunningText text={`0${i + 1}`} />
                </span>
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
                  />
                </p>
              </article>
            ))}
          </div>
          <p className="pricing-fineprint">{copy.motionNote}</p>
        </section>

        <section className="pricing-section">
          <div className="section-meta">
            <p className="label">
              <RunningText text={copy.waLabel} />
            </p>
            <span className="label">{copy.waSide}</span>
          </div>
          <div className="pricing-section-heading">
            <h2>{copy.waTitle}</h2>
            <p>{copy.waIntro}</p>
          </div>
          <div className="pricing-lines">
            {copy.waRows.map(([name, body], i) => (
              <article className="pricing-line" key={name}>
                <span className="label">
                  <RunningText text={`0${i + 1}`} />
                </span>
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
