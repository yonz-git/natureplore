"use client";

import { useState } from "react";
import Intro from "@/components/Intro";

// Plays the logo intro before what it wraps, A0 · Welcome. The welcome only mounts on Continue or
// Skip, so its own opening (the words, the liquid layer) starts then instead of running unseen
// under the intro; the intro fades away over it and is removed.
// It plays when the site is opened or reloaded, not when someone comes back to the start from inside
// the app: the flag lives as long as the loaded page does.
let played = false;

export default function IntroGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"intro" | "leaving" | "done">(played ? "done" : "intro");

  return (
    <>
      {phase !== "intro" && children}
      {phase !== "done" && (
        <Intro
          onContinue={() => {
            played = true;
            setPhase("leaving");
          }}
          onGone={() => setPhase("done")}
        />
      )}
    </>
  );
}
