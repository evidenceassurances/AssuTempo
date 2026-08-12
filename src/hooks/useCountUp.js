import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useCountUp(target, trigger, duration = 1800) {
  /* L'etat initial vaut la valeur FINALE, jamais zero.

     Le HTML prerendu est ce que lisent les moteurs qui n'executent pas le
     JavaScript (GPTBot, PerplexityBot, ClaudeBot...). Avec un etat initial a 0,
     ils lisaient litteralement "0 ans d'expertise" et "0 pays europeens" : une
     affirmation fausse, pire qu'une absence de chiffre.

     L'animation reste identique pour l'humain : elle repart de 0 apres
     hydratation, au moment ou le bloc entre dans le champ. Serveur et client
     rendent la meme valeur au premier rendu, donc aucun mismatch. */
  const [count, setCount] = useState(target);
  const rafRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!trigger) return undefined;

    /* Preference systeme "reduire les animations" : on affiche directement le
       chiffre final, sans comptage. */
    if (reduce) {
      setCount(target);
      return undefined;
    }

    const start = performance.now();
    setCount(0);

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, trigger, duration, reduce]);

  return count;
}
