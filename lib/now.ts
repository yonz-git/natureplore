// The prototype's month. Every visit is in September (8, counting from 0 for January), the prototype
// date of Thursday 24 September 2026. Capturing screens for the case study film can start the dev
// server with NEXT_PUBLIC_CAPTURE_MONTH set to 0 to 11, so the same screens read as another month;
// the sample entries for those months live in lib/spots.ts and are used only then.

const NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const raw = process.env.NEXT_PUBLIC_CAPTURE_MONTH;
const asked = raw === undefined || raw === "" ? NaN : Number(raw);

/** True only while capturing for the film, with a month other than the prototype's own. */
export const CAPTURE = Number.isInteger(asked) && asked >= 0 && asked <= 11;

/** The month as an index from 0 for January. */
export const NOW = CAPTURE ? asked : 8;

/** The month written out, "September". */
export const MONTH = NAMES[NOW];
