"use client";

import { useEffect, useState } from "react";
import { HOME } from "@/lib/content";
import { WA_PRIMARY } from "@/lib/links";
import { MessageCircle } from "./Icons";

/** Sticky motion control + WhatsApp chip + “Plan your project” FAB. */
export function ProjectGuideFab() {
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

  /* Soft cursor parallax on .orb-pointer — live GSAP quickTo equivalent */
  useEffect(() => {
    if (!active) {
      document.querySelectorAll<HTMLElement>(".orb-pointer").forEach((el) => {
        el.style.transform = "";
      });
      return;
    }

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    let raf = 0;
    let running = true;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const tick = () => {
      if (!running) return;
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      document.querySelectorAll<HTMLElement>(".orb-pointer").forEach((el) => {
        el.style.transform = `translate(${curX.toFixed(2)}px, ${curY.toFixed(2)}px)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const hero = document.querySelector(".hero");
      if (!hero) return;
      if (hero.getBoundingClientRect().bottom <= 0) return;
      targetX = (e.clientX / window.innerWidth - 0.5) * 38;
      targetY = (e.clientY / window.innerHeight - 0.5) * 28;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.querySelectorAll<HTMLElement>(".orb-pointer").forEach((el) => {
        el.style.transform = "";
      });
    };
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
        href={WA_PRIMARY}
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
        href={WA_PRIMARY}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle />
        <span>{HOME.fab}</span>
      </a>
    </>
  );
}
