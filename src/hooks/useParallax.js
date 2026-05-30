import { useMemo } from 'react';
import { useScrollProgress } from './useScrollProgress';

export function useParallax(speed = 0.3) {
  const progress = useScrollProgress();
  const height = typeof window !== 'undefined' ? window.innerHeight : 0;

  return useMemo(() => {
    return progress * height * speed;
  }, [progress, height, speed]);
}
