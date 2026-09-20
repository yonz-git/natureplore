"use client";

// The permission prompt, asked only after the person chooses to use their location. It stands in
// for the one the platform shows, so it reads the way each platform's does: an action sheet on the
// phone, the browser's own bubble on the desktop. Allowing goes to A4, declining leaves the screen
// where it was, which is what both platforms do.

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useIsDesktop } from "@/lib/useIsDesktop";

export default function LocationDialog({
  onAllow,
  onDecline,
}: {
  onAllow: () => void;
  onDecline: () => void;
}) {
  const desktop = useIsDesktop();
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDecline();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onDecline]);

  // The platform's own words, not ours: a phone asks for this once, a browser asks per site.
  const copy = desktop
    ? {
        title: "natureplore wants to know your location",
        actions: ["Allow on every visit", "Allow this time"],
        decline: "Never allow",
      }
    : {
        title: "Allow Natureplore to use your location?",
        actions: ["Allow once", "Allow while using app"],
        decline: "Don’t allow",
      };

  // The prompt belongs to the whole window, not to the screen under it. A screen is a fixed
  // layer, which is its own stacking context, so a dialog left inside one would sit under the
  // tab bar however high its z-index. It is put on the body instead.
  return createPortal(
    <>
      <button type="button" className="dialog-scrim" aria-label="Close" onClick={onDecline} />
      <div className="dialog glass glass-card" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <p id="dialog-title" className="dialog-title">
          {copy.title}
        </p>
        <p className="dialog-note">Shows recorded places near you. Only used on this device.</p>
        <div className="dialog-actions">
          {copy.actions.map((label, i) => (
            <button
              key={label}
              type="button"
              ref={i === 0 ? first : undefined}
              className={`dialog-btn${i === 0 ? " is-strong" : ""}`}
              onClick={onAllow}
            >
              {label}
            </button>
          ))}
          <button type="button" className="dialog-btn" onClick={onDecline}>
            {copy.decline}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
