"use client";

import { useEffect, useState } from "react";
import { HOME } from "@/lib/content";
import { WA_PRIMARY } from "@/lib/links";
import { MessageCircle } from "./Icons";

/** Sticky motion control + “Plan your project” FAB → WhatsApp in 1 tap. */
export function ProjectGuideFab() {
  const [motionOn, setMotionOn] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      if (mq.matches) setMotionOn(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motionOn && !reduced ? "on" : "off";
  }, [motionOn, reduced]);

  return (
    <>
      <button
        type="button"
        className="motion-toggle label"
        disabled={reduced}
        aria-pressed={motionOn}
        onClick={() => setMotionOn((v) => !v)}
      >
        <span className="motion-toggle-dot" aria-hidden="true" />
        {reduced
          ? HOME.motion.reduced
          : motionOn
            ? HOME.motion.pause
            : HOME.motion.resume}
      </button>

      <a
        className="assistant-fab"
        href={WA_PRIMARY}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle />
        <span>{HOME.fab}</span>
      </a>
    </>
  );
}
