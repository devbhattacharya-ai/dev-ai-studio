"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "start" | "run";

/**
 * Rolls each digit into place when the text enters the screen.
 * The readable final value stays in the DOM for assistive tech.
 * Phone numbers and other values that must not move should not use this.
 */
export function RunningText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const hasDigit = /\d/.test(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasDigit) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("idle");
      return;
    }

    let rafA = 0;
    let rafB = 0;
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      setPhase("start");
      rafA = window.requestAnimationFrame(() => {
        rafB = window.requestAnimationFrame(() => setPhase("run"));
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafA);
      window.cancelAnimationFrame(rafB);
    };
  }, [hasDigit, text]);

  if (!hasDigit) return <>{text}</>;

  let digitIndex = 0;
  return (
    <span ref={ref} className="running-num">
      <span aria-hidden="true" className="running-num-visual">
        {Array.from(text).map((ch, i) => {
          if (!/\d/.test(ch)) {
            return (
              <span className="running-char" key={`${text}-${i}`}>
                {ch}
              </span>
            );
          }
          const order = digitIndex;
          digitIndex += 1;
          return (
            <Reel
              key={`${text}-${i}`}
              digit={Number(ch)}
              phase={phase}
              delay={Math.min(order, 10) * 48}
            />
          );
        })}
      </span>
      <span className="running-num-copy">{text}</span>
    </span>
  );
}

function Reel({
  digit,
  phase,
  delay,
}: {
  digit: number;
  phase: Phase;
  delay: number;
}) {
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const at = phase === "start" ? 0 : 10 + digit;
  return (
    <span className="running-reel" data-phase={phase}>
      <span
        className="running-reel-strip"
        style={{
          transform: `translateY(${-at}em)`,
          transitionDelay: phase === "run" ? `${delay}ms` : "0ms",
        }}
      >
        {cells.map((n, i) => (
          <span key={i}>{n}</span>
        ))}
      </span>
    </span>
  );
}
