"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// the icons of the version 6 boards, the same set the welcome's nav uses
const TABS = [
  {
    href: "/map",
    label: "Map",
    icon: (
      <>
        <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
        <path d="M9 4v13.5M15 6.5V20" />
      </>
    ),
  },
  {
    href: "/learn",
    label: "Learn",
    icon: (
      <>
        <path d="M12 6.5C10.4 5.2 8 4.6 4 4.8v13.6c4-.2 6.4.4 8 1.6 1.6-1.2 4-1.8 8-1.6V4.8c-4-.2-6.4.4-8 1.7z" />
        <path d="M12 6.5V20" />
      </>
    ),
  },
  {
    href: "/notebook",
    label: "Notebook",
    icon: (
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M9 3.5v17" />
        <path d="M12.5 9h3.5M12.5 13h3.5" />
      </>
    ),
  },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Tabs" className="tabbar">
      <ul className="tabbar-pill glass glass-nav">
        {TABS.map((tab) => {
          const current = pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={current ? "page" : undefined}
                className={`tabbar-tab${current ? " is-current" : ""}`}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {tab.icon}
                </svg>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
