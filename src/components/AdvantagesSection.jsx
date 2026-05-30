import { motion } from 'framer-motion';

function AdvantagesSection({ benefits }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="rounded-[2.5rem] border border-gold/20 bg-surface p-8 shadow-gold"
      >
        <div className="mb-10 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-gold">Pourquoi AssuTempo</p>
          <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Des garanties simples, claires et premium</h2>
          <p className="mt-4 text-base leading-8 text-textSub">Chaque option est pensée pour offrir une expérience haut de gamme, sans complexité et sans compromis.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {benefits.map((item) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-[1.75rem] border border-gold/15 bg-[#111111]/90 p-8 text-white transition duration-200 hover:border-gold/40 hover:bg-[#1A1A1A]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#0A0A0A] text-3xl shadow-[0_20px_80px_-50px_rgba(201,168,76,0.45)]">{item.icon}</div>
              <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-textSub">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default AdvantagesSection;
