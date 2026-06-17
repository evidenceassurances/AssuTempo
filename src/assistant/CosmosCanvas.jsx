/**
 * CosmosCanvas : ambiance cosmos de la zone de chat, rendue dans UN SEUL
 * <canvas> pilote par requestAnimationFrame (bien plus fluide que des dizaines
 * de noeuds DOM animes).
 *
 * Couches : 3 plans d'etoiles (parallaxe par derive lente differenciee),
 * scintillement leger, etoiles filantes rares (toutes les 8-15 s), poussiere
 * d'etoiles a l'arrivee d'un message.
 *
 * Performance :
 *  - L'animation ne tourne que lorsque le composant est monte (panneau ouvert)
 *    ET l'onglet visible (pause sur visibilitychange). Cleanup complet.
 *  - Mobile : densite reduite, devicePixelRatio plafonne a 2.
 *  - prefers-reduced-motion : rendu statique (pas de boucle, pas de filante).
 *
 * Lisibilite : le canvas est en fond (z-index 0, pointer-events none) ; le
 * contenu du panneau passe au-dessus.
 */
import { useEffect, useRef } from 'react';

const GOLD = '232,201,122';
const IVORY = '244,241,234';

function createEngine(canvas, opts) {
  const ctx = canvas.getContext('2d');
  const reduced = !!opts.reduced;
  let w = 0;
  let h = 0;
  let layers = [];
  let shooting = null;
  let dust = [];
  let nextShootAt = 0;
  let raf = 0;
  let last = 0;
  let running = false;

  function isMobile() {
    return w < 440;
  }

  function initStars() {
    const mobile = isMobile();
    const density = mobile ? 0.00009 : 0.00015; // etoiles par px^2
    const cap = mobile ? 42 : 95;
    const total = Math.max(18, Math.min(cap, Math.round(w * h * density)));
    // 3 plans : lointain (petit/tenu/lent) -> proche (grand/vif/rapide)
    const defs = [
      { frac: 0.5, rMin: 0.4, rMax: 0.9, alpha: 0.35, speed: mobile ? 1.6 : 2.4 },
      { frac: 0.32, rMin: 0.7, rMax: 1.35, alpha: 0.55, speed: mobile ? 3.4 : 5 },
      { frac: 0.18, rMin: 1.1, rMax: 2.0, alpha: 0.85, speed: mobile ? 6 : 9 },
    ];
    layers = defs.map((d) => {
      const n = Math.round(total * d.frac);
      const stars = [];
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: d.rMin + Math.random() * (d.rMax - d.rMin),
          base: d.alpha * (0.5 + Math.random() * 0.5),
          alpha: d.alpha,
          tw: Math.random() * Math.PI * 2,
          tws: 0.6 + Math.random() * 1.1,
          gold: Math.random() < 0.45,
        });
      }
      return { stars, speed: d.speed };
    });
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initStars();
    if (reduced) drawStatic();
  }

  function drawStar(s) {
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = 'rgba(' + (s.gold ? GOLD : IVORY) + ',1)';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStatic() {
    ctx.clearRect(0, 0, w, h);
    for (const L of layers) for (const s of L.stars) { s.alpha = s.base; drawStar(s); }
    ctx.globalAlpha = 1;
  }

  function maybeShoot(now) {
    if (shooting || now < nextShootAt) return;
    const fromLeft = Math.random() < 0.5;
    const sp = 0.42 + Math.random() * 0.3; // px/ms
    const ang = 0.18 + Math.random() * 0.16;
    shooting = {
      x: fromLeft ? -20 : w + 20,
      y: Math.random() * h * 0.5,
      vx: (fromLeft ? 1 : -1) * sp * Math.cos(ang),
      vy: sp * Math.sin(ang),
      len: 80 + Math.random() * 70,
      life: 0,
    };
    nextShootAt = now + 8000 + Math.random() * 7000;
  }

  function drawShooting(dt) {
    if (!shooting) return;
    const s = shooting;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.life += dt;
    const sp = Math.hypot(s.vx, s.vy) || 1;
    const tx = s.x - (s.vx / sp) * s.len;
    const ty = s.y - (s.vy / sp) * s.len;
    const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
    g.addColorStop(0, 'rgba(' + GOLD + ',0.9)');
    g.addColorStop(1, 'rgba(' + GOLD + ',0)');
    ctx.globalAlpha = 1;
    ctx.strokeStyle = g;
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    if (s.x < -60 || s.x > w + 60 || s.y > h + 60 || s.life > 1600) shooting = null;
  }

  function spawnDust() {
    if (reduced) return;
    const cx = w * (0.18 + Math.random() * 0.64);
    const cy = h * (0.55 + Math.random() * 0.32);
    const n = isMobile() ? 5 : 8;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 0.01 + Math.random() * 0.03;
      dust.push({
        x: cx, y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 0.012,
        r: 0.8 + Math.random() * 1.2,
        life: 0,
        max: 700 + Math.random() * 500,
      });
    }
    if (!running && !reduced) start();
  }

  function drawDust(dt) {
    for (let i = dust.length - 1; i >= 0; i--) {
      const d = dust[i];
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.life += dt;
      const t = 1 - d.life / d.max;
      if (t <= 0) { dust.splice(i, 1); continue; }
      ctx.globalAlpha = t * 0.8;
      ctx.fillStyle = 'rgba(' + GOLD + ',1)';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(50, now - last || 16);
    last = now;
    ctx.clearRect(0, 0, w, h);
    for (const L of layers) {
      for (const s of L.stars) {
        s.x -= (L.speed * dt) / 1000;
        if (s.x < -2) { s.x = w + 2; s.y = Math.random() * h; }
        s.tw += (s.tws * dt) / 1000;
        s.alpha = s.base * (0.55 + 0.45 * Math.sin(s.tw));
        drawStar(s);
      }
    }
    ctx.globalAlpha = 1;
    maybeShoot(now);
    drawShooting(dt);
    drawDust(dt);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    if (reduced) { drawStatic(); return; }
    running = true;
    last = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    if (!nextShootAt) nextShootAt = last + 4000 + Math.random() * 6000;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  return { resize, start, stop, spawnDust };
}

export default function CosmosCanvas({ reduced = false, burst = 0 }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const engine = createEngine(canvas, { reduced });
    engineRef.current = engine;
    engine.resize();
    engine.start();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => engine.resize());
      ro.observe(canvas);
    }
    const onResize = () => engine.resize();
    const onVis = () => {
      if (document.hidden) engine.stop();
      else engine.start();
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      engine.stop();
      engineRef.current = null;
    };
  }, [reduced]);

  // poussiere d'etoiles a chaque nouveau message (ignore le 1er rendu)
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (engineRef.current) engineRef.current.spawnDust();
  }, [burst]);

  return <canvas ref={canvasRef} className="atp-cosmos" aria-hidden />;
}
