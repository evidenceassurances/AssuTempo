import { motion, AnimatePresence } from 'framer-motion';

function AnimatedAccordion({ question, answer, open, onToggle }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-gold/15 bg-[#111111]/90 shadow-gold">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-white transition hover:bg-[#111111]/80"
      >
        <span>{question}</span>
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-gold transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden px-6 pb-6"
          >
            <p className="text-sm leading-7 text-textSub">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnimatedAccordion;
