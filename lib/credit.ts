// Every photograph and every occurrence record arrives from iNaturalist with the person who made
// it attached, and the licence that person chose. Credit is a field, not a footer: the observer
// keeps their name on their work wherever it is shown.
//
// The field name is `license` rather than `licence` because that is the column in the iNaturalist
// AWS Open Data export, and one spelling across the pipeline is worth more than house style here.

/**
 * The only licences ingested. NC is deliberately not in this union, so a non-commercial record
 * cannot be represented, let alone rendered. The filter lives in the type, not in the view.
 */
export type License = "cc0" | "cc-by" | "cc-by-sa";

export type Credit = {
  /** the observer's display name, absent when they have not set one */
  observerName?: string;
  /** their iNaturalist login, always present, and what the profile link is built from */
  observerLogin: string;
  license: License;
  /** ISO date the observation was made, for the dated-source rule */
  observedOn?: string;
};

const LICENSE_LABELS: Record<License, string> = {
  "cc0": "CC0",
  "cc-by": "CC BY",
  "cc-by-sa": "CC BY-SA",
};

export function licenseLabel(license: License): string {
  return LICENSE_LABELS[license];
}

/** iNaturalist profile of the person who made the observation */
export function observerUrl(credit: Credit): string {
  return `https://www.inaturalist.org/people/${credit.observerLogin}`;
}

/**
 * The credit as it is set under a photograph or beside a record: a name, then the licence.
 * The login stands in when someone has no display name, because an unattributed CC-BY photo
 * is a licence breach, not a style choice.
 */
export function creditLine(credit: Credit): string {
  return `${credit.observerName ?? credit.observerLogin} · ${licenseLabel(credit.license)}`;
}
