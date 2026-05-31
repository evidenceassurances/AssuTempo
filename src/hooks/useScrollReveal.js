import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollReveal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  return [ref, inView];
}
