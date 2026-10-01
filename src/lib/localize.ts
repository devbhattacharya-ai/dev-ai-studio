import type { Lang } from "./content";

/** Deep-merge MR over EN; any missing MR leaf keeps EN. Never invents strings. */
export function localize<T>(lang: Lang, en: T, mr?: unknown): T {
  if (lang !== "mr" || mr == null) return en;
  return merge(en, mr) as T;
}

function merge(en: unknown, mr: unknown): unknown {
  if (mr === undefined || mr === null) return en;
  if (Array.isArray(en)) {
    if (!Array.isArray(mr)) return en;
    // Prefer MR array wholesale when provided (same length or intentional replace)
    return mr.length ? mr : en;
  }
  if (typeof en === "object" && en !== null) {
    if (typeof mr !== "object" || mr === null || Array.isArray(mr)) return en;
    const out: Record<string, unknown> = { ...(en as Record<string, unknown>) };
    for (const key of Object.keys(mr as object)) {
      if (key in out) {
        out[key] = merge(out[key], (mr as Record<string, unknown>)[key]);
      }
    }
    return out;
  }
  // leaf: use MR string/number when present
  return mr;
}

export function waHref(lang: Lang, enUrl: string, mrUrl: string) {
  return lang === "mr" ? mrUrl : enUrl;
}
