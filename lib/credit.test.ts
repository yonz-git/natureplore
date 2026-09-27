// node --test lib/credit.test.ts
// The rule these guard: nothing is ever shown without a name on it, and the licence label is
// the one the source recorded.

import assert from "node:assert/strict";
import test from "node:test";

import { creditLine, licenseLabel, observerUrl } from "./credit.ts";

test("a credit reads as a name and a licence", () => {
  assert.equal(
    creditLine({ observerName: "Katrin Greiser", observerLogin: "kgreiser", license: "cc-by" }),
    "Katrin Greiser · CC BY",
  );
});

test("the login stands in when there is no display name", () => {
  assert.equal(creditLine({ observerLogin: "kgreiser", license: "cc0" }), "kgreiser · CC0");
});

test("every licence has a label", () => {
  assert.deepEqual(
    (["cc0", "cc-by", "cc-by-sa"] as const).map(licenseLabel),
    ["CC0", "CC BY", "CC BY-SA"],
  );
});

test("the observer links to their profile", () => {
  assert.equal(
    observerUrl({ observerLogin: "kgreiser", license: "cc-by" }),
    "https://www.inaturalist.org/people/kgreiser",
  );
});
