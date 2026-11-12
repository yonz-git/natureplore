# Natureplore domain

The words the code and the people working on it share. Architecture words (module, interface, seam) are
used in their plain design sense; these are the product's.

**Route**: a walk on the map, with its line and its spots. Four are built: Grumsin, Linum, Tegeler Fließ,
Tempelhofer Feld.

**Spot**: a numbered stop on a route, about one species of its own, with what to do there.

**Organism**: a species with a name, a group (plants, herbs, mushrooms, birds, mammals) and usually a page. A
page's id is not always its name: Sweet woodruff's page is `woodruff`. Ask `lib/organism-names.ts`, never build
an id from a name.

**Record**: a GBIF occurrence along a route, inside its 250 m corridor. An organism is tagged with the spots
within 300 m of its records, or failing that the closest spot, so every organism on a route has a spot.

**Season**: what is in season on a route in a month, decided in `lib/season.ts` and nowhere else.
- A spot is in season when its own species is, or when anything is recorded at it this month.
- What to look for is its own species first, then what is recorded there, most records first, three at most.
- The prototype's month is `NOW` (`lib/now.ts`). Records hold one month, `RECORDS_MONTH` in `lib/records.ts`, set
  by `.design/gbif/month.py`; a test holds the two together.
- In any other month, as in a film capture, nothing is recorded: screens say less rather than show another
  month's species as this month's. The spots' own seasons still apply.

**Region**: a place on the map search that groups routes, such as Berlin or Uckermark.

**Sheet**: the panel over the map on the phone, with three places: down, resting and open.
