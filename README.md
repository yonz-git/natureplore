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

v1 only. Three tabs: Routes, Learn, Saved. No booking, no guided walks, no
guides, no payments, those are v2 (flows G to K, reporting a sighting included).

There are no accounts. Saving keeps a route on this device, and nothing asks for
sign-in or an email. Which screens exist, and what they say, follows the flow and
IA redesign in `../.forge/briefs/flow-ia-redesign-final.md`.

Notifications only ever report a change of state in something the person
started. No streaks, no engagement prompts.

## Layout

- `app/page.tsx` opens with A0 · Welcome, logo applied, the logo intro (below), and then shows A0 · Welcome, which scrolls into A0-2 · Welcome (`components/Welcome.tsx`). It opens as A0: the green field and the three statements, which blur in word by word. Scrolling moves the statements to their A0-2 places, opens the forest photograph in a growing circle, brings in the nav and the green action, and fades the map card in last. The page is laid out as A0-2 in `app/welcome2.css`; `app/welcome.css` holds the field, the intro and the scroll choreography, where every A0 position is the "from" of a paused animation. `components/WelcomeScroll.tsx` feeds them one eased scroll progress value, so the page glides after the scroll, and grows the circle with transforms only (a round lens scaled up, the photograph inside it scaled by the inverse), so nothing is repainted on the way. A person who asked for reduced motion, or a browser without scripting, gets A0-2 as a still page.
- `components/IntroGate.tsx` plays A0 · Welcome, logo applied, the logo intro from the "Logo 3-2" board (`components/Intro.tsx`), before A0 · Welcome. The welcome only mounts on Continue or Skip, so its own opening starts then, and the intro fades away over it. It plays when the site is opened or reloaded, not when someone comes back to the start from inside the app. The forest photograph behind its veil, and the logo assembling itself: the plant, the bird and the mushroom gather into the symbol, then the swan, the snake, the squirrel and the leaf spell out the wordmark. Skip is there the whole time; once the animals have settled, at 8.5s, Replay and Continue come up. The timeline is GSAP in `lib/intro-timeline.ts`, in the logo's own viewBox units; the logo is `components/intro-logo.ts`, one piece per animal and letter, clipped from one shared fill in the marker tokens, the colours of the "You are here" tag and dot. `app/intro.css` sizes the logo with `min()` and `max()` as the board does, covering the window and easing back on a narrow screen to stay whole. Reduced motion gets the photograph and the logo fading in, nothing else.
- `components/WelcomeEther.tsx` puts a liquid layer over A0's green field: the pointer stirs flows in three green tokens, the field colour stays underneath. It wraps `components/LiquidEther.tsx`, copied in from React Bits (needs `three`, loaded after the page). It is not mounted for reduced motion, and it pauses once the forest covers the field.
- `components/WelcomeReveal.tsx` lets the forest photograph show faintly through A0's field in a soft circle that follows the mouse, under the liquid layer. Transforms only, mouse and pen only, off for reduced motion.
- `app/welcome/page.tsx` is A0-2 · Welcome on its own, the same component with `still`: the statements, one green action and a glass card holding the region map, split layout with the glass nav pill from 1024px.
- `app/glass.css` is the frosted glass recipe from the design system as classes: `glass` plus a tier (`glass-pin`, `glass-pill`, `glass-nav`, `glass-card`), `glass-top` for sheets that bleed off the bottom edge, and `glass-inner` for glass that sits on glass.
- `app/(app)/` is the tabbed shell: Routes (`map`, A5), Learn (`learn`, D0) and Saved (`saved`, E1). The Routes tab is flow A:
  - `map` is A5, the first screen of the app and where "Go to map" on the welcome lands: the routes in season this month in Berlin and Brandenburg, sorted by how many of their spots are in season (`components/SuggestionsScreen.tsx`, cards in `components/SuggestionCard.tsx`). Save works in place on every card, and says so beside the bookmark. On the phone the sheet's handle is a control (`components/SheetGrab.tsx`): drag it, tap it, or scroll the list to open the sheet to the top; B1 uses the same. On the phone "Show on map" swaps the list for the map with the routes labelled; from 64rem the list is the panel and the map is always beside it. "Use my location" asks first: allowing opens `map/near-you`, A4, the same screen near you; declining stays on A5.
  - `map/search` is A2 and A3 in one screen (`components/SearchScreen.tsx`): the map searches for a region or an organism, never a route. Results come as Regions, then Organisms, as the query is typed; a miss offers the nearest names and says where routes are mapped. A region opens `map?region=…`, its suggestions, where the Routes / Organisms switch picks what is listed. The query is in the address. From 64rem search happens inside the same panel as the suggestions.
  - `saved` is E1 (`components/SavedScreen.tsx`): the routes saved on this device, each downloaded, with Walk it, which opens the walk (L4), then the organisms, and the actions and documentaries kept.
  - `map/route/[id]/recorded` is A8 (`components/RecordedScreen.tsx`, `lib/recorded.ts`), everything recorded along Linum wet meadows loop, opened from B1.
  - `map/offline` is the first open without a connection, reached by its address only. Try again goes to A5.
  - `map/route/[id]` is B1, the route (`components/RouteCardScreen.tsx`), and B1-saved: the map draws the route's real line with its start and numbered spots (the Linum loop follows OpenStreetMap tracks, `lib/route-lines.ts`, over `public/geo/linum.json`), and the page follows the redesign's order: spots along this route, the route drawn flat, what is recorded (to A8), when to walk it, what is happening (claim cards) and getting there. Save is pinned; once saved it becomes Walk it. Back returns to the list it came from, Saved included.
  - `map/route/[id]/spot/[n]` is L3, a spot (`components/SpotScreen.tsx`): the spot block, when, what is happening here and what else is recorded. The crane opens B4.
  - `walk/[id]` is L4, the walk (`components/WalkScreen.tsx`), outside the app group because it hides the tab bar. A map strip over a solid sheet that is the spot block; `?spot=` is the spot shown, so previous and next, the map's markers and the way back from the crane all land on the same spot. It opens on spot 2 with the position dot, as on the location-on board. End walk goes to Saved.
  - The spot data, the season counts, getting there and the claim cards are in `lib/spots.ts`; the spot block, claim card, action row and month grid are built once in `components/SpotParts.tsx` and styled in `app/flow-b.css`.
  - `map/organism/[id]` is B4, the organism detail, and B5 when its location is generalised (`components/OrganismPage.tsx`, `app/organism.css`), from `lib/organisms.ts`. B4 follows the redesign: the spot it was recorded at, why it is here, when to look, the spots it is recorded at, impact here (claim card and its spot's action row) and documentaries; back returns to the spot page or to the walk on its spot. A generalised species (B5) shows an area, never a point, and is reached only from search.
  - `learn/claim/[id]` is C1a, C1b and C6, a claim (`components/ClaimScreen.tsx`): its tags, the figure with who published it, the aerial comparison as labelled frames until the photographs exist, then what you can do, or what was done and how to keep it that way, and the route it is on. `learn/claim/[id]/source` is C2a to C2c (`components/SourceDialog.tsx`), a dialog over the claim; the publisher's page is not linked while the figures are sample content.
  - `learn/action/[id]` is C3 (the clean-up), C5 (supporting the group) and C7 (peat-free compost) in `components/ActionScreen.tsx`; `learn/action/clean-up/registered` is C4 (`components/RegisteredDialog.tsx`), with Add to calendar as a calendar file made on the device. Registering and saving are kept in `lib/saved.ts` as `action:<id>`, and Saved lists them.
  - Claims and actions are in `lib/claims.ts` and `lib/actions.ts`. The claim card (`components/ClaimCard.tsx`) opens the claim and its action line opens the action; `lib/back.ts` remembers where each was opened from, so back returns to the route, spot, walk, crane or Saved, and to the board's target (Learn, or the claim) when nothing is known. Opened from the walk, they keep the tab bar hidden. Flow C styles are in `app/flow-c.css`; the page shell is the organism page's.
  - `learn` is D0, the Learn tab (`components/LearnScreen.tsx`): chips that jump to Impact (the claim cards, grouped by protected site), What you can do (the action rows in their long form) and Documentaries (three, and Open the collection).
  - `learn/documentaries` is D2, the collection (`components/DocsScreen.tsx`), grouped by region, with chips for a subject or the routes you saved; the chip in use is in the address (`?f=`), so back from a documentary returns to the same list. `learn/documentaries/[id]` is D3 (`components/DocScreen.tsx`): what it covers, where to watch it, why it is here, its species and routes; watching is not linked, and Save to watch later keeps it in `lib/saved.ts` as `doc:<id>`, listed in Saved. A documentary that cannot be watched here opens as D4, with what on the same subject can be. The documentaries are in `lib/docs.ts`; the documentary item (`components/DocParts.tsx`) is a card on Learn and in the collection from 64rem, a row on the phone, D4 and Saved. The crane (B4) opens its documentary. Flow D styles are in `app/flow-d.css`.
  - `components/MapParts.tsx` holds what the map screens share: the search field, the organism pills and the desktop map tools. `app/flow-a.css` lays out the flow A screens on top of it. `app/map.css` lays them out, phone first, and from 64rem moves the bar and the sheet into one glass panel. `glass-phone` and `glass-desk` in `app/glass.css` make a surface glass at one size only.
  - `components/LocationDialog.tsx` stands in for the permission prompt: the system alert on the phone, the browser prompt on the desktop, in the `system-` colours. It is put on the body, because a screen is a fixed layer and so its own stacking context.
  - `lib/suggestions.ts` holds the four routes in season, as the redesign gives them, and the search over them; `lib/routes.ts` holds the routes and spots B1 draws. `lib/saved.ts` keeps what was saved on this device.
- `components/RegionMap.tsx` is the map itself: Leaflet over the vector geometry in `public/base-geo.js`, drawn to one canvas in the `basemap` tokens, with no tile server, so it holds the design system and works offline. The count pins are React siblings of the Leaflet container, placed from `latLngToContainerPoint` on every move, because a Leaflet pane always carries a transform and a transformed ancestor switches the frost off. The place names are plain text, so they stay ordinary markers. The view is centred in the part of the screen the sheet leaves free, above it on the phone and beside it on the desktop, so a pin is never under the glass.
- `app/tablet.css` is the tablet step, from 48rem wide and 36rem tall: the suggestions and search become a column down the left beside the map, and every other screen keeps the phone's shape with the board's 48 side padding, reading text capped at 40rem and buttons at 342, centred. The values are tokens in `docs/design.md`. A phone turned sideways keeps the phone layout.
- `components/Logo.tsx` is the natureplore mark, one inline SVG filled with `currentColor`; give it a height and the width follows.
- `components/` holds shared pieces, `TabBar` is the fixed bottom navigation.
- `--top-chrome` in `app/globals.css` is the room above the first element on a screen. A status
  bar only exists once the app is installed, so it is `1.75rem` plus the safe area rather than a
  fixed allowance: in any browser it is the same offset the desktop layout uses, and on an
  installed phone the notch adds itself. Every screen top uses it, the welcome page, the tabbed
  shell and the map credit.
- `app/tokens.css` is generated; `app/globals.css` is hand written.
