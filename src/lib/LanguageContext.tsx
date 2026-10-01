"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "./content";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("lang") === "mr") setLangState("mr");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.language = lang;
    const url = new URL(window.location.href);
    // Never carry a hash into the language URL — toggle must not scroll to sections.
    url.hash = "";
    if (lang === "mr") url.searchParams.set("lang", "mr");
    else url.searchParams.delete("lang");
    const y = window.scrollY;
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    window.scrollTo(0, y);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(
    () => setLangState((prev) => (prev === "en" ? "mr" : "en")),
    []
  );

  const value = useMemo(() => ({ lang, setLang, toggleLang }), [lang, setLang, toggleLang]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
