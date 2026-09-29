"use client";

// The permission prompt, asked only after the person chooses to use their location. It stands in
// for the one the platform shows, so it reads the way each platform's does: the system alert on the
// phone, the browser's own prompt on the desktop. Allowing goes to A4, declining to A5, the region
// without a location. Boards: "System location dialog over A1" and "Browser location prompt over
// A1, desktop".

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useIsDesktop } from "@/lib/useIsDesktop";

export default function LocationDialog({
  onAllow,
  onDecline,
  onDismiss = onDecline,
}: {
  onAllow: () => void;
  onDecline: () => void;
  /** Escape or a click beside it closes the prompt without answering it */
  onDismiss?: () => void;
}) {
  const desktop = useIsDesktop();
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onDismiss, desktop]);

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

  // The prompt belongs to the whole window, not to the screen under it, so it is put on the body:
  // a screen is a fixed layer, and a dialog left inside one would sit under the tab bar.
  return createPortal(
    <>
      <button type="button" className="dialog-scrim" aria-label="Close" tabIndex={-1} onClick={onDismiss} />
      <div
        className={`dialog${desktop ? " is-browser" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-note"
      >
        <div className="dialog-head">
          <p id="dialog-title" className="dialog-title">
            {copy.title}
          </p>
          <p id="dialog-note" className="dialog-note">
            Shows routes and spots near you. Only used on this device.
          </p>
        </div>
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

/**
 * Asking for the location from any screen: `ask` shows the prompt, allowing goes to A4 and
 * declining to `declineTo`, or leaves the screen as it is when there is none. Closing the prompt
 * without answering it stays where it was.
 */
export function useLocationPrompt(declineTo?: string) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const node = open ? (
    <LocationDialog
      onAllow={() => router.push("/map/near-you")}
      onDecline={() => {
        setOpen(false);
        if (declineTo) router.push(declineTo);
      }}
      onDismiss={() => setOpen(false)}
    />
  ) : null;
  return { ask: () => setOpen(true), prompt: node };
}
