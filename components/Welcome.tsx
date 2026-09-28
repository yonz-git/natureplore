import Link from "next/link";
import Logo from "@/components/Logo";
import RegionMap from "@/components/RegionMap";
import WelcomeCue from "@/components/WelcomeCue";
import WelcomeEther from "@/components/WelcomeEther";
import WelcomeHero from "@/components/WelcomeHero";
import WelcomeLogo from "@/components/WelcomeLogo";
import WelcomeReveal from "@/components/WelcomeReveal";
import WelcomeScroll from "@/components/WelcomeScroll";
import WelcomeZoom from "@/components/WelcomeZoom";

// A0 · Welcome and A0-2 · Welcome as one page. It opens as A0: the green field and one line,
// "Natureplore all around,", blurring in word by word in the middle of the screen, no logo. Scrolling
// takes that line away as the forest photograph opens in a growing circle with a glowing rim, builds
// the logo piece by piece in the middle and sends it to the top left corner
// (components/WelcomeLogo.tsx), and only then brings in A0-2: the statements, the nav, the green
// action, and the map card last. The card holds the same map as the Map tab,
// fitted to the region and fixed: it is a picture of where you are going, not a control.
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
            ? `color-mix(in srgb, var(--color-group-plants) ${(first + i - 8) * 20}%, var(--color-on-ground))`
            : undefined,
        }}
      >
        {w}
      </span>
    </span>
  ));
}

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
          <div className="a02-photo">
            <div className="a02-photo-in" />
          </div>
        </div>
        {!still && <div className="a0-orb" aria-hidden="true" />}
        {/* the logo: built by the scroll on A0, already in its corner on A0-2 */}
        {still ? (
          <div className="a0-mark-corner">
            <Logo symbol />
          </div>
        ) : (
          <WelcomeLogo />
        )}

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

        {/* what the page opens on, alone in the middle of the screen until the scroll takes it away */}
        {!still && <WelcomeHero text="Natureplore all around" />}

        <main className="a02-main">
          <h1 className="a02-h1" aria-label="Natureplore all around, what nests and grows there and what is happening to them.">
            <span className="a0-l1" aria-hidden="true">
              <Words text="Natureplore all around," first={0} />
            </span>
            <span className="a0-l2" aria-hidden="true">
              <Words text="what nests and grows there" first={3} />
            </span>
            {/* "to them." sits on a second row in A0-2 and at the end of the row in A0 on desktop.
                The hidden copy keeps the row as wide as the whole sentence. */}
            <span className="a0-l3" aria-hidden="true">
              <span className="a0-l3a">
                <Words text="and what is happening" first={8} tint />
                <span className="a0-l3b">
                  <Words text="to them." first={12} tint />
                </span>
              </span>
              <span className="a0-ghost"> to them.</span>
            </span>
          </h1>
          <Link href="/map" className="a02-cta">
            Go to map
          </Link>
        </main>

        <div className="a02-card glass glass-card" aria-hidden="true">
          <RegionMap className="a02-map" still />
        </div>

        {!still && <WelcomeCue text="Scroll" />}
        <WelcomeZoom />
        {!still && <WelcomeScroll />}
      </div>
    </div>
  );
}
