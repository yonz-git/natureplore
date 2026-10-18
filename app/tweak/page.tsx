"use client";

// A dev tool, not a screen: /map in a phone frame beside sliders that write CSS into the frame live,
// so spacing and sizes can be tried before they go into the stylesheets. Copy CSS gives the rules
// that differ from the starting values, ready to paste into app/flow-a.css, map.css or tabbar.css.

import { useEffect, useRef, useState } from "react";

type Control = {
  id: string;
  label: string;
  group: string;
  css: (v: string) => string;
  /** "range" values carry a unit; "color" and "text" are written as they are */
  kind: "range" | "color" | "text";
  value: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

const r = (
  id: string, group: string, label: string, value: number, min: number, max: number, step: number,
  unit: string, css: (v: string) => string,
): Control => ({ id, group, label, kind: "range", value: String(value), min, max, step, unit, css });

const CONTROLS: Control[] = [
  r("barTop", "Top bar", "Distance from top", 0.4, 0, 2, 0.05, "rem", (v) => `.ms-bar { top: calc(${v} + env(safe-area-inset-top, 0px)) !important; }`),
  r("handleW", "Sheet handle", "Width", 2.25, 1, 4, 0.125, "rem", (v) => `.ms-handle { width: ${v} !important; }`),
  r("handleH", "Sheet handle", "Thickness", 0.25, 0.125, 0.5, 0.0125, "rem", (v) => `.ms-handle { height: ${v} !important; }`),
  r("handleY", "Sheet handle", "Nudge up", 2, -6, 10, 0.5, "px", (v) => `.ms-grab .ms-handle { margin-top: -${v} !important; }`),
  r("scope", "Header", "Place line size", 1.125, 0.875, 1.5, 0.025, "rem", (v) => `.sg-scope { font-size: ${v} !important; line-height: 1.4 !important; }`),
  r("title", "Header", "Title size", 1.5, 1, 2.25, 0.025, "rem", (v) => `.sg .ms-title { font-size: ${v} !important; line-height: 1.25 !important; }`),
  r("aspect", "Card photo", "Height (% of width)", 80, 50, 130, 1, "", (v) => `.sug-track { aspect-ratio: 100 / ${v} !important; }`),
  r("scrim", "Card photo", "Scrim strength", 0.78, 0, 1, 0.01, "", (v) => `.sug-media::after { background: linear-gradient(to top, rgb(6 18 9 / ${v}) 0%, rgb(6 18 9 / calc(${v} * 0.58)) 50%, transparent 100%) !important; }`),
  r("name", "Card photo", "Route name size", 1.5, 1, 2.25, 0.025, "rem", (v) => `.sug-name { font-size: ${v} !important; }`),
  r("meta", "Card photo", "Distance and time size", 1.125, 0.75, 1.5, 0.025, "rem", (v) => `.sug-meta { font-size: ${v} !important; }`),
  r("textX", "Card photo", "Text from left", 1, 0.25, 2.5, 0.0625, "rem", (v) => `.sug-head { padding-left: ${v} !important; }`),
  r("textY", "Card photo", "Text from bottom", 1, 0.25, 2.5, 0.0625, "rem", (v) => `.sug-head { padding-bottom: ${v} !important; }`),
  r("save", "Save", "Circle size", 2.8125, 2, 3.5, 0.0625, "rem", (v) => `.sug-save { width: ${v} !important; height: ${v} !important; }`),
  r("saveIcon", "Save", "Icon size", 1.25, 0.75, 1.75, 0.0625, "rem", (v) => `.sug-save svg { width: ${v} !important; height: ${v} !important; }`),
  r("saveInset", "Save", "Inset from corner", 1.5, 0.75, 2.5, 0.0625, "rem", (v) => `.sug-save { top: ${v} !important; right: ${v} !important; }`),
  r("dotsR", "Photo dots", "From right", 0.75, 0, 2, 0.0625, "rem", (v) => `.sug-dots { right: ${v} !important; }`),
  r("dotsB", "Photo dots", "From bottom", 0.375, 0, 2, 0.0625, "rem", (v) => `.sug-dots { bottom: ${v} !important; }`),
  r("dot", "Photo dots", "Dot size", 0.375, 0.25, 0.75, 0.0125, "rem", (v) => `.sug-dot::before { width: ${v} !important; height: ${v} !important; }`),
  r("dotGap", "Photo dots", "Dot spacing", 0.75, 0.5, 1.5, 0.0625, "rem", (v) => `.sug-dot { width: ${v} !important; }`),
  { id: "pillEdge", group: "Pills", label: "Border colour", kind: "text", value: "rgb(222 224 222 / 0.39)", css: (v) => `.pill-org, .sug-spots { border-color: ${v} !important; }` },
  r("pillH", "Pills", "Height", 2, 1.5, 2.75, 0.0625, "rem", (v) => `.pill-org, .sug-spots { height: ${v} !important; }`),
  r("tabY", "Nav bar", "From bottom", 0.25, -0.5, 1.5, 0.03125, "rem", (v) => `.tabbar { bottom: calc(${v} + env(safe-area-inset-bottom, 0px)) !important; }`),
];

const WIDTHS = [320, 375, 390, 430];
const STORE = "np-tweak";

export default function Tweak() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [vals, setVals] = useState<Record<string, string>>(() => Object.fromEntries(CONTROLS.map((c) => [c.id, c.value])));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [width, setWidth] = useState(375);
  const [copied, setCopied] = useState(false);

  // remember the last session's values on this device
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) ?? "null");
      if (saved) {
        setVals((v) => ({ ...v, ...saved.vals }));
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
  const css = (all: boolean) =>
    CONTROLS.filter((c) => all || touched[c.id]).map((c) => c.css(value(c))).join("\n");

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
    tag.textContent = css(false);
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
    await navigator.clipboard.writeText(css(false).replaceAll(" !important", "") || "/* nothing changed */");
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const groups = [...new Set(CONTROLS.map((c) => c.group))];

  return (
    <main style={{ display: "flex", gap: "2rem", padding: "1.5rem", minHeight: "100dvh", background: "#101512", color: "#e8eae0", fontSize: "0.875rem", boxSizing: "border-box", alignItems: "flex-start" }}>
      <div style={{ flex: "none", position: "sticky", top: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          {WIDTHS.map((w) => (
            <button key={w} type="button" onClick={() => setWidth(w)} style={btn(w === width)}>
              {w}
            </button>
          ))}
          <button type="button" onClick={() => frame.current?.contentWindow?.location.reload()} style={btn(false)}>
            Reload
          </button>
        </div>
        <iframe
          ref={frame}
          src="/map"
          title="Map screen"
          onLoad={inject}
          style={{ width, height: 812, border: "1px solid #2a332d", borderRadius: "2rem", background: "#000", display: "block" }}
        />
      </div>

      <div style={{ flex: "1 1 auto", maxWidth: "30rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", position: "sticky", top: 0, background: "#101512", padding: "0.5rem 0", zIndex: 1 }}>
          <button type="button" onClick={copy} style={btn(true)}>{copied ? "Copied" : "Copy CSS"}</button>
          <button type="button" onClick={reset} style={btn(false)}>Reset</button>
        </div>
        {groups.map((g) => (
          <fieldset key={g} style={{ border: "1px solid #2a332d", borderRadius: "0.75rem", padding: "0.75rem 1rem", margin: "0 0 0.75rem" }}>
            <legend style={{ padding: "0 0.375rem", color: "#b9d36b" }}>{g}</legend>
            {CONTROLS.filter((c) => c.group === g).map((c) => (
              <label key={c.id} style={{ display: "grid", gridTemplateColumns: "9rem 1fr 6rem", gap: "0.75rem", alignItems: "center", padding: "0.25rem 0" }}>
                <span style={{ opacity: touched[c.id] ? 1 : 0.7 }}>{c.label}</span>
                {c.kind === "range" ? (
                  <input type="range" min={c.min} max={c.max} step={c.step} value={vals[c.id]} onChange={(e) => set(c.id, e.target.value)} />
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
        <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.75rem", opacity: 0.8 }}>{css(false) || "Move a slider to see the CSS."}</pre>
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
