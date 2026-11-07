"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BackIcon, ClearIcon, GroupIcon, SearchIcon } from "@/components/ui/Icons";
import { playGroup } from "@/lib/group-motion";
import { GROUPS, type Counts } from "@/lib/routes";

export function SearchField({
  label = "Search a region or an organism",
  defaultValue = "",
  autoFocus = false,
  inner = false,
  onChange,
  onBack,
}: {
  label?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  inner?: boolean;
  onChange?: (value: string) => void;
  onBack?: () => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (value || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setShown((i) => (i + 1) % GROUPS.length), 1800);
    return () => clearInterval(id);
  }, [value]);
  const hintIcons = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const icon = hintIcons.current?.children[shown];
    if (icon) playGroup(icon, GROUPS[shown].id, 150);
  }, [shown]);
  const set = (v: string) => {
    setValue(v);
    onChange?.(v);
  };

  return (
    <form
      role="search"
      className="flex min-w-0 grow"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/map/search?q=${encodeURIComponent(value.trim())}`);
      }}
    >
      <label htmlFor="map-q" className="sr-only">
        {label}
      </label>
      <div className={`field${inner ? " is-inner" : " glass glass-pill"}`}>
        {onBack ? (
          <button type="button" className="field-back" aria-label="Back" onClick={onBack}>
            <BackIcon size={20} />
          </button>
        ) : (
          <SearchIcon />
        )}
        <input
          id="map-q"
          type="search"
          value={value}
          autoFocus={autoFocus}
          autoComplete="off"
          onChange={(e) => set(e.target.value)}
        />
        {!value && (
          <span className="field-hint" aria-hidden="true">
            <SearchIcon className="field-hint-search" />
            <span className="field-hint-text">{label}</span>
            <span className="field-hint-icons" ref={hintIcons}>
              {GROUPS.map((g, i) => (
                <GroupIcon key={g.id} group={g.id} size={19.8} className={`is-${g.id}${i === shown ? " is-shown" : i === (shown + GROUPS.length - 1) % GROUPS.length ? " is-gone" : ""}`} />
              ))}
            </span>
          </span>
        )}
        {value && (
          <button type="button" className="field-clear" aria-label="Clear" onClick={() => set("")}>
            <ClearIcon />
          </button>
        )}
      </div>
    </form>
  );
}

export function OrganismPills({ counts, all = false }: { counts: Counts; all?: boolean }) {
  return (
    <ul className="pills" aria-label="Organisms recorded along it">
      {GROUPS.filter((g) => all || counts[g.id]).map((g) => (
        <li key={g.id} className={`pill-org${counts[g.id] ? "" : " is-none"}`}>
          <GroupIcon group={g.id} className={`is-${g.id}`} />
          <b>{counts[g.id] ?? 0}</b>
          <span className="sr-only">{counts[g.id] ? g.label.toLowerCase() : `${g.label.toLowerCase()}, none recorded yet`}</span>
        </li>
      ))}
    </ul>
  );
}
