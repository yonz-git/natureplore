import { PinIcon } from "@/components/Icons";

export function RegionLine({ children, replay, className = "" }: { children: React.ReactNode; replay?: string; className?: string }) {
  return (
    <p className={`sg-scope ${className}`.trim()}>
      <span className="sg-pin" key={replay}>
        {}
        {}
        <svg className="sg-pin-ring" viewBox="0 0 24 24" aria-hidden="true">
          <ellipse cx="12" cy="20.9" rx="7.2" ry="2.5" />
        </svg>
        <PinIcon size={18} className="sg-pin-icon" />
      </span>
      {children}
    </p>
  );
}
