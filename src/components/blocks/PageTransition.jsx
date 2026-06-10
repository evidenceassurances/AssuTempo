import { m } from 'framer-motion';

function PageTransition({ children }) {
  return (
    <m.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="min-h-[calc(100vh-112px)]"
    >
      {children}
    </m.main>
  );
}

export default PageTransition;
