function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="text-sm uppercase tracking-[0.4em] text-goldLight opacity-80">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-8 text-textSub">{description}</p>}
    </div>
  );
}

export default SectionHeader;
