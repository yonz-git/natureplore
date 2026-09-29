# Natureplore prototype

The v1 prototype: find nature near you, understand its state, and help it.
Next.js (App Router) and TypeScript, Tailwind v4, deployed on Vercel.

```bash
npm install
npm run dev      # http://localhost:3000
npm run tokens   # regenerate app/tokens.css from the design system
npm run build
```

## Where things come from

| Thing | Source |
| --- | --- |
| Design tokens | `docs/design.md` frontmatter, generated into `app/tokens.css` by `scripts/tokens.mjs`. Edit the design system, never `tokens.css`. |
| Base map data | `public/base-geo.js`, copied from `../design flow/base-geo.js`. Regenerate it from `../design flow/base-geo-src/`. Vector data from OpenStreetMap, no tile server. `components/RegionMap.tsx` draws it with Leaflet on the Map tab. |
| Background photograph | `public/img/forest-olena-bohovyk.jpg`, from `../docs/assets/`. |
| Intro photograph | `public/img/intro-waterfall.webp`, the waterfall from the "Logo 3-2" intro board, 1920 wide. |
| Intro shading | `public/img/intro-shade.webp`, the edge shading and grain of the intro logo, baked from the board's SVG filters (`d-model`, `e-grain`) so nothing is filtered live. Its rim is in `marker-label-deep`, to match the logo's marker colours; a change to the logo's shape or colours needs a new bake. |
| Place tiles | `public/img/place-*.jpg`, the soft fields the version 6 boards use where a place photograph will go. |
| Screens and states | The wireframe canvas, https://claude.ai/artifact/S5XrKyZEsHDqYnrxfLM98F (phone, tablet and desktop boards, codes A0 to K7). |
| Flows | `../design flow/Natureplore_User_Flows_v1.md`, generated from `../design flow/flows-src/`. |
| Brand | `../BRAND.md`. |

## Scope

v1 only. Three tabs: Map, Learn, Notebook. No booking, no guided walks, no
guides, no payments, those are v2 (flows G to K, reporting a sighting included).

There is no sign-in. Where v1 asks for an account, the prototype acts as if the
person is already signed in, so joining an action completes straight away.

Notifications only ever report a change of state in something the person
started. No streaks, no engagement prompts.

## Layout

