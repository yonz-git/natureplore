"use client";

import Link from "next/link";
import MapSketch from "@/components/MapSketch";

// A0 · Welcome (first open only), animated. Styles and keyframes: app/welcome.css.
// Board: "A0 · Welcome, version 4 (animated)", phone and desktop, on the design system test canvas.

const STATEMENTS = [
  "places near you, on a map",
  "what is recorded there",
  "what is happening to them",
];

// index of the first word of each statement, so the words come in one after another across lines
const FIRST_WORD = STATEMENTS.map((_, i) =>
  STATEMENTS.slice(0, i).join(" ").split(" ").filter(Boolean).length,
);

const T_RULES = 1800; // ms, the rules start to wipe in, once most words have landed
const T_UI = 2300; // ms, the interface starts to arrive

function replay() {
  document.getAnimations().forEach((a) => {
    a.cancel();
    a.play();
  });
}

const ui = (step: number) => ({ animationDelay: `${T_UI + step * 90}ms` });

export default function Welcome() {
  return (
    <div className="a0" data-screen="A0 · Welcome">
      <div className="a0-field" aria-hidden="true">
        <div className="a0-blob a0-blob-1" />
        <div className="a0-blob a0-blob-b a0-blob-2" />
        <div className="a0-blob a0-blob-3" />
        <div className="a0-blob a0-blob-b a0-blob-4" />
        <MapSketch className="a0-map" viewBox="-150 20 640 400" />
        <svg className="a0-grain">
          <filter id="a0-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#a0-grain)" />
        </svg>
      </div>

      <header className="a0-header">
        <button
          type="button"
          onClick={replay}
          aria-label="natureplore, replay the intro"
          className="a0-mark a0-ui"
          style={ui(0)}
        >
          natureplore
        </button>
        <nav aria-label="Main" className="a0-nav">
          <Link href="/learn" className="a0-navlink a0-ui" style={ui(1)}>
            Learn
          </Link>
          <Link href="/notebook" className="a0-navlink a0-ui" style={ui(2)}>
            Notebook
          </Link>
          <Link href="/map" className="a0-navlink a0-ghost a0-ui" style={ui(3)}>
            See the map
          </Link>
        </nav>
      </header>

      <h1 className="a0-h1">
        {STATEMENTS.map((text, line) => (
          <span key={text} className={`a0-line a0-line-${line + 1}`}>
            <span>
              {text.split(" ").map((w, i) => (
                <span key={i}>
                  <span
                    className="a0-w"
                    style={{ animationDelay: `${300 + (FIRST_WORD[line] + i) * 85}ms` }}
                  >
                    {w}
                  </span>{" "}
                </span>
              ))}
            </span>
            {line > 0 && (
              <span
                aria-hidden="true"
                className="a0-rule"
                style={{ animationDelay: `${T_RULES + (line - 1) * 150}ms` }}
              />
            )}
          </span>
        ))}
      </h1>

      <div className="a0-foot">
        <p className="a0-copy a0-ui" style={ui(4)}>
          A map of wild places in Berlin and Brandenburg, the species recorded
          there by season, and ways to protect them.
        </p>
        <div className="a0-action a0-ui" style={ui(5)}>
          <Link href="/map" className="a0-cta">
            See the map
            <svg width="22" height="12" viewBox="0 0 22 12" aria-hidden="true">
              <path
                d="M0 6h20M15 1l5 5-5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <span className="a0-note">No account needed to look around</span>
        </div>
      </div>
    </div>
  );
}
