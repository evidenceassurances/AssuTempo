import { motion } from 'framer-motion';

function VehicleScroller({ items }) {
  return (
    <div className="mt-10 overflow-x-auto py-4 sm:mt-12">
      <div className="flex gap-5 min-w-[120%] px-2 sm:min-w-full sm:px-0">
        {items.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="min-w-[280px] rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.8)]"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300/90">{item.category}</p>
            <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">{item.price}</span>
              <span className="text-sm font-semibold text-amber-300">{item.badge}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default VehicleScroller;
