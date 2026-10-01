# Motion gap — live vs rebuild

Diagnosed from live CSS/JS (`studio-portfolio-visual/main.css`, `studio-portfolio-source/assets/page-BTJaTWDp.js` `Eg()`, `home.html`) vs `/workspace/dev-ai-studio`.

## Ported (2026-10-01 — live Eg fidelity)

1. **Lenis** — duration 1.05, smoothWheel, syncTouch false, anchors offset -24, `[data-lenis-prevent]`.
2. **GSAP ScrollTrigger** wired to Lenis (`scroll` → update; ticker → `lenis.raf`; `lagSmoothing(0)`).
3. **Hero sticky scrub** — `.hero-scroll` (~190svh) + sticky `.hero` 100svh at `(width>=961px) and (height>=650px)` when `data-motion=on`; desktop line/orbit scrub; compact `.orb-scroll` y:65 scale:1.12 scrub.
4. **Entrance** — hero-character, orb-surface, topline/bottom (GSAP; CSS keyframe entrances removed to avoid conflict).
5. **Section theatre** — `.reveal`, work-section timelines + image scrub, editorial-bridge, statement-word scrub, service-row, process-number, contact-mark rotate scrub, footer-wordmark-inner rise, sphere-sheen visibility-gated pulse.
6. **Orb pointer** — GSAP `quickTo` ±38/±28 on fine pointer (custom studio-cursor skipped).
7. **Pause / reduced-motion** — tears down Lenis + GSAP context; sticky track CSS only under `[data-motion=on]`.

## Intentional skips

- **studio-cursor** chrome (optional / noisy).
- **depth-scene** — present in live CSS + nav helper, **not** in live home HTML; not invented.
- Lightweight HeroTitle letter-disperse + IntersectionObserver `.reveal` — removed; GSAP path owns them.

## KEEP (regression guards)

- Mobile ≤760px: hide `.assistant-fab`, `.motion-toggle`, `.wa-chip`.
- Dual INR+USD pricing; no EN/मराठी toggle; Plan FAB → WhatsApp.
