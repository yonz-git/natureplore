import Link from "next/link";
import MapSketch from "@/components/MapSketch";
import WelcomeEther from "@/components/WelcomeEther";
import WelcomeReveal from "@/components/WelcomeReveal";
import WelcomeScroll from "@/components/WelcomeScroll";

// A0 · Welcome and A0-2 · Welcome as one page. It opens as A0: the green field and the three
// statements, which blur in word by word. Scrolling moves the statements to their A0-2 places,
// opens the forest photograph in a growing circle with a glowing rim, brings in the nav and the
// green action, and fades the map in last.
// With `still` it is A0-2 alone, nothing moves.
// Layout: app/welcome2.css. Field, intro and scroll choreography: app/welcome.css, fed by
// components/WelcomeScroll.tsx. Glass: app/glass.css.
// Boards: "A0 · Welcome, version 4 (animated)" and "A0-2 · Welcome, version 6", phone and desktop.

const TABS = [
  {
    href: "/map",
    label: "Map",
    current: true,
    icon: (
      <>
        <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
        <path d="M9 4v13.5M15 6.5V20" />
      </>
    ),
  },
  {
    href: "/learn",
    label: "Learn",
    icon: (
      <>
        <path d="M12 6.5C10.4 5.2 8 4.6 4 4.8v13.6c4-.2 6.4.4 8 1.6 1.6-1.2 4-1.8 8-1.6V4.8c-4-.2-6.4.4-8 1.7z" />
        <path d="M12 6.5V20" />
      </>
    ),
  },
  {
    href: "/notebook",
    label: "Notebook",
    icon: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M9 3.5v17M12.5 9H16M12.5 13H16" />
      </>
    ),
  },
];

// one span per word, so the words can come in one after another across the lines
function Words({ text, first, tint }: { text: string; first: number; tint?: boolean }) {
  return text.split(" ").map((w, i) => (
    <span key={i}>
      {i > 0 && " "}
      <span
        className="a0-w"
        style={{
          animationDelay: `${300 + (first + i) * 85}ms`,
          // the last statement runs from white to the accent tint, word by word
          color: tint
            ? `color-mix(in srgb, var(--color-accent-tint) ${(first + i - 6) * 25}%, var(--color-on-ground))`
            : undefined,
        }}
      >
        {w}
      </span>
    </span>
  ));
}

const Rule = ({ n }: { n: 1 | 2 }) => (
  <span className="a0-rule" aria-hidden="true">
    <span style={{ animationDelay: `${1650 + n * 150}ms` }} />
  </span>
);

export default function Welcome({ still = false }: { still?: boolean }) {
  return (
    <div className={still ? undefined : "a0s"}>
      <div className="a02" data-screen={still ? "A0-2 · Welcome" : "A0 · Welcome, A0-2 · Welcome"}>
        {!still && (
          <div className="a0-field" aria-hidden="true">
            <div className="a0-blob a0-blob-1" />
            <div className="a0-blob a0-blob-b a0-blob-2" />
            <div className="a0-blob a0-blob-3" />
            <div className="a0-blob a0-blob-b a0-blob-4" />
            <WelcomeReveal />
            <div className="a0-ether">
              <WelcomeEther />
            </div>
            <svg className="a0-grain">
              <filter id="a0-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#a0-grain)" />
            </svg>
          </div>
        )}
        <div className="a0-lens" aria-hidden="true">
          <div className="a02-photo" />
        </div>
        {!still && <div className="a0-orb" aria-hidden="true" />}

        <div className="a02-mark">natureplore</div>
        <nav aria-label="Main" className="a02-nav glass glass-nav">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.current ? "page" : undefined}
              className="a02-tab"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {tab.icon}
              </svg>
              {tab.label}
            </Link>
          ))}
        </nav>

        <main className="a02-main">
          <h1 className="a02-h1" aria-label="Places near you. What lives there. What is happening to them.">
            <span className="a0-l1" aria-hidden="true">
              <Words text="Places near you." first={0} />
            </span>
            <span className="a0-l2" aria-hidden="true">
              <Words text="What lives there." first={3} />
              <Rule n={1} />
            </span>
            {/* "to them." sits on a second row in A0-2 and at the end of the row in A0 on desktop.
                The hidden copy keeps the row as wide as the whole sentence. */}
            <span className="a0-l3" aria-hidden="true">
              <span className="a0-l3a">
                <Words text="What is happening" first={6} tint />
                <span className="a0-l3b">
                  <Words text="to them." first={9} tint />
                </span>
              </span>
              <span className="a0-ghost"> to them.</span>
              <Rule n={2} />
            </span>
          </h1>
          <Link href="/map" className="a02-cta">
            See the map
          </Link>
        </main>

        <div className="a02-card glass glass-card glass-top glass-clip" aria-hidden="true">
          <MapSketch className="a02-map a02-map-tall" viewBox="30 60 330 250" places />
          <MapSketch className="a02-map a02-map-wide" viewBox="-20 30 420 480" places />
        </div>

        {!still && (
          <div className="a0-cue" aria-hidden="true">
            <span>Scroll</span>
          </div>
        )}
        {!still && <WelcomeScroll />}
      </div>
    </div>
  );
}
