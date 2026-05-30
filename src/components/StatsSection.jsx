import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

function StatsSection({ stats }) {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { margin: '-120px 0px -120px 0px', once: true });

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="rounded-[2.5rem] border border-gold/20 bg-surface p-8 shadow-gold"
      >
        <div className="grid gap-6 lg:grid-cols-4 lg:divide-x lg:divide-gold/20">
          {stats.map((item, index) => {
            const count = useCountUp(item.value, inView);
            const display = `${item.prefix ?? ''}${count}${item.suffix ?? ''}`;

            return (
              <div key={item.label} className={`space-y-3 px-5 py-8 ${index > 0 ? 'lg:pl-8' : ''}`}>
                <p className="text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold to-goldLight">{display}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-textSub">{item.label}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

export default StatsSection;
