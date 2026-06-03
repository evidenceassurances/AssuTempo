import { useState, useEffect } from 'react';

/**
 * Détecte les écrans tactiles (mobile / tablette) via matchMedia.
 * SSR-safe : valeur par défaut = false (bureau, carte figée).
 * Mise à jour après montage client uniquement.
 */
export function useIsMobile(query = '(pointer: coarse)') {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(query);
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return isMobile;
}
