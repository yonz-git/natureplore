"use client";

// Next renders a fresh template on every navigation, so the enter animations in
// app/transitions.css run once per screen. The wrapper itself never animates: it would become a
// backdrop root and switch off the frost on the glass inside it.
export default function ScreenTransition({ children }: { children: React.ReactNode }) {
  return <div className="screen-enter">{children}</div>;
}
