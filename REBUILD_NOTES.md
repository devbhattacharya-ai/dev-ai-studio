# Rebuild notes — DEV / AI STUDIO

Faithful Next.js App Router rebuild of https://dev-ai-web-automation.dev2404.chatgpt.site/

**App path:** `/workspace/dev-ai-studio`  
**Build:** `npm run build` — **PASSED** (Next.js 16 / TypeScript)  
**Dev smoke:** `npm run dev` on :3010 — `/`, `/pricing`, `/project-notes`, `/work/bisi-bele` returned 200 with live EN copy.

## Routes implemented

| Route | Status |
|-------|--------|
| `/` | Home sections + anchors `#top` `#about` `#work` `#services` `#automation-demo` `#process` `#scope` `#contact` |
| `/pricing` | Dual INR+USD prices, highlight toggle, website tiers, motion add-ons, WhatsApp automation, quote CTA |
| `/project-notes` | Privacy & project notes (case chrome) |
| `/work/bisi-bele` | Case study |
| `/work/smile-dental` | Case study |
| `/work/afterdark` | Case study |
| `/work/pink-static` | Case study |
| `/work/nutty` | Case study |

## Copy & CTAs

- EN copy sourced from `/workspace/copy-pack-live-site.md` (exact live wording).
- Primary WhatsApp: `wa.me/917738400373` with live prefills (hero/services/contact, pricing quote, case, demo handoff).
- Call: `tel:+917738400373` (`+91 77384 00373`) as secondary.
- No public email; no invented testimonials/metrics.
- FAQ accordion: all 7 Q&As static in bundle + SSR HTML (`hidden` when closed).
- Automation demo: client-side simulation + disclaimer only.
- Ghost-link CTAs (no WhatsApp green).

## UX deltas (Dev approved 2026-10-01)

Applied from `P0-IA-PACK.md` § UX change list:

1. **FAB “Plan your project”** — Multi-step project-guide dialog removed. FAB is a direct WhatsApp link (`WA_PRIMARY` / studio prefill) in **1 tap**. Motion pause/resume toggle kept.
2. **EN/मराठी toggle hidden** — Removed from header, footer, case pages, pricing, and project-notes. `LanguageProvider` / `LanguageSwitch` plumbing left unused until full Marathi copy ships. EN-only chrome.
3. **Header “Let’s talk”** — Primary action opens WhatsApp with the same studio prefill as hero “Start a conversation” (`WA_PRIMARY`). Call remains secondary at `#contact` (`tel:+917738400373`).
4. **FAQ static** — All 7 Q&As from `HOME.faq.items` always rendered in the DOM for SSR/SEO; accordion still expands/collapses via `hidden` + `aria-expanded`.
5. **Case “View live website” fallback** — Local `public/demo-*.jpg` remains the prominent preview. External ChatGPT demo link kept with `rel="noopener noreferrer"`. New `CaseLiveExplore` client wrapper soft-checks reachability; on failure shows “Preview only — live demo unavailable” while keeping the screenshot. No new demo URLs invented.
6. **Pricing INR + USD both visible** — Every tier/cell/add-on shows both amounts (e.g. ₹9,999 / $109). INR/USD control kept only as a **highlight preference** (which currency reads primary); both stay visible without switching. USD note always shown. Exact figures from `src/lib/pricing.ts` / copy pack.

## Visual system

- Tokens from `/workspace/studio-portfolio-visual/tokens.css` imported as source of truth.
- Parchment `#e5e4e0` / ink `#1d1d1d` / paper / ash / stone / muted; radius 10px; page-width 1400px; Inter + Noto Sans Devanagari (next/font).
- Iridescent sphere decorative element on hero.
- Sticky motion toggle (left) + Plan your project FAB (right → WhatsApp).

## Language

- **Toggle hidden until full MR copy.** Content is EN-only. Marathi type-loosening CSS still available if `data-language=mr` is set later.

## Gaps vs live site

1. **Motion / scroll choreography** — live uses heavier line masks, rolling nav labels, pricing reveal/count-up; rebuild uses static layout + reduced-motion respect without full Lenis/scroll theatre.
2. **Hero character-split animation** — title is line-stacked, not per-glyph masked motion.
3. **Marathi content** — not shipped; toggle hidden.
4. **Project-guide dialog** — intentionally removed (UX delta #1); FAB goes straight to WhatsApp.
5. **External concept demos** — linked only with local screenshot fallback (UX delta #5).
6. **metadataBase** — Next warns until production URL is set (parent deploy).
7. **Appendix strings** (CLEAR SCOPE / unused bullets / old homepage variants) intentionally **not** used per copy pack.

## Not done (by brief)

- No GitHub push
- No Vercel deploy

## How to run

```bash
cd /workspace/dev-ai-studio
npm install
npm run build
npm run dev
```