- `app/page.tsx` opens with A0 · Welcome, logo applied, the logo intro (below), and then shows A0 · Welcome, which scrolls into A0-2 · Welcome (`components/Welcome.tsx`). It opens as A0: the green field and the three statements, which blur in word by word. Scrolling moves the statements to their A0-2 places, opens the forest photograph in a growing circle, brings in the nav and the green action, and fades the map card in last. The page is laid out as A0-2 in `app/welcome2.css`; `app/welcome.css` holds the field, the intro and the scroll choreography, where every A0 position is the "from" of a paused animation. `components/WelcomeScroll.tsx` feeds them one eased scroll progress value, so the page glides after the scroll, and grows the circle with transforms only (a round lens scaled up, the photograph inside it scaled by the inverse), so nothing is repainted on the way. A person who asked for reduced motion, or a browser without scripting, gets A0-2 as a still page.
- `components/IntroGate.tsx` plays A0 · Welcome, logo applied, the logo intro from the "Logo 3-2" board (`components/Intro.tsx`), before A0 · Welcome. The welcome only mounts on Continue or Skip, so its own opening starts then, and the intro fades away over it. It plays when the site is opened or reloaded, not when someone comes back to the start from inside the app. The forest photograph behind its veil, and the logo assembling itself: the plant, the bird and the mushroom gather into the symbol, then the swan, the snake, the squirrel and the leaf spell out the wordmark. Skip is there the whole time; once the animals have settled, at 8.5s, Replay and Continue come up. The timeline is GSAP in `lib/intro-timeline.ts`, in the logo's own viewBox units; the logo is `components/intro-logo.ts`, one piece per animal and letter, clipped from one shared fill in the marker tokens, the colours of the "You are here" tag and dot. `app/intro.css` sizes the logo with `min()` and `max()` as the board does, covering the window and easing back on a narrow screen to stay whole. Reduced motion gets the photograph and the logo fading in, nothing else.
- `components/WelcomeEther.tsx` puts a liquid layer over A0's green field: the pointer stirs flows in three green tokens, the field colour stays underneath. It wraps `components/LiquidEther.tsx`, copied in from React Bits (needs `three`, loaded after the page). It is not mounted for reduced motion, and it pauses once the forest covers the field.
- `components/WelcomeReveal.tsx` lets the forest photograph show faintly through A0's field in a soft circle that follows the mouse, under the liquid layer. Transforms only, mouse and pen only, off for reduced motion.
- `app/welcome/page.tsx` is A0-2 · Welcome on its own, the same component with `still`: the statements, one green action and a glass card holding the region map, split layout with the glass nav pill from 1024px.
- `app/glass.css` is the frosted glass recipe from the design system as classes: `glass` plus a tier (`glass-pin`, `glass-pill`, `glass-nav`, `glass-card`), `glass-top` for sheets that bleed off the bottom edge, and `glass-inner` for glass that sits on glass.
- `app/(app)/` is the tabbed shell. `learn` and `notebook` are stub screens for now. The map tab is flow A:
  - `map` is A1, where "Go to map" on A0 lands: a start card over the real Berlin and Brandenburg map on the phone, the start panel on the desktop. Search opens A2, the location prompt leads to A4 when allowed and A5 when declined, and Browse (desktop) opens A5.
  - `map/search` is A2 and A3 in one screen (`components/SearchScreen.tsx`): the regions whose name contains what was typed, or, when nothing does, the nearest mapped spellings. The query is in the address. A mapped region opens A5, one that is not mapped opens A6.
  - `map/near-you` (A4) and `map/region` (A5) are one screen in two states (`components/RoutesScreen.tsx`): routes near the person, or the whole region with its count pins and a line offering the location again. `map/saved` is A7 (`components/SavedScreen.tsx`), reached from the Saved control on the desktop map.
  - `map/not-mapped` is A6, the honest empty state, with a street grid and no routes. `map/offline` is the first open without a connection, reached by its address only.
  - `components/MapParts.tsx` holds what every map screen shares: the search field, the Routes and Organisms segment, the organism pills, the route and saved cards, a region row and the desktop tools. `app/map.css` lays them out, phone first, and from 64rem moves the bar and the sheet into one glass panel. `glass-phone` and `glass-desk` in `app/glass.css` make a surface glass at one size only.
  - `components/LocationDialog.tsx` stands in for the permission prompt: the system alert on the phone, the browser prompt on the desktop, in the `system-` colours. It is put on the body, because a screen is a fixed layer and so its own stacking context.
  - `lib/routes.ts` holds the routes, saved spots and regions every screen reads, so a card, a pin and a search result never disagree. `lib/saved.ts` keeps what was saved on this device.
- `components/RegionMap.tsx` is the map itself: Leaflet over the vector geometry in `public/base-geo.js`, drawn to one canvas in the `basemap` tokens, with no tile server, so it holds the design system and works offline. The count pins are React siblings of the Leaflet container, placed from `latLngToContainerPoint` on every move, because a Leaflet pane always carries a transform and a transformed ancestor switches the frost off. The place names are plain text, so they stay ordinary markers. The view is centred in the part of the screen the sheet leaves free, above it on the phone and beside it on the desktop, so a pin is never under the glass.
- `components/Logo.tsx` is the natureplore mark, one inline SVG filled with `currentColor`; give it a height and the width follows.
- `components/` holds shared pieces, `TabBar` is the fixed bottom navigation.
- `--top-chrome` in `app/globals.css` is the room above the first element on a screen. A status
  bar only exists once the app is installed, so it is `1.75rem` plus the safe area rather than a
  fixed allowance: in any browser it is the same offset the desktop layout uses, and on an
  installed phone the notch adds itself. Every screen top uses it, the welcome page, the tabbed
  shell and the map credit.
- `app/tokens.css` is generated; `app/globals.css` is hand written.
