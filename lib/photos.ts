// Photographs from Unsplash (unsplash.com/license: free to use, no permission needed), downloaded
// 29 Sep and 17 Oct 2026 for the prototype and chosen by eye for the species. Each carries its
// photographer and page, so a credit can be shown and a photo can be checked or replaced. A species
// without a photo here keeps the blank frame: no free Unsplash photo was found of ragged robin,
// woodruff, wood melick, beech woodwart, candlesnuff fungus or the red-breasted flycatcher. A few
// stand in for their species at a glance: the noctule bat, the early marsh orchid and the
// beechwood sickener are a bat, a marsh orchid and a red-capped brittlegill not named to species.

export type Photo = { src: string; by: string; page: string };

export const PHOTOS: Record<string, Photo> = {
  "claims/c1a": { src: "/img/claims/c1a.jpg", by: "Ries Bosch", page: "https://unsplash.com/photos/a-puddle-of-water-in-the-middle-of-a-grassy-field-TJjkdzKQGsY" },
  "claims/c1b": { src: "/img/claims/c1b.jpg", by: "Gennady Zakharin", page: "https://unsplash.com/photos/cracked-dry-earth-along-a-lake-shore-with-green-reeds-3qZHXRYxtxA" },
  "claims/c6": { src: "/img/claims/c6.jpg", by: "Scott Huddleston", page: "https://unsplash.com/photos/wooden-boardwalk-through-grassy-wetland-HLwYdqItSu8" },
  "organisms/artist-s-bracket": { src: "/img/organisms/artist-s-bracket.jpg", by: "Anya Chernykh", page: "https://unsplash.com/photos/a-group-of-mushrooms-growing-on-the-side-of-a-tree-byVEi2ZqsMM" },
  "organisms/bearded-reedling": { src: "/img/organisms/bearded-reedling.jpg", by: "Vincent van Zalinge", page: "https://unsplash.com/photos/photo-of-brown-and-gray-short-beak-bird-r_VSC5yhwuM" },
  "organisms/beechwood-sickener": { src: "/img/organisms/beechwood-sickener.jpg", by: "Andrew", page: "https://unsplash.com/photos/a-small-red-mushroom-growing-in-the-forest-uAQJyYZGHik" },
  "organisms/black-alder": { src: "/img/organisms/black-alder.jpg", by: "Austris Augusts", page: "https://unsplash.com/photos/a-close-up-of-some-berries-ZGwhvc9fFBw" },
  "organisms/black-woodpecker": { src: "/img/organisms/black-woodpecker.jpg", by: "Daniil Komov", page: "https://unsplash.com/photos/a-black-bird-perched-on-a-tree-trunk-yFWYHKefLwk" },
  "organisms/blackthorn": { src: "/img/organisms/blackthorn.jpg", by: "Sanela Arsenić", page: "https://unsplash.com/photos/a-bunch-of-blue-berries-hanging-from-a-tree-ZZjyFK9Ye5w" },
  "organisms/bog-moss": { src: "/img/organisms/bog-moss.jpg", by: "Hanna Lazar", page: "https://unsplash.com/photos/green-moss-growing-on-forest-floor-with-twigs-QC6INZb7AyM" },
  "organisms/common-beech": { src: "/img/organisms/common-beech.jpg", by: "Lutz Stallknecht", page: "https://unsplash.com/photos/beech-branch-with-green-leaves-Mxo7zQa18yQ" },
  "organisms/common-cotton-grass": { src: "/img/organisms/common-cotton-grass.jpg", by: "Pix Tresa", page: "https://unsplash.com/photos/a-couple-of-white-flowers-sitting-on-top-of-a-green-plant-FOVqI-qgEdg" },
  "organisms/common-crane": { src: "/img/organisms/common-crane.jpg", by: "Santiago Lacarta", page: "https://unsplash.com/photos/gray-bird-on-grass-pH3tczAQjCo" },
  "organisms/common-kingfisher": { src: "/img/organisms/common-kingfisher.jpg", by: "Boris Smokrovic", page: "https://unsplash.com/photos/closeup-photo-of-teal-and-orange-bird-Ori_JWlqVpc" },
  "organisms/common-reed": { src: "/img/organisms/common-reed.jpg", by: "Jahanzeb Ahsan", page: "https://unsplash.com/photos/reeds-wave-in-front-of-a-blue-lake-wAS_6rqApBM" },
  "organisms/common-snipe": { src: "/img/organisms/common-snipe.jpg", by: "Todd Morris", page: "https://unsplash.com/photos/a-small-bird-standing-on-a-wooden-post-250Uupeoe7o" },
  "organisms/cuckooflower": { src: "/img/organisms/cuckooflower.jpg", by: "Pix Tresa", page: "https://unsplash.com/photos/a-bunch-of-white-and-purple-flowers-in-a-field-1ApakgiCm4w" },
  "organisms/downy-birch": { src: "/img/organisms/downy-birch.jpg", by: "pure julia", page: "https://unsplash.com/photos/white-and-black-tree-trunks-WWOw5K-V8PU" },
  "organisms/early-marsh-orchid": { src: "/img/organisms/early-marsh-orchid.jpg", by: "bryan priestley", page: "https://unsplash.com/photos/a-purple-flower-is-growing-in-the-grass-56yif-F0Qr8" },
  "organisms/eurasian-beaver": { src: "/img/organisms/eurasian-beaver.jpg", by: "Howard Walsh", page: "https://unsplash.com/photos/a-beaver-sits-on-muddy-ground-near-water-AV7DdezYuT4" },
  "organisms/eurasian-bittern": { src: "/img/organisms/eurasian-bittern.jpg", by: "Hongbin", page: "https://unsplash.com/photos/a-small-bird-standing-on-top-of-a-green-plant-dZfbc1DWHfA" },
  "organisms/eurasian-nuthatch": { src: "/img/organisms/eurasian-nuthatch.jpg", by: "Gerrit Stam", page: "https://unsplash.com/photos/nuthatch-clinging-to-tree-stump-V8i9ldeIHUk" },
  "organisms/eurasian-otter": { src: "/img/organisms/eurasian-otter.jpg", by: "Andy Spark", page: "https://unsplash.com/photos/a-close-up-of-a-beaver-CnyUDzhY9n4" },
  "organisms/eurasian-red-squirrel": { src: "/img/organisms/eurasian-red-squirrel.jpg", by: "Pearse O'Halloran", page: "https://unsplash.com/photos/brown-squirrel-on-brown-tree-trunk-OPEcO8M_m7U" },
  "organisms/eurasian-skylark": { src: "/img/organisms/eurasian-skylark.jpg", by: "Heather Wilde", page: "https://unsplash.com/photos/a-small-bird-sitting-on-top-of-a-wooden-post-7GwEO8JWij0" },
  "organisms/european-hare": { src: "/img/organisms/european-hare.jpg", by: "Margo Evardson", page: "https://unsplash.com/photos/a-brown-hare-sits-in-a-green-field-J3Y4TFmbf6k" },
  "organisms/great-crested-grebe": { src: "/img/organisms/great-crested-grebe.jpg", by: "Will Hulbert", page: "https://unsplash.com/photos/a-duck-floating-on-top-of-a-body-of-water-9-Jswh0n8Fc" },
  "organisms/grey-heron": { src: "/img/organisms/grey-heron.jpg", by: "Maryia Shedava", page: "https://unsplash.com/photos/a-large-bird-standing-on-top-of-a-dirt-field-rS2Nj6pNlow" },
  "organisms/grey-willow": { src: "/img/organisms/grey-willow.jpg", by: "Deny Hill", page: "https://unsplash.com/photos/soft-pussy-willow-buds-on-a-branch-in-sunlight-xbB6Ah-CqRs" },
  "organisms/greylag-goose": { src: "/img/organisms/greylag-goose.jpg", by: "Rick Souls", page: "https://unsplash.com/photos/a-duck-is-standing-in-the-water-Fzeji4pm7xU" },
  "organisms/hawthorn": { src: "/img/organisms/hawthorn.jpg", by: "Griffin Quinn", page: "https://unsplash.com/photos/a-close-up-of-some-berries-rbUkpjVd7e4" },
  "organisms/holly": { src: "/img/organisms/holly.jpg", by: "Trevor Vannoy", page: "https://unsplash.com/photos/a-branch-with-red-berries-and-green-leaves-gr4eHZxez30" },
  "organisms/hornbeam": { src: "/img/organisms/hornbeam.jpg", by: "Pix Tresa", page: "https://unsplash.com/photos/a-close-up-of-a-tree-branch-with-leaves-jCipn0o_Tsc" },
  "organisms/marsh-marigold": { src: "/img/organisms/marsh-marigold.jpg", by: "Wolfgang Hasselmann", page: "https://unsplash.com/photos/a-group-of-yellow-flowers-sitting-on-top-of-a-forest-floor-HAMY3oOXnP8" },
  "organisms/meadowsweet": { src: "/img/organisms/meadowsweet.jpg", by: "Fiona Dodd", page: "https://unsplash.com/photos/fluffy-white-flowers-growing-beside-dark-blue-water-AIOH97n_r-o" },
  "organisms/middle-spotted-woodpecker": { src: "/img/organisms/middle-spotted-woodpecker.jpg", by: "Łukasz Rawa", page: "https://unsplash.com/photos/black-and-white-bird-on-brown-tree-branch-5B_ItUbsXz8" },
  "organisms/noctule-bat": { src: "/img/organisms/noctule-bat.jpg", by: "Todd Cravens", page: "https://unsplash.com/photos/brown-and-black-bat-opening-mouth-IY1sRDxNWN4" },
  "organisms/northern-lapwing": { src: "/img/organisms/northern-lapwing.jpg", by: "Lukáš Kadava", page: "https://unsplash.com/photos/a-northern-lapwing-bird-standing-in-grassy-field-BmILoPtPRCw" },
  "organisms/northern-wheatear": { src: "/img/organisms/northern-wheatear.jpg", by: "Ronan Hello", page: "https://unsplash.com/photos/a-bird-is-perched-on-a-tree-branch-SEw0hA-6-5o" },
  "organisms/osprey": { src: "/img/organisms/osprey.jpg", by: "Meenakshi Bose", page: "https://unsplash.com/photos/a-large-bird-perched-on-top-of-a-tree-branch-7GUgCmsp0wQ" },
  "organisms/oyster-mushroom": { src: "/img/organisms/oyster-mushroom.jpg", by: "Victor Birai", page: "https://unsplash.com/photos/a-close-up-of-a-bunch-of-mushrooms-HoKEqznOSVo" },
  "organisms/pedunculate-oak": { src: "/img/organisms/pedunculate-oak.jpg", by: "Tina Xinia", page: "https://unsplash.com/photos/brown-fruit-on-green-leaves-during-daytime-2o8a64Gznlo" },
  "organisms/pine-marten": { src: "/img/organisms/pine-marten.jpg", by: "Oskar Jabłoński", page: "https://unsplash.com/photos/a-brown-marten-sits-on-grassy-ground-near-water-BwCaz0VgVCE" },
  "organisms/porcelain-fungus": { src: "/img/organisms/porcelain-fungus.jpg", by: "Jaap Straydog", page: "https://unsplash.com/photos/three-mushrooms-o9JapjMqjfc" },
  "organisms/purple-loosestrife": { src: "/img/organisms/purple-loosestrife.jpg", by: "Stephanie Gibeault", page: "https://unsplash.com/photos/vibrant-purple-flowers-bloom-in-a-field-qjfaKB3qngM" },
  "organisms/red-deer": { src: "/img/organisms/red-deer.jpg", by: "Stefan Szankowski", page: "https://unsplash.com/photos/majestic-stag-with-large-antlers-in-a-grassy-field-iEARPGdD3I0" },
  "organisms/red-fox": { src: "/img/organisms/red-fox.jpg", by: "Charles Jackson", page: "https://unsplash.com/photos/brown-fox-on-green-grass-during-daytime-BNR4sS2LA10" },
  "organisms/roe-deer": { src: "/img/organisms/roe-deer.jpg", by: "Bob Brewer", page: "https://unsplash.com/photos/brown-deer-in-green-grass-during-daytime-RIUb1HXg750" },
  "organisms/round-leaved-sundew": { src: "/img/organisms/round-leaved-sundew.jpg", by: "Théotim THORON", page: "https://unsplash.com/photos/red-and-yellow-flower-in-macro-lens-RZ3o34qgW_4" },
  "organisms/scots-pine": { src: "/img/organisms/scots-pine.jpg", by: "Joanna Kosinska", page: "https://unsplash.com/photos/green-christmas-tree-with-pinecones-l_QssMVzmBU" },
  "organisms/sessile-oak": { src: "/img/organisms/sessile-oak.jpg", by: "alksndra", page: "https://unsplash.com/photos/a-close-up-of-a-leaf-on-a-tree-bjIeFsqbjQ4" },
  "organisms/silver-birch": { src: "/img/organisms/silver-birch.jpg", by: "Martin Sepion", page: "https://unsplash.com/photos/brown-tree-trunk-in-tilt-shift-lens-XeuLqlq9JAA" },
  "organisms/tinder-fungus": { src: "/img/organisms/tinder-fungus.jpg", by: "Haberdoedas", page: "https://unsplash.com/photos/mushrooms-growing-on-the-bark-of-a-tree-NGl51mmWIcM" },
  "organisms/turkey-tail": { src: "/img/organisms/turkey-tail.jpg", by: "Ronin", page: "https://unsplash.com/photos/a-close-up-of-a-bunch-of-mushrooms-on-a-tree-T3FQFz6UxM0" },
  "organisms/water-mint": { src: "/img/organisms/water-mint.jpg", by: "Gagan Varma", page: "https://unsplash.com/photos/green-leaves-with-water-droplets-SVGw0YkqN4o" },
  "organisms/water-vole": { src: "/img/organisms/water-vole.jpg", by: "Jonathan Ridley", page: "https://unsplash.com/photos/brown-rodent-on-green-grass-wO1SCsmlIAk" },
  "organisms/western-marsh-harrier": { src: "/img/organisms/western-marsh-harrier.jpg", by: "Christoph Nolte", page: "https://unsplash.com/photos/a-hawk-with-wings-spread-flies-against-a-dark-sky-O1pcvSavbrQ" },
  "organisms/white-stork": { src: "/img/organisms/white-stork.jpg", by: "Doncoombez", page: "https://unsplash.com/photos/a-white-bird-with-a-long-neck-standing-in-tall-grass-kYs74jpmxA4" },
  "organisms/white-willow": { src: "/img/organisms/white-willow.jpg", by: "Kevy Michaels", page: "https://unsplash.com/photos/a-large-tree-stands-beside-a-calm-lake-eaOF8ZeQmyA" },
  "organisms/wild-boar": { src: "/img/organisms/wild-boar.jpg", by: "Ed van duijn", page: "https://unsplash.com/photos/shallow-focus-photo-of-pig-414NZVxzc20" },
  "organisms/wood-anemone": { src: "/img/organisms/wood-anemone.jpg", by: "Ira Piller", page: "https://unsplash.com/photos/a-group-of-white-flowers-with-green-leaves-XgG8U98qxsE" },
  "organisms/wood-sorrel": { src: "/img/organisms/wood-sorrel.jpg", by: "Vasilina Sirotina", page: "https://unsplash.com/photos/a-bunch-of-flowers-that-are-in-the-grass-ZJ8cLeQoEC4" },
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
