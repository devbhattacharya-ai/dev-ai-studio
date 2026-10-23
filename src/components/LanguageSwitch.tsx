"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const PHONE = "(max-width: 760px)";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MS = 560;
const BAR = 48;

type Spot = { left: number; top: number; width: number; height: number };

/**
 * Header switches can pin to the top center on a phone while scrolling.
 * Footer switches stay where they are.
 */
export function LanguageSwitch({ pin = false }: { pin?: boolean }) {
  const { lang, toggleLang } = useLanguage();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const phase = useRef<"rest" | "docked">("rest");
  const [fixed, setFixed] = useState(false);
  const [vacant, setVacant] = useState(false);
  const [style, setStyle] = useState<CSSProperties>();

  useEffect(() => {
    if (!pin) return;
    const mq = window.matchMedia(PHONE);
    let timer = 0;
    let frame = 0;

    const paint = (spot: Spot, transition: boolean) => {
      setFixed(true);
      setStyle({
        position: "fixed",
        left: spot.left,
        top: spot.top,
        width: spot.width,
        height: spot.height,
        margin: 0,
        zIndex: 60,
        transition: transition
          ? `left ${MS}ms ${EASE}, top ${MS}ms ${EASE}, width ${MS}ms ${EASE}, height ${MS}ms ${EASE}`
          : "none",
      });
    };

    const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const release = () => {
      phase.current = "rest";
      setFixed(false);
      setVacant(false);
      setStyle(undefined);
      if (slotRef.current) slotRef.current.style.cssText = "";
      delete document.documentElement.dataset.langDock;
      const y = window.scrollY || document.documentElement.scrollTop;
      if (mq.matches && y > 24) {
        frame = window.requestAnimationFrame(() => dock());
      }
    };

    const dock = () => {
      if (!mq.matches || phase.current === "docked") return;
      const button = buttonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const start: Spot = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
      const slot = slotRef.current;
      if (slot) {
        slot.style.width = `${rect.width}px`;
        slot.style.height = `${rect.height}px`;
      }
      phase.current = "docked";
      if (reduced()) {
        const width = start.width;
        paint(
          {
            left: (window.innerWidth - width) / 2,
            top: 0,
            width,
            height: BAR,
          },
          false,
        );
        setVacant(true);
        document.documentElement.dataset.langDock = "1";
        return;
      }
      paint(start, false);
      setVacant(true);
      frame = window.requestAnimationFrame(() => {
        button.getBoundingClientRect();
        frame = window.requestAnimationFrame(() => {
          const width = button.offsetWidth || start.width;
          paint(
            {
              left: (window.innerWidth - width) / 2,
              top: 0,
              width,
              height: BAR,
            },
            true,
          );
          document.documentElement.dataset.langDock = "1";
        });
      });
    };

    const undock = () => {
      if (phase.current !== "docked") return;
      const slot = slotRef.current;
      const button = buttonRef.current;
      window.clearTimeout(timer);
      if (!slot || !button || reduced()) {
        release();
        return;
      }
      setVacant(false);
      slot.classList.remove("is-vacant");
      const rect = slot.getBoundingClientRect();
      const headerShift = document.documentElement.dataset.langDock === "1" ? BAR : 0;
      paint(
        {
          left: rect.left,
          top: Math.max(0, rect.top - headerShift),
          width: rect.width || button.offsetWidth,
          height: rect.height || button.offsetHeight,
        },
        true,
      );
      delete document.documentElement.dataset.langDock;
      timer = window.setTimeout(release, MS);
    };

    const onScroll = () => {
      if (!mq.matches) {
        if (phase.current !== "rest") release();
        return;
      }
      const y = window.scrollY || document.documentElement.scrollTop;
      if (y > 24) dock();
      else if (y < 8) undock();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onScroll);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      delete document.documentElement.dataset.langDock;
    };
  }, [pin]);

  return (
    <span ref={slotRef} className={vacant ? "language-switch-slot is-vacant" : "language-switch-slot"}>
      <button
        ref={buttonRef}
        type="button"
        className={fixed ? "language-switch is-pinned" : "language-switch"}
        style={style}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const y = window.scrollY;
          toggleLang();
          requestAnimationFrame(() => window.scrollTo(0, y));
        }}
        aria-label={lang === "en" ? "Switch to Marathi" : "Switch to English"}
        aria-pressed={lang === "mr"}
      >
        <span className={lang === "en" ? "selected" : ""}>EN</span>
        <span className="language-divider" aria-hidden="true">
          /
        </span>
        <span lang="mr" className={lang === "mr" ? "selected" : ""}>
          मराठी
        </span>
      </button>
    </span>
  );
}
