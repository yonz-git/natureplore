"use client";

// The pieces the map screens share, so the same control reads the same on every screen and at
// both sizes: the search field, the organism pills and the desktop map tools.
// Layout: app/map.css. Glass: app/glass.css.

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ClearIcon, GroupIcon, LocationIcon, SearchIcon } from "@/components/Icons";
import { GROUPS, type Counts } from "@/lib/routes";

/**
 * The search field. Submitting it opens the results, which is what A2 and A3 are, so the same
 * field searches from wherever it is typed in.
 */
export function SearchField({
  label = "Search a region or an organism",
  defaultValue = "",
  autoFocus = false,
  inner = false,
  onChange,
}: {
  label?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  /** resting on a glass sheet it is inner glass; floating over the map it is glass */
  inner?: boolean;
  onChange?: (value: string) => void;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [shown, setShown] = useState(0);
  // the placeholder names one group at a time, so the field says what an organism can be
  useEffect(() => {
    if (value || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setShown((i) => (i + 1) % GROUPS.length), 1500);
    return () => clearInterval(id);
  }, [value]);
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
        <SearchIcon />
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
            <span className="field-hint-text">{label}</span>
            <span className="field-hint-icons">
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

/** The organism counts, always as pills in the fixed group order. A group with none is left out. */
export function OrganismPills({ counts, all = false }: { counts: Counts; all?: boolean }) {
  // `all` is the route card on B1, which shows every group and says so when one has none yet
  return (
    <ul className="pills" aria-label="Organisms recorded along it">
      {GROUPS.filter((g) => all || counts[g.id]).map((g) => (
        <li key={g.id} className={`pill-org${counts[g.id] ? "" : " is-none"}`}>
          <GroupIcon group={g.id} />
          <b>{counts[g.id] ?? 0}</b>
          <span className="sr-only">{counts[g.id] ? g.label.toLowerCase() : `${g.label.toLowerCase()}, none recorded yet`}</span>
        </li>
      ))}
    </ul>
  );
}

/** The map's own control on the desktop, in the top right: locate, where the location is on. */
export function MapTools({ locate }: { locate?: () => void }) {
  if (!locate) return null;
  return (
    <div className="ms-tools">
      <button type="button" className="round glass glass-pin" aria-label="Show where I am" onClick={locate}>
        <LocationIcon size={20} />
      </button>
    </div>
  );
}
