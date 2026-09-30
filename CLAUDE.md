# Natureplore prototype

Read `README.md` first, it says where tokens, map data, screens and flows come
from. The rules that are easy to get wrong:

- **Tokens are generated.** Change `docs/design.md`, then `npm run tokens`.
  Never hand-edit `app/tokens.css`, and never paste hex values into components:
  use the Tailwind utilities the tokens create (`bg-ground`, `text-on-ground-soft`,
  `rounded-sheet`, `p-inset-screen`, `text-body`).
- **v1 scope only.** No booking, guided walks, guides or payments. No sighting
  reporting, that moved to v2. Tabs are Routes, Learn, Saved (A5, D0, E1). Learn
  holds the claims and actions (Flow C) and the documentaries (Flow D).
- **No accounts.** Nothing asks for sign-in or an email; saving keeps a route
  on the device. The flow and IA redesign (`../.forge/briefs/flow-ia-redesign-final.md`)
  is the source for which screens exist and what they say.
- **Screens follow the wireframe canvas**, codes and all: A for the map and
  search, B for routes and organisms, L for spots and the walk, C for impact and
  actions, D for Learn and documentaries, E for Saved. Keep the code in the page
  so a screen can be traced back to its board.
- **Flow content is generated too.** Edit `../design flow/flows-src/`, then
  `node build.mjs` there. Never edit the generated `.md` or `.html`.
- Writing style for anything a person reads: plain sentences, no em dashes,
  commas or colons instead.

## Design rules that carry across every screen

Run the `/impeccable` skill for design work, and keep these whatever the task is.

- **Glass.** Every frosted surface is `.glass` plus one tier (`glass-pin`,
  `glass-pill`, `glass-nav`, `glass-card`, `glass-top` for sheets). The recipe
  lives in `app/glass.css` and mirrors `docs/design.md`: blur 30, a white wash
  over `glass-fill`, a 0.5px edge, a 1px inner top highlight, a scrim shadow and
  a faint 0.5px rim of light on `::after`. Glass inside glass becomes inner
  glass automatically (no second blur); `glass-inner` does the same by hand.
- **Never hand-write `-webkit-backdrop-filter`.** The build adds prefixes. Written
  next to the standard property it makes the build keep only the prefixed one,
  which Chrome ignores, and every frosted surface silently goes flat.
- **Never animate opacity or transform on an ancestor of glass.** Either one makes
  the ancestor a backdrop root and switches the frost off on everything inside it.
  Transform is the worse half: `transform: none` in a keyframe computes to the
  identity matrix, which still counts as a transform, and `animation-fill-mode:
  both` keeps the last keyframe applied forever, so a *finished* animation leaves
  the glass flat permanently, not just while it runs. This is what broke the map
  panel: `.screen-enter > section` was animating `.a1`, the wrapper around the
  sheet and pins. Animate each layer instead, as `app/transitions.css` does. An
  element's own transform is fine, only an ancestor's breaks it.
- **If a CSS change seems ignored, the build cache is stale.** Restarting the dev
  server is not always enough: Turbopack has served an old stylesheet from
  `.next` across a restart. Delete `.next` and start again before debugging the
  CSS, and check the served bytes, not just the file on disk.
- **Every screen change animates.** Layered enter, strong ease-out
  (`--ease-out`), under 300ms for a control and under 400ms for a screen,
  `transform` and `opacity` only, and a shorter fade under
  `prefers-reduced-motion`.
- **CSS for micro motion, GSAP for choreography.** Hovers, active and focus
  states, dropdowns, sheet and modal entries: CSS transitions and animations, or
  a React motion helper. Hero sequences, page transitions, SVG path animation,
  canvas or map state morphing and anything driven by the scroll: GSAP. The
  welcome is the pattern for the second kind (`lib/intro-timeline.ts`,
  `components/WelcomeLogo.tsx`, `components/WelcomeScroll.tsx`): build a
  timeline, hold it, drive it.
- **In React, GSAP goes in `useGSAP`.** From `@gsap/react`, with `scope` set to
  the component's own ref where there is one, so every tween, timeline and
  `gsap.set` is reverted when the component unmounts or the effect re-runs.
  Listeners, rAF loops and classes you add by hand still need the cleanup
  function you return from it.
- GSAP takes an element's `translate`, `rotate` and `scale` properties into its
  own transform the first time it sets one, and never reads them again. A value
  that changes, a custom property among them, has to be passed to GSAP each
  time, not left in the stylesheet: this is what made the welcome's photograph
  slide as the circle grew. The backdrop root trap above holds for GSAP too, a
  transform it writes on an ancestor of glass kills the frost the same way.
- **rem, never px.** Every size, space, radius and type step is in rem, so the
  screens follow the reader's own font size. The only px left are hairlines,
  `0.5px` edges and rims and `1px` rules, which have to stay one line whatever the zoom.
  Values live in `docs/design.md` and are generated, so change them there
  and run `npm run tokens`.
- **One value per size, fluid only in between.** Type and spacing tokens hold
  one value per size class, as on the boards, and switch with responsive
  variants. Page insets are the fluid part (`inset-screen` runs 16 to 32), with
  proportions and `min()` on widths, and a breakpoint only where the layout
  truly changes shape, at 64rem.
- **Every screen has both sizes.** Phone first, then the desktop layout from
  1024px that follows the matching desktop board.
- **A change to one element is a change to all of them.** The same control,
  label or tile appears on several screens and at both sizes. Change every
  instance in the same pass, and say which ones were touched.
- **Accessibility ships with the screen.** Real `button`, `a href`, `input` with
  a label, 44px targets, 4.5:1 on body text, visible focus, and the
  `prefers-reduced-transparency` fallback that turns glass solid.
