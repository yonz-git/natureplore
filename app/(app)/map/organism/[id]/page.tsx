import type { Metadata } from "next";
import { notFound } from "next/navigation";

import OrganismPage from "@/components/OrganismPage";
import { organismById } from "@/lib/organisms";
import { routeById } from "@/lib/routes";
import { spotOf } from "@/lib/spots";

// B4 · Organism, and B5 when its location is generalised. Back returns where the page was opened:
// the walk on the spot it showed (B4-walk, `?from=walk&spot=`), or the route with that spot open
// (`?spot=`, with or without `from=route`).

export async function generateMetadata({ params }: PageProps<"/map/organism/[id]">): Promise<Metadata> {
  const { id } = await params;
  const o = organismById(id);
  return { title: o && `${o.name} ${o.close}`.trim() };
}

export default async function Organism({ params, searchParams }: PageProps<"/map/organism/[id]">) {
  const { id } = await params;
  const { from, spot, route } = await searchParams;
  const o = organismById(id);
  if (!o) notFound();
  // the spot in the link is a Linum spot: only a species recorded there goes back to it
  const at = o.where?.some((w) => (w.route ?? "linum") === "linum" && w.n === Number(spot)) ? spotOf("linum", Number(spot)) : undefined;
  // opened from a route's tiles (`?route=`) or its records (`?from=recorded&route=`): back is that route, not
  // the one the species was last recorded on
  const source = typeof route === "string" ? routeById(route) : undefined;
  const opened = source
    ? from === "recorded"
      ? {
          href: `/map/route/${source.id}/recorded`,
          label: `Back to the records of ${source.name}`,
        }
      : { href: `/map/route/${source.id}`, label: `Back to ${source.name}` }
    : undefined;
  const back =
    from === "walk"
      ? {
          href: `/walk/linum${at ? `?spot=${at.n}` : ""}`,
          label: at ? `Back to the walk, spot ${at.n}` : "Back to the walk",
        }
      : at
        ? {
            href: `/map/route/linum?spot=${at.n}`,
            label: "Back to Linum wet meadows loop",
          }
        : opened
          ? opened
          : o.back;
  return <OrganismPage o={o} back={back} walk={from === "walk"} />;
}
