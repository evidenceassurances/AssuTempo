import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Users } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';

const values = [
  { title: 'Efficace', description: 'Processus fluide, prise en charge rapide, réponse sous 24h.', icon: ShieldCheck },
  { title: 'Disponible', description: 'Accompagnement client dédié du lundi au samedi.', icon: Users },
  { title: 'Engagé RSE', description: "Parité, égalité salariale et réduction de l'empreinte carbone.", icon: Sparkles },
];

function About() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-8">
      <SectionHeading title="Qui sommes-nous" subtitle="Evidence Assurances, 6 ans d'expertise au service d'une assurance temporaire moderne." />
      <div className="mt-16 grid gap-12 lg:grid-cols-[0.9fr_0.9fr] lg:items-start">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="rounded-[2rem] border border-slate-200 bg-white/85 p-10 shadow-lg shadow-slate-900/5">
          <p style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#FFFFFF' }}>Notre histoire</p>
          <h2 className="mt-5 text-3xl font-semibold text-slate-950">Evidence Assurances combine expertise et innovation pour l'assurance temporaire.</h2>
          <p className="mt-6 text-sm leading-7 text-slate-600">
            Depuis 6 ans, notre mission a été de simplifier l'accès à une couverture temporaire fiable pour tous les conducteurs. Nous concevons des parcours digitaux clairs et un support humain pour chaque dossier.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-3xl font-semibold text-slate-950">6 ans</p>
              <p className="mt-2 text-sm text-slate-600">d'expertise</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-3xl font-semibold text-slate-950">24h</p>
              <p className="mt-2 text-sm text-slate-600">Réponse sous 24h max</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {values.map((item) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="flex gap-4 rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-mint text-black">
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
