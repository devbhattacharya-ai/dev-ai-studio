"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Ports live ChatGPT-site Eg() motion theatre:
 * Lenis + GSAP ScrollTrigger sticky hero scrub, section reveals,
 * contact-mark rotate, footer wordmark, orb pointer quickTo, sheen pulse.
 * Runs only when data-motion=on and prefers-reduced-motion is off.
 */
export function useStudioMotion(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    let lenis: Lenis | null = null;
    let media: gsap.MatchMedia | null = null;
    let ctx: gsap.Context | null = null;
    let killed = false;
    let resizeRaf = 0;
    let ro: ResizeObserver | null = null;
    let tickerFn: ((time: number) => void) | null = null;
    let active = false;

    const motionAllowed = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
      }
      const frame =
        (root.closest(".site-frame") as HTMLElement | null) ?? root;
      const value =
        frame.dataset.motion ?? document.documentElement.dataset.motion;
      return value === "on";
    };

    const teardown = () => {
      killed = true;
      if (ro) {
        ro.disconnect();
        ro = null;
      }
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = 0;
      }
      if (media) {
        media.revert();
        media = null;
      }
      if (ctx) {
        ctx.revert();
        ctx = null;
      }
      if (tickerFn) {
        gsap.ticker.remove(tickerFn);
        tickerFn = null;
      }
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
        lenis = null;
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      active = false;
      killed = false;
    };

    const setup = () => {
      if (active || !motionAllowed()) return;
      killed = false;
      active = true;

      const heroScroll = root.querySelector(".hero-scroll") as HTMLElement | null;

      lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -24 },
        prevent: (node) => !!node.closest("[data-lenis-prevent]"),
      });
      lenis.on("scroll", ScrollTrigger.update);
      tickerFn = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      media = gsap.matchMedia();

      ctx = gsap.context(() => {
        const chars = root.querySelectorAll(".hero-character");
        if (
          heroScroll &&
          heroScroll.getBoundingClientRect().bottom > 0 &&
          window.scrollY < 80
        ) {
          gsap.fromTo(
            chars,
            { yPercent: 112, rotation: 5 },
            {
              yPercent: 0,
              rotation: 0,
              duration: 1.1,
              stagger: 0.018,
              delay: 0.08,
              ease: "power4.out",
              clearProps: "transform",
            },
          );
          gsap.from(".orb-surface", {
            scale: 0.65,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out",
          });
          gsap.from(".hero-topline, .hero-bottom", {
            opacity: 0,
            y: 12,
            duration: 0.7,
            delay: 0.45,
            clearProps: "all",
          });
        }

        root.querySelectorAll(".display-heading, .contact-title").forEach((el) => {
          const lines = el.querySelectorAll(".motion-line");
          if (!lines.length) return;
          gsap.from(lines, {
            yPercent: 112,
            rotation: 2,
            duration: 0.95,
            stagger: 0.1,
            ease: "power4.out",
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 91%", once: true },
          });
        });

        root.querySelectorAll(".reveal").forEach((el) => {
          gsap.from(el, {
            y: 42,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          });
        });

        const workSection = root.querySelector(".work-section");
        if (workSection) {
          const workHeading = workSection.querySelector(".work-heading");
          if (workHeading) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: workSection,
                  start: "top 90%",
                  once: true,
                },
              })
              .from(workSection.querySelector(".section-meta"), {
                y: 12,
                opacity: 0,
                duration: 0.55,
                ease: "power2.out",
                clearProps: "opacity,transform",
              })
              .from(
                workHeading.children,
                {
                  y: 22,
                  opacity: 0,
                  duration: 0.75,
                  stagger: 0.11,
                  ease: "power3.out",
                  clearProps: "opacity,transform",
                },
                "-=0.3",
              );
          }

          const desktopCards = window.matchMedia("(min-width: 761px)").matches;
          workSection.querySelectorAll(".work-card").forEach((card, index) => {
            const visual = card.querySelector(".work-card-visual");
            const copy = card.querySelector(".work-card-copy");
            const img = visual?.querySelector("img");
            if (!visual || !copy) return;
            gsap
              .timeline({
                delay: desktopCards && index % 2 ? 0.12 : 0,
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
                  once: true,
                },
              })
              .from(visual, {
                y: 30,
                opacity: 0,
                clipPath: "inset(0 0 12% 0 round 10px)",
                duration: 0.9,
                ease: "power3.out",
                clearProps: "transform,opacity,clipPath",
              })
              .from(
                copy,
                {
                  y: 16,
                  opacity: 0,
                  duration: 0.65,
                  ease: "power3.out",
                  clearProps: "transform,opacity",
                },
                "-=0.56",
              );
            if (desktopCards && img) {
              gsap.fromTo(
                img,
                { yPercent: -2, scale: 1.06 },
                {
                  yPercent: 2,
                  scale: 1.06,
                  ease: "none",
                  scrollTrigger: {
                    trigger: visual,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.65,
                  },
                },
              );
            }
          });
        }

        const bridge = root.querySelector(".editorial-bridge");
        if (bridge) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: bridge,
                start: "top 86%",
                once: true,
              },
              defaults: { ease: "power2.out", clearProps: "opacity,transform" },
            })
            .from(bridge.querySelector(".bridge-rule"), {
              scaleX: 0,
              transformOrigin: "left",
              duration: 0.65,
            })
            .from(bridge.querySelector("h2"), { y: 14, opacity: 0, duration: 0.6 }, 0.12)
            .from(bridge.querySelector("p"), { y: 10, opacity: 0, duration: 0.55 }, 0.24);
        }

        if (root.querySelector(".statement-word")) {
          gsap.fromTo(
            ".statement-word",
            { opacity: 0.22 },
            {
              opacity: 1,
              stagger: 0.16,
              ease: "none",
              scrollTrigger: {
                trigger: ".intro-copy h2",
                start: "top 82%",
                end: "bottom 48%",
                scrub: 0.35,
              },
            },
          );
        }

        root.querySelectorAll(".sphere-sheen").forEach((sheen) => {
          const pulse = gsap.to(sheen, {
            opacity: 0.75,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            paused: true,
          });
          const triggerEl =
            (sheen as HTMLElement).closest(".contact-section") ??
            heroScroll ??
            root;
          ScrollTrigger.create({
            trigger: triggerEl,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => (self.isActive ? pulse.play() : pulse.pause()),
            onRefresh: (self) => (self.isActive ? pulse.play() : pulse.pause()),
          });
        });

        if (root.querySelector(".service-list") && root.querySelector(".service-row")) {
          gsap.from(".service-row", {
            x: 40,
            opacity: 0,
            stagger: 0.18,
            duration: 0.8,
            clearProps: "all",
            scrollTrigger: {
              trigger: ".service-list",
              start: "top 88%",
              once: true,
            },
          });
        }

        if (root.querySelector(".process-grid") && root.querySelector(".process-number")) {
          gsap.from(".process-number", {
            yPercent: 35,
            opacity: 0,
            stagger: 0.15,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: ".process-grid",
              start: "top 88%",
              once: true,
            },
          });
        }

        if (root.querySelector(".contact-mark") && root.querySelector(".contact-section")) {
          gsap.fromTo(
            ".contact-mark",
            { rotation: -50, scale: 0.65 },
            {
              rotation: 90,
              scale: 1.2,
              ease: "none",
              scrollTrigger: {
                trigger: ".contact-section",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        }

        if (root.querySelector(".footer-wordmark-inner")) {
          gsap.from(".footer-wordmark-inner", {
            yPercent: 105,
            duration: 1.2,
            ease: "power4.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: ".site-footer",
              start: "top 92%",
              once: true,
            },
          });
        }

        media!.add(
          {
            desktop: "(min-width: 961px) and (min-height: 650px)",
            compact: "(max-width: 960px), (max-height: 649px)",
          },
          (mq) => {
            if (!heroScroll) return;
            if (mq.conditions?.desktop) {
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: heroScroll,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.7,
                  },
                })
                .to(".hero-line-0", { xPercent: -22, y: -90, ease: "none" }, 0)
                .to(".hero-line-1", { xPercent: 25, y: -40, ease: "none" }, 0)
                .to(".hero-line-2", { xPercent: -12, y: 30, ease: "none" }, 0)
                .to(
                  ".hero-orbit",
                  { xPercent: -27, scale: 1.85, yPercent: 8, ease: "none" },
                  0,
                )
                .to(".hero-orbit", { opacity: 0.55, duration: 0.24 }, 0.46)
                .to(".hero-title", { opacity: 0.35, duration: 0.2 }, 0.5)
                .to(
                  ".hero-topline, .hero-bottom, .hero-coordinate",
                  { autoAlpha: 0, duration: 0.16 },
                  0,
                )
                .to(".orbit-ring", { scale: 1.3, duration: 0.7, ease: "none" }, 0);
            } else {
              gsap.to(".orb-scroll", {
                y: 65,
                scale: 1.12,
                ease: "none",
                scrollTrigger: {
                  trigger: heroScroll,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.5,
                },
              });
            }
          },
        );

        /* Orb pointer quickTo only — skip studio-cursor chrome */
        media!.add("(hover: hover) and (pointer: fine)", () => {
          const pointer = root.querySelector(".orb-pointer") as HTMLElement | null;
          if (!pointer || !heroScroll) return;
          const qx = gsap.quickTo(pointer, "x", { duration: 1.2, ease: "power3.out" });
          const qy = gsap.quickTo(pointer, "y", { duration: 1.2, ease: "power3.out" });
          const onMove = (event: PointerEvent) => {
            if (heroScroll.getBoundingClientRect().bottom > 0) {
              qx((event.clientX / window.innerWidth - 0.5) * 38);
              qy((event.clientY / window.innerHeight - 0.5) * 28);
            }
          };
          window.addEventListener("pointermove", onMove, { passive: true });
          return () => {
            window.removeEventListener("pointermove", onMove);
            qx.tween.kill();
            qy.tween.kill();
            gsap.killTweensOf(pointer);
            gsap.set(pointer, { clearProps: "all" });
          };
        });
      }, root);

      const onResize = () => {
        if (killed || resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
          resizeRaf = 0;
          lenis?.resize();
          ScrollTrigger.refresh();
        });
      };
      ro = new ResizeObserver(onResize);
      ro.observe(root);
      void document.fonts.ready.then(() => {
        if (!killed) onResize();
      });
      onResize();
    };

    const sync = () => {
      if (motionAllowed()) {
        if (!active) setup();
      } else if (active) {
        teardown();
      }
    };

    sync();

    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    const frame = root.closest(".site-frame") ?? root;
    if (frame !== document.documentElement) {
      mo.observe(frame, { attributes: true, attributeFilter: ["data-motion"] });
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", sync);

    return () => {
      mo.disconnect();
      mq.removeEventListener("change", sync);
      teardown();
    };
  }, [rootRef]);
}
