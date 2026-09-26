"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { INTRO_LOGO_SVG } from "@/components/intro-logo";
import { playIntro } from "@/lib/intro-timeline";

// A0 · Welcome, logo applied: the logo intro from the "Logo 3-2" board. The forest photograph
// behind its veil, and the logo assembling itself in the middle: the plant, the bird and the
// mushroom gather into the symbol, then the swan, the snake, the squirrel and the leaf spell out
// the wordmark. Once the animals have settled, Replay and Continue come up; Continue goes on to
// A0 · Welcome. Skip is there the whole time.
// Layout and loops: app/intro.css. Timeline: lib/intro-timeline.ts. Logo: components/intro-logo.ts.

export default function Intro() {
  const [run, setRun] = useState(0);
  const [settled, setSettled] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const intro = playIntro(root, () => setSettled(true));
    return () => intro.revert();
  }, [run]);

  const replay = () => {
    setSettled(false);
    setRun((n) => n + 1);
  };

  return (
    <main className="intro" data-screen="A0 · Welcome, logo applied">
      {/* a replay mounts the stage afresh, so the pieces, the photo zoom and the loops all restart */}
      <div className="intro-stage" key={run} ref={stage}>
        <div className="intro-photo" aria-hidden="true" />
        <div className="intro-veil" aria-hidden="true" />
        <div className="intro-mark" dangerouslySetInnerHTML={{ __html: INTRO_LOGO_SVG }} />
      </div>

      {settled ? (
        <div className="intro-actions">
          <button type="button" className="intro-replay glass glass-pill" onClick={replay}>
            Replay
          </button>
          <Link href="/" className="intro-continue">
            Continue
          </Link>
        </div>
      ) : (
        <Link href="/" className="intro-skip">
          Skip
        </Link>
      )}
    </main>
  );
}
