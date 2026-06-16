import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { m, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/* Detection client sans setState-in-effect : false au prerendu, true au client,
   React gere la difference sans erreur d'hydratation. */
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/* Barre de progression de scroll : 2px or, fixee en haut de la fenetre.
   Rendue via un portal vers document.body pour echapper a la transformation
   de PageTransition (un ancestor transforme casserait position: fixed).
   Client-only : pendant le prerendu et la 1re passe d'hydratation, on rend
   null des deux cotes pour eviter tout decalage d'hydratation. */
function ScrollProgress() {
  const isClient = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  if (!isClient || typeof document === 'undefined') return null;

  return createPortal(
    <m.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        transformOrigin: '0% 50%',
        scaleX: reduce ? scrollYProgress : scaleX,
        background: 'linear-gradient(90deg, #C9A84C, #E8C97A)',
        zIndex: 120,
        pointerEvents: 'none',
      }}
    />,
    document.body,
  );
}

export default ScrollProgress;
