import { useEffect, useState } from 'react';

export function useMouseSpotlight() {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handleMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return position;
}
