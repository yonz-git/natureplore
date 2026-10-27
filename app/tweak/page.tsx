"use client";

// A dev tool, not a screen: /map in a phone or desktop frame beside sliders that write CSS into the frame live,
// so spacing and sizes can be tried before they go into the stylesheets. Copy CSS gives the rules
// that differ from the starting values, ready to paste into app/flow-a.css, map.css or tabbar.css.

import { useEffect, useRef, useState } from "react";

type Control = {
  id: string;
  label: string;
  group: string;
  css: (v: string) => string;
  /** "range" values carry a unit; "color" and "text" are written as they are */
  kind: "range" | "color" | "text" | "select";
  /** the choices of a "select" */
  options?: string[];
  /** which layout the rule belongs to: written inside that size's media query */
  size: Size;
  value: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

type Size = "phone" | "desktop" | "all";
const MEDIA: Record<Size, string> = {
  phone: "@media (max-width: 35.74rem)",
  desktop: "@media (min-width: 64rem)",
  all: "",
};

let size: Size = "phone";
const r = (
  id: string, group: string, label: string, value: number, min: number, max: number, step: number,
  unit: string, css: (v: string) => string,
): Control => ({ id, group, label, kind: "range", value: String(value), min, max, step, unit, css, size });
const at = (s: Size, list: () => Control[]) => {
  size = s;
  const out = list();
  size = "phone";
  return out;
};

const PHONE: Control[] = at("phone", () => [
  r("barTop", "Top bar", "Distance from top", 0.4, 0, 2, 0.05, "rem", (v) => `.ms-bar { top: calc(${v} + env(safe-area-inset-top, 0px)) !important; }`),
  r("handleW", "Sheet handle", "Width", 2.25, 1, 4, 0.125, "rem", (v) => `.ms-handle { width: ${v} !important; }`),
  r("handleH", "Sheet handle", "Thickness", 0.25, 0.125, 0.5, 0.0125, "rem", (v) => `.ms-handle { height: ${v} !important; }`),
  r("handleY", "Sheet handle", "Nudge up", 2, -6, 10, 0.5, "px", (v) => `.ms-grab .ms-handle { margin-top: -${v} !important; }`),
  r("scope", "Header", "Place line size", 1.125, 0.875, 1.5, 0.025, "rem", (v) => `.sg-scope { font-size: ${v} !important; line-height: 1.4 !important; }`),
  r("title", "Header", "Title size", 1.5, 1, 2.25, 0.025, "rem", (v) => `.sg .ms-title { font-size: ${v} !important; line-height: 1.25 !important; }`),
  r("titleT", "Header", "Title space above", 0, -1, 2, 0.0625, "rem", (v) => `.sg .ms-title { margin-top: ${v} !important; }`),
  r("titleB", "Header", "Title space below", 0, -1, 2, 0.0625, "rem", (v) => `.sg .ms-title { margin-bottom: ${v} !important; }`),
  r("aspect", "Card photo", "Height (% of width)", 80, 50, 130, 1, "", (v) => `.sug-track { aspect-ratio: 100 / ${v} !important; }`),
  r("scrim", "Card photo", "Scrim strength", 0.78, 0, 1, 0.01, "", (v) => `.sug-media::after { background: linear-gradient(to top, rgb(6 18 9 / ${v}) 0%, rgb(6 18 9 / calc(${v} * 0.58)) 50%, transparent 100%) !important; }`),
  r("name", "Card photo", "Route name size", 1.5, 1, 2.25, 0.025, "rem", (v) => `.sug-name { font-size: ${v} !important; }`),
  r("meta", "Card photo", "Distance and time size", 1.125, 0.75, 1.5, 0.025, "rem", (v) => `.sug-meta { font-size: ${v} !important; }`),
  r("textX", "Card photo", "Text from left", 1, 0.25, 2.5, 0.0625, "rem", (v) => `.sug-head { padding-left: ${v} !important; }`),
  r("textY", "Card photo", "Text from bottom", 1, 0.25, 2.5, 0.0625, "rem", (v) => `.sug-head { padding-bottom: ${v} !important; }`),
  r("save", "Save", "Circle size", 2.8125, 2, 3.5, 0.0625, "rem", (v) => `.sug-save { width: ${v} !important; height: ${v} !important; }`),
  r("saveIcon", "Save", "Icon size", 1.25, 0.75, 1.75, 0.0625, "rem", (v) => `.sug-save svg { width: ${v} !important; height: ${v} !important; }`),
  r("saveTop", "Save", "From top", 1.5, 0, 3, 0.0625, "rem", (v) => `.sug-save { top: ${v} !important; }`),
  r("saveRight", "Save", "From right", 1.5, 0, 3, 0.0625, "rem", (v) => `.sug-save { right: ${v} !important; }`),
  r("dotsR", "Photo dots", "From right", 0.75, 0, 2, 0.0625, "rem", (v) => `.sug-dots { right: ${v} !important; }`),
  r("dotsB", "Photo dots", "From bottom", 0.375, 0, 2, 0.0625, "rem", (v) => `.sug-dots { bottom: ${v} !important; }`),
  r("dot", "Photo dots", "Dot size", 0.375, 0.25, 0.75, 0.0125, "rem", (v) => `.sug-dot::before { width: ${v} !important; height: ${v} !important; }`),
  r("dotGap", "Photo dots", "Dot spacing", 0.75, 0.5, 1.5, 0.0625, "rem", (v) => `.sug-dot { width: ${v} !important; }`),
  r("pillH", "Pills", "Height", 2, 1.5, 2.75, 0.0625, "rem", (v) => `.pill-org, .sug-spots { height: ${v} !important; }`),
  r("tabY", "Nav bar", "From bottom", 0.25, -0.5, 1.5, 0.03125, "rem", (v) => `.tabbar { bottom: calc(${v} + env(safe-area-inset-bottom, 0px)) !important; }`),
]);

const DESKTOP: Control[] = at("desktop", () => [
  r("dBarTop", "Search and switch", "Panel from top", 4.5625, 0, 5, 0.0625, "rem", (v) => `.sg .ms-panel { top: ${v} !important; }`),
  r("dBarPad", "Search and switch", "Space above them, inside the panel", 1.0625, 0, 3, 0.0625, "rem", (v) => `.sg .ms-panel { padding-top: ${v} !important; }`),
  r("dPanelW", "Panel", "Width", 27.75, 22, 36, 0.25, "rem", (v) => `:root { --panel-w: ${v} !important; }`),
  r("dPanelX", "Panel", "From left", 1.5, 0.5, 5, 0.125, "rem", (v) => `.ms-panel { left: ${v} !important; }`),
  r("dPanelP", "Panel", "Inner padding", 0.95, 0.75, 2.5, 0.05, "rem", (v) => `.ms-panel { padding: ${v} !important; }`),
  r("dScope", "Header", "Place line size", 1.2, 0.875, 1.5, 0.025, "rem", (v) => `.sg-scope { font-size: ${v} !important; line-height: 1.4 !important; }`),
  r("dTitle", "Header", "Title size", 1.65, 1, 2.5, 0.025, "rem", (v) => `.sg .ms-title { font-size: ${v} !important; line-height: 1.25 !important; }`),
  r("dTitleT", "Header", "Title space above", 1.625, -1, 2, 0.0625, "rem", (v) => `.sg .ms-title { margin-top: ${v} !important; }`),
  r("dTitleB", "Header", "Title space below", -1, -1, 2, 0.0625, "rem", (v) => `.sg .ms-title { margin-bottom: ${v} !important; }`),
  r("dLead", "Header", "Organisms count line below title", 1.3375, 0, 3, 0.0625, "rem", (v) => `.sg .ms-title + .ms-lead { margin-top: ${v} !important; }`),
  r("dGap", "Header", "Gap between rows", 1.9, 0.5, 2.5, 0.05, "rem", (v) => `.sg .ms-sheet { --sg-gap: ${v} !important; }`),
  r("dPhoto", "Route card", "Photo size", 9.125, 5, 11, 0.125, "rem", (v) => `.sug { grid-template-columns: ${v} minmax(0, 1fr) !important; }`),
  r("dPad", "Route card", "Card padding", 0.5, 0.5, 1.75, 0.0625, "rem", (v) => `.sug { padding: ${v} !important; }`),
  r("dColGap", "Route card", "Photo to text", 0.9375, 0.5, 2, 0.0625, "rem", (v) => `.sug { column-gap: ${v} !important; }`),
  { id: "dTextAlign", group: "Route card", label: "Text against photo", kind: "select", size: "desktop", value: "center", options: ["start", "center", "end"], css: (v) => `.sug-head { align-self: ${v} !important; }` },
  r("dTextNudge", "Route card", "Text nudge down", 0, -2, 2, 0.0625, "rem", (v) => `.sug-head { position: relative; top: ${v} !important; }`),
  r("dTextGap", "Route card", "Name to distance gap", 0.3375, 0, 1.5, 0.0625, "rem", (v) => `.sug-head { gap: ${v} !important; }`),
  r("dName", "Route card", "Route name size", 1.375, 1, 2, 0.025, "rem", (v) => `.sug-name { font-size: ${v} !important; line-height: 1.3 !important; }`),
  r("dMeta", "Route card", "Distance and time size", 1.15, 0.75, 1.5, 0.025, "rem", (v) => `.sug-meta { font-size: ${v} !important; }`),
  r("dCardGap", "Route card", "Space between cards", 0.5, 0.25, 2.5, 0.0625, "rem", (v) => `.sg-list { gap: ${v} !important; }`),
  r("dSave", "Save", "Circle size", 2.0625, 1.75, 3.25, 0.0625, "rem", (v) => `.sug-save { width: ${v} !important; height: ${v} !important; }`),
  r("dSaveIcon", "Save", "Icon size", 1.25, 0.75, 1.5, 0.0625, "rem", (v) => `.sug-save svg { width: ${v} !important; height: ${v} !important; }`),
  r("dSaveTop", "Save", "From top", 0.4375, 0, 2.5, 0.0625, "rem", (v) => `.sug-save { top: ${v} !important; }`),
  r("dSaveRight", "Save", "From right", 0.5, 0, 2.5, 0.0625, "rem", (v) => `.sug-save { right: ${v} !important; }`),
  r("dPillH", "Pills", "Height", 2, 1.5, 2.75, 0.0625, "rem", (v) => `.pill-org, .sug-spots { height: ${v} !important; }`),
  r("dTabTop", "Nav", "From top", 0.4, 0.25, 2.5, 0.05, "rem", (v) => `.tabbar { top: ${v} !important; }`),
]);

const SHARED: Control[] = [
  { id: "pillEdge", group: "Pills", label: "Border colour", kind: "text", size: "all", value: "rgb(222 224 222 / 0.39)", css: (v) => `.pill-org, .sug-spots { border-color: ${v} !important; }` },
];

const CONTROLS = [...PHONE, ...DESKTOP, ...SHARED];

const FRAMES = [
  { label: "320", w: 320, h: 812, size: "phone" as const },
  { label: "375", w: 375, h: 812, size: "phone" as const },
  { label: "390", w: 390, h: 844, size: "phone" as const },
  { label: "430", w: 430, h: 932, size: "phone" as const },
  { label: "1280", w: 1280, h: 800, size: "desktop" as const },
  { label: "1440", w: 1440, h: 900, size: "desktop" as const },
];
const STORE = "np-tweak";

export default function Tweak() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [vals, setVals] = useState<Record<string, string>>(() => Object.fromEntries(CONTROLS.map((c) => [c.id, c.value])));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fi, setFi] = useState(1);
  const f = FRAMES[fi];
  // a desktop frame is drawn at its real size and scaled down to the room beside the controls
  const [room, setRoom] = useState(900);
  useEffect(() => {
    const fit = () => setRoom(Math.max(320, window.innerWidth - 34 * 16));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  const scale = Math.min(1, room / f.w);
  const [copied, setCopied] = useState(false);

  // remember the last session's values on this device
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) ?? "null");
      if (saved) {
        // only what was moved comes back, so new starting values show for the rest
        const kept = Object.fromEntries(Object.entries((saved.vals ?? {}) as Record<string, string>).filter(([id]) => saved.touched?.[id]));
        // localStorage is only readable in the browser, so the saved values cannot be the initial state
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVals((v) => ({ ...v, ...kept }));
        setTouched(saved.touched ?? {});
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ vals, touched }));
    } catch {}
  }, [vals, touched]);

  const value = (c: Control) => (c.kind === "range" ? `${vals[c.id]}${c.unit}` : vals[c.id]);
  // each size's touched rules inside its own media query, so a phone value never reaches the desktop
  const css = () =>
    (["all", "phone", "desktop"] as Size[])
      .map((sz) => {
        const rules = CONTROLS.filter((c) => c.size === sz && touched[c.id]).map((c) => c.css(value(c)));
        if (!rules.length) return "";
        return sz === "all" ? rules.join("\n") : `${MEDIA[sz]} {\n  ${rules.join("\n  ")}\n}`;
      })
      .filter(Boolean)
      .join("\n");

  // write the touched rules into the frame on every change, and again whenever it navigates
  const inject = () => {
    const doc = frame.current?.contentDocument;
    if (!doc?.head) return;
    let tag = doc.getElementById("np-tweak") as HTMLStyleElement | null;
    if (!tag) {
      tag = doc.createElement("style");
      tag.id = "np-tweak";
      doc.head.appendChild(tag);
    }
    tag.textContent = css();
  };
  useEffect(inject);

  const set = (id: string, v: string) => {
    setVals((all) => ({ ...all, [id]: v }));
    setTouched((t) => ({ ...t, [id]: true }));
  };
  const reset = () => {
    setVals(Object.fromEntries(CONTROLS.map((c) => [c.id, c.value])));
    setTouched({});
  };
  const copy = async () => {
    await navigator.clipboard.writeText(css().replaceAll(" !important", "") || "/* nothing changed */");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  // only the controls for the size on show, and the ones shared by every size
  const shown = CONTROLS.filter((c) => c.size === f.size || c.size === "all");
  const groups = [...new Set(shown.map((c) => c.group))];

  return (
    <main style={{ display: "flex", gap: "2rem", padding: "1.5rem", minHeight: "100dvh", background: "#101512", color: "#e8eae0", fontSize: "0.875rem", boxSizing: "border-box", alignItems: "flex-start" }}>
      <div style={{ flex: "none", position: "sticky", top: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          {FRAMES.map((fr, i) => (
            <button key={fr.label} type="button" onClick={() => setFi(i)} style={btn(i === fi)}>
              {fr.label}
            </button>
          ))}
          <button type="button" onClick={() => frame.current?.contentWindow?.location.reload()} style={btn(false)}>
            Reload
          </button>
        </div>
        <div style={{ width: f.w * scale, height: f.h * scale, overflow: "hidden", borderRadius: f.size === "phone" ? "2rem" : "0.75rem", border: "1px solid #2a332d" }}>
          <iframe
            ref={frame}
            src="/map"
            title="Map screen"
            onLoad={inject}
            style={{ width: f.w, height: f.h, border: 0, background: "#000", display: "block", transform: `scale(${scale})`, transformOrigin: "0 0" }}
          />
        </div>
      </div>

      <div style={{ flex: "1 1 auto", maxWidth: "30rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", position: "sticky", top: 0, background: "#101512", padding: "0.5rem 0", zIndex: 1 }}>
          <button type="button" onClick={copy} style={btn(true)}>{copied ? "Copied" : "Copy CSS"}</button>
          <button type="button" onClick={reset} style={btn(false)}>Reset</button>
        </div>
        {groups.map((g) => (
          <fieldset key={g} style={{ border: "1px solid #2a332d", borderRadius: "0.75rem", padding: "0.75rem 1rem", margin: "0 0 0.75rem" }}>
            <legend style={{ padding: "0 0.375rem", color: "#b9d36b" }}>{g}</legend>
            {shown.filter((c) => c.group === g).map((c) => (
              <label key={c.id} style={{ display: "grid", gridTemplateColumns: "9rem 1fr 6rem", gap: "0.75rem", alignItems: "center", padding: "0.25rem 0" }}>
                <span style={{ opacity: touched[c.id] ? 1 : 0.7 }}>{c.label}</span>
                {c.kind === "range" ? (
                  <input type="range" min={c.min} max={c.max} step={c.step} value={vals[c.id]} onChange={(e) => set(c.id, e.target.value)} />
                ) : c.kind === "select" ? (
                  <select value={vals[c.id]} onChange={(e) => set(c.id, e.target.value)} style={{ background: "#1a211c", color: "inherit", border: "1px solid #2a332d", borderRadius: "0.375rem", padding: "0.25rem 0.5rem", font: "inherit" }}>
                    {c.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text" value={vals[c.id]} onChange={(e) => set(c.id, e.target.value)} style={{ background: "#1a211c", color: "inherit", border: "1px solid #2a332d", borderRadius: "0.375rem", padding: "0.25rem 0.5rem", font: "inherit" }} />
                )}
                <span style={{ fontVariantNumeric: "tabular-nums", textAlign: "right" }}>
                  {c.kind === "range" ? `${vals[c.id]}${c.unit}` : ""}
                </span>
              </label>
            ))}
          </fieldset>
        ))}
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.75rem", opacity: 0.8 }}>{css() || "Move a slider to see the CSS."}</pre>
      </div>
    </main>
  );
}

const btn = (on: boolean) => ({
  padding: "0.375rem 0.75rem",
  borderRadius: "999px",
  border: "1px solid #2a332d",
  background: on ? "#b9d36b" : "#1a211c",
  color: on ? "#0b1a10" : "#e8eae0",
  font: "inherit",
  cursor: "pointer",
});
