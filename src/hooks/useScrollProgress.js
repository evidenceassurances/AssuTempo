import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let ticking = false;

    const updateProgress = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const fullHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(fullHeight > 0 ? Math.min(1, scrollY / fullHeight) : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateProgress);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}
