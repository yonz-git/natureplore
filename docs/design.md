---
version: alpha
name: Natureplore Prototype
description: Clear liquid glass over a living forest photograph, white type, one moss green for action, and generous spacing so every screen can breathe.
colors:
  ground: "#14261A"
  scrim: "#061209"
  glass-solid: "#23402A"
  primary: "#5A7C58"
  primary-mid: "#4E6E4D"
  primary-deep: "#425F42"
  on-primary: "#FFFFFF"
  on-ground: "#FFFFFF"
  on-ground-soft: "#D0D4D1"
  on-ground-mute: "#A9B0A9"
  accent-tint: "#B9D6B1"
  accent-tint-soft: "#DCEBD7"
  marker: "#2F4A30"
  map-road: "#FFFFFF"
  map-water: "#C8E8F0"
  basemap-land: "#1B2521"
  basemap-urban: "#222D28"
  basemap-wood: "#213027"
  basemap-water: "#15232A"
  basemap-motorway: "#5E4A52"
  basemap-trunk: "#5C5044"
  basemap-road: "#4F4C40"
  basemap-rail: "#48524D"
  basemap-border: "#4E4560"
  basemap-label: "#98A291"
  basemap-label-strong: "#E3E8DC"
  basemap-label-nature: "#9FB47E"
  basemap-label-water: "#7B9EA3"
  basemap-halo: "rgb(27 37 33 / 0.92)"
  keyboard: "#08120A"
  field-light: "#668A64"
  field: "#547654"
  field-deep: "#33502F"
  field-shade: "#2C442D"
  field-mid: "#3E5C3E"
  field-glow: "#80A57D"
  field-flow: "#5F8058"
  on-field: "#FAFBF5"
typography:
  display-desktop:
    fontFamily: Space Grotesk
    fontSize: 4.5rem   # the ceiling of the fluid display below
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: -0.025em
  display:
    fontFamily: Space Grotesk
    fontSize: "clamp(2.375rem, 1.06rem + 5.6vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: -0.02em
  h1-desktop:
    fontFamily: Space Grotesk
    fontSize: 2.75rem   # the ceiling of the fluid h1 below
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: -0.02em
  h1:
    fontFamily: Space Grotesk
    fontSize: "clamp(2.125rem, 1.7rem + 1.8vw, 2.75rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 1.875rem
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: -0.02em
  h3:
    fontFamily: Space Grotesk
    fontSize: 1.625rem
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: Space Grotesk
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.6
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.2
  label:
    fontFamily: Space Grotesk
    fontSize: 0.9375rem
    fontWeight: 500
    lineHeight: 1.3
  field:
    fontFamily: Space Grotesk
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.3
  chip:
    fontFamily: Space Grotesk
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1
  caption:
    fontFamily: Space Grotesk
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.4
  tab:
    fontFamily: Space Grotesk
    fontSize: 0.6875rem
    fontWeight: 500
    lineHeight: 1.3
  nav-desktop:
    fontFamily: Space Grotesk
    fontSize: 0.875rem
    fontWeight: 300
    lineHeight: 1
    letterSpacing: -0.02em
  micro:
    fontFamily: Space Grotesk
    fontSize: 0.625rem
    fontWeight: 400
    lineHeight: 1.2
rounded:
  xs: 0.125rem
  sm: 0.875rem
  md: 1.125rem
  lg: 1.5625rem
  xl: 2rem
  sheet: 2.25rem
  panel: 2.5rem
  hero: 3.5rem
  full: 9999px
