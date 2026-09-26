"use client";

import { useEffect, useRef, useState } from "react";
import { INTRO_LOGO_SVG } from "@/components/intro-logo";
import { playIntro } from "@/lib/intro-timeline";

// A0 · Welcome, logo applied: the logo intro from the "Logo 3-2" board, played before A0 · Welcome
// (components/IntroGate.tsx). The forest photograph behind its veil, and the logo assembling itself
// in the middle: the plant, the bird and the mushroom gather into the symbol, then the swan, the
// snake, the squirrel and the leaf spell out the wordmark. Skip is there the whole time; once the
// animals have settled, Replay and Continue come up. Skip and Continue call onContinue, which mounts
// the welcome under the intro; the intro holds still until the welcome has drawn its first frames
// (mounting it is heavy, and a fade started at the same moment would be swallowed), then fades away
// over it and calls onGone.
// Layout and loops: app/intro.css. Timeline: lib/intro-timeline.ts. Logo: components/intro-logo.ts.

export default function Intro({ onContinue, onGone }: { onContinue: () => void; onGone: () => void }) {
  const [run, setRun] = useState(0);
  const [settled, setSettled] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [fading, setFading] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const intro = playIntro(root, () => setSettled(true));
    return () => intro.revert();
  }, [run]);

  useEffect(() => {
    if (!leaving) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setFading(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [leaving]);

  const replay = () => {
    setSettled(false);
    setRun((n) => n + 1);
  };
  const leave = () => {
    setLeaving(true);
    onContinue();
  };

  return (
    <div
      className={fading ? "intro intro-leaving intro-fading" : leaving ? "intro intro-leaving" : "intro"}
      role={leaving ? undefined : "main"}
      aria-hidden={leaving || undefined}
      data-screen="A0 · Welcome, logo applied"
    >
      {/* a replay mounts the stage afresh, so the pieces, the photo zoom and the loops all restart.
          On the way out only the stage fades: the glass buttons are gone by then. */}
      <div
        className="intro-stage"
        key={run}
        ref={stage}
        onAnimationEnd={(e) => {
          if (fading && e.target === e.currentTarget) onGone();
        }}
      >
        <div className="intro-photo" aria-hidden="true" />
        <div className="intro-veil" aria-hidden="true" />
        <div className="intro-mark" dangerouslySetInnerHTML={{ __html: INTRO_LOGO_SVG }} />
      </div>

      {leaving ? null : settled ? (
        <div className="intro-actions">
          <button type="button" className="intro-replay glass glass-pill" onClick={replay}>
            Replay
          </button>
          <button type="button" className="intro-continue" onClick={leave}>
            Continue
          </button>
        </div>
      ) : (
        <button type="button" className="intro-skip" onClick={leave}>
          Skip
        </button>
      )}
    </div>
  );
}
