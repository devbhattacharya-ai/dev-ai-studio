"use client";

import Link from "next/link";
import { NOTES } from "@/lib/content";
import { WA_CONTACT_PLAIN } from "@/lib/links";

export function ProjectNotesPage() {
  return (
    <main className="case-study page-shell" data-language="en">
      <nav className="case-nav">
        <Link className="ghost-link" href="/">
          {NOTES.back}
        </Link>
      </nav>
      <header className="case-hero">
        <p className="label">{NOTES.label}</p>
        <h1>{NOTES.h1}</h1>
      </header>
      {NOTES.sections.map(([title, body], i) => (
        <section className="case-story" key={title}>
          <p className="label">0{i + 1}</p>
          <div>
            <h2>{title}</h2>
            <p>{body}</p>
          </div>
        </section>
      ))}
      <footer className="case-footer">
        <a
          className="ghost-link"
          href={WA_CONTACT_PLAIN}
          target="_blank"
          rel="noopener noreferrer"
        >
          {NOTES.cta}
        </a>
      </footer>
    </main>
  );
}
