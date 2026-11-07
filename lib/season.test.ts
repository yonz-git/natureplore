// npm test
// The season through its interface, and the promises that keep the screens from disagreeing.

import assert from "node:assert/strict";

import { describe, test } from "vitest";

import { NOW } from "./now";
import { ORGANISMS, organismHref } from "./organisms";
import { RECORDED, RECORDED_ALL, RECORDS_MONTH } from "./records";
import { countsIn, everythingIn, recordedIn, spotIn } from "./season";
import { routeDetail, type Spot } from "./spots";
import { REGIONS, SUGGESTIONS, organismsIn } from "./suggestions";

// a spot whose own species is recorded in October only, at a place the records tag
const taggedSpot = RECORDED.grumsin.flatMap((o) => o.spots)[0];
const octoberOnly: Spot = {
  n: taggedSpot,
  name: "A spot",
  months: [9],
  when: "Oct",
  look: [{ name: "Rosy bonnet", what: "in the leaf litter", last: "16 Oct 2022" }],
  outText: "Rosy bonnet recorded here in October.",
} as Spot;
const untagged: Spot = { ...octoberOnly, n: 99 };

describe("a spot's season", () => {
  test("its own species comes first in its own month", () => {
    const s = spotIn("grumsin", octoberOnly, 9);
    assert.equal(s.out, undefined);
    assert.equal(s.look[0].name, "Rosy bonnet");
  });

  test("anything recorded at it puts it in season, and the month joins its months", () => {
    const s = spotIn("grumsin", octoberOnly, RECORDS_MONTH);
    assert.equal(s.out, undefined);
    assert.ok(s.look.length > 0 && s.look.length <= 3);
    assert.ok(s.look.every((l) => l.name !== "Rosy bonnet"));
    assert.ok(s.months.includes(RECORDS_MONTH));
  });

  test("nothing of its own and nothing recorded: not in season, and it says why", () => {
    const s = spotIn("grumsin", untagged, RECORDS_MONTH);
    assert.deepEqual(s.look, []);
    assert.match(s.out ?? "", /^Not in season in \w+\. Rosy bonnet recorded here in October\.$/);
  });
});

describe("a month without records", () => {
  const other = (RECORDS_MONTH + 6) % 12;
  test("has nothing recorded, rather than another month's species", () => {
    assert.deepEqual(recordedIn("grumsin", other), []);
    assert.equal(countsIn("grumsin", other), undefined);
    assert.equal(everythingIn("grumsin", other), undefined);
  });

  test("still has the spots' own seasons", () => {
    const allYear = { ...octoberOnly, months: [other] };
    assert.equal(spotIn("grumsin", allYear, other).look[0].name, "Rosy bonnet");
  });
});

describe("the screens agree", () => {
  test("the records are for the prototype's month", () => {
    assert.equal(RECORDS_MONTH, NOW);
  });

  test("a card's count is the spots its route page does not mute", () => {
    for (const s of SUGGESTIONS) {
      const spots = routeDetail(s.id)!.spots;
      assert.deepEqual(s.lit, spots.filter((x) => !x.out).map((x) => x.n), s.id);
      assert.equal(s.spots, spots.length, s.id);
    }
  });

  test("a spot a tile points to is in season", () => {
    for (const [route, rows] of Object.entries(RECORDED))
      for (const n of rows.flatMap((o) => o.spots)) {
        const spot = routeDetail(route)!.spots.find((x) => x.n === n);
        assert.equal(spot?.out, undefined, `${route} spot ${n}`);
      }
  });

  test("an organism along several routes shows its newest record", () => {
    const newest = new Map<string, number>();
    for (const rows of Object.values(RECORDED))
      for (const o of rows) newest.set(o.name, Math.max(newest.get(o.name) ?? 0, Date.parse(o.last)));
    for (const { organism } of organismsIn(REGIONS[0])) assert.equal(Date.parse(organism.last), newest.get(organism.name), organism.name);
  });
});

describe("every organism link opens a page", () => {
  const ids = new Set(ORGANISMS.map((o) => o.id));

  test("what a spot says to look for", () => {
    for (const id of ["grumsin", "linum", "tegel", "tempelhof"])
      for (const spot of routeDetail(id)!.spots)
        for (const l of spot.look) if (l.organism) assert.ok(ids.has(l.organism), `${id} spot ${spot.n}: ${l.organism}`);
  });

  test("every species on a route's tiles", () => {
    for (const rows of Object.values(RECORDED)) for (const o of rows) assert.ok(organismHref(o.name), o.name);
  });

  test("Sweet woodruff, whose page id is not its name", () => {
    assert.equal(organismHref("Sweet woodruff"), "/map/organism/woodruff");
  });

  test("the Recorded page has every route", () => {
    assert.deepEqual(Object.keys(RECORDED_ALL).sort(), ["grumsin", "linum", "tegel", "tempelhof"]);
  });
});
