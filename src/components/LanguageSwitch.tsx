"use client";

import { useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const PHONE = "(max-width: 760px)";

/**
 * On a phone, the header switch becomes a bar fixed to the top of the screen
 * once you scroll, and it stays there. Footer switches are left alone.
 */
export function LanguageSwitch({ pin = false }: { pin?: boolean }) {
  const { lang, toggleLang } = useLanguage();

  useEffect(() => {
    if (!pin) return;
    const mq = window.matchMedia(PHONE);
    let docked = false;

    const apply = (next: boolean) => {
      docked = next;
      if (next) document.documentElement.dataset.langDock = "1";
      else delete document.documentElement.dataset.langDock;
    };

    const onScroll = () => {
      if (!mq.matches) {
        if (docked) apply(false);
        return;
      }
      const y = window.scrollY || document.documentElement.scrollTop;
      if (!docked && y > 28) apply(true);
      else if (docked && y < 8) apply(false);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onScroll);
      apply(false);
    };
  }, [pin]);

  return (
    <span className="language-switch-slot">
      <button
        type="button"
        className="language-switch"
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
