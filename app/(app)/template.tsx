"use client";

import { usePathname } from "next/navigation";

// Next renders a fresh template on every navigation, so the enter animation in app/transitions.css
// runs once per screen. Tab switches are shorter: they happen many times a day.
const TABS = ["/map", "/learn", "/notebook"];

export default function ScreenTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTab = TABS.includes(pathname);

  return (
    <div className={`screen-enter${isTab ? " screen-enter-tab" : ""}`}>
      {children}
    </div>
  );
}
