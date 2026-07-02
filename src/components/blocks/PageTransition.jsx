import { useEffect } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { EASE_PREMIUM } from '../../lib/motion';

/* Au tout premier montage (hydratation du HTML prerendu), aucune animation
   d'entree : sinon la page entiere reste en opacity:0 dans le HTML statique
   jusqu'au chargement du JS (ecran vide de plusieurs secondes sur mobile).
   Le flag module ne passe a false qu'apres le premier effet client : il
   reste donc true pendant tout le rendu serveur (les effets n'y tournent
   jamais) et pendant l'hydratation, puis les navigations suivantes animent. */
let isFirstMount = true;

function PageTransition({ children }) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    isFirstMount = false;
  }, []);

  const initial = isFirstMount
    ? false
    : prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 12 };

  return (
    <m.main
      initial={initial}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
      transition={{ duration: 0.3, ease: EASE_PREMIUM }}
      style={{ minHeight: 'calc(100vh - 112px)' }}
    >
      {children}
    </m.main>
  );
}

export default PageTransition;
