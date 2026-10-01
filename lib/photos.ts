// Photographs from Unsplash (unsplash.com/license: free to use, no permission needed), downloaded
// 29 Sep 2026 for the prototype and chosen by eye for the species. Each carries its photographer and
// page, so a credit can be shown and a photo can be checked or replaced. A species without a photo
// here keeps the blank frame (ragged robin: no free photo of it was found).

export type Photo = { src: string; by: string; page: string };

export const PHOTOS: Record<string, Photo> = {
  "claims/c1a": { src: "/img/claims/c1a.jpg", by: "Ries Bosch", page: "https://unsplash.com/photos/a-puddle-of-water-in-the-middle-of-a-grassy-field-TJjkdzKQGsY" },
  "claims/c1b": { src: "/img/claims/c1b.jpg", by: "Gennady Zakharin", page: "https://unsplash.com/photos/cracked-dry-earth-along-a-lake-shore-with-green-reeds-3qZHXRYxtxA" },
  "claims/c6": { src: "/img/claims/c6.jpg", by: "Scott Huddleston", page: "https://unsplash.com/photos/wooden-boardwalk-through-grassy-wetland-HLwYdqItSu8" },
  "organisms/bearded-reedling": { src: "/img/organisms/bearded-reedling.jpg", by: "Vincent van Zalinge", page: "https://unsplash.com/photos/photo-of-brown-and-gray-short-beak-bird-r_VSC5yhwuM" },
  "organisms/black-alder": { src: "/img/organisms/black-alder.jpg", by: "Austris Augusts", page: "https://unsplash.com/photos/a-close-up-of-some-berries-ZGwhvc9fFBw" },
  "organisms/black-woodpecker": { src: "/img/organisms/black-woodpecker.jpg", by: "Daniil Komov", page: "https://unsplash.com/photos/a-black-bird-perched-on-a-tree-trunk-yFWYHKefLwk" },
  "organisms/blackthorn": { src: "/img/organisms/blackthorn.jpg", by: "Sanela Arsenić", page: "https://unsplash.com/photos/a-bunch-of-blue-berries-hanging-from-a-tree-ZZjyFK9Ye5w" },
  "organisms/common-crane": { src: "/img/organisms/common-crane.jpg", by: "Santiago Lacarta", page: "https://unsplash.com/photos/gray-bird-on-grass-pH3tczAQjCo" },
  "organisms/common-kingfisher": { src: "/img/organisms/common-kingfisher.jpg", by: "Boris Smokrovic", page: "https://unsplash.com/photos/closeup-photo-of-teal-and-orange-bird-Ori_JWlqVpc" },
  "organisms/common-reed": { src: "/img/organisms/common-reed.jpg", by: "Jahanzeb Ahsan", page: "https://unsplash.com/photos/reeds-wave-in-front-of-a-blue-lake-wAS_6rqApBM" },
  "organisms/common-snipe": { src: "/img/organisms/common-snipe.jpg", by: "Todd Morris", page: "https://unsplash.com/photos/a-small-bird-standing-on-a-wooden-post-250Uupeoe7o" },
  "organisms/cuckooflower": { src: "/img/organisms/cuckooflower.jpg", by: "Pix Tresa", page: "https://unsplash.com/photos/a-bunch-of-white-and-purple-flowers-in-a-field-1ApakgiCm4w" },
  "organisms/downy-birch": { src: "/img/organisms/downy-birch.jpg", by: "pure julia", page: "https://unsplash.com/photos/white-and-black-tree-trunks-WWOw5K-V8PU" },
  "organisms/eurasian-beaver": { src: "/img/organisms/eurasian-beaver.jpg", by: "Howard Walsh", page: "https://unsplash.com/photos/a-beaver-sits-on-muddy-ground-near-water-AV7DdezYuT4" },
  "organisms/eurasian-bittern": { src: "/img/organisms/eurasian-bittern.jpg", by: "Hongbin", page: "https://unsplash.com/photos/a-small-bird-standing-on-top-of-a-green-plant-dZfbc1DWHfA" },
  "organisms/eurasian-otter": { src: "/img/organisms/eurasian-otter.jpg", by: "Andy Spark", page: "https://unsplash.com/photos/a-close-up-of-a-beaver-CnyUDzhY9n4" },
  "organisms/eurasian-skylark": { src: "/img/organisms/eurasian-skylark.jpg", by: "Heather Wilde", page: "https://unsplash.com/photos/a-small-bird-sitting-on-top-of-a-wooden-post-7GwEO8JWij0" },
  "organisms/european-hare": { src: "/img/organisms/european-hare.jpg", by: "Margo Evardson", page: "https://unsplash.com/photos/a-brown-hare-sits-in-a-green-field-J3Y4TFmbf6k" },
  "organisms/grey-heron": { src: "/img/organisms/grey-heron.jpg", by: "Maryia Shedava", page: "https://unsplash.com/photos/a-large-bird-standing-on-top-of-a-dirt-field-rS2Nj6pNlow" },
  "organisms/grey-willow": { src: "/img/organisms/grey-willow.jpg", by: "Deny Hill", page: "https://unsplash.com/photos/soft-pussy-willow-buds-on-a-branch-in-sunlight-xbB6Ah-CqRs" },
  "organisms/greylag-goose": { src: "/img/organisms/greylag-goose.jpg", by: "Rick Souls", page: "https://unsplash.com/photos/a-duck-is-standing-in-the-water-Fzeji4pm7xU" },
  "organisms/hawthorn": { src: "/img/organisms/hawthorn.jpg", by: "Griffin Quinn", page: "https://unsplash.com/photos/a-close-up-of-some-berries-rbUkpjVd7e4" },
  "organisms/marsh-marigold": { src: "/img/organisms/marsh-marigold.jpg", by: "Wolfgang Hasselmann", page: "https://unsplash.com/photos/a-group-of-yellow-flowers-sitting-on-top-of-a-forest-floor-HAMY3oOXnP8" },
  "organisms/meadowsweet": { src: "/img/organisms/meadowsweet.jpg", by: "Fiona Dodd", page: "https://unsplash.com/photos/fluffy-white-flowers-growing-beside-dark-blue-water-AIOH97n_r-o" },
  "organisms/northern-lapwing": { src: "/img/organisms/northern-lapwing.jpg", by: "Lukáš Kadava", page: "https://unsplash.com/photos/a-northern-lapwing-bird-standing-in-grassy-field-BmILoPtPRCw" },
  "organisms/northern-wheatear": { src: "/img/organisms/northern-wheatear.jpg", by: "Ronan Hello", page: "https://unsplash.com/photos/a-bird-is-perched-on-a-tree-branch-SEw0hA-6-5o" },
  "organisms/pedunculate-oak": { src: "/img/organisms/pedunculate-oak.jpg", by: "Tina Xinia", page: "https://unsplash.com/photos/brown-fruit-on-green-leaves-during-daytime-2o8a64Gznlo" },
  "organisms/porcelain-fungus": { src: "/img/organisms/porcelain-fungus.jpg", by: "Jaap Straydog", page: "https://unsplash.com/photos/three-mushrooms-o9JapjMqjfc" },
  "organisms/purple-loosestrife": { src: "/img/organisms/purple-loosestrife.jpg", by: "Stephanie Gibeault", page: "https://unsplash.com/photos/vibrant-purple-flowers-bloom-in-a-field-qjfaKB3qngM" },
  "organisms/red-fox": { src: "/img/organisms/red-fox.jpg", by: "Charles Jackson", page: "https://unsplash.com/photos/brown-fox-on-green-grass-during-daytime-BNR4sS2LA10" },
  "organisms/roe-deer": { src: "/img/organisms/roe-deer.jpg", by: "Bob Brewer", page: "https://unsplash.com/photos/brown-deer-in-green-grass-during-daytime-RIUb1HXg750" },
  "organisms/silver-birch": { src: "/img/organisms/silver-birch.jpg", by: "Martin Sepion", page: "https://unsplash.com/photos/brown-tree-trunk-in-tilt-shift-lens-XeuLqlq9JAA" },
  "organisms/water-mint": { src: "/img/organisms/water-mint.jpg", by: "Gagan Varma", page: "https://unsplash.com/photos/green-leaves-with-water-droplets-SVGw0YkqN4o" },
  "organisms/water-vole": { src: "/img/organisms/water-vole.jpg", by: "Jonathan Ridley", page: "https://unsplash.com/photos/brown-rodent-on-green-grass-wO1SCsmlIAk" },
  "organisms/western-marsh-harrier": { src: "/img/organisms/western-marsh-harrier.jpg", by: "Christoph Nolte", page: "https://unsplash.com/photos/a-hawk-with-wings-spread-flies-against-a-dark-sky-O1pcvSavbrQ" },
  "organisms/white-stork": { src: "/img/organisms/white-stork.jpg", by: "Doncoombez", page: "https://unsplash.com/photos/a-white-bird-with-a-long-neck-standing-in-tall-grass-kYs74jpmxA4" },
  "organisms/white-willow": { src: "/img/organisms/white-willow.jpg", by: "Kevy Michaels", page: "https://unsplash.com/photos/a-large-tree-stands-beside-a-calm-lake-eaOF8ZeQmyA" },
  "organisms/wild-boar": { src: "/img/organisms/wild-boar.jpg", by: "Ed van duijn", page: "https://unsplash.com/photos/shallow-focus-photo-of-pig-414NZVxzc20" },
  "organisms/yellow-iris": { src: "/img/organisms/yellow-iris.jpg", by: "Anneliese Klotz", page: "https://unsplash.com/photos/yellow-irises-bloom-beside-a-calm-body-of-water-VQItJaxFUT0" },
  "routes/grumsin": { src: "/img/routes/grumsin.jpg", by: "Ken Shono", page: "https://unsplash.com/photos/person-in-black-jacket-walking-on-brown-dirt-road-in-the-middle-of-green-trees-during-911Pcj6Tgao" },
  "routes/linum": { src: "/img/routes/linum.jpg", by: "Santiago Lacarta", page: "https://unsplash.com/photos/birds-on-field-OFkZPEjFKaE" },
  "routes/tegel": { src: "/img/routes/tegel.jpg", by: "Leshaesvan", page: "https://unsplash.com/photos/a-wide-open-field-with-a-river-running-through-it-0eFr29kRHso" },
  "routes/tempelhof": { src: "/img/routes/tempelhof.jpg", by: "Unsplash", page: "https://unsplash.com/photos/a-grassy-field-with-a-water-tower-in-the-background-AoVkvse3DhM" },
};

/** An organism's photo by its common name, "Common crane" → organisms/common-crane. */
export const organismPhoto = (name: string): Photo | undefined =>
  PHOTOS[`organisms/${name.toLowerCase().replace(/[^a-z]+/g, "-")}`];

/** "Photo: Name, Unsplash" */
export const creditLine = (p: Photo) => `Photo: ${p.by}, Unsplash`;
