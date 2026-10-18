"use client";

// B1 · Route, and B1-saved: what is on this route, and when. The map shows the route's real line,
// its start and its spots in walking order; under it (phone) or beside it (desktop) the page, in
// the order of the flow and IA redesign: Spots along this route (each opens its spot, L3), the
// route and where its spots are, what is recorded along it (to A8), when to walk the route, what is
// happening along it (claim cards), and getting there. Save is the bookmark on the photographs; once
// the route is saved a pinned bar holds Walk the route, which opens the walk (L4). The store is real in the prototype, so B1
// and B1-saved are one page. Boards: B1 phone, tablet and desktop, and B1-saved phone.

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { BackIcon, BookmarkIcon, CalendarIcon, ChevronIcon, DownloadIcon, GroupIcon, WalkIcon } from "@/components/Icons";
import { useSheet } from "@/components/SheetGrab";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/RegionMap";
import { StatValue } from "@/components/CParts";
import { ActionRow, ClaimCard, MonthGrid, RecordedToo, SpotLook, SpotMark } from "@/components/SpotParts";
import { InSeasonList } from "@/components/InSeasonList";
import { organismPhoto } from "@/lib/photos";
import { GROUPS, recordsOf, spotsOf, type Route } from "@/lib/routes";
import { lastList, useSaved } from "@/lib/saved";
import { MONTH_LETTERS, MONTH_NAMES, NOW, routeDetail, spotLine } from "@/lib/spots";
import { suggestionById } from "@/lib/suggestions";

const noop = () => () => {};

const SECTIONS = [
  ["recorded", "Organisms"],
  ["spots", "Spots"],
  ["season", "Seasons"],
  ["happening", "Environment"],
] as const;

function SectionHead({ id, lead, close, note }: { id: string; lead: string; close: string; note?: string }) {
  return (
    <div className="fb-sec" id={`sec-${id}`}>
      <h2 id={`sec-${id}-title`}>
        {lead}
        <em>{close}</em>
      </h2>
      {note && <span>{note}</span>}
    </div>
  );
}

/**
 * Saving lives in one place, the bookmark on the photograph's top right (SaveToggle). Saved, Walk the
 * route appears under the stats (WalkButton); removed, a pinned bar offers Undo for the rest of the visit.
 */
function useRouteSave(id: string) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);
  const [removed, setRemoved] = useState(false);
  // Undo brings Walk the route back, so focus follows it there
  const undone = useRef(false);
  return {
    saved,
    removed,
    undone,
    toggle: () => {
      toggle(id);
      setRemoved(saved);
    },
  };
}
type RouteSave = ReturnType<typeof useRouteSave>;

/** The bookmark on the photograph, as on the suggestion cards: a round frost, filled once saved. */
function SaveToggle({ route, save }: { route: Route; save: RouteSave }) {
  return (
    <button
      type="button"
      className="sug-save b1-save glass glass-pin"
      aria-pressed={save.saved}
      aria-label={save.saved ? `Saved, ${route.name}, remove it from Saved` : `Save ${route.name}`}
      onClick={save.toggle}
    >
      <BookmarkIcon size={20} filled={save.saved} />
    </button>
  );
}

/** Downloaded: the suggestion card's second frost, left of the bookmark once saved, not a control. */
function DownloadedMark({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <span className="sug-save sug-dl b1-dl glass glass-pin" aria-hidden="true">
      <DownloadIcon size={20} />
    </span>
  );
}

/** Walk the route, under the stats once the route is saved. */
function WalkButton({ route, walkable, save }: { route: Route; walkable: boolean; save: RouteSave }) {
  if (!save.saved) return null;
  const focusIfUndone = (el: HTMLElement | null) => {
    if (el && save.undone.current) {
      save.undone.current = false;
      el.focus();
    }
  };
  return walkable ? (
    <Link ref={focusIfUndone} href={`/walk/${route.id}`} className="btn btn-primary b1-walk">
      <WalkIcon size={20.8} />
      Walk the route
    </Link>
  ) : (
    <button ref={focusIfUndone} type="button" className="btn btn-primary b1-walk" aria-disabled="true">
      <WalkIcon size={20.8} />
      Walk the route
      <span className="sr-only">, the walk of this route is not built in the prototype yet</span>
    </button>
  );
}

/** The route in a few sentences, four lines until "more" opens the rest. */
function About({ text }: { text: string }) {
  const [all, setAll] = useState(false);
  return (
    <div className={`b1-about${all ? " is-all" : ""}`}>
      <p id="b1-about-text">{text}</p>
      {!all && (
        <button type="button" className="b1-about-more" aria-controls="b1-about-text" aria-expanded={all} onClick={() => setAll(true)}>
          more
        </button>
      )}
    </div>
  );
}

