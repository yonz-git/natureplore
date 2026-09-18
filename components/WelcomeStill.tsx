import Link from "next/link";
import MapSketch from "@/components/MapSketch";

// A0-2 · Welcome. The still welcome over the forest photograph. Styles: app/welcome2.css, glass: app/glass.css.
// Boards: "A0-2 · Welcome, version 6", phone and desktop, on the design system test canvas.

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

export default function WelcomeStill() {
  return (
    <div className="a02" data-screen="A0-2 · Welcome">
      <div className="a02-photo" aria-hidden="true" />
      <div className="a02-filter" aria-hidden="true" />

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
        <h1 className="a02-h1">
          <span>Places near you.</span>
          <span>What lives there.</span>
          <span className="a02-accent">What is changing.</span>
        </h1>
        <p className="a02-copy">
          A map of wild places in Berlin and Brandenburg, the species recorded
          there by season, and ways to protect them.
        </p>
        <Link href="/map" className="a02-cta">
          See the map
        </Link>
        <p className="a02-note">No account needed to look around</p>
      </main>

      <div className="a02-card glass glass-card glass-top glass-clip" aria-hidden="true">
        <MapSketch className="a02-map a02-map-tall" viewBox="30 60 330 250" places />
        <MapSketch className="a02-map a02-map-wide" viewBox="-20 30 420 480" places />
      </div>
    </div>
  );
}
