// node --test lib/places.test.ts
// The one bit of real logic in lib/places.ts is the search: a substring match, and the fallback
// that has to catch a misspelling without offering a suggestion for nonsense.

import assert from "node:assert/strict";
import test from "node:test";

import { countLine, searchRegions } from "./places.ts";

test("a partial name lists every region that contains it", () => {
  const { results, suggestions } = searchRegions("Brandenb");
  assert.deepEqual(
    results.map((r) => r.name),
    ["Brandenburg", "Brandenburg an der Havel", "Brandenburg Gate area", "New Brandenburg"],
  );
  assert.deepEqual(suggestions, []);
});

test("matching ignores case and accents", () => {
  assert.equal(searchRegions("flaming").results[0]?.name, "Fläming");
});

test("a misspelling matches nothing and suggests the nearest spellings", () => {
  const { results, suggestions } = searchRegions("Brandenbrug");
  assert.deepEqual(results, []);
  assert.deepEqual(
    suggestions.map((r) => r.name),
    ["Brandenburg", "Brandenburg an der Havel"],
  );
});

test("nonsense suggests nothing rather than the least bad guess", () => {
  assert.deepEqual(searchRegions("qqqzzz").suggestions, []);
});

test("a group with nothing recorded is left out of the count line", () => {
  assert.equal(countLine({ plants: 24, herbs: 72, birds: 41 }), "24 plants, 72 herbs, 41 birds");
});
