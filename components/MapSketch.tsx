// The hand-drawn Berlin sketch used on the welcome screens: rivers, lakes, the ring and the roads out of it.
// Stroke widths and colours come from the stylesheet of the screen that uses it (classes ms-*).
export default function MapSketch({
  viewBox,
  className,
  places = false,
}: {
  viewBox: string;
  className?: string;
  places?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g className="ms-water">
        <path className="ms-river-1" d="M352 -260C340 -120 362 -20 348 60S364 200 352 290S366 380 356 440" />
        <path className="ms-river-2" d="M136 -40C146 40 132 120 150 170S152 230 122 236S72 236 52 206S26 150 -20 136" />
        <path className="ms-river-3" d="M292 348C268 312 246 268 222 226S180 212 150 214" />
      </g>
      <g className="ms-lakes">
        <ellipse cx="146" cy="98" rx="7" ry="6" />
        <ellipse cx="116" cy="136" rx="3" ry="9" />
        <ellipse cx="206" cy="122" rx="3" ry="9" />
        <ellipse cx="244" cy="112" rx="7" ry="4" />
        <ellipse cx="222" cy="218" rx="6" ry="4" />
        <ellipse cx="262" cy="262" rx="4" ry="10" />
        <ellipse cx="134" cy="238" rx="6" ry="4" />
      </g>
      <g className="ms-roads">
        <ellipse cx="192" cy="208" rx="60" ry="38" />
        <path d="M150 180 96 140 40 100-20 58" />
        <path d="M226 176 252 128 282 62 312 -60" />
        <path d="M252 214 304 222 410 232" />
        <path d="M232 240 262 292 300 362 332 440" />
        <path d="M160 242 130 300 98 380 72 440" />
        <path d="M132 212 72 222-20 240" />
      </g>
      <g className="ms-lanes">
        <path d="M195 170 200 100 206 -60" />
        <path d="M304 222 342 176 410 140" />
        <path d="M96 140 60 190 20 300" />
      </g>
      {places && (
        <g className="ms-places">
          <circle cx="195" cy="207" r="7" />
          <circle cx="221" cy="132" r="4.5" />
          <circle cx="270" cy="318" r="4.5" />
          <circle cx="150" cy="228" r="4.5" />
          <circle cx="103" cy="188" r="4.5" />
          <circle cx="78" cy="232" r="4.5" />
          <circle cx="254" cy="93" r="4.5" />
          <circle cx="116" cy="297" r="4.5" />
          <circle cx="307" cy="183" r="4.5" />
        </g>
      )}
    </svg>
  );
}
