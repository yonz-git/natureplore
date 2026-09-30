"use client";

// D2 · Documentaries, the collection: curated links grouped by where they are about, Brandenburg,
// northern Germany, Europe, with chips that narrow it by subject or to the routes you saved. The
// region search of the old board became these chips. The chip in use is kept in the address
// (?f=), so coming back from a documentary returns to the same list. On the phone rows in a glass
// box per group; from 64rem the same items as cards, four to a row.
// Boards: D2, phone, tablet and desktop.

import { usePathname, useSearchParams } from "next/navigation";

import { BackLink, BackTop } from "@/components/CParts";
import { DocList } from "@/components/DocParts";
import { BookmarkIcon } from "@/components/Icons";
import { backLabel, useBack } from "@/lib/back";
import { type Doc, DOCS, REGIONS, type Topic, TOPICS } from "@/lib/docs";
import { useSaved } from "@/lib/saved";

type Filter = "all" | "saved" | Topic;

const slug = (f: string) => f.toLowerCase().replace(/\s+/g, "-");

export default function DocsScreen() {
  const pathname = usePathname();
  const params = useSearchParams();
  const { ids } = useSaved();
  const back = useBack("/learn");
  const label = backLabel(back, "Back to Learn");

  const filters: Filter[] = ["all", "saved", ...TOPICS];
  const current: Filter = filters.find((f) => slug(f) === params.get("f")) ?? "all";
  const keep = (d: Doc) =>
    current === "all" ? true : current === "saved" ? !!d.routeId && ids.includes(d.routeId) : d.topics.includes(current);
  const groups = REGIONS.map((r) => ({ region: r, docs: DOCS.filter((d) => d.region === r && keep(d)) })).filter((g) => g.docs.length);
  const count = groups.reduce((n, g) => n + g.docs.length, 0);

  // replaceState rather than the router: the list changes in place, where it is scrolled to, and
  // Next keeps useSearchParams in step with it
  const choose = (f: Filter) => window.history.replaceState(null, "", f === "all" ? pathname : `${pathname}?f=${slug(f)}`);

  return (
    <section className="org ln ln-docs" aria-labelledby="d2-title">
      <BackTop href={back} label={label} />
      <div className="org-sheet glass glass-top">
        <div className="org-main">
          <BackLink href={back} label={label} />
          <h1 id="d2-title" className="org-title ln-title">
            <em>Documentaries</em>
          </h1>
          <p className="org-body ln-intro">
            Curated links with what they cover. Watching happens on the maker&apos;s site, and availability is stated before you go.
          </p>
          <div className="chips ln-filter" role="group" aria-label="Filter the collection">
            {filters.map((f) => (
              <button key={f} type="button" className="chip" aria-pressed={f === current} onClick={() => choose(f)}>
                {f === "saved" && <BookmarkIcon size={16} />}
                {f === "all" ? "All" : f === "saved" ? "On your saved routes" : f}
              </button>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {count === 1 ? "1 documentary" : `${count} documentaries`}
          </p>

          {groups.length === 0 ? (
            <p className="saved-empty ln-empty">
              {current === "saved"
                ? "None yet. Save a route, and the documentaries about it appear here."
                : "No documentaries on this subject yet."}
            </p>
          ) : (
            groups.map((g) => (
              <section key={g.region} className="ln-group" aria-labelledby={`g-${slug(g.region)}`}>
                <h2 id={`g-${slug(g.region)}`} className="ln-site">
                  {g.region}
                </h2>
                <DocList docs={g.docs} as="rows" />
              </section>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
