// The prototype's month. Every visit is in November (10, counting from 0 for January), the prototype
// date of Wednesday 4 November 2026. The GBIF records follow it: .design/gbif/month.py holds the same
// month, and fetch.py, build.py and organism_pages.py rebuild lib/records.ts and lib/organism-pages.ts
// for it. Capturing screens for the case study film can start the dev
// server with NEXT_PUBLIC_CAPTURE_MONTH set to 0 to 11, so the same screens read as another month;
// the sample entries for those months live in lib/spots.ts and are used only then.

const NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const raw = process.env.NEXT_PUBLIC_CAPTURE_MONTH;
const asked = raw === undefined || raw === "" ? NaN : Number(raw);

/** True only while capturing for the film, with a month other than the prototype's own. */
export const CAPTURE = Number.isInteger(asked) && asked >= 0 && asked <= 11;

/** The month as an index from 0 for January. */
export const NOW = CAPTURE ? asked : 10;

/** The month written out, "November". */
export const MONTH = NAMES[NOW];
