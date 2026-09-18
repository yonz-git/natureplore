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
| Design tokens | `../docs/design.md` frontmatter, generated into `app/tokens.css` by `scripts/tokens.mjs`. Edit the design system, never `tokens.css`. |
| Base map data | `public/base-geo.js`, copied from `../design flow/base-geo.js`. Regenerate it from `../design flow/base-geo-src/`. Vector data from OpenStreetMap, no tile server. |
| Background photograph | `public/img/forest-olena-bohovyk.jpg`, from `../docs/assets/`. |
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

- `app/page.tsx` is A0 · Welcome, the animated opening page (`components/Welcome.tsx`, keyframes in `app/welcome.css`). One markup, phone layout first and the staggered desktop layout from 1024px. "See the map" goes on to `/map`, and the wordmark replays the intro.
- `app/welcome/page.tsx` is A0-2 · Welcome, the still welcome over the forest photograph (`components/WelcomeStill.tsx`, styles in `app/welcome2.css`): statements, one green action and a glass card with the map sketch, split layout with the glass nav pill from 1024px.
- `app/glass.css` is the liquid glass recipe from the design system as classes: `glass` plus a tier (`glass-pill`, `glass-nav`, `glass-card`), `glass-top` for surfaces lit from the top only, `glass-clip` for clipped ones. `components/MapSketch.tsx` is the hand-drawn Berlin sketch both welcome screens use.
- `app/(app)/` is the tabbed shell: `map`, `learn`, `notebook`, each a stub screen for now.
- `components/` holds shared pieces, `TabBar` is the fixed bottom navigation.
- `app/tokens.css` is generated; `app/globals.css` is hand written.
