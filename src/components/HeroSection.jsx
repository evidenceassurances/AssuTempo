import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.06, delayChildren: 0 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function HeroSection({ hero }) {
  const words = hero.title.split(' ');

  return (
    <section className="relative overflow-hidden bg-background pb-28 pt-24">
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b from-[#111111] via-[#0A0A0A]/90 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="relative overflow-hidden rounded-[2.5rem] border border-gold/20 bg-surface p-10 shadow-gold"
        >
          <motion.p variants={item} className="inline-flex items-center rounded-full border border-gold/20 bg-[#111111] px-4 py-2 text-xs uppercase tracking-[0.35em] text-gold animate-pulse/30">
            ● {hero.badge}
          </motion.p>

          <motion.h1 variants={container} className="mt-8 text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            {words.map((word, index) => (
              <motion.span key={`${word}-${index}`} variants={item} className="inline-block mr-3">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p variants={item} className="mt-8 max-w-3xl text-lg leading-8 text-textSub sm:text-xl">
            {hero.subtitle}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to={hero.primaryCta.href}
              className="shimmer-button inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-black transition duration-300 hover:bg-goldLight"
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              to={hero.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-full border border-gold px-8 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#111111]"
            >
              {hero.secondaryCta.label}
            </Link>
          </motion.div>

          <motion.div variants={item} className="mt-12 grid gap-4 sm:grid-cols-3">
            {hero.trust.map((item) => (
              <div key={item.label} className="rounded-[1.75rem] border border-gold/15 bg-[#111111]/90 p-5 text-sm text-textSub transition duration-200 hover:border-gold/40 hover:bg-[#1A1A1A] hover:text-white">
                <p className="text-3xl">{item.icon}</p>
                <p className="mt-4 font-semibold text-white">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
