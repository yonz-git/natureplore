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
