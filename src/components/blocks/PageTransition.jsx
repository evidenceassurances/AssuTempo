import { m, useReducedMotion } from 'framer-motion';
import { EASE_PREMIUM } from '../../lib/motion';

function PageTransition({ children }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.main
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
      transition={{ duration: 0.3, ease: EASE_PREMIUM }}
      className="min-h-[calc(100vh-112px)]"
    >
      {children}
    </m.main>
  );
}

export default PageTransition;
