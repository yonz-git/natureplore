import type { Metadata } from "next";
import { notFound } from "next/navigation";

import OrganismPage from "@/features/organisms/OrganismPage";
import { organismById } from "@/lib/organisms";
import { routeById } from "@/lib/routes";
import { spotOf } from "@/lib/spots";

// B4, B5 · Organism

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
  const at = o.where?.some((w) => (w.route ?? "linum") === "linum" && w.n === Number(spot)) ? spotOf("linum", Number(spot)) : undefined;
  const source = typeof route === "string" ? routeById(route) : undefined;
  const opened = source
    ? from === "recorded"
      ? {
          href: `/map/route/${source.id}/recorded`,
          label: `Back to the records of ${source.name}`,
        }
      : { href: `/map/route/${source.id}`, label: `Back to ${source.name}` }
    : undefined;
  const walkRoute = source?.id ?? "linum";
  const walkSpot = spotOf(walkRoute, Number(spot));
  const back =
    from === "walk"
      ? {
          href: `/walk/${walkRoute}${walkSpot ? `?spot=${walkSpot.n}` : ""}`,
          label: walkSpot ? `Back to the walk, spot ${walkSpot.n}` : "Back to the walk",
        }
      : at
        ? {
            href: `/map/route/linum?spot=${at.n}`,
            label: "Back to Linum wet meadows loop",
          }
        : opened
          ? opened
          : o.back;
  return <OrganismPage o={o} back={back} walk={from === "walk"} route={source?.id} />;
}
