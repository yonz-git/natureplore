import Link from "next/link";

import Logo from "@/components/ui/Logo";
import TabBar from "@/components/layout/TabBar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative min-h-full">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/img/forest-olena-bohovyk.jpg)" }}
      />
      <div className="fixed inset-0 -z-10 bg-scrim/55" />
      <main className="mx-auto min-h-full w-full max-w-[32.5rem] px-inset-screen pt-[var(--top-chrome)] pb-tabbar-clearance">
        {children}
      </main>
      {}
      <Link href="/" className="app-logo" aria-label="natureplore, back to the welcome">
        <Logo symbol />
      </Link>
      <TabBar />
    </div>
  );
}
