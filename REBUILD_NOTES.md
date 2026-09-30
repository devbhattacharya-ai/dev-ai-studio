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
- Iridescent orb: live markup (`.orb-scroll` / `.orb-pointer` / `.orb-surface` / `.iridescent-sphere` + `.sphere-sheen`) with sheen pulse + pointer parallax.
- Hero character-split title + vertical `.hero-coordinate`; contact clover mark reuses sphere/sheen.
- Sticky motion toggle (left) pauses/resumes decorative motion site-wide via `data-motion`; Plan your project FAB (right → WhatsApp).

## Language

- **Toggle hidden until full MR copy.** Content is EN-only. Marathi type-loosening CSS still available if `data-language=mr` is set later.

## Gaps vs live site

1. **Lenis / sticky hero scrub / depth-scene theatre** — live GSAP ScrollTrigger sticky hero (190svh), depth tiles, section reveals, pricing count-up still not ported; decorative CSS + pause control restored instead (see `MOTION_GAP.md`).
2. **Rolling nav labels / studio custom cursor** — omitted (chrome nicety; not core sphere/pause motion Dev reported).
3. **Marathi content** — not shipped; toggle hidden.
4. **Project-guide dialog** — intentionally removed (UX delta #1); FAB goes straight to WhatsApp.
5. **External concept demos** — linked only with local screenshot fallback (UX delta #5).
6. **metadataBase** — Next warns until production URL is set (parent deploy).
7. **Appendix strings** (CLEAR SCOPE / unused bullets / old homepage variants) intentionally **not** used per copy pack.

## Motion restore (2026-10-01)

Restored from live sources into rebuild (no redesign):

- Orb nesting + `.sphere-sheen` opacity pulse (4s alternate) matching live GSAP values.
- Hero glyph masks + CSS entrance stagger; vertical coordinate; scroll-prompt bounce on indicator SVG.
- Contact clover `.contact-mark` with shared sphere/sheen.
- Sticky **Pause / Resume motion** sets `data-motion` on `html` + `.site-frame`; gates all decorative animations; respects `prefers-reduced-motion`.
- Soft `.orb-pointer` cursor parallax when motion is on (fine pointer only).
- Hero H1 scroll-tied letter disperse (see section below).
- Details: `/workspace/dev-ai-studio/MOTION_GAP.md`.

## Hero H1 scroll disperse (2026-10-01)

- Target: `#hero-title` / `.hero-character` only (“GOOD DESIGN. REAL CONVERSATIONS.”).
- Progress: `clamp(-heroRect.top / heroRect.height, 0, 1)` via rAF on scroll/resize; smoothstep easing; per-char deterministic translate + fade.
- Assembled at scroll top; letters gone / `pointer-events: none` by hero exit so About isn’t blocked.
- Gated by `data-motion="on"` and `prefers-reduced-motion: no-preference` (Pause motion + reduced → static H1).
- Entrance keyframes kept: disperse uses CSS `translate` (composes with animated `transform`).
- No Lenis/GSAP.

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