spacing:
  "1": 0.25rem
  "2": 0.5rem
  "3": 0.75rem
  "4": 1rem
  "5": 1.25rem
  "6": 1.5rem
  "7": 1.75rem
  "8": 2rem
  "10": 2.5rem
  "12": 3rem
  "18": 4.5rem
  "24": 6rem
  inset-float: 1.25rem
  inset-screen: "clamp(1.25rem, 0.9rem + 1.6vw, 1.75rem)"
  inset-panel: "clamp(1.5rem, 1rem + 1.6vw, 2.25rem)"
  inset-desktop: "clamp(2.5rem, 1rem + 6.6vw, 6rem)"
  tabbar-clearance: 7.125rem
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 3.125rem
    padding: 0 1.5rem
  button-primary-pressed:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 3.125rem
    padding: 0 1.5rem
  button-outline:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 3.125rem
    padding: 0 1.5rem
  field-search:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    typography: "{typography.field}"
    rounded: "{rounded.lg}"
    height: 3.125rem
    padding: 0 1.375rem
  field-search-focused:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    typography: "{typography.field}"
    rounded: "{rounded.lg}"
    height: 3.125rem
    padding: 0 1.375rem
  chip:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    typography: "{typography.chip}"
    rounded: "{rounded.md}"
    height: 2.25rem
    padding: 0 1rem
  chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.chip}"
    rounded: "{rounded.md}"
    height: 2.25rem
    padding: 0 1rem
  control-round:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    rounded: "{rounded.full}"
    size: 3.125rem
  control-round-on:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: 3.125rem
  pin:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    typography: "{typography.chip}"
    rounded: "{rounded.full}"
    size: 2.75rem
  sheet:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    rounded: "{rounded.sheet}"
    padding: 0.75rem 1.75rem 7.125rem
  card:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    rounded: "{rounded.xl}"
    padding: 1.25rem 1.5rem 0.5rem
  dialog:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    rounded: "{rounded.xl}"
    width: 18.875rem
  tab-bar:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground-soft}"
    typography: "{typography.tab}"
    rounded: "{rounded.full}"
    height: 4.25rem
    padding: 0.3125rem
  tab-active:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    typography: "{typography.tab}"
  list-row:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.on-ground}"
    typography: "{typography.label}"
    height: 5.5rem
    padding: 1rem 0
---

# Natureplore Prototype Design System

## Overview

Natureplore shows people the wild places near them in Berlin and Brandenburg, what is recorded there, and what is happening to it. The prototype should feel like looking down into a forest through clean glass: calm, quiet and alive. Every screen sits on one top-down forest photograph, the interface floats over it as clear liquid glass, type is white and light in weight, and a single moss green marks the one thing to do next.

The system started from the Oevra style tokens (one chromatic colour, light display weights, Space Grotesk for text, hairlines instead of shadows, no sharp corners) and keeps those habits. What changed is the material. Flat white paper became frosted glass over a photograph, black hairlines became bright rims of light, and spacing grew until each group of content has room around it.

It must never become a dense dashboard, a stack of grey cards, or a neon dark theme. When in doubt, remove an element and give the rest more room.

## Colors

