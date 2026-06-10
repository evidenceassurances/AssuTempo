import { useState } from 'react';
import { m } from 'framer-motion';

function InteractiveMap({ countries }) {
  const [active, setActive] = useState(countries[0] || 'France');

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-mint">Couverture Europe</p>
        <h3 className="mt-4 text-3xl font-semibold text-slate-950">34 pays européens couverts</h3>
        <p className="mt-4 text-sm leading-7 text-slate-600">L&apos;assurance temporaire AssuTempo couvre 34 pays européens sans frais cachés, idéale pour les voyages et les démarches internationales.</p>
        <div className="mt-8 rounded-[1.75rem] bg-slate-950/95 p-6 text-white shadow-glow">
          <p className="text-xs uppercase tracking-[0.3em] text-mint">Pays sélectionné</p>
          <p className="mt-4 text-2xl font-semibold">{active}</p>
          <p className="mt-3 text-sm text-slate-300">Assurance temporaire valide pour ce pays dans votre attestation.</p>
        </div>
      </div>

      <m.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm md:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => (
          <button
            key={country}
            type="button"
            onClick={() => setActive(country)}
            className={`rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition ${active === country ? 'border-mint bg-mint/10 text-slate-950 shadow-glow' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'}`}
          >
            {country}
          </button>
        ))}
      </m.div>
    </div>
  );
}

export default InteractiveMap;
