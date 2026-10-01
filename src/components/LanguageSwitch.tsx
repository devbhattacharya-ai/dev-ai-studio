"use client";

import { useLanguage } from "@/lib/LanguageContext";

export function LanguageSwitch() {
  const { lang, toggleLang } = useLanguage();
  return (
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
  );
}
