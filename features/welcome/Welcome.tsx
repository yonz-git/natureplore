import Link from "next/link";
import CtaSquirrel from "@/features/welcome/CtaSquirrel";
import LetterWave from "@/features/welcome/LetterWave";
import Logo from "@/components/Logo";
import WelcomeCue from "@/features/welcome/WelcomeCue";
import WelcomeHero from "@/features/welcome/WelcomeHero";
import WelcomeLogo from "@/features/welcome/WelcomeLogo";
import WelcomeReveal from "@/features/welcome/WelcomeReveal";
import WelcomeRoute from "@/features/welcome/WelcomeRoute";
import WelcomeScroll from "@/features/welcome/WelcomeScroll";
import WelcomeZoom from "@/features/welcome/WelcomeZoom";

export default function Welcome({ still = false }: { still?: boolean }) {
  return (
    <div className={still ? undefined : "a0s"}>
      <div className="a02" data-screen={still ? "A0 · Welcome" : "Opening, A0 · Welcome"}>
        {!still && (
          <div className="a0-field" aria-hidden="true">
            <WelcomeReveal />
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
        {}
        {still ? (
          <div className="a0-mark-corner">
            <Logo symbol />
          </div>
        ) : (
          <WelcomeLogo />
        )}

        {}
        {!still && <WelcomeHero lines={["Natureplore", "all around"]} />}

        <WelcomeRoute />

        <main className="a02-main">
          <h1 className="a02-h1">
            Explore <br className="a02-br" />
            <span className="a02-close">all the corners of <span className="a02-nature">Nature</span></span>
          </h1>
          <p className="a02-lead">What nests and grows there, and learn about what is happening to them.</p>
          <Link href="/start" className="a02-cta">
            <LetterWave text="Start Natureploring" />
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
