export default function Screen({
  code,
  title,
  blurb,
  next,
}: {
  code: string;
  title: string;
  blurb: string;
  next: string;
}) {
  return (
    <section className="flex flex-col gap-6">
      <p className="text-stat-label text-on-ground-soft">
        {code}
      </p>
      <h1 className="text-h1 text-on-ground">{title}</h1>
      <p className="text-body text-on-ground-soft">{blurb}</p>
      <div className="rounded-card bg-ground/80 p-6 backdrop-blur-xl">
        <h2 className="text-title-sm text-on-ground">Next to build</h2>
        <p className="mt-2 text-body text-on-ground-soft">{next}</p>
      </div>
    </section>
  );
}
