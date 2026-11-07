// `license`, not `licence`: the column name in the iNaturalist export

// NC is left out on purpose, so a non-commercial record cannot be represented
export type License = "cc0" | "cc-by" | "cc-by-sa";

export type Credit = {
  observerName?: string;
  observerLogin: string;
  license: License;
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

export function observerUrl(credit: Credit): string {
  return `https://www.inaturalist.org/people/${credit.observerLogin}`;
}

// the login stands in for a missing name: an unattributed CC-BY photo is a licence breach
export function creditLine(credit: Credit): string {
  return `${credit.observerName ?? credit.observerLogin} · ${licenseLabel(credit.license)}`;
}
