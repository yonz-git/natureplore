"use client";

// A2 · Search, regions and organisms, and A3 · Search, no match. The map searches for a place or an
// organism, not a route: the results follow the field as it is typed in, grouped Regions then
// Organisms. A mapped region opens its suggestions, where Routes or Organisms filters the list; an
// organism with a page opens it, the others are plain text in the prototype. A miss names the query, offers what it probably meant and says
// where routes are mapped. On the phone search takes the screen over a darkened map; from 64rem it
// happens inside the same panel as the suggestions. Boards: A2 and A3, phone, tablet and desktop.

import Link from "next/link";
import { useMemo, useState } from "react";

import { BackIcon, ChevronIcon, GroupIcon, InfoIcon, PinIcon } from "@/components/Icons";
import { SearchField } from "@/components/MapParts";
import RegionMap from "@/components/RegionMap";
import { rememberSearch } from "@/lib/recent";
import { didYouMean, groupWord, ROUTE_POINTS, search } from "@/lib/suggestions";

function Row({ name, line, href, icon, kind }: { name: string; line: React.ReactNode; href?: string; icon: React.ReactNode; kind: string }) {
  const body = (
    <>
      {icon}
      <span className="row-text">
        <span className="row-name">{name}</span>
        <span className="row-meta">{line}</span>
      </span>
      {href && <ChevronIcon size={18} />}
    </>
  );
  return (
    <li>
      {href ? (
        <Link href={href} className="sr-row" onClick={() => rememberSearch({ label: name, kind, href })}>
          {body}
        </Link>
      ) : (
        <div className="sr-row">{body}</div>
      )}
    </li>
  );
}

const disc = (icon: React.ReactNode) => <span className="row-disc">{icon}</span>;

export default function SearchScreen({ query }: { query: string }) {
  const [q, setQ] = useState(query);
  const found = useMemo(() => search(q), [q]);
  const miss = q.trim() !== "" && found.regions.length === 0 && found.organisms.length === 0;
  const meant = useMemo(() => (miss ? didYouMean(q) : { regions: [], organisms: [] }), [miss, q]);

  return (
    <section className="ms sr">
      <RegionMap className="a1-map" points={ROUTE_POINTS} maxZoom={9.5} />
      <div className="sr-veil" aria-hidden="true" />

      <div className="ms-panel glass-desk">
        {/* A3 has its own heading, the no-match line */}
        {!miss && <h1 className="sr-only">Search regions and organisms</h1>}
        <div className="ms-bar">
          <div className="ms-bar-row">
            <Link href="/map" className="round glass glass-pin" aria-label="Back to the map">
              <BackIcon size={20} />
            </Link>
            <SearchField defaultValue={query} autoFocus onChange={setQ} />
          </div>
        </div>

        <div className="ms-sheet" aria-live="polite">
          {(found.regions.length > 0 || found.organisms.length > 0) && (
            <div className="sr-panel">
              {found.regions.length > 0 && (
                <section className="sr-group" aria-labelledby="sr-regions">
                  <h2 id="sr-regions" className="rows-label">
                    Regions
                  </h2>
                  <ul className="rows">
                    {found.regions.map(({ region, line, href }) => (
                      <Row key={region.id} kind="Region" name={region.name} line={line} href={href} icon={disc(<PinIcon size={18} />)} />
                    ))}
                  </ul>
                </section>
              )}
              {found.organisms.length > 0 && (
                <section className="sr-group" aria-labelledby="sr-orgs">
                  <h2 id="sr-orgs" className="rows-label">
                    Organisms
                  </h2>
                  <ul className="rows">
                    {found.organisms.map(({ organism: o, line, href }) => (
                      <Row
                        key={o.name}
                        kind={`Organism, ${groupWord(o.group).toLowerCase()}`}
                        href={href}
                        name={o.name}
                        line={
                          <>
                            {groupWord(o.group)}, <i>{o.latin}</i>
                            {line.slice(line.indexOf("."))}
                          </>
                        }
                        icon={disc(<GroupIcon group={o.group} size={18} />)}
                      />
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {miss && (
            <div className="sr-panel">
              <div className="sr-miss">
                <h1>
                  No regions or organisms match <em>“{q.trim()}”</em>
                </h1>
                <p>Check the spelling, or try another name.</p>
              </div>
              {(meant.regions.length > 0 || meant.organisms.length > 0) && (
                <section className="sr-group" aria-labelledby="sr-meant">
                  <h2 id="sr-meant" className="rows-label">
                    Did you mean
                  </h2>
                  <ul className="rows">
                    {meant.regions.map(({ region, line, href }) => (
                      <Row key={region.id} kind="Region" name={region.name} line={line} href={href} icon={disc(<PinIcon size={18} />)} />
                    ))}
                    {meant.organisms.map((o) => (
                      <Row
                        key={o.name}
                        kind={`Organism, ${groupWord(o.group).toLowerCase()}`}
                        name={o.name}
                        line={
                          <>
                            {groupWord(o.group)}, <i>{o.latin}</i>
                          </>
                        }
                        icon={disc(<GroupIcon group={o.group} size={18} />)}
                      />
                    ))}
                  </ul>
                </section>
              )}
              <p className="notice">
                <InfoIcon size={18} />
                Routes are mapped only in Berlin and Brandenburg so far.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
