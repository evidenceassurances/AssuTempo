import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import './TempoDial.css';
import './CadranAssutempo.css';

/* Cadran interactif du hero scrollytelling.
   Base visuelle : les classes atd de TempoDial.css (bloom, anneaux, comete),
   scopees ici par .atc pour ne pas toucher les autres pages.
   Par-dessus : une couche SVG (arc de remplissage, aiguille-point,
   90 graduations allumables) generee et pilotee apres hydratation.
   Machine a etats de rotation : idle > interacting > resuming > idle.
   Le cadran ne possede PAS sa propre boucle rAF : il expose frame(ts),
   appele par la boucle unique de HeroScrollytelling (fusion scroll +
   rotation = un seul callback par frame). */

const R = 34.6;                      /* rayon de l'orbite, en unites viewBox (100) */
const CIRC = +(2 * Math.PI * R).toFixed(3);
const IDLE_SPEED = 360 / 75;         /* comete au repos : 1 tour en 75 s */
const DASH_SPEED = 360 / 180;        /* contre-rotation : 1 tour en 3 min, sens inverse */

const CadranAssutempo = forwardRef(function CadranAssutempo(_, ref) {
  const rootRef = useRef(null);
  const cometRef = useRef(null);
  const trailRef = useRef(null);
  const dashRef = useRef(null);
  const gradsRef = useRef(null);
  const numsRef = useRef(null);
  const fillRef = useRef(null);
  const arcRef = useRef(null);
  const arcGlowRef = useRef(null);
  const needleRef = useRef(null);

  /* Etat mutable hors React : aucune re-render pendant le scroll ou le drag */
  const st = useRef({
    angle: 0,
    dashAngle: 0,
    speed: IDLE_SPEED,
    mode: 'idle',
    last: 0,
    active: true,
    started: false,
    reduced: false,
    timer: 0,
    days: 7,          /* derniere valeur choisie (re-materialisation) */
    lit: 0,           /* nombre de graduations allumees */
    zeroed: true,     /* cadran "pur" (retour en haut) */
    lastP2: -1,
    grads: [],
    nums: [],         /* chiffres reperes {el, angle} pour le fondu de proximite */
    geom: null,       /* geometrie mobile (invalidee au resize) */
  }).current;

  /* Geometrie du mode instrument mobile : le cadran quitte sa position de
     fond du hero pour devenir un cercle entier (~90vw, max 420px) cale sur
     la boite .dx-face du module (interpolation liee a p2, transform only).
     Publie --scy-dial-d sur l'etage pour que le CSS du module s'aligne. */
  const measureGeom = () => {
    const root = rootRef.current;
    if (!root || !root.parentElement) return { mobile: false };
    if (!window.matchMedia('(max-width: 767px)').matches) return { mobile: false };
    const stage = root.parentElement;
    const targetD = Math.min(window.innerWidth * 0.9, 420);
    stage.style.setProperty('--scy-dial-d', `${targetD.toFixed(0)}px`);
    const baseD = root.offsetWidth;
    const baseCY = stage.clientHeight * 0.58; /* top: 58% du CSS mobile */
    const face = stage.querySelector('.dx-face');
    let targetCY = 84 + targetD / 2;
    if (face) {
      /* mesure la position de repos de la face : le transform d'entree du
         module (translateY + scale a p2 faible) fausserait le rect */
      const mod = face.closest('.scy-module');
      const prev = mod ? mod.style.transform : '';
      if (mod) mod.style.transform = 'none';
      const fr = face.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      if (mod) mod.style.transform = prev;
      targetCY = fr.top - sr.top + fr.height / 2;
    }
    return { mobile: true, baseD, baseCY, targetD, targetCY };
  };

  /* Fondu de proximite (detail horloger) : tout repere chiffre a moins de
     14 degres de l'aiguille (= tete de l'arc) s'estompe a 0 en 200 ms et
     revient quand elle s'eloigne. days=0 (cadran pur, acte 1) : tout revient,
     l'aiguille masquee ne doit jamais eteindre le 90 du haut. */
  const fadeNearNumerals = (days) => {
    const needle = (days * 4) % 360;
    for (const n of st.nums) {
      const d = Math.abs(((needle - n.angle + 540) % 360) - 180);
      n.el.classList.toggle('atc-num-off', days > 0 && d < 14);
    }
  };

  /* Applique une valeur de jours a l'arc, l'aiguille et aux graduations */
  const applyVisual = (days, animate) => {
    const fill = fillRef.current;
    if (!fill) return;
    if (!animate) fill.classList.add('atc-notrans');

    const offset = (CIRC * (1 - days / 90)).toFixed(3);
    arcRef.current.style.strokeDashoffset = offset;
    arcGlowRef.current.style.strokeDashoffset = offset;
    needleRef.current.style.transform = `rotate(${days * 4}deg)`;
    fadeNearNumerals(days);

    const grads = st.grads;
    if (grads.length) {
      if (days > st.lit) {
        for (let j = st.lit + 1; j <= days; j++) grads[j].classList.add('on');
      } else if (days < st.lit) {
        for (let j = days + 1; j <= st.lit; j++) grads[j].classList.remove('on');
      }
    }
    st.lit = days;

    if (!animate) {
      void fill.offsetWidth; /* flush : les prochains changements retransitionnent */
      fill.classList.remove('atc-notrans');
    }
  };

  /* Pas de rotation, appele chaque frame par la boucle UNIQUE du hero.
     Garde sur la ref : entre le detachement du DOM (navigation) et le
     cleanup de l'effet, un frame en attente peut encore se presenter.
     st.last remis a zero apres une pause (>0,5 s) : pas de saut d'angle. */
  const frame = (ts) => {
    if (!st.active || !st.started || !cometRef.current) return;
    if (!st.last || ts - st.last > 500) st.last = ts;
    const dt = Math.min((ts - st.last) / 1000, 0.05);
    st.last = ts;

    const target = st.mode === 'interacting' ? 0 : IDLE_SPEED;
    const k = st.mode === 'resuming' ? 1.2 : 6;
    st.speed += (target - st.speed) * Math.min(1, k * dt);
    if (st.mode === 'resuming' && Math.abs(st.speed - IDLE_SPEED) < 0.02) {
      st.speed = IDLE_SPEED;
      st.mode = 'idle';
    }
    st.angle = (st.angle + st.speed * dt) % 360;
    cometRef.current.style.transform = `rotate(${st.angle.toFixed(3)}deg)`;

    /* Finition 1 : contre-rotation lente et constante, deux vitesses opposees */
    st.dashAngle = (st.dashAngle - DASH_SPEED * dt) % 360;
    dashRef.current.style.transform = `rotate(${st.dashAngle.toFixed(3)}deg)`;

    /* Finition 5 : respiration de la lueur au repos (cycle ~4 s, faible
       amplitude), amortie proportionnellement quand la rotation s'arrete */
    const kIdle = Math.max(0, Math.min(1, st.speed / IDLE_SPEED));
    const breathe = 0.86 + 0.14 * Math.sin(ts / 636.6);
    trailRef.current.style.opacity = (1 - kIdle + breathe * kIdle).toFixed(3);
  };

  useEffect(() => {
    st.active = true;
    st.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Generation des 90 graduations (une par jour, majeures toutes les 10).
       textContent = '' : idempotent sous StrictMode (double montage en dev). */
    const NS = 'http://www.w3.org/2000/svg';
    const g = gradsRef.current;
    g.textContent = '';
    const grads = [null];
    for (let j = 1; j <= 90; j++) {
      const a = (j * 4 * Math.PI) / 180;
      const maj = j % 10 === 0;
      const r1 = maj ? 32.9 : 34.3;
      const r2 = maj ? 35.15 : 35.0;
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', (50 + r1 * Math.sin(a)).toFixed(2));
      line.setAttribute('y1', (50 - r1 * Math.cos(a)).toFixed(2));
      line.setAttribute('x2', (50 + r2 * Math.sin(a)).toFixed(2));
      line.setAttribute('y2', (50 - r2 * Math.cos(a)).toFixed(2));
      line.setAttribute('class', maj ? 'atc-grad atc-grad-maj' : 'atc-grad');
      g.appendChild(line);
      grads.push(line);
    }
    st.grads = grads;
    st.lit = 0;
    if (!st.zeroed) applyVisual(st.days, false);

    /* Finition 2 : chiffres reperes graves aux graduations majeures.
       Toujours droits (jamais tournes vers le centre : un chiffre a
       l'envers en bas de cadran est illisible), poses sur un cercle
       interieur, centres optiquement via dy. Le 90 se lit a midi.
       Classe par valeur (atc-num-v30...) : le CSS mobile retire 30 et 60,
       qui traversaient la ligne "JOURS DE COUVERTURE" de la face. */
    const R_NUM = 29.2;
    const nums = numsRef.current;
    nums.textContent = '';
    st.nums = [];
    for (let v = 15; v <= 90; v += 15) {
      const na = (v * 4 * Math.PI) / 180;
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('x', (50 + R_NUM * Math.sin(na)).toFixed(2));
      t.setAttribute('y', (50 - R_NUM * Math.cos(na)).toFixed(2));
      t.setAttribute('dy', '1.1');
      t.setAttribute('class', `atc-num atc-num-v${v}`);
      t.textContent = String(v);
      nums.appendChild(t);
      st.nums.push({ el: t, angle: (v * 4) % 360 });
    }
    if (!st.zeroed) fadeNearNumerals(st.days);

    /* Prise de controle des rotations CSS sans saut : on lit l'angle courant.
       La rotation est ensuite servie par frame(ts), appele par le hero. */
    if (!st.reduced) {
      const readAngle = (el) => {
        const mtx = getComputedStyle(el).transform;
        if (!mtx || !mtx.startsWith('matrix')) return 0;
        const [ma, mb] = mtx.slice(7).split(',');
        return ((Math.atan2(+mb, +ma) * 180) / Math.PI + 360) % 360;
      };
      st.angle = readAngle(cometRef.current);
      st.dashAngle = readAngle(dashRef.current);
      cometRef.current.style.animation = 'none';
      dashRef.current.style.animation = 'none';
      st.started = true;
    }

    /* Geometrie instrument recalculee au prochain setPresence apres resize */
    const onResize = () => {
      st.geom = null;
      st.lastP2 = -1; /* force une reapplication meme si p2 n'a pas bouge */
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      st.active = false;
      clearTimeout(st.timer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    /* Interaction curseur : la rotation decelere (~600 ms), memoire 3 s, reprise douce */
    interact(days) {
      st.days = days;
      if (!st.reduced) {
        st.mode = 'interacting';
        clearTimeout(st.timer);
        st.timer = setTimeout(() => { st.mode = 'resuming'; }, 3000);
      }
      applyVisual(days, !st.reduced);
    },

    /* Presence de l'acte 2 (p2 du scroll) : materialise arc + aiguille */
    setPresence(p2) {
      const fill = fillRef.current;
      if (!fill) return;
      const v = p2.toFixed(3);
      if (v === st.lastP2) return;
      st.lastP2 = v;
      fill.style.opacity = v;

      if (!st.geom) st.geom = measureGeom();
      if (st.geom.mobile) {
        /* Mobile : interpolation hero -> instrument (translate + scale).
           Fonctionnel (pas decoratif) : appliquee aussi en reduced-motion,
           pilotee par le geste de scroll de l'utilisateur. */
        const g = st.geom;
        const s = 1 + (g.targetD / g.baseD - 1) * p2;
        const dy = (g.targetCY - g.baseCY) * p2;
        rootRef.current.style.transform =
          `translate(-50%, calc(-50% + ${dy.toFixed(1)}px)) scale(${s.toFixed(4)})`;
        /* mode instrument : cercle entier, sans le fondu de masque du hero */
        rootRef.current.classList.toggle('atc-instr', p2 > 0.35);
      } else if (!st.reduced) {
        /* Finition 7 : zoom imperceptible, le cadran s'avance quand il devient l'outil */
        rootRef.current.style.transform = `translate(-50%, -50%) scale(${(1 + 0.03 * p2).toFixed(4)})`;
      }

      if (p2 <= 0.02 && !st.zeroed) {
        /* Retour en haut : cadran pur (arc vide, graduations eteintes, aiguille masquee) */
        st.zeroed = true;
        applyVisual(0, false);
      } else if (p2 > 0.06 && st.zeroed) {
        st.zeroed = false;
        applyVisual(st.days, !st.reduced);
      }
    },

    /* Un pas d'animation (rotation + respiration), pilote par la boucle
       unique du hero. No-op si inactif, reduced-motion ou non demarre. */
    frame,

    /* Pause hors viewport / onglet cache (le hero cesse aussi d'appeler frame) */
    setActive(on) {
      st.active = on;
      if (on) st.last = 0; /* reprise sans saut d'angle apres la pause */
    },
  }));

  return (
    <div className="atd atc" aria-hidden="true" ref={rootRef}>
      <div className="atd-bloom" />
      <div className="atd-ring atd-r1" />
      <div className="atd-ring atd-r2" />
      <div className="atd-ring atd-dash" ref={dashRef} />
      <div className="atd-ticks" />
      <div className="atd-ticks atd-ticks-major" />

      <svg className="atc-svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="atcArc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E8C97A" />
            <stop offset="1" stopColor="#C9A84C" />
          </linearGradient>
          <radialGradient id="atcDotGlow">
            <stop offset="0" stopColor="rgba(246,231,182,0.9)" />
            <stop offset="0.4" stopColor="rgba(232,201,122,0.45)" />
            <stop offset="1" stopColor="rgba(232,201,122,0)" />
          </radialGradient>
        </defs>

        <g ref={numsRef} />

        {/* Tout ce qui se materialise avec l'acte 2 (opacite = p2) vit ici */}
        <g ref={fillRef} className="atc-fill" style={{ opacity: 0 }}>
          <g ref={gradsRef} />
          <circle ref={arcGlowRef} className="atc-arc-glow" cx="50" cy="50" r={R} style={{ strokeDashoffset: CIRC }} />
          <circle ref={arcRef} className="atc-arc" cx="50" cy="50" r={R} style={{ strokeDashoffset: CIRC }} />
          <g ref={needleRef} className="atc-needle" style={{ transform: 'rotate(0deg)' }}>
            <line className="atc-needle-line" x1="50" y1="21.4" x2="50" y2="16.6" />
            <circle className="atc-needle-glow" cx="50" cy="15.4" r="2.6" fill="url(#atcDotGlow)" />
            <circle className="atc-needle-dot" cx="50" cy="15.4" r="0.85" />
          </g>
        </g>
      </svg>

      <div className="atd-comet" ref={cometRef}>
        <span className="atd-trail" ref={trailRef} />
        <span className="atd-dot" />
      </div>
    </div>
  );
});

export default CadranAssutempo;
