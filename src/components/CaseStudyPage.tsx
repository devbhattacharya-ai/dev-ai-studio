"use client";

import Image from "next/image";
import Link from "next/link";
import { getCase } from "@/lib/cases";
import { CASE_CHROME } from "@/lib/content";
import { waCase } from "@/lib/links";
import { GhostLink } from "./GhostLink";
import { CaseLiveExplore } from "./CaseLiveExplore";

export function CaseStudyPage({ slug }: { slug: string }) {
  const study = getCase(slug);
  if (!study) return null;
  const copy = study.en;
  const chrome = CASE_CHROME;

  return (
    <div className="case-study page-shell" data-language="en">
      <a className="skip-link" href="#case-content">
        Skip to case study
      </a>
      <nav className="case-nav" aria-label="Project navigation">
        <Link className="ghost-link" href="/#work">
          ← {chrome.selectedWork}
        </Link>
      </nav>
      <main id="case-content" tabIndex={-1} aria-labelledby="case-title">
        <header className="case-hero">
          <p className="label">{chrome.label}</p>
          <h1 id="case-title">{study.title}</h1>
          <p className="case-deck">{copy.deck}</p>
          <div className="case-meta">
            <span>{copy.sector}</span>
            <span>{chrome.badgeSelf}</span>
          </div>
        </header>
        <figure className="case-image">
          <Image
            src={study.image}
            width={1200}
            height={750}
            alt={`${study.title} — website preview in its original colours`}
            priority
          />
          <figcaption>{chrome.previewLabel}</figcaption>
        </figure>
        <section className="case-story">
          <p className="label">{chrome.problemLabel}</p>
          <div>
            <h2>{chrome.problemH}</h2>
            <p>{copy.problem}</p>
          </div>
        </section>
        <section className="case-story">
          <p className="label">{chrome.solutionLabel}</p>
          <div>
            <h2>{chrome.solutionH}</h2>
            <p>{copy.solution}</p>
            <div className="case-feature-list">
              {copy.features.map(([title, body], i) => (
                <article key={title}>
                  <span className="label">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="case-mobile-note">
          <p className="label">{chrome.exploreLabel}</p>
          <h2>{chrome.exploreH}</h2>
          <p>{chrome.exploreBody}</p>
          <CaseLiveExplore liveUrl={study.url} />
        </section>
        <section className="case-story">
          <p className="label">{chrome.outcomeLabel}</p>
          <div>
            <h2>{chrome.outcomeH}</h2>
            <p>{copy.outcome}</p>
            <p className="case-note">{chrome.disclaimer}</p>
          </div>
        </section>
      </main>
      <footer className="case-footer">
        <p className="label">{chrome.nextLabel}</p>
        <h2>{chrome.nextH}</h2>
        <GhostLink href={waCase(study.title)} external srHint={chrome.nextCtaSr}>
          {chrome.nextCta}
        </GhostLink>
        <Link className="ghost-link" href="/#work">
          {chrome.back}
        </Link>
      </footer>
    </div>
  );
}
