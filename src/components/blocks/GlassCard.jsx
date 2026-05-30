function GlassCard({ icon, title, description }) {
  return (
    <div className="glass-panel rounded-[2rem] border border-white/70 p-8 shadow-lg shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950/5 text-2xl shadow-sm">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

export default GlassCard;
