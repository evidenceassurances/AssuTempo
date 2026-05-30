function SectionHeading({ title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">AssuTempo</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mx-auto mt-5 max-w-2xl text-base text-textSub">{subtitle}</p>
    </div>
  );
}

export default SectionHeading;
