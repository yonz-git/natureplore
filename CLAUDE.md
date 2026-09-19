# Natureplore prototype

Read `README.md` first, it says where tokens, map data, screens and flows come
from. The rules that are easy to get wrong:

- **Tokens are generated.** Change `../docs/design.md`, then `npm run tokens`.
  Never hand-edit `app/tokens.css`, and never paste hex values into components:
  use the Tailwind utilities the tokens create (`bg-ground`, `text-on-ground-soft`,
  `rounded-sheet`, `p-inset-screen`, `text-body`).
- **v1 scope only.** No booking, walks, guides or payments. No sighting
  reporting, that moved to v2. Tabs are Map, Learn, Notebook.
- **No sign-in.** Treat the person as signed in wherever v1 would ask.
- **Screens follow the wireframe canvas**, codes and all: A for the map and
  search, B for places and species, C for impact and actions, D for Learn and
  documentaries, E for the Notebook, F for sign-in. Keep the code in the page so
  a screen can be traced back to its board.
- **Flow content is generated too.** Edit `../design flow/flows-src/`, then
  `node build.mjs` there. Never edit the generated `.md` or `.html`.
- Writing style for anything a person reads: plain sentences, no em dashes,
  commas or colons instead.

## Design rules that carry across every screen

Run the `/impeccable` skill for design work, and keep these whatever the task is.

- **Glass.** Every frosted surface is `.glass` plus one tier (`glass-pin`,
  `glass-pill`, `glass-nav`, `glass-card`, `glass-top` for sheets). The recipe
  lives in `app/glass.css` and mirrors `../docs/design.md`: one fill, one
  hairline rim of `0.2px` white 55%, a specular pair inside the corners, blur 18
  on pins and chips, 26 on controls and bars, 30 on cards, panels and sheets.
- **Never hand-write `-webkit-backdrop-filter`.** The build adds prefixes. Written
  next to the standard property it makes the build keep only the prefixed one,
  which Chrome ignores, and every frosted surface silently goes flat.
- **Never animate opacity on an ancestor of glass.** An ancestor below opacity 1
  becomes a backdrop root and switches the frost off for the length of the
  animation. Animate each layer instead, as `app/transitions.css` does.
- **Every screen change animates.** Layered enter, strong ease-out
  (`--ease-out`), under 300ms for a control and under 400ms for a screen,
  `transform` and `opacity` only, and a shorter fade under
  `prefers-reduced-motion`.
- **Every screen has both sizes.** Phone first, then the desktop layout from
  1024px that follows the matching desktop board.
- **Accessibility ships with the screen.** Real `button`, `a href`, `input` with
  a label, 44px targets, 4.5:1 on body text, visible focus, and the
  `prefers-reduced-transparency` fallback that turns glass solid.
