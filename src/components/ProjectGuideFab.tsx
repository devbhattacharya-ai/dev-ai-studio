"use client";

import { useEffect, useState } from "react";
import { getHome } from "@/lib/content";
import { useLanguage } from "@/lib/LanguageContext";
import { waPrimary } from "@/lib/links";
import { MessageCircle } from "./Icons";

/** Sticky motion control + WhatsApp chip + “Plan your project” FAB.
 *  Orb pointer parallax is owned by useStudioMotion (GSAP quickTo). */
export function ProjectGuideFab() {
  const { lang } = useLanguage();
  const HOME = getHome(lang);
  const wa = waPrimary(lang);
  const [motionOn, setMotionOn] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [chipVisible, setChipVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      if (mq.matches) setMotionOn(false);
    };
    apply();
    setMounted(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const active = mounted && motionOn && !reduced;

  useEffect(() => {
    const value = active ? "on" : "off";
    document.documentElement.dataset.motion = value;
    const frame = document.querySelector(".site-frame");
    if (frame instanceof HTMLElement) frame.dataset.motion = value;
  }, [active]);

  /* Sticky WhatsApp chip — show after hero, hide near #contact */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const hero = document.querySelector("section.hero");
      const contact = document.querySelector("#contact");
      let show = false;
      if (hero instanceof HTMLElement) {
        show = hero.getBoundingClientRect().bottom < 8;
      }
      if (show && contact instanceof HTMLElement) {
        const top = contact.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.82) show = false;
      }
      setChipVisible(show);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="motion-toggle label"
        disabled={reduced}
        aria-pressed={active}
        onClick={() => setMotionOn((v) => !v)}
      >
        <span className="motion-toggle-dot" aria-hidden="true" />
        {reduced
          ? HOME.motion.reduced
          : active
            ? HOME.motion.pause
            : HOME.motion.resume}
      </button>

      <a
        className={`wa-chip${chipVisible ? " is-visible" : ""}`}
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={HOME.waChip}
        aria-hidden={chipVisible ? undefined : true}
        tabIndex={chipVisible ? 0 : -1}
        hidden={!chipVisible}
      >
        <MessageCircle size={18} aria-hidden="true" />
        <span className="wa-chip-label" aria-hidden="true">
          {HOME.waChip}
        </span>
      </a>

      <a
        className="assistant-fab"
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={HOME.fab}
      >
        <MessageCircle />
        <span className="assistant-fab-label">{HOME.fab}</span>
      </a>
    </>
  );
}
