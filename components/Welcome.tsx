import Link from "next/link";
import CtaSquirrel from "@/components/CtaSquirrel";
import Logo from "@/components/Logo";
import WelcomeCue from "@/components/WelcomeCue";
import WelcomeEther from "@/components/WelcomeEther";
import WelcomeHero from "@/components/WelcomeHero";
import WelcomeLogo from "@/components/WelcomeLogo";
import WelcomeReveal from "@/components/WelcomeReveal";
import WelcomeRoute from "@/components/WelcomeRoute";
import WelcomeScroll from "@/components/WelcomeScroll";
import WelcomeZoom from "@/components/WelcomeZoom";

// The opening, then A0 · Welcome, as one page. It opens on the green field and one line,
// "Natureplore all around", in the middle of the screen, no logo. Scrolling takes that line away as
// the forest photograph opens in a growing circle with a glowing rim, builds the logo piece by piece
// in the middle and sends the symbol to the top left corner (components/WelcomeLogo.tsx), and only
// then brings in A0: the heading, the line and the green action, the nav, and the route drawn across
// the photograph with the four things the map holds (components/WelcomeRoute.tsx).
// With `still` it is A0 alone, nothing moves.
// Layout: app/welcome2.css. Field, opening and scroll choreography: app/welcome.css, fed by
// components/WelcomeScroll.tsx. Glass: app/glass.css.
// Boards: "A0 · Welcome, version 4 (animated)" for the opening, "A0 · Welcome" and
// "A0 · Welcome, desktop" on the redesign canvas for the page it lands on.

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
    href: "/saved",
    label: "Saved",
    icon: <path d="M7 3.8h10V20l-5-3.6L7 20z" />,
  },
];

export default function Welcome({ still = false }: { still?: boolean }) {
  return (
    <div className={still ? undefined : "a0s"}>
      <div className="a02" data-screen={still ? "A0 · Welcome" : "Opening, A0 · Welcome"}>
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
        {/* the logo: built by the scroll, already in its corner when the page is still */}
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
                width="1.125rem"
                height="1.125rem"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
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

        <WelcomeRoute />

        <main className="a02-main">
          <h1 className="a02-h1">
            Explore <br className="a02-br" />
            <span className="a02-close">all the corners of <span className="a02-nature">Nature</span></span>
          </h1>
          <p className="a02-lead">What nests and grows there, and learn about what is happening to them.</p>
          <Link href="/map/start" className="a02-cta">
            Start Natureploring
            <CtaSquirrel />
          </Link>
        </main>

        {!still && <WelcomeCue text="Scroll" />}
        <WelcomeZoom />
        {!still && <WelcomeScroll />}
      </div>
    </div>
  );
}
