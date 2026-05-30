function CountCard({ value, label }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.85)]">
      <p className="text-4xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm text-slate-400">{label}</p>
    </div>
  );
}

export default CountCard;
