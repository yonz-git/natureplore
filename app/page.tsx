import IntroGate from "@/components/IntroGate";
import Welcome from "@/components/Welcome";

// A0 · Welcome, logo applied, the logo intro, then A0 · Welcome, which scrolls into A0-2 · Welcome.
// "Go to map" goes on to the tabbed app.
export default function Home() {
  return (
    <IntroGate>
      <Welcome />
    </IntroGate>
  );
}
