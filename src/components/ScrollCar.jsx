import { useEffect, useRef, useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { useScrollProgress } from '../hooks/useScrollProgress';

const carSvg = (
  <svg viewBox="0 0 120 60" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 32c0-8 7-14 15-14h54c8 0 15 6 15 14v8H16v-8Z" fill="#C9A84C" />
    <path d="M20 36h80v6H20v-6Z" fill="#0A0A0A" />
    <circle cx="34" cy="48" r="7" fill="#C9A84C" />
    <circle cx="86" cy="48" r="7" fill="#C9A84C" />
    <path d="M25 32c6-5 14-5 18-5h34c4 0 12 0 18 5" stroke="#0A0A0A" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

function ScrollCar() {
  const progress = useScrollProgress();
  const [top, setTop] = useState(60);
  const [direction, setDirection] = useState('down');
  const [isStopped, setIsStopped] = useState(false);
  const lastProgress = useRef(progress);
  const stopTimer = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setTop(60);
      return undefined;
    }

    const delta = progress - lastProgress.current;
    if (Math.abs(delta) > 0.002) {
      setDirection(delta > 0 ? 'down' : 'up');
      setIsStopped(false);
    }

    lastProgress.current = progress;

    const height = window.innerHeight || 700;
    setTop(Math.min(Math.max(24, progress * (height - 64)), height - 48));

    if (stopTimer.current) {
      window.clearTimeout(stopTimer.current);
    }

    stopTimer.current = window.setTimeout(() => {
      setIsStopped(true);
    }, 120);

    return () => {
      if (stopTimer.current) {
        window.clearTimeout(stopTimer.current);
      }
    };
  }, [progress, prefersReducedMotion]);

  const rotate = direction === 'down' ? 90 : -90;

  return (
    <m.div
      className="scroll-car hidden md:block fixed left-5 z-50"
      style={{ top: `${top}px` }}
      animate={{ rotate, y: isStopped ? [0, -6, 0] : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26, duration: 0.15 }}
    >
      <div className="relative h-12 w-16 rounded-full bg-[#111111] p-1 shadow-[0_20px_80px_-46px_rgba(201,168,76,0.55)]">
        <div className="absolute inset-0 rounded-full border border-white/10 bg-gradient-to-br from-[#12131b] to-[#0a0a14] p-1">
          {carSvg}
        </div>
      </div>
    </m.div>
  );
}

export default ScrollCar;
