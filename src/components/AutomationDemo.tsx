"use client";

import { useEffect, useRef, useState } from "react";
import { HOME } from "@/lib/content";
import { waDemo } from "@/lib/links";
import { GhostLink } from "./GhostLink";
import { RotateCcw } from "./Icons";

export function AutomationDemo() {
  const [scenario, setScenario] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const tree = HOME.demo.trees[scenario];
  const done = answers.length === tree.length;
  const choices = answers.map((idx, step) => tree[step].choices[idx]);
  const actionRef = useRef<HTMLDivElement>(null);

  /* Keep keyboard focus inside the demo after each step (buttons remount). */
  useEffect(() => {
    const root = actionRef.current;
    if (!root) return;
    const focusable = root.querySelector<HTMLElement>(
      'button:not([disabled]), a[href]',
    );
    focusable?.focus();
  }, [answers, scenario, done]);

  return (
    <section
      id="automation-demo"
      className="page-shell section-space automation-section"
      aria-labelledby="automation-title"
    >
      <div className="section-meta">
        <p className="label">{HOME.demo.meta}</p>
        <span className="label">{HOME.demo.metaSide}</span>
      </div>
      <div className="automation-layout">
        <div className="automation-intro">
          <h2 id="automation-title">
            {HOME.demo.h2[0]}
            <br />
            {HOME.demo.h2[1]}
          </h2>
          <p>{HOME.demo.body}</p>
          <ol className="automation-steps">
            {HOME.demo.steps.map((step, i) => (
              <li key={step} data-current={Math.min(answers.length, 2) === i}>
                <span>0{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="demo-disclaimer">{HOME.demo.disclaimer}</p>
        </div>
        <div className="conversation-panel">
          <div
            className="scenario-picker"
            role="group"
            aria-label={HOME.demo.pickerAria}
          >
            {HOME.demo.scenarios.map((name, i) => (
              <button
                key={name}
                type="button"
                aria-pressed={scenario === i}
                onClick={() => {
                  setScenario(i);
                  setAnswers([]);
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <header className="conversation-header">
            <div>
              <span className="label">
                {HOME.demo.scenarios[scenario]} / {HOME.demo.panelSub}
              </span>
              <p>{HOME.demo.panelTitle}</p>
            </div>
            <button
              type="button"
              className="ghost-link"
              onClick={() => setAnswers([])}
              aria-label={HOME.demo.restartAria}
            >
              <RotateCcw />
            </button>
          </header>
          <div
            className="conversation-log"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {tree.slice(0, Math.min(answers.length + 1, tree.length)).map((turn, r) => (
              <div className="conversation-turn" key={turn.question}>
                <p className="chat-message">
                  <small>{HOME.demo.automatedLabel}</small>
                  {turn.question}
                </p>
                {answers[r] !== undefined ? (
                  <p className="chat-message chat-customer">
                    <small>{HOME.demo.youLabel}</small>
                    {turn.choices[answers[r]]}
                  </p>
                ) : null}
              </div>
            ))}
            {done ? (
              <div className="conversation-handoff" ref={actionRef}>
                <p className="label">{HOME.demo.handoffLabel}</p>
                <h3>{HOME.demo.handoffH3}</h3>
                <ul>
                  {choices.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className="handoff-note">{HOME.demo.handoffNote}</p>
                <GhostLink
                  href={waDemo(HOME.demo.scenarios[scenario])}
                  className="underlined"
                  external
                >
                  {HOME.demo.cta}
                </GhostLink>
                <p className="cta-note">{HOME.demo.ctaNote}</p>
              </div>
            ) : (
              <div className="conversation-options" ref={actionRef}>
                {tree[answers.length].choices.map((choice, idx) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setAnswers((prev) => [...prev, idx])}
                  >
                    {choice} →
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
