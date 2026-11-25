export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const raw = process.env.NEXT_PUBLIC_CAPTURE_MONTH;
const asked = raw === undefined || raw === "" ? NaN : Number(raw);

const CAPTURE = Number.isInteger(asked) && asked >= 0 && asked <= 11;

export const NOW = CAPTURE ? asked : 10;

export const MONTH = MONTH_NAMES[NOW];
