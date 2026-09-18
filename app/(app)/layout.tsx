import TabBar from "@/components/TabBar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="relative min-h-full">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/img/forest-olena-bohovyk.jpg)" }}
      />
      <div className="fixed inset-0 -z-10 bg-scrim/55" />
      <main className="mx-auto min-h-full w-full max-w-[520px] px-inset-screen pt-12 pb-tabbar-clearance">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
