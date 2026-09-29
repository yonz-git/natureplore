"use client";

// The pieces every map screen is built from, so the same control reads the same on A1 to A7 and
// at both sizes: the search field, the Routes and Organisms segment, the organism pills, a route
// card, a saved card, a region row, the desktop tools and the panel's logo.
// Layout: app/map.css. Glass: app/glass.css.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  BookmarkIcon,
  ChevronIcon,
  ClearIcon,
  GroupIcon,
  LeafIcon,
  LocationIcon,
  PinIcon,
  RoutesIcon,
  SearchIcon,
} from "@/components/Icons";
import Logo from "@/components/Logo";
import { GROUPS, regionLine, type Counts, type Region, type Route, type Saved } from "@/lib/routes";
import { useSaved } from "@/lib/saved";

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
          placeholder={label}
          value={value}
          autoFocus={autoFocus}
          autoComplete="off"
          onChange={(e) => set(e.target.value)}
        />
        {value && (
          <button type="button" className="field-clear" aria-label="Clear" onClick={() => set("")}>
            <ClearIcon />
          </button>
        )}
      </div>
    </form>
  );
}

/**
 * Routes or Organisms, the two ways into the map. Organisms is A8, which is not built in the
 * prototype yet, so it is a control with nowhere to go rather than a link that would drop the
 * person back at the start.
 */
export function Segment() {
  return (
    <div role="group" aria-label="Two ways into the map" className="seg glass glass-pill">
      <span className="seg-opt" aria-current="page">
        <RoutesIcon size={18} />
        Routes
      </span>
      <button type="button" className="seg-opt" aria-disabled="true">
        <LeafIcon size={18} />
        Organisms
      </button>
    </div>
  );
}

/** The organism counts, always as pills in the fixed group order. A group with none is left out. */
export function OrganismPills({ counts }: { counts: Counts }) {
  return (
    <ul className="pills" aria-label="Organisms recorded along it">
      {GROUPS.filter((g) => counts[g.id]).map((g) => (
        <li key={g.id} className="pill-org">
          <GroupIcon group={g.id} />
          <b>{counts[g.id]}</b>
          <span className="sr-only">{g.label.toLowerCase()}</span>
        </li>
      ))}
    </ul>
  );
}

function SaveButton({ id, name }: { id: string; name: string }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);
  return (
    <button
      type="button"
      className="card-save"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
      onClick={() => toggle(id)}
    >
      <BookmarkIcon size={20} filled={saved} />
    </button>
  );
}

function Photo({ src }: { src?: string }) {
  // small local files at a fixed size: the optimiser would add a round trip for nothing
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img className="card-photo" src={src} alt="" /> : <span className="card-photo" aria-hidden="true" />;
}

/**
 * A route. `rich` is the A4 card on the phone: the tall photograph and the three stat tiles.
 * Every other list, and every list from 64rem, shows the compact card. L2, the route detail, is
 * not built in the prototype yet, so the card does not open anything.
 */
export function RouteCard({ route, rich = false }: { route: Route; rich?: boolean }) {
  return (
    <article className={`card${rich ? " card-rich" : ""}`} aria-label={route.name}>
      <Photo src={route.image} />
      <div className="card-text">
        <h3 className="card-name">{route.name}</h3>
        <p className="card-meta card-where">{route.where}</p>
        <p className="card-meta card-line">{route.line}</p>
        <p className="card-meta card-spots">{route.spots} spots</p>
      </div>
      <dl className="card-stats">
        <div className="card-stat">
          <dt>Distance</dt>
          <dd>
            <b>{route.km}</b>
            <span>km</span>
          </dd>
        </div>
        <div className="card-stat">
          <dt>Time</dt>
          <dd>
            <b>{route.time}</b>
            <span>h</span>
          </dd>
        </div>
        <div className="card-stat">
          <dt>Spots</dt>
          <dd>
            <b>{route.spots}</b>
          </dd>
        </div>
      </dl>
      <OrganismPills counts={route.counts} />
      <SaveButton id={route.id} name={route.name} />
    </article>
  );
}

/** A saved spot or route on A7: the compact card, with the save control filled. */
export function SavedCard({ item }: { item: Saved }) {
  return (
    <article className="card" aria-label={item.name}>
      <Photo src={item.image} />
      <div className="card-text">
        <h3 className="card-name">{item.name}</h3>
        <p className="card-meta card-line">{item.line}</p>
      </div>
      <OrganismPills counts={item.counts} />
      <SaveButton id={item.id} name={item.name} />
    </article>
  );
}

/** A region in the search results: mapped ones open A5, one that is not mapped opens A6. */
export function RegionRow({ region }: { region: Region }) {
  const mapped = region.routes !== undefined;
  return (
    <li>
      <Link
        className="row"
        href={mapped ? "/map/region" : `/map/not-mapped?place=${encodeURIComponent(region.name)}`}
      >
        <span className="row-disc">
          <PinIcon />
        </span>
        <span className="row-text">
          <span className="row-name">{region.name}</span>
          <span className="row-meta">{regionLine(region)}</span>
        </span>
        {mapped ? <ChevronIcon size={18} /> : <span className="tag">Not mapped yet</span>}
      </Link>
    </li>
  );
}

/** The panel's logo on the desktop, the way home to the welcome. */
export function PanelLogo() {
  return (
    <Link href="/" aria-label="natureplore, back to the welcome" className="ms-logo">
      <Logo className="block h-full w-auto" />
    </Link>
  );
}

/**
 * The map's own controls on the desktop, in the top right: Saved, which is A7, and locate.
 * The phone has neither: the sheet covers that corner.
 */
export function MapTools({ locate }: { locate?: () => void }) {
  const pathname = usePathname();
  const onSaved = pathname === "/map/saved";
  return (
    <div className="ms-tools">
      <Link
        href="/map/saved"
        className="tool-pill glass glass-pill"
        aria-current={onSaved ? "page" : undefined}
      >
        <BookmarkIcon size={18} filled={onSaved} />
        Saved
      </Link>
      {locate && (
        <button type="button" className="round glass glass-pin" aria-label="Show where I am" onClick={locate}>
          <LocationIcon size={20} />
        </button>
      )}
    </div>
  );
}
