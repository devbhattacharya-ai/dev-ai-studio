"use client";

import { useLayoutEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

const PHONE = "(max-width: 760px)";

/**
 * On a phone, the header switch slides to the top centre once you scroll.
 * It stays in the sticky header (no fixed positioning), so the page cannot jump.
 */
export function LanguageSwitch({ pin = false }: { pin?: boolean }) {
  const { lang, toggleLang } = useLanguage();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!pin) return;
    const button = buttonRef.current;
    const slot = slotRef.current;
    if (!button || !slot) return;

    const mq = window.matchMedia(PHONE);
    const header = button.closest(".site-header, .pricing-header, .case-nav");
    if (!(header instanceof HTMLElement)) return;

    let docked = false;

    const clear = () => {
      docked = false;
      button.classList.remove("is-armed");
      button.style.removeProperty("--lang-rest-x");
      button.style.removeProperty("--lang-rest-y");
      button.style.removeProperty("--lang-dx");
      button.style.removeProperty("--lang-dy");
      slot.style.removeProperty("width");
      slot.style.removeProperty("height");
      delete document.documentElement.dataset.langDock;
    };

    const measure = () => {
      if (!mq.matches) {
        clear();
        return;
      }
      const dockNow = docked || document.documentElement.dataset.langDock === "1";
      const headerTransition = header.style.transition;
      const buttonTransition = button.style.transition;
      header.style.transition = "none";
      button.style.transition = "none";
      button.classList.remove("is-armed");
      if (dockNow) delete document.documentElement.dataset.langDock;
      const buttonBox = button.getBoundingClientRect();
      const headerBox = header.getBoundingClientRect();
      const x = buttonBox.left - headerBox.left;
      const y = buttonBox.top - headerBox.top;
      const dx = header.clientWidth / 2 - x - buttonBox.width / 2;
      const dy = 10 - y;
      slot.style.width = `${buttonBox.width}px`;
      slot.style.height = `${buttonBox.height}px`;
      button.style.setProperty("--lang-rest-x", `${x}px`);
      button.style.setProperty("--lang-rest-y", `${y}px`);
      button.style.setProperty("--lang-dx", `${dx}px`);
      button.style.setProperty("--lang-dy", `${dy}px`);
      button.classList.add("is-armed");
      if (dockNow) document.documentElement.dataset.langDock = "1";
      header.getBoundingClientRect();
      header.style.transition = headerTransition;
      button.style.transition = buttonTransition;
    };

    const onScroll = () => {
      if (!mq.matches || !button.classList.contains("is-armed")) {
        if (docked) {
          docked = false;
          delete document.documentElement.dataset.langDock;
        }
        return;
      }
      const y = window.scrollY || document.documentElement.scrollTop;
      if (!docked && y > 36) {
        docked = true;
        document.documentElement.dataset.langDock = "1";
      } else if (docked && y < 10) {
        docked = false;
        delete document.documentElement.dataset.langDock;
      }
    };

    let width = window.innerWidth;
    const onResize = () => {
      if (Math.abs(window.innerWidth - width) < 40) return;
      width = window.innerWidth;
      measure();
    };
    const onMode = () => {
      width = window.innerWidth;
      measure();
      onScroll();
    };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onMode);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onMode);
      clear();
    };
  }, [pin, lang]);

  return (
    <span ref={slotRef} className="language-switch-slot">
      <button
        ref={buttonRef}
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