There is one hue. `primary` (#5A7C58) with `primary-mid` and `primary-deep` forms the diagonal gradient on filled actions, and white text on it clears 4.5:1. `accent-tint` and `accent-tint-soft` are pale greens used only for the gradient on emphasised words in headings, fading from white. `marker` is the deep green core of the "You are here" dot.

Everything else is white at different strengths on top of the photograph. `on-ground` is pure white for headings, labels and icons. `on-ground-soft` is white at 80% (shown here as its solid equivalent) for body copy and captions. `on-ground-mute` is white at 60% to 72% for inactive tabs and unmapped search results. Do not go below 60% for any text.

The photograph is always filtered before anything sits on it: a vertical `scrim` gradient (55% at the top, 20% in the upper middle, 60% at the bottom) plus an even black layer at 39%. That filter is what keeps white text at or above 4.5:1 over the brightest tree crowns, so it is part of the colour system, not decoration. `ground` is the solid colour behind the photo while it loads. `glass-solid` replaces every glass fill when the viewer asks for reduced transparency. `map-road` is drawn at 60% and `map-water` at 40% over the photo, like a satellite layer, which is the hand-drawn sketch on the welcome screens and nothing else. The real map on the Map tab is its own surface rather than a layer over the photograph, so it has its own set: `basemap-land` behind everything, `basemap-wood`, `basemap-urban` and `basemap-water` for the areas, `basemap-motorway`, `basemap-trunk`, `basemap-road` and `basemap-rail` for the lines, `basemap-border` for the dashed state edge, and four label inks, `basemap-label` for towns, `basemap-label-strong` for cities, `basemap-label-nature` for reserves and landscapes and `basemap-label-water` for lakes and rivers, each carried by a `basemap-halo` glow so a name stays readable wherever it falls. Every one of those inks clears 4.5:1 on the surface it sits on. The set is deliberately dim: the map is the quietest thing on the screen, so the glass sheet and the count pins read as the foreground. The animated welcome page (A0) is the one screen without the photograph. It opens straight on a green field, and the words blur in one by one: a diagonal gradient from `field-light` through `field` to `field-deep`, with slow drifting patches of `field-shade`, `field-mid`, `field-glow` and soft white, and grain. The pointer stirs a liquid layer over it, slow broad flows of `field-flow`, a dark green that is screened over the field, so all it can do is lift the field a little, to a step above `field-glow` where the flow is fastest: the same green tone, just a bit brighter, never white, grey, neon or darker than the field. Text and rules on the field are `on-field`, a green-tinted off-white, and the one button is a white pill (`on-primary` to `accent-tint-soft`) with `marker` ink.

There are no state colours (error, success, warning) yet. Add them when the first screen needs one, and keep them desaturated.

## Typography

Space Grotesk carries everything, in three weights. Headings are weight 300 with slightly tight tracking, large and quiet. Body is 400 at a relaxed 1.6 line height. Labels, buttons, row titles and the active tab are 500. The one exception is the desktop nav, whose three labels are set in the heading weight so the top of the screen reads in one voice. Nothing is bolder than 500 and nothing is set in capitals.

The scale is short on purpose. `display` opens the welcome screen, `h1` is the start sheet heading, `h2` is for state sheets such as "not mapped yet" and "no connection", `h3` is for list sheets and messages over the map. `body` is the default paragraph, `caption` is for helper lines and row details, `chip` for chips and pins, `tab` for the tab bar, `micro` only for placeholder tags. Desktop adds `display-desktop`, `h1-desktop`, `body-lg` and `nav-desktop`, which is the heading treatment at 14, weight 300 with the heading tracking.

One phrase per heading may carry the white to pale green gradient ("around you", "near you", "isn't mapped yet"). It marks the meaning of the screen, so use it once per screen and never on body text. The system location dialog is the one exception to the typeface: it uses the platform font, because it belongs to the operating system.

## Layout

Spacing is the main design tool. The rule is simple: when two spacings would both work, take the larger one, and when content does not fit, remove content before tightening space.

The scale runs 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 72, 96. Use it by distance in meaning:

- 4 to 8 inside one item: icon to label, lines of a row, tab icon to tab label.
- 12 to 16 between controls that act together: field to button, button to button, chips in a row, photo to row text.
- 22 to 32 between groups: heading block to chips, chips to list, copy to actions, actions to helper line.
- 40 to 48 between sections on a page, and 60 to 72 above a welcome heading.

Phone screens are 390 wide. Content inside sheets and pages uses `inset-screen` (28). Floating clusters over the map (search, chips, controls) use `inset-float` (20). A bottom sheet has 12 above its handle, 26 to 28 below it, and `tabbar-clearance` (114) at the bottom so content never hides behind the floating tab bar, which sits 16 from the sides and 24 from the bottom edge.

Rows are 88 tall with 16 above and below and 16 between photo and text. A map sheet shows two rows, or three when there are no chips above them. The rest scrolls. Never shrink rows to fit one more. Rows of 76 with 10 padding are allowed only on sheets whose rows carry four lines of text.

The map must stay a map. Keep at least the band between the top cluster and the sheet free for pins, never let the sheet cover a pin, and keep 8 or more between the lowest pin and the sheet edge. Floating controls never sit among the pins: Saved lives beside the search field, the locate button sits alone at the right edge.

Touch targets are 44 at minimum and 50 for the controls people use most (search, primary buttons, Saved, back). Desktop is 1440 by 900 with `inset-desktop` (96) page margins, a 440 wide glass side panel set 24 from the edges with `inset-panel` (36) padding, and the nav pill 28 from the top and 40 from the right.

## Elevation & Depth

Depth comes from glass, not from stacked drop shadows. Every frosted surface is built from the same four parts, and only the size of the lighting changes with the size of the surface.

1. Frost: `backdrop-filter: blur(26px) saturate(1.8)` on controls, the nav and the tab bar; 18px on pins, discs and chips; 30px on cards, panels, dialogs and sheets. Always pair it with the `-webkit-` prefix.
2. Fill: `linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.07))` over `rgba(10,28,14,0.3)`, on every frosted surface, pins included.
3. Rim: one hairline border, `0.2px solid rgba(255,255,255,0.55)`, all the way round. Sheets carry it on the top edge only. There is no gradient ring: the hairline is the whole edge, and thick or blurred inner shadows would read as a plastic bevel.
4. Inner shading and separation: a soft light inside the top left and a soft shade inside the bottom right, sized with the surface, plus a thin contact shadow and one float shadow.

| Surface | Blur | Inner shading | Shadow |
| --- | --- | --- | --- |
| Pins, discs, chips | 18px | `inset 2px 2px 6px -3px rgba(255,255,255,0.35)`, `inset -2px -2px 6px -3px rgba(0,0,0,0.22)` | `0 1px 2px rgba(0,0,0,0.3)`, `0 8px 22px rgba(0,0,0,0.24)` |
| Controls, search field, nav and tab bars | 26px | 4px and 10px at the same colours | `0 1px 2px rgba(0,0,0,0.3)`, `0 14px 34px rgba(0,0,0,0.32)` |
| Cards, panels, dialogs, the desktop map card | 30px | 6px and 16px | `0 1px 2px rgba(0,0,0,0.3)`, `0 24px 60px rgba(0,0,0,0.32)` |
| Sheets and edge-bleeding surfaces | 30px | `inset 0 10px 20px -12px rgba(255,255,255,0.35)` on the top edge | `0 -1px 2px rgba(0,0,0,0.3)`, `0 -10px 40px rgba(0,0,0,0.26)` |

Glass that sits on glass (fields, outline buttons, season chips inside a sheet) gets the rim and inner shading but no second blur. Do not stack `backdrop-filter` surfaces. A modal dims and blurs the whole screen first (`scrim` at 30% to 58% with a 10px blur), then the dialog takes the same glass fill as the sheet it interrupts. With reduced transparency every glass fill becomes `glass-solid` and the blur is removed.

## Shapes

Nothing has a sharp corner. Radius grows with the size of the surface: `md` (18) for chips and photo tiles, `lg` (25) for every 50 tall control so buttons and fields are full pills, `xl` (32) for cards and dialogs, `sheet` (36) for the top corners of bottom sheets, `panel` (40) for the desktop side panel, `hero` (56) for the large map card on the desktop welcome page. Pins, icon discs, round controls and the tab bar are fully round. `sm` (14) is only for the small map label and `xs` (2) only for the sheet handle. Round shapes and wide radii are what make the glass read as poured rather than cut.

## Components

`button-primary` is the only filled element on a screen: the diagonal gradient from `primary` through `primary-mid` to `primary-deep`, white `label-lg`, a 1px inner top highlight and a soft float shadow, no glass rim. One per view. Pressed state scales to 0.97 over 160ms and settles on `primary-deep`. `button-outline` is glass on glass: transparent fill, rim, white label. Text links are white `label` with an underline offset by 3px.

`field-search` is a 50 tall glass pill with a 20px icon, 12 gap and 22 side padding. `field-search-focused` raises the border to white 90% and shows a clear button with a 44 target. `chip` is a 36 tall glass pill; `chip-selected` takes the primary gradient, and only one chip in a group is selected. Chip rows scroll sideways and bleed off the right edge rather than wrapping on phone.

`pin` is a 44 round glass disc with a count in `chip` type, or 40 with a leaf icon for a single place. "You are here" is a `marker` dot with a 4px white border and a soft white halo, labelled by a small glass tag. `control-round` is a 50 round glass button (back, Saved, locate at 44); `control-round-on` is the same control filled with the primary gradient and a filled icon.

`sheet` rises from the bottom edge with a 40 by 4 handle, then heading, caption, optional chips, a list and one text action. `list-row` has a 56 photo tile with radius `md`, a `label` title on one line, up to two `caption` lines, and a 44 bookmark target; rows are divided by 1px lines at white 22%, and the last row in a card has no line. `card` groups search results under a `caption` heading with 44 round icon discs. `dialog` is 302 wide on phone and 380 on desktop, centred, with the sheet's glass fill; the system dialog keeps platform type and stacked full-width choices.

`tab-bar` is a floating glass pill with three equal tabs. `tab-active` is pure white in weight 500 with no capsule behind it; the other tabs are white at 72% in weight 400. On desktop the same pill sits at the top right with icon and label side by side, and its three labels take `nav-desktop` rather than `tab`. Because both states share that weight, the current tab there is marked by colour alone, white against white at 72%, carried by `aria-current` for anyone not reading the colour.

## Do's and Don'ts

Do:

- Give every group room. Reach for 28 and 32 before 12 and 16, and drop a row before shrinking one.
- Keep one filled green action per screen and let everything else be glass or text.
- Keep the photo filter on (scrim plus 39% black) and check white text against the brightest part of the photo.
- Build every glass surface from the same four parts: frost, fill, a 0.2px rim, inner shading with its separation shadow.
- Use the gradient on one phrase of one heading per screen.
- Keep targets at 44 or more, and 50 for the main controls.

Don't:

- Don't let a sheet, chip row or control cover the map pins, and don't float controls among them.
- Don't draw rims with thick, blurred or offset inner shadows, don't add a second ring on top of the hairline, and don't stack one blurred surface on another.
- Don't add a second hue, a neon accent, pure black panels or grey card stacks.
- Don't set text heavier than 500, in capitals, or below white 60%.
- Don't use sharp corners or a radius smaller than 14 on anything a finger touches.
- Don't join details with middle dots. Use commas.
