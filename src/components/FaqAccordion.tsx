"use client";

import { useState } from "react";
import { ChevronDown } from "./Icons";
import { HOME } from "@/lib/content";

/**
 * Accordion UX with all Q&As always present in the DOM (SSR-safe).
 * Closed panels use the HTML `hidden` attribute — content stays in the bundle/HTML.
 */
export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq-list">
      {HOME.faq.items.map(([q, a], i) => {
        const isOpen = open === i;
        return (
          <div className="faq-item" key={q} data-open={isOpen}>
            <button
              type="button"
              className="faq-trigger"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              id={`faq-trigger-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span>
                <span className="label">0{i + 1}</span> {q}
              </span>
              <ChevronDown />
            </button>
            <div
              className="faq-panel"
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              hidden={!isOpen}
            >
              <p>{a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
