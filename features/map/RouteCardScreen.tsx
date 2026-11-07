"use client";

// B1 · Route, B1-saved

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { BackIcon, BookmarkIcon, ChevronIcon, DownloadIcon, LoopIcon, OneWayIcon, WalkIcon } from "@/components/Icons";
import { useSheet } from "@/components/layout/SheetGrab";
import RegionMap, { type MapHandle, type MapPoint } from "@/components/shared/RegionMap";
import { StatValue } from "@/components/shared/CParts";
import { ActionRow, ClaimCard, SpotMark } from "@/components/shared/SpotParts";
import { InSeasonList } from "@/components/shared/InSeasonList";
import { PhotoGallery, type Photo } from "@/components/shared/PhotoGallery";
import { GroupFilter } from "@/components/shared/GroupFilter";
import { countsIn } from "@/lib/season";
import { recordedOf } from "@/lib/recorded";
import { YearChart } from "@/components/shared/YearChart";
import { organismPhoto } from "@/lib/photos";
import { GROUPS, recordsOf, spotsOf, type Group, type Route } from "@/lib/routes";
import { lastList, useSaved } from "@/lib/saved";
import { MONTH_LETTERS, MONTH_NAMES, NOW, routeDetail } from "@/lib/spots";
import { MONTH, suggestionById } from "@/lib/suggestions";
import { easeScroll } from "@/lib/ease-scroll";

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

function useRouteSave(id: string) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);
  const [removed, setRemoved] = useState(false);
  const [undone, setUndone] = useState(false);
  return {
    saved,
    removed,
    undone,
    toggle: () => {
      toggle(id);
      setRemoved(saved);
      setUndone(false);
    },
    undo: () => {
      toggle(id);
      setRemoved(saved);
      setUndone(true);
    },
  };
}
type RouteSave = ReturnType<typeof useRouteSave>;

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

function DownloadedMark({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <span className="sug-save sug-dl b1-dl glass glass-pin" aria-hidden="true">
      <DownloadIcon size={20} />
    </span>
  );
}

function SpotAt({ n, km }: { n?: number; km: string }) {
  return (
    <span className="fb-at">
      {n ? (
        <SpotMark n={n} />
      ) : (
        <span className="spot-mark fb-mark fb-mark-end" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {}
            <path d="M6.5 20.5V3.5" />
            <path d="M6.5 3.5h11l-2 4 2 4H6.5" />
          </svg>
        </span>
      )}
      <span className="fb-at-km">{km} km</span>
    </span>
  );
}

function WalkButton({ route, walkable, save }: { route: Route; walkable: boolean; save: RouteSave }) {
  const link = useRef<HTMLAnchorElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const { saved, undone } = save;
  useEffect(() => {
    if (saved && undone) (link.current ?? button.current)?.focus();
  }, [saved, undone]);
  if (!saved) return null;
  return walkable ? (
    <Link ref={link} href={`/walk/${route.id}`} className="btn btn-primary b1-walk">
      <WalkIcon size={20.8} />
      Walk the route
    </Link>
  ) : (
    <button ref={button} type="button" className="btn btn-primary b1-walk" aria-disabled="true">
      <WalkIcon size={20.8} />
      Walk the route
      <span className="sr-only">, the walk of this route is not built in the prototype yet</span>
    </button>
  );
}

function About({ text }: { text: string }) {
  return (
    <div className="b1-about">
      <p>{text}</p>
    </div>
  );
}

