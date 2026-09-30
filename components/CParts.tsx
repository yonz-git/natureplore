"use client";

// Pieces the Flow C pages share: the back control, the tag and benefit pills, the stat tile, the
// fact list, share, and the dialog frame the source (C2) and the registration (C4) open in.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  BackIcon,
  BagIcon,
  CalendarIcon,
  CarbonIcon,
  CheckIcon,
  DownIcon,
  LeafIcon,
  PeopleIcon,
  PinIcon,
  ShareIcon,
  UpIcon,
  WalkIcon,
  WaterIcon,
} from "@/components/Icons";
import type { Benefit, Fact } from "@/lib/actions";
import type { Tag } from "@/lib/claims";

const TAG_ICON = { down: DownIcon, up: UpIcon, leaf: LeafIcon, water: WaterIcon } as const;
const FACT_ICON = { calendar: CalendarIcon, pin: PinIcon, people: PeopleIcon, walk: WalkIcon, bag: BagIcon, check: CheckIcon } as const;
const BENEFIT_ICON: Record<Benefit, typeof WaterIcon> = { "Habitat condition": WaterIcon, Biodiversity: LeafIcon, Carbon: CarbonIcon };

/** Round back control over the photograph on the phone, a text link at the top of the sheet from 64rem. */
export function BackTop({ href, label, share }: { href: string; label: string; share?: string }) {
  return (
    <div className="org-top">
      <Link href={href} className="round glass glass-pin" aria-label={label}>
        <BackIcon size={20} />
      </Link>
      {share && (
        <div className="org-actions">
          <ShareButton title={share} className="round glass glass-pin" />
        </div>
      )}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="org-back">
      <BackIcon size={18} />
      {label.replace(/^Back to /, "").replace(/^./, (c) => c.toUpperCase())}
    </Link>
  );
}

export function ShareButton({ title, className, label = false }: { title: string; className: string; label?: boolean }) {
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title, url: location.href });
      else await navigator.clipboard.writeText(location.href);
    } catch {
      // the person closed the share sheet
    }
  };
  return (
    <button type="button" className={className} aria-label={label ? undefined : "Share"} onClick={share}>
      <ShareIcon size={label ? 19 : 20} />
      {label && "Share"}
    </button>
  );
}

export function Tags({ tags }: { tags: Tag[] }) {
  return (
    <ul className="cp-tags">
      {tags.map((t) => {
        const I = TAG_ICON[t.icon];
        return (
          <li key={t.label} className="cp-tag">
            <I size={16} />
            {t.label}
          </li>
        );
      })}
    </ul>
  );
}

export function KindTag({ kind, icon }: { kind: string; icon: "people" | "leaf" | "bag" }) {
  const I = icon === "people" ? PeopleIcon : icon === "bag" ? BagIcon : LeafIcon;
  return (
    <p className="cp-tag cp-kind">
      <I size={16} />
      {kind}
    </p>
  );
}

export function Benefits({ items }: { items: Benefit[] }) {
  return (
    <div className="cp-benefits">
      <p className="org-small">Direct ecological benefit</p>
      <ul className="cp-tags">
        {items.map((b) => {
          const I = BENEFIT_ICON[b];
          return (
            <li key={b} className="cp-tag">
              <I size={16} />
              {b}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Facts({ items }: { items: Fact[] }) {
  return (
    <ul className="cp-facts">
      {items.map((f) => {
        const I = FACT_ICON[f.icon];
        return (
          <li key={f.text}>
            <I size={20} />
            <span>{f.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="cp-stat">
      <span>{label}</span>
      <span>
        <b>{value}</b>
        {unit && <small>{unit}</small>}
      </span>
    </div>
  );
}

/**
 * A modal sheet over a dimmed page: the source of a claim (C2) and the registration (C4). Focus
 * goes to its title, Tab stays inside, Escape closes it.
 */
export function Dialog({ labelledBy, close, children }: { labelledBy: string; close: string; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.querySelector<HTMLElement>(`#${labelledBy}`)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        router.replace(close);
        return;
      }
      if (e.key !== "Tab") return;
      const all = [...el.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (!all.length) return;
      const first = all[0];
      const last = all[all.length - 1];
      if (e.shiftKey && (document.activeElement === first || !el.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [labelledBy, close, router]);

  return (
    <section className="cp-dialog">
      <div className="cp-veil" aria-hidden="true" />
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby={labelledBy} className="cp-dialog-sheet glass glass-top">
        <div className="ms-handle" aria-hidden="true" />
        {children}
      </div>
    </section>
  );
}
