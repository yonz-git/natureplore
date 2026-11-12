"use client";

export default function ScreenTransition({ children }: { children: React.ReactNode }) {
  return <div className="screen-enter">{children}</div>;
}
