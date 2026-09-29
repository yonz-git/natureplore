import { notFound } from "next/navigation";

import OrganismPage from "@/components/OrganismPage";
import { organismById } from "@/lib/organisms";
import { spotOf } from "@/lib/spots";

// B4 · Organism, and B5 when its location is generalised. Back returns where the page was opened:
// the walk on the spot it showed (B4-walk, `?from=walk&spot=`), or the spot page (`?spot=`).

export default async function Organism({ params, searchParams }: PageProps<"/map/organism/[id]">) {
  const { id } = await params;
  const { from, spot } = await searchParams;
  const o = organismById(id);
  if (!o) notFound();
  const at = spotOf("linum", Number(spot));
  const back =
    from === "walk"
      ? { href: `/walk/linum${at ? `?spot=${at.n}` : ""}`, label: at ? `Back to the walk, spot ${at.n}` : "Back to the walk" }
      : at
        ? { href: `/map/route/linum/spot/${at.n}`, label: `Back to spot ${at.n}, ${at.name}` }
        : o.back;
  return <OrganismPage o={o} back={back} />;
}
