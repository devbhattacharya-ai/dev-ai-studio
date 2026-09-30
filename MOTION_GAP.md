# Motion gap — live vs rebuild (pre-restore)

Diagnosed from live CSS/JS (`studio-portfolio-visual/main.css`, `studio-portfolio-source/assets/page-BTJaTWDp.js`, `home.html`) vs `/workspace/dev-ai-studio`.

## Live has

1. **Iridescent orb structure** — nested markup:
   `.hero-orbit > .orbit-ring.ring-outer/inner > .orb-scroll > .orb-pointer > .orb-surface > .iridescent-sphere + .sphere-sheen`
   Highlight lives on `.orb-surface::after` (not only sphere `::after`).
2. **Sphere sheen pulse** — GSAP: opacity `0.12 → 0.75`, `duration: 4`, `yoyo`, `sine.inOut`, infinite; plays while orb/contact is in view.
3. **Orb pointer parallax** — on `(hover: hover) and (pointer: fine)`, `.orb-pointer` tracks cursor (`±38px / ±28px`, soft lerp).
4. **Orb / hero entrance** — characters rise from `yPercent: 112` with stagger; `.orb-surface` scales from `0.65`; topline/bottom fade up.
5. **Hero glyph split** — each EN line is `.hero-line-mask > .hero-character` spans; desktop offsets `hero-line-1: 26%`, `hero-line-2: 6%`.
6. **Vertical `.hero-coordinate`** inside `.hero-stage` (`writing-mode: vertical-rl`).
7. **Scroll indicator bounce** — `@keyframes scroll-prompt` on `.scroll-indicator svg` (2s ease-in-out infinite).
8. **Contact clover mark** — `.contact-mark > .contact-colour` masks the same sphere + sheen (also pulses).
9. **`data-motion="on"|"off"`** on `.site-frame` — toggle tears down Lenis + GSAP context when off; CSS also kills scroll-prompt / rolling-label / cursor.
10. **Sticky pause/resume control** — left FAB; respects `prefers-reduced-motion` (`Reduced motion`, disabled).
11. **Heavier scroll theatre** (Lenis + ScrollTrigger sticky hero / depth scene / section reveals) — out of scope for CSS-keyframe restore; noted below.

## Rebuild lacked (before restore)

| Item | Rebuild state |
|------|----------------|
| Orb nesting + `.sphere-sheen` | Flat `.iridescent-sphere` only; no sheen layer |
| Sheen pulse / any looping decorative animation | None |
| `data-motion` actually pausing animations | Attribute set on `<html>`, but almost nothing animated — only work-card hover gated |
| Motion-toggle dot | Always filled (live fills only when motion on) |
| Hero character masks / entrance | Static line stacks (`.hero-line-2` only) |
| Vertical hero coordinate | Coordinate sitting in bottom column, not stage |
| Scroll-prompt keyframes | Text “↓” only; no SVG bounce |
| Contact colour/sphere mark | Missing |
| Orb pointer follow | Missing |
| Lenis / sticky hero scrub | Intentionally not ported (heavy; see REBUILD_NOTES) |

## Restore approach (this pass)

- Match live **markup** for orb + contact sheen + hero glyphs.
- Recreate continuous / entrance motion with **CSS keyframes** gated by `[data-motion="on"]`.
- Lightweight JS cursor parallax on `.orb-pointer` (no GSAP/Lenis dependency).
- Pause/resume + `prefers-reduced-motion` kill decorative animations site-wide via `data-motion`.
- Do **not** invent WhatsApp green or undo UX deltas (FAB → WhatsApp, no MR toggle, dual prices).

## Hero H1 letter disperse (added 2026-10-01)

Lightweight scroll listener (no Lenis/GSAP) on `HeroTitle` in `HomePage.tsx`:

- Progress `0→1` = hero section top leaving viewport → hero fully scrolled out (`-rect.top / rect.height`).
- Per `.hero-character`: deterministic spread from `--char-i` + opacity fade; masks `overflow: visible` while dispersing.
- Respects Pause/Resume (`data-motion`) and `prefers-reduced-motion` (CSS + JS both force assembled).
- Scope: hero H1 only — not other display headings.

