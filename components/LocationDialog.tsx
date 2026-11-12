"use client";

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
            Sorts the routes by distance from you. Only used on this device.
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
