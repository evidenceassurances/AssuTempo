import { useEffect, useMemo, useState } from 'react';

function GlobeSection({ points }) {
  const [Globe, setGlobe] = useState(null);

  useEffect(() => {
    let active = true;
    import('react-globe.gl').then((mod) => {
      if (active) setGlobe(() => mod.default);
    });
    return () => { active = false; };
  }, []);

  const formattedPoints = useMemo(
    () => points.map((item) => ({
      lat: item.latitude,
      lng: item.longitude,
      size: item.size ?? 0.5,
      color: item.color ?? '#FDE68A',
      label: item.label,
    })),
    [points]
  );

  return (
    <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-slate-950/80 p-6 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.8)] sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,250,252,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.1),transparent_30%)]" />
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-300/80">Globe interactif</p>
          <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Vue globale des territoires couverts</h3>
          <p className="max-w-xl text-sm leading-7 text-slate-300">Explorez notre réseau d'assurance temporaire en temps réel, avec des points de couverture premium et une navigation fluide sur un globe 3D.</p>
        </div>
        <div className="h-[320px] min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-[inset_0_0_30px_rgba(255,255,255,0.06)]">
          {Globe ? (
            <Globe
              globeImageUrl="https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
              backgroundColor="rgba(0,0,0,0)"
              pointsData={formattedPoints}
              pointLat="lat"
              pointLng="lng"
              pointAltitude="size"
              pointRadius={0.4}
              pointColor={() => '#fcd34d'}
              pointsTransitionDuration={1000}
              width={600}
              height={320}
              animateIn
              onPointClick={(point) => window.open(`https://www.google.com/search?q=${encodeURIComponent(point.label)}`)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">Chargement du globe en 3D...</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GlobeSection;