function Pin({ save }: { save: RouteSave }) {
  const { saved, removed } = save;
  const live = (
    <p className="sr-only" aria-live="polite">
      {saved ? "Saved and downloaded. Find it under You, in Routes." : removed ? "Removed from Saved, and its download deleted." : ""}
    </p>
  );
  if (saved || !removed) return live;
  return (
    <div className="b1-pin glass-phone">
      <p className="b1-removed">Removed from Saved</p>
      <button
        type="button"
        className="btn btn-secondary b1-undo"
        onClick={save.undo}
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
  const [current, setCurrent] = useState<string>(SECTIONS[0][0]);
  const [tucked, setTucked] = useState(false);
  const [pinned, setPinned] = useState(false);
  const jumping = useRef(false);
  const jumps = useRef(0);
  const onSheetScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sheet.onScroll();
    const strip = e.currentTarget.querySelector(".fb-strip");
    if (!strip) return;
    const stripBottom = strip.getBoundingClientRect().bottom;
    const line = stripBottom + 1;
    for (let el = strip.nextElementSibling as HTMLElement | null; el; el = el.nextElementSibling as HTMLElement | null) {
      el.style.setProperty("--cut", `${stripBottom - el.getBoundingClientRect().top}px`);
    }
    const box = e.currentTarget;
    setPinned(strip.getBoundingClientRect().top <= box.getBoundingClientRect().top + 1);
    if (jumping.current) return;
    let id: string = SECTIONS[0][0];
    for (const [s] of SECTIONS) {
      const el = document.getElementById(`sec-${s}`);
      if (el && el.getBoundingClientRect().top <= line) id = s;
    }
    setCurrent(id);
  };
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
      easeScroll(strip, { left: left - pad });
  }, [current]);
  const jumpTo = (e: React.MouseEvent, id: string) => {
    const box = sheetEl.current;
    const target = document.getElementById(`sec-${id}`);
    const strip = box?.querySelector<HTMLElement>(".fb-strip");
    if (!box || !target || !strip) return;
    e.preventDefault();
    const stuckBottom = strip.offsetHeight + parseFloat(getComputedStyle(strip).top);
    const top = target.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - stuckBottom;
    const jump = ++jumps.current;
    jumping.current = true;
    easeScroll(box, { top }).then(() => {
      if (jumps.current === jump) jumping.current = false;
    });
    history.replaceState(null, "", `#sec-${id}`);
    setCurrent(id);
  };
  const detail = routeDetail(route.id);
  const kmAt = (n: number) => ((route.marks?.[n - 1] ?? n / (route.spots + 1)) * parseFloat(route.km)).toFixed(1);
  const spots = useMemo(() => spotsOf(route), [route]);
  const save = useRouteSave(route.id);
  const inSeason = (suggestionById(route.id)?.inSeason ?? []).filter((o) => organismPhoto(o.name)).slice(0, 2);
  const photoNames = [route.name, ...inSeason.map((o) => o.name)];
  const frames = [route.image, ...inSeason.map((o) => organismPhoto(o.name)?.src)].slice(0, 3);
  const photos: Photo[] = frames.flatMap((src, i) => (src ? [{ src, alt: photoNames[i] }] : []));
  const [gallery, setGallery] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const back = useSyncExternalStore(noop, lastList, () => "/map");
  const backLabel = back === "/you" ? "Back to You" : "Back to the suggestions";

  const line = useMemo<[number, number][]>(
    () =>
      route.path ?? [[route.lat, route.lon], ...spots.map((s) => [s.lat, s.lon] as [number, number]), [route.lat, route.lon]],
    [route, spots],
  );
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

  const [openSpot, setOpenSpot] = useState<number | null>(detail && initialSpot ? initialSpot : null);
  const toggleSpot = (n: number, open: boolean) => {
    setOpenSpot(open ? n : null);
    history.replaceState(history.state, "", open ? `?spot=${n}` : location.pathname);
    const at = spots.find((s) => s.n === n);
    if (open && at) map.current?.centre(at.lat, at.lon, 15, !matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  useEffect(() => {
    const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
    const reveal = (n: number, behavior: ScrollBehavior = smooth()) => {
      const el = sheetEl.current;
      const row = document.getElementById(`spot-${n}`);
      el?.closest(".ms")?.scrollTo({ top: 0 });
      if (!el || !row) return;
      const strip = el.querySelector<HTMLElement>(".fb-strip");
      const under = strip ? strip.offsetHeight + parseFloat(getComputedStyle(strip).top) : 16;
      const top = el.scrollTop + row.getBoundingClientRect().top - el.getBoundingClientRect().top - under;
      if (behavior === "smooth") easeScroll(el, { top });
      else el.scrollTo({ top });
    };
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const fresh = nav && nav.type !== "back_forward" && nav.name === location.href;
    if (openSpot && fresh) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenSpot(null);
      history.replaceState(history.state, "", location.pathname);
    } else if (openSpot) requestAnimationFrame(() => reveal(openSpot, "auto"));
    const onHash = () => {
      const m = /^#spot-(\d+)$/.exec(location.hash);
      if (!m || !detail) return;
      const n = Number(m[1]);
      setOpenSpot(n);
      history.replaceState(history.state, "", `?spot=${n}`);
      sheetEl.current?.closest(".ms")?.scrollTo({ top: 0 });
      setTimeout(() => reveal(n), smooth() === "smooth" ? 340 : 0);
    };
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  const counts = countsIn(route.id) ?? route.counts;
  const [pickedOn, setPickedOn] = useState<{ route: string; groups: Group[] }>({ route: route.id, groups: [] });
  const picked = pickedOn.route === route.id ? pickedOn.groups : [];
  const pick = (g: Group) =>
    setPickedOn({ route: route.id, groups: picked.includes(g) ? picked.filter((x) => x !== g) : [...picked, g] });
  const total = recordsOf(counts);
  const [name, ...rest] = route.name.split(" ").reverse();
  const lead = rest.reverse().join(" ");

  return (
    <section className={`ms b1${tucked ? " is-tucked" : ""}`}>
      <RegionMap className="a1-map" behind ref={map} points={points} line={line} detail={route.detail} maxZoom={15} mapLabel={`Map of ${route.name}`} />

      <div className="b1-top">
        <Link href={back} className="round glass glass-pin back-top" aria-label={backLabel}>
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
          className={`ms-sheet glass-phone${sheet.open ? " is-open" : ""}${sheet.down ? " is-down" : ""}${pinned ? " is-pinned" : ""}`}
          aria-labelledby="route-title"
          onScroll={onSheetScroll}
        >
          {sheet.grab("route")}

          <div className="b1-photos">
            {}
            {frames.map((src, i) =>
              src ? (
                <button
                  key={i}
                  type="button"
                  className="b1-photo"
                  aria-label={`Open the photos, ${photoNames[i]}`}
                  onClick={(e) => {
                    opener.current = e.currentTarget;
                    setGallery(photos.findIndex((p) => p.src === src));
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" />
                </button>
              ) : (
                <span key={i} />
              ),
            )}
            <SaveToggle route={route} save={save} />
            <DownloadedMark saved={save.saved} />
          </div>
          <PhotoGallery photos={photos} title={route.name} at={gallery} onClose={() => setGallery(null)} opener={opener} />

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
                {}
                <StatValue value={route.time.split(":")[0]} />
                <span>h</span>
                {route.time.split(":")[1] !== "00" && <StatValue value={route.time.split(":")[1]} />}
              </dd>
            </div>
            <div className="card-stat">
              <dt>Spots</dt>
              <dd>
                <StatValue value={String(route.spots)} />
              </dd>
            </div>
            {}
            <div className="card-stat b1-shape">
              <dt>{route.oneWay ? "One way" : "Loop"}</dt>
              <dd>{route.oneWay ? <OneWayIcon /> : <LoopIcon />}</dd>
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
              {SECTIONS.map(([id, label]) =>
                id === "happening" && !detail.claims.length ? (
                  <a key={id} data-text={label} aria-disabled="true" aria-label={`${label}, nothing recorded on this route yet`}>
                    <span>{label}</span>
                  </a>
                ) : (
                  <a key={id} href={`#sec-${id}`} data-text={label} aria-current={current === id ? "location" : undefined} onClick={(e) => jumpTo(e, id)} draggable={false}>
                    <span>{label}</span>
                  </a>
                ),
              )}
            </nav>
          )}

          <section aria-labelledby="sec-recorded-title">
            <SectionHead id="recorded" lead="Recorded " close="organisms" />
            <div className="fb-card fb-recorded">
              <span className="fb-label" id="in-season-label">
                In season in {MONTH}
              </span>
              <div
                className="b1-bar"
                role="img"
                aria-label={`${total} species recorded: ${GROUPS.map((g) => `${counts[g.id] ?? 0} ${g.label.toLowerCase()}`).join(", ")}`}
              >
                {GROUPS.filter((g) => counts[g.id]).map((g) => (
                  <span key={g.id} className={`is-${g.id}`} style={{ flexGrow: counts[g.id] }} />
                ))}
              </div>
              <GroupFilter counts={counts} picked={picked} onPick={pick} onAll={() => setPickedOn({ route: route.id, groups: [] })} />
              <InSeasonList routeId={route.id} groups={picked} />
              {}
              {recordedOf(route.id) ? (
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
            <SectionHead id="spots" lead="Spots along " close="this route" />
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
                          <SpotAt n={s.n} km={kmAt(s.n)} />
                          <span className="fb-row-text">
                            <b>{s.name}</b>
                          </span>
                          <ChevronIcon size={18} />
                        </button>
                        {}
                        <div id={`spot-${s.n}-detail`} className="fb-spot-detail" inert={!open}>
                          <div>
                            <ActionRow spot={s} />
                          </div>
                        </div>
                      </li>
                    );
                  })
                    .concat(
                      <li key="end" className="fb-spot-end">
                        <div className="fb-row">
                          <SpotAt km={route.km} />
                          <span className="fb-row-text">
                            <b>Finish</b>
                            <span>{route.oneWay ? "The end of the route" : "Back where you started"}</span>
                          </span>
                        </div>
                      </li>,
                    )
                : route.stops.map((s, i) => (
                    <li key={s.name}>
                      <div className="fb-row">
                        <SpotAt n={i + 1} km={kmAt(i + 1)} />
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
                <SectionHead id="season" lead="Best season to visit " close="the route" />
                <YearChart routeId={route.id} />
              </section>

              {detail.claims.length > 0 && (
                <section aria-labelledby="sec-happening-title">
                  <SectionHead id="happening" lead="What is happening " close="along this route" />
                  <div className="fb-stack">
                    {detail.claims.map((c) => (
                      <ClaimCard key={c.id} claim={c} spots />
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
