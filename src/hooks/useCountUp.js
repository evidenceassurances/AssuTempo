import { useEffect, useRef, useState } from 'react';

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export function useCountUp(target, inView) {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);

  useEffect(() => {
    if (!inView || target == null) {
      setCount(0);
      return undefined;
    }

    let animationFrame;

    const step = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / 2000, 1);
      setCount(Math.min(target, Math.floor(easeOut(progress) * target)));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [target, inView]);

  return count;
}