/** Pinned over the tab bar after a removal: Undo. The live region says what saving did. */
function Pin({ save }: { save: RouteSave }) {
  const { saved, removed } = save;
  const live = (
    <p className="sr-only" aria-live="polite">
      {saved ? "Saved and downloaded. Find it in Saved." : removed ? "Removed from Saved, and its download deleted." : ""}
    </p>
  );
  if (saved || !removed) return live;
  return (
    <div className="b1-pin glass-phone">
      <p className="b1-removed">Removed from Saved</p>
      <button
        type="button"
        className="btn btn-secondary b1-undo"
        onClick={() => {
          save.undone.current = true;
          save.toggle();
        }}
      >
        Undo
      </button>
      {live}
    </div>
  );
}

export default function RouteCardScreen({ route, spot: initialSpot }: { route: Route; spot?: number }) {
  const map = useRef<MapHandle>(null);
  const sheetEl = useRef<HTMLDivElement>(null);
  const sheet = useSheet(sheetEl);
  // the jump strip stays at the top of the sheet; its pill for the section under it is the current one
  const [current, setCurrent] = useState<string>(SECTIONS[0][0]);
  // tablet: the docked panel slides away to the left to give the map the whole screen, and back
  const [tucked, setTucked] = useState(false);
  const onSheetScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sheet.onScroll();
    const strip = e.currentTarget.querySelector(".fb-strip");
    if (!strip) return;
    const stripBottom = strip.getBoundingClientRect().bottom;
    const line = stripBottom + 1;
    // what scrolls under the chips is cut away and fades in below them, like the suggestions list; each
    // block after the strip is masked on its own, since a mask on the sheet would cut the chips too
    for (let el = strip.nextElementSibling as HTMLElement | null; el; el = el.nextElementSibling as HTMLElement | null) {
      el.style.setProperty("--cut", `${stripBottom - el.getBoundingClientRect().top}px`);
    }
    let id: string = SECTIONS[0][0];
    for (const [s] of SECTIONS) {
      const el = document.getElementById(`sec-${s}`);
      if (el && el.getBoundingClientRect().top <= line) id = s;
    }
    setCurrent(id);
  };
  // the chips scroll sideways with a mouse too: the wheel turns sideways over them until they reach
  // an end, and a drag pulls them (a drag is not a click). The current chip slides into view.
  useEffect(() => {
    const strip = sheetEl.current?.querySelector<HTMLElement>(".fb-strip");
    if (!strip) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = strip.scrollWidth - strip.clientWidth;
      if ((e.deltaY > 0 && strip.scrollLeft >= max - 1) || (e.deltaY < 0 && strip.scrollLeft <= 0)) return;
      e.preventDefault();
      strip.scrollLeft += e.deltaY;
    };
    let drag: { x: number; left: number; moved: boolean } | null = null;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button === 0) drag = { x: e.clientX, left: strip.scrollLeft, moved: false };
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      if (drag.moved) strip.scrollLeft = drag.left - dx;
    };
    const onUp = () => {
      if (drag?.moved) strip.addEventListener("click", (e) => e.preventDefault(), { capture: true, once: true });
      drag = null;
    };
    // the chips fade out at a side that has more of them past it; each chip is masked on its own, since a
    // mask on the strip would make it a backdrop root and take the frost off every chip
    const fade = () => {
      const S = strip.getBoundingClientRect();
      const w = parseFloat(getComputedStyle(strip).paddingLeft) * 1.5;
      const max = strip.scrollWidth - strip.clientWidth;
      const fl = strip.scrollLeft > 1 ? w : 0;
      const fr = strip.scrollLeft < max - 1 ? w : 0;
      for (const chip of strip.querySelectorAll<HTMLElement>("a")) {
        const x = chip.getBoundingClientRect().left;
        const l = S.left - x;
        const r = S.right - x;
        chip.style.maskImage = `linear-gradient(to right, transparent ${l}px, #000 ${l + fl}px, #000 ${r - fr}px, transparent ${r}px)`;
      }
    };
    fade();
    const ro = new ResizeObserver(fade);
    ro.observe(strip);
    strip.addEventListener("scroll", fade, { passive: true });
    strip.addEventListener("wheel", onWheel, { passive: false });
    strip.addEventListener("pointerdown", onDown);
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    return () => {
      ro.disconnect();
      strip.removeEventListener("scroll", fade);
      strip.removeEventListener("wheel", onWheel);
      strip.removeEventListener("pointerdown", onDown);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
    };
  }, [route.id]);
  useEffect(() => {
    const strip = sheetEl.current?.querySelector<HTMLElement>(".fb-strip");
    const chip = strip?.querySelector<HTMLElement>("a[aria-current]");
    if (!strip || !chip) return;
    const pad = parseFloat(getComputedStyle(strip).paddingLeft);
    const left = chip.offsetLeft - strip.offsetLeft;
    if (left < strip.scrollLeft + pad || left + chip.offsetWidth > strip.scrollLeft + strip.clientWidth - pad)
      strip.scrollTo({ left: left - pad, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [current]);
  // a chip scrolls the sheet alone: the link's own jump also scrolls the panel and the page around
  // it, which lifts the whole panel out of its frame. The section lands just under the stuck chips.
  const jumpTo = (e: React.MouseEvent, id: string) => {
    const box = sheetEl.current;
    const target = document.getElementById(`sec-${id}`);
    const strip = box?.querySelector<HTMLElement>(".fb-strip");
    if (!box || !target || !strip) return;
    e.preventDefault();
    const stuckBottom = strip.offsetHeight + parseFloat(getComputedStyle(strip).top);
    const top = target.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - stuckBottom;
    box.scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    history.replaceState(null, "", `#sec-${id}`);
    setCurrent(id);
  };
  const detail = routeDetail(route.id);
  const spots = useMemo(() => spotsOf(route), [route]);
  const save = useRouteSave(route.id);
  const inSeasonPhotos = (suggestionById(route.id)?.inSeason ?? []).map((o) => organismPhoto(o.name)?.src).slice(0, 2);
  // back goes to the list the route was opened from, A5, A4 or Saved, read once the page is in the browser
  const back = useSyncExternalStore(noop, lastList, () => "/map");
  const backLabel = back === "/saved" ? "Back to Saved" : "Back to the suggestions";

  // the real line when the route has one, otherwise a loop through its spots
  const line = useMemo<[number, number][]>(
    () =>
      route.path ?? [[route.lat, route.lon], ...spots.map((s) => [s.lat, s.lon] as [number, number]), [route.lat, route.lon]],
    [route, spots],
  );
  // a spot's marker opens the spot in the list below (its #spot-n anchor)
  const points = useMemo<MapPoint[]>(
    () => [
      { id: "start", lat: route.lat, lon: route.lon, label: `${route.oneWay ? "Start" : "Start and finish"}, ${route.from}`, start: true, startText: route.oneWay ? "Start" : undefined },
      ...spots.map((s, i) => ({
        id: `s${s.n}`,
        lat: s.lat,
        lon: s.lon,
        n: s.n,
        out: !!detail?.spots[i]?.out,
        label: route.stops[i]?.name ?? `Spot ${s.n}`,
        left: route.stops[i]?.left,
      })),
    ],
    [route, spots, detail],
  );

  // one spot open at a time, inside its row. The URL keeps it (?spot=n), so coming back from an
  // organism opened there finds it open; a marker on the map opens it through its #spot-n anchor.
  const [openSpot, setOpenSpot] = useState<number | null>(detail && initialSpot ? initialSpot : null);
  const toggleSpot = (n: number, open: boolean) => {
    setOpenSpot(open ? n : null);
    history.replaceState(history.state, "", open ? `?spot=${n}` : location.pathname);
    const at = spots.find((s) => s.n === n);
    if (open && at) map.current?.centre(at.lat, at.lon, 15, !matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  useEffect(() => {
    const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
    // only the sheet scrolls to the spot: scrollIntoView, or the #spot-n jump itself, would also
    // scroll the screen around it, which never scrolls
    const reveal = (n: number, behavior: ScrollBehavior = smooth()) => {
      const el = sheetEl.current;
      const row = document.getElementById(`spot-${n}`);
      el?.closest(".ms")?.scrollTo({ top: 0 });
      if (!el || !row) return;
      // the row lands just under the stuck section chips
      const strip = el.querySelector<HTMLElement>(".fb-strip");
      const under = strip ? strip.offsetHeight + parseFloat(getComputedStyle(strip).top) : 16;
      const top = el.scrollTop + row.getBoundingClientRect().top - el.getBoundingClientRect().top - under;
      el.scrollTo({ top, behavior });
    };
    // arriving with a spot open (back from its organism) lands on it at once. A page loaded or reloaded
    // straight at ?spot=n starts at the top instead, all spots folded
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const fresh = nav && nav.type !== "back_forward" && nav.name === location.href;
    if (openSpot && fresh) {
      setOpenSpot(null);
      history.replaceState(history.state, "", location.pathname);
    } else if (openSpot) requestAnimationFrame(() => reveal(openSpot, "auto"));
    const onHash = () => {
      const m = /^#spot-(\d+)$/.exec(location.hash);
      if (!m || !detail) return;
      const n = Number(m[1]);
      setOpenSpot(n);
      history.replaceState(history.state, "", `?spot=${n}`);
      // the jump has already moved the sheet; once the spot that was open has folded away, the
      // new one is brought to the top
      sheetEl.current?.closest(".ms")?.scrollTo({ top: 0 });
      setTimeout(() => reveal(n), smooth() === "smooth" ? 340 : 0);
    };
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
    // the first open spot is revealed once, on arrival
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  const total = recordsOf(route.counts);
  const [name, ...rest] = route.name.split(" ").reverse();
  const lead = rest.reverse().join(" ");
  const most = detail ? Math.max(...detail.season) : 1;

  return (
    <section className={`ms b1${tucked ? " is-tucked" : ""}`}>
      <RegionMap className="a1-map" behind ref={map} points={points} line={line} detail={route.detail} maxZoom={15} mapLabel={`Map of ${route.name}`} />

      <div className="b1-top">
        <Link href={back} className="round glass glass-pin" aria-label={backLabel}>
          <BackIcon size={20} />
        </Link>
      </div>

      <button
        type="button"
        className="b1-dock round glass glass-pin"
        aria-expanded={!tucked}
        aria-label={tucked ? "Show the route again" : "Hide the route, show the whole map"}
        onClick={() => setTucked((t) => !t)}
      >
        <ChevronIcon size={18} />
      </button>

      <div className="ms-panel glass-desk">
        <div
          ref={sheetEl}
          className={`ms-sheet glass-phone${sheet.open ? " is-open" : ""}${sheet.down ? " is-down" : ""}`}
          aria-labelledby="route-title"
          onScroll={onSheetScroll}
        >
          {sheet.grab("route")}

          <div className="b1-photos">
            {/* the route, then two of what is in season along it; a frame stays blank where there is no photo */}
            {[route.image, ...inSeasonPhotos].slice(0, 3).map((src, i) =>
              src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={i ? "" : `${route.name}`} />
              ) : (
                <span key={i} />
              ),
            )}
            <SaveToggle route={route} save={save} />
            <DownloadedMark saved={save.saved} />
          </div>

          <div className="b1-head">
            <h1 id="route-title" className="ms-title">
              {lead} <em>{name}</em>
            </h1>
            <p className="ms-lead">{route.from}</p>
            <About text={route.description} />
          </div>

          <dl className="card-stats b1-stats">
            <div className="card-stat">
              <dt>Distance</dt>
              <dd>
                <StatValue value={String(route.km)} />
                <span>km</span>
              </dd>
            </div>
            <div className="card-stat">
              <dt>Time</dt>
              <dd>
                <StatValue value={route.time.replace(":", " h ")} />
              </dd>
            </div>
            <div className="card-stat">
              <dt>Spots</dt>
              <dd>
                <StatValue value={String(route.spots)} />
              </dd>
            </div>
          </dl>

          {detail && (
            <dl className="fb-card fb-facts">
              {detail.getting.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <WalkButton route={route} walkable={!!detail} save={save} />

          {detail && <hr className="b1-rule" />}

          {detail && (
            <nav aria-label="Jump to a section" className="fb-strip">
              {SECTIONS.map(([id, label]) => (
                <a key={id} href={`#sec-${id}`} data-text={label} aria-current={current === id ? "location" : undefined} onClick={(e) => jumpTo(e, id)} draggable={false}>
                  <span>{label}</span>
                </a>
              ))}
            </nav>
          )}

          <section aria-labelledby="sec-recorded-title">
            <SectionHead id="recorded" lead="Recorded " close="organisms" />
            <div className="fb-card fb-recorded">
              <div
                className="b1-bar"
                role="img"
                aria-label={`${total} species recorded: ${GROUPS.map((g) => `${route.counts[g.id] ?? 0} ${g.label.toLowerCase()}`).join(", ")}`}
              >
                {GROUPS.filter((g) => route.counts[g.id]).map((g) => (
                  <span key={g.id} className={`is-${g.id}`} style={{ flexGrow: route.counts[g.id] }} />
                ))}
              </div>
              <ul className="fb-legend" aria-hidden="true">
                {GROUPS.map((g) => (
                  <li key={g.id} className={`fb-pill${route.counts[g.id] ? "" : " is-none"}`} title={g.label}>
                    <GroupIcon group={g.id} size={17} className={`is-${g.id}`} />
                    <span className="fb-legend-num" data-last={String(route.counts[g.id] ?? 0).slice(-1)}>{route.counts[g.id] ?? 0}</span>
                  </li>
                ))}
              </ul>
              <InSeasonList routeId={route.id} />
              {/* A8 has the records of Grumsin beech forest loop only */}
              {route.id === "grumsin" ? (
                <Link href={`/map/route/${route.id}/recorded`} className="btn btn-secondary btn-chev">
                  See everything recorded
                  <ChevronIcon size={18} />
                </Link>
              ) : (
                <button type="button" className="btn btn-secondary btn-chev" aria-disabled="true">
                  See everything recorded
                  <span className="sr-only">, not built in the prototype yet</span>
                  <ChevronIcon size={18} />
                </button>
              )}
            </div>
          </section>

          <section aria-labelledby="sec-spots-title">
            <SectionHead id="spots" lead="Spots along " close="this route" note="In walking order" />
            <ol className="fb-card fb-rows">
              {detail
                ? detail.spots.map((s) => {
                    const open = openSpot === s.n;
                    return (
                      <li key={s.n} id={`spot-${s.n}`} className={`fb-spot-row${open ? " is-open" : ""}${s.out ? " is-out" : ""}`}>
                        <button
                          type="button"
                          className="fb-row"
                          aria-expanded={open}
                          aria-controls={`spot-${s.n}-detail`}
                          onClick={() => toggleSpot(s.n, !open)}
                        >
                          <SpotMark n={s.n} />
                          <span className="fb-row-text">
                            <b>{s.name}</b>
                            <span>{spotLine(s)}</span>
                            <span className="fb-pill">
                              <CalendarIcon size={14} />
                              {s.when}
                            </span>
                          </span>
                          <ChevronIcon size={18} />
                        </button>
                        {/* the spot's detail opens in place: what to look for and what not to do */}
                        <div id={`spot-${s.n}-detail`} className="fb-spot-detail" inert={!open}>
                          <div>
                            <SpotLook spot={s} organismHref={(id) => `/map/organism/${id}?from=route&spot=${s.n}`} />
                            <ActionRow spot={s} />
                            <div className="fb-spot-part">
                              <h3 className="fb-label">When</h3>
                              <MonthGrid months={s.months} />
                              <p className="fb-small">In season {s.when === "All year" ? "all year" : s.when}</p>
                            </div>
                            {detail.claims[0] && (
                              <div className="fb-spot-part">
                                <h3 className="fb-label">What is happening here</h3>
                                <ClaimCard claim={detail.claims[0]} />
                              </div>
                            )}
                            <div className="fb-spot-part">
                              <h3 className="fb-label">Recorded here too</h3>
                              <RecordedToo />
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })
                : route.stops.map((s, i) => (
                    <li key={s.name}>
                      <div className="fb-row">
                        <SpotMark n={i + 1} />
                        <span className="fb-row-text">
                          <b>{s.name}</b>
                          <span>{s.note}</span>
                        </span>
                      </div>
                    </li>
                  ))}
            </ol>
          </section>

          {detail && (
            <>
              <section aria-labelledby="sec-season-title">
                <SectionHead id="season" lead="When to " close="walk the route" note="Spots in season" />
                <div className="fb-card">
                  <div
                    className="fb-season"
                    role="img"
                    aria-label={`Spots in season by month. ${MONTH_NAMES[NOW]}: ${detail.season[NOW]} of ${detail.spots.length}`}
                  >
                    {detail.season.map((c, i) => (
                      <div key={i} className={i === NOW ? "is-now" : undefined}>
                        <span>{c}</span>
                        <span className="fb-season-bar" style={{ height: `${0.75 + (4.375 * c) / most}rem` }} />
                        <span>{MONTH_LETTERS[i]}</span>
                      </div>
                    ))}
                  </div>
                  <p className="fb-small">{detail.seasonNote}</p>
                </div>
              </section>

              {detail.claims.length > 0 && (
                <section aria-labelledby="sec-happening-title">
                  <SectionHead id="happening" lead="What is happening " close="along this route" />
                  <div className="fb-stack">
                    {detail.claims.map((c) => (
                      <ClaimCard key={c.id} claim={c} />
                    ))}
                  </div>
                </section>
              )}

              <p className="fb-small b1-foot">{detail.foot}</p>
            </>
          )}
        </div>
        <Pin save={save} />
      </div>
    </section>
  );
}
