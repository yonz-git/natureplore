// A8 · Recorded along this route: everything recorded within 250 m of Linum wet meadows loop, by
// group, in one fixed order. Names and dates come from the canvas's A8 boards; they are sample
// records. "where" is the spot a record was made at, when it was at one.

import type { Group } from "@/lib/routes";

export type Recorded = { name: string; latin: string; last: string; where?: string };

const rows = (list: [string, string, string, string?][]): Recorded[] =>
  list.map(([name, latin, last, where]) => ({ name, latin, last, where }));

export const LINUM_RECORDED: { group: Group; total: number; rows: Recorded[] }[] = [
  {
    group: "plants",
    total: 19,
    rows: rows([
      ["Grey willow", "Salix cinerea", "4 Sep 2026"],
      ["Black alder", "Alnus glutinosa", "4 Sep 2026"],
      ["Pedunculate oak", "Quercus robur", "30 Aug 2026"],
      ["Silver birch", "Betula pendula", "4 Sep 2026"],
      ["White willow", "Salix alba", "22 Aug 2026"],
      ["Hawthorn", "Crataegus monogyna", "9 Sep 2026"],
      ["Blackthorn", "Prunus spinosa", "1 Sep 2026"],
      ["Downy birch", "Betula pubescens", "14 Aug 2026"],
    ]),
  },
  {
    group: "herbs",
    total: 48,
    rows: rows([
      ["Marsh marigold", "Caltha palustris", "18 May 2026", "At spot 5"],
      ["Ragged robin", "Silene flos-cuculi", "2 Jun 2026"],
      ["Yellow iris", "Iris pseudacorus", "12 Jun 2026"],
      ["Purple loosestrife", "Lythrum salicaria", "20 Aug 2026"],
      ["Meadowsweet", "Filipendula ulmaria", "3 Aug 2026"],
      ["Water mint", "Mentha aquatica", "28 Aug 2026"],
      ["Common reed", "Phragmites australis", "9 Sep 2026"],
      ["Cuckooflower", "Cardamine pratensis", "7 May 2026"],
    ]),
  },
  { group: "mushrooms", total: 0, rows: [] },
  {
    group: "birds",
    total: 64,
    rows: rows([
      ["Common crane", "Grus grus", "11 Sep 2026", "At spots 1 and 2"],
      ["Eurasian bittern", "Botaurus stellaris", "20 Apr 2026"],
      ["White stork", "Ciconia ciconia", "16 Aug 2026", "At spot 6"],
      ["Greylag goose", "Anser anser", "10 Sep 2026", "At spot 3"],
      ["Northern lapwing", "Vanellus vanellus", "5 Sep 2026", "At spot 3"],
      ["Western marsh harrier", "Circus aeruginosus", "2 Sep 2026"],
      ["Bearded reedling", "Panurus biarmicus", "27 Aug 2026", "At spot 4"],
      ["Common snipe", "Gallinago gallinago", "8 Sep 2026"],
    ]),
  },
  {
    group: "mammals",
    total: 7,
    rows: rows([
      ["Roe deer", "Capreolus capreolus", "11 Sep 2026"],
      ["European hare", "Lepus europaeus", "28 Aug 2026"],
      ["Red fox", "Vulpes vulpes", "6 Sep 2026"],
      ["Eurasian otter", "Lutra lutra", "19 Aug 2026"],
      ["Wild boar", "Sus scrofa", "3 Sep 2026"],
      ["Eurasian beaver", "Castor fiber", "25 Aug 2026"],
      ["Water vole", "Arvicola amphibius", "30 Jul 2026"],
    ]),
  },
];
