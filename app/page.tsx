import Welcome from "@/components/Welcome";

// The opening, which scrolls into A0 · Welcome. The page opens on the green field with no logo:
// the scroll builds the logo and opens the photograph behind it (components/WelcomeLogo.tsx).
// "Go to map" goes on to the tabbed app.
export default function Home() {
  return <Welcome />;
}
