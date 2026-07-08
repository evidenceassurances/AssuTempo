import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  cubicBezier,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Zap, Globe, Check } from 'lucide-react';
import CadranAssutempo from './CadranAssutempo';
import { trackEvent } from '../lib/analytics';
import { EASE_PREMIUM } from '../lib/motion';
import './HeroScrollytelling.css';

/* Hero scrollytelling "Cadran Assutempo".
   Zone de ~210vh avec etage sticky plein ecran : le cadran est epingle,
   le bloc hero s'eleve et s'estompe (acte 1), le module Devis express
   entre par le bas (acte 2). Tout derive d'une seule progression p,
   recalculee a chaque frame : systeme idempotent (scroll rapide,
   rechargement a mi-page, retour navigateur, rotation d'ecran).

   Le compteur de jours vit dans des motion values (aucun etat React,
   zero re-render au scroll comme au drag) : le scroll remonte la cible
   de 1 vers la valeur choisie (fenetre RAMP), le curseur la retarget,
   et un seul ressort (useSpring) lisse le tout. L'odometre, l'arc du
   cadran, l'aiguille, les graduations, le halo et la date derivent tous
   de ce meme signal continu : un seul point de mutation, renderCounter.

   La choregraphie d'entree (badge, H1, sous-titre, CTAs, confiance) est
   en CSS pur (classes scy-in-*) : elle joue des le premier paint, sans
   attendre l'hydratation JS. Le LCP (ligne du H1) ne depend plus du
   telechargement du bundle sur mobile. */

const INITIAL_DAYS = 7;
/* 11e cellule : le 0 de bouclage, l'unite franchit 9 -> 0 vers l'avant
   au lieu de rembobiner toute la colonne (defaut de l'ancien odometre) */
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* Fenetre de scroll (valeurs de p) qui remonte le compteur de 1 vers la
   valeur choisie, calee sur l'entree du module (p 0.26 -> 0.52) avec une
   fin legerement posterieure : le roulement se pose quand le module est la */
const RAMP_START = 0.30;
const RAMP_SPAN = 0.25;
const easeRamp = cubicBezier(...EASE_PREMIUM);

/* Ressort du compteur : amortissement ~0.95 de la valeur critique, soit un
   leger depassement absorbe en une oscillation, jamais de rebond multiple */
const SPRING_DAYS = { stiffness: 110, damping: 20, mass: 1 };

/* Date de fin incluse : 1 jour = couvert aujourd'hui seulement.
   Cache par duree (Intl ne reformate plus a chaque evenement), purge au
   changement de jour : un onglet laisse ouvert apres minuit ou restaure
   du bfcache n'affiche jamais une date de fin perimee */
let dateCacheDay = '';
const dateCache = [];
const fmtDateFin = (days) => {
  const today = new Date().toDateString();
  if (today !== dateCacheDay) {
    dateCacheDay = today;
    dateCache.length = 0;
  }
  return (dateCache[days] ??= new Date(Date.now() + (days - 1) * 864e5)
    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }));
};

function HeroScrollytelling() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const zoneRef = useRef(null);
  const copyRef = useRef(null);
  const hintRef = useRef(null);
  const modRef = useRef(null);
  const cadranRef = useRef(null);
  const numRef = useRef(null);
  const tensRef = useRef(null);
  const unitsRef = useRef(null);
  const haloRef = useRef(null);
  const dateRef = useRef(null);
  const rangeRef = useRef(null);
  const daysRef = useRef(INITIAL_DAYS);
  const draggingRef = useRef(false);
  const shownDayRef = useRef(INITIAL_DAYS);
  const revealSentRef = useRef(false);

  /* Chaine du compteur : cible = 1 + (choix - 1) * remontee, ou la remontee
     vaut la fenetre de scroll easee, court-circuitee a 1 des la premiere
     manipulation du curseur (liveMV) pour que l'affichage colle au pouce.
     Le ressort est la seule source d'animation : tout le reste s'y abonne. */
  const rampMV = useMotionValue(0);
  const liveMV = useMotionValue(0);
  const selMV = useMotionValue(INITIAL_DAYS);
  /* Cible quantifiee au jour entier : si le scroll s'arrete au milieu de la
     fenetre RAMP, l'odometre se gare sur un chiffre net, jamais entre deux */
  const targetMV = useTransform(() =>
    1 + Math.round((selMV.get() - 1) * Math.max(easeRamp(clamp01(rampMV.get())), liveMV.get()))
  );
  const springMV = useSpring(targetMV, SPRING_DAYS);
  /* reduced-motion : la valeur choisie s'affiche telle quelle, sans roulement */
  const shownMV = reducedMotion ? selMV : springMV;

  /* Police de l'odometre arrondie au pixel entier : 22vw donne des em
     fractionnaires et les translations de colonnes laissent alors un
     lisere du chiffre voisin sur iOS (residu au repos) */
  const roundNumFont = () => {
    const el = numRef.current;
    if (!el) return;
    el.style.fontSize = '';
    el.style.fontSize = `${Math.round(parseFloat(getComputedStyle(el).fontSize))}px`;
  };

  /* Mises a jour discretes, une fois par jour entier franchi, jamais par
     frame : date de fin, et piste + valeur du curseur. Le curseur n'est
     re-ecrit que pour le roulement pilote par le scroll (liveMV a 0) :
     apres une manipulation, la valeur posee par l'utilisateur fait foi et
     le ressort ne fait que la rejoindre (aucun retour en arriere du pouce
     pendant la pose, Safari compris), jamais pendant un drag ni sur un
     champ focus (clavier, lecteur d'ecran) */
  const renderDayMeta = useCallback((di) => {
    const range = rangeRef.current;
    if (
      range && liveMV.get() === 0 && !draggingRef.current &&
      document.activeElement !== range && +range.value !== di
    ) {
      range.value = di;
      range.style.setProperty('--f', `${(((di - 1) / 89) * 100).toFixed(1)}%`);
      range.setAttribute('aria-valuetext', `${di} ${di > 1 ? 'jours' : 'jour'}`);
    }
    if (dateRef.current) dateRef.current.textContent = `, jusqu'au ${fmtDateFin(di)}`;
  }, [liveMV]);

  /* Point de mutation unique du compteur, abonne au ressort : la valeur ne
     traverse jamais l'etat React. Mecanique d'odometre reelle : la roue des
     dizaines n'avance que pendant que l'unite franchit 9 -> 0, chaque roue
     glisse en continu (transform), le halo suit la vitesse du ressort. */
  const renderCounter = useCallback((v) => {
    const num = numRef.current;
    const tens = tensRef.current;
    const units = unitsRef.current;
    if (!num || !tens || !units) return;
    /* Bornes dures : le depassement du ressort n'affiche jamais <1 ni >90 */
    const day = v < 1 ? 1 : v > 90 ? 90 : v;
    const whole = Math.floor(day / 10);
    const t = whole + Math.max(0, (day % 10) - 9);
    const u = day - whole * 10;
    tens.style.transform = `translate3d(0, ${(-t).toFixed(4)}em, 0)`;
    tens.style.opacity = t >= 1 ? '1' : t.toFixed(3);
    units.style.transform = `translate3d(0, ${(-u).toFixed(4)}em, 0)`;
    num.style.transform = t >= 0.5 ? 'translateX(0ch)' : 'translateX(-0.5ch)';
    if (haloRef.current && !reducedMotion) {
      const glow = Math.min(1, Math.sqrt(Math.abs(springMV.getVelocity())) / 9);
      haloRef.current.style.opacity = (glow * 0.8).toFixed(3);
    }
    cadranRef.current?.setDaysLive(day);
    const di = Math.round(day);
    if (di !== shownDayRef.current) {
      shownDayRef.current = di;
      renderDayMeta(di);
    }
  }, [reducedMotion, springMV, renderDayMeta]);

  useMotionValueEvent(shownMV, 'change', renderCounter);

  const onDays = (e) => {
    const days = +e.target.value;
    /* Bonus haptique : pulsation discrete a chaque dizaine franchie (Android) */
    if (Math.floor(days / 10) !== Math.floor(daysRef.current / 10)) navigator.vibrate?.(5);
    daysRef.current = days;
    /* Retour immediat sous le doigt : la piste et la valeur accessible
       suivent le pouce sans lag ; le grand nombre, l'arc et la date
       suivent le ressort, une fraction de seconde derriere */
    e.target.style.setProperty('--f', `${(((days - 1) / 89) * 100).toFixed(1)}%`);
    e.target.setAttribute('aria-valuetext', `${days} ${days > 1 ? 'jours' : 'jour'}`);
    liveMV.set(1);
    selMV.set(days);
    cadranRef.current?.engage();
  };

  /* Drag du curseur signale au reste de la page (le lanceur de l'assistant
     s'efface pendant la manipulation et revient a l'arret). Le pointer capture
     natif du <input range> garantit le pointerup meme si le doigt sort du champ. */
  const emitDrag = (dragging) => {
    draggingRef.current = dragging;
    window.dispatchEvent(new CustomEvent('assutempo:instrument-drag', { detail: { dragging } }));
  };

  const goTunnel = () => {
    /* La valeur AFFICHEE fait foi : compteur, curseur, date et tunnel
       montrent et recoivent le meme jour, meme si le scroll s'est arrete
       au milieu du roulement (jamais daysRef, qui peut differer) */
    const days = shownDayRef.current;
    trackEvent('cta_devis_click', {
      "cta_label": 'Continuer mon devis',
      "page_path": window.location.pathname,
      "duree_jours": days,
    });
    navigate(`/tarification?duree=${days}`);
  };

  /* Orchestration : UNE seule boucle rAF pour toute la zone. Elle applique la
     progression p seulement quand scrollY a change (geometrie de zone mise en
     cache, aucune lecture de layout par frame) puis sert la rotation du cadran
     (cadran.frame). Active uniquement zone visible + onglet au premier plan.
     Partition resserree (zone 210vh) : sortie du texte sur p 0 -> 0.30
     (mouvement ease-out, fondu LINEAIRE pour un vrai tuilage), entree du
     module sur p 0.26 -> 0.52 (fondu croise, jamais de cadran seul a l'ecran),
     puis courte respiration avant la section suivante. */
  useEffect(() => {
    const zone = zoneRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let inView = true;
    let pageHidden = document.hidden;
    let zoneTop = 0;
    let span = 1;
    let lastY = -1;
    let forced = true; /* premiere application et re-application apres resize */

    const measure = () => {
      zoneTop = zone.getBoundingClientRect().top + window.scrollY;
      span = zone.offsetHeight - window.innerHeight;
      forced = true;
    };

    const apply = (p) => {
      /* Garde : un frame en attente peut arriver apres le detachement du
         DOM (navigation), quand les refs sont deja nulles */
      const copy = copyRef.current;
      if (!copy || !modRef.current || !hintRef.current) return;
      const rm = reduce.matches;

      /* Acte 1 : le bloc texte s'eleve (ease-out) et s'estompe (lineaire :
         l'ease-out sur l'opacite le faisait disparaitre des p~0.15, ouvrant
         un temps mort ou l'ecran ne montrait que le cercle vide) */
      const tRaw = clamp01(p / 0.30);
      const e1 = easeOutCubic(tRaw);
      copy.style.transform = rm ? '' : `translate3d(0, ${(-140 * e1).toFixed(1)}px, 0)`;
      copy.style.opacity = (1 - tRaw).toFixed(3);
      copy.style.visibility = tRaw >= 0.995 ? 'hidden' : '';
      copy.style.pointerEvents = tRaw > 0.5 ? 'none' : '';

      /* Indice de scroll : disparait dans les premiers 12 % */
      hintRef.current.style.opacity = (1 - clamp01(p / 0.12)).toFixed(3);

      /* Acte 2 : le module entre pendant que le texte finit de sortir */
      const p2 = easeOutCubic(clamp01((p - 0.26) / 0.26));
      const mod = modRef.current;
      mod.style.transform = rm
        ? ''
        : `translate3d(0, ${(90 - 90 * p2).toFixed(1)}px, 0) scale(${(0.94 + 0.06 * p2).toFixed(4)})`;
      mod.style.opacity = p2.toFixed(3);
      mod.style.visibility = p2 > 0.02 ? '' : 'hidden';
      mod.style.pointerEvents = p2 > 0.6 ? 'auto' : 'none';

      cadranRef.current?.setPresence(p2);

      /* Compteur : la fenetre RAMP du scroll remonte la cible du ressort.
         Module completement sorti = re-armement du roulement (liveMV), la
         prochaine entree remonte a nouveau de 1 vers la valeur choisie.
         reduced-motion : rien, l'affichage suit selMV et le ressort ne
         doit pas travailler dans le vide. */
      if (!rm) {
        const ramp = clamp01((p - RAMP_START) / RAMP_SPAN);
        if (ramp !== rampMV.get()) rampMV.set(ramp);
        if (p2 <= 0.02 && liveMV.get() !== 0) liveMV.set(0);
      }

      if (p2 > 0.6 && !revealSentRef.current) {
        revealSentRef.current = true;
        trackEvent('devis_express_view', { "page_path": window.location.pathname });
      }
    };

    const tick = (ts) => {
      raf = 0;
      if (!inView || pageHidden) return;
      const y = window.scrollY;
      if (forced || y !== lastY) {
        lastY = y;
        forced = false;
        apply(clamp01(span > 0 ? (y - zoneTop) / span : 0));
      }
      cadranRef.current?.frame(ts);
      /* reduced-motion : rien ne tourne, on ne boucle pas a vide ; les
         evenements scroll/resize relancent un tick a la demande */
      if (!reduce.matches) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf && inView && !pageHidden) raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      pageHidden = document.hidden;
      cadranRef.current?.setActive(inView && !pageHidden);
      if (!pageHidden) start();
    };

    /* Tout s'arrete hors ecran et onglet cache */
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      cadranRef.current?.setActive(inView && !pageHidden);
      if (inView) start();
    }, { threshold: 0 });
    io.observe(zone);

    const onResize = () => { roundNumFont(); measure(); start(); };
    const onPageShow = () => { measure(); start(); };
    window.addEventListener('scroll', start, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibility);
    reduce.addEventListener?.('change', start);

    roundNumFont();
    /* Etat initial deterministe : colonnes posees sur la valeur courante du
       ressort (1 en haut de page, module invisible ; valeur choisie en
       reduced-motion), piste et date posees sur le jour entier correspondant */
    const v0 = shownMV.get();
    shownDayRef.current = Math.round(v0 < 1 ? 1 : v0 > 90 ? 90 : v0);
    renderCounter(v0);
    renderDayMeta(shownDayRef.current);
    measure();
    tick(performance.now()); /* etat correct des le montage (rechargement a mi-page, bfcache) */

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('scroll', start);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibility);
      reduce.removeEventListener?.('change', start);
    };
    /* Deps stables (motion values) + renderCounter : l'effet ne se rejoue
       qu'a la bascule reduced-motion, et il est idempotent (teardown complet,
       remesure, re-application de l'etat courant) */
  }, [rampMV, liveMV, shownMV, renderCounter, renderDayMeta]);

  return (
    <section className="scy-zone" ref={zoneRef}>
      <div className="scy-stage">
        <CadranAssutempo ref={cadranRef} />

        {/* Halo d'ambiance dore */}
        <div aria-hidden className="halo-gold" style={{ zIndex: 1 }} />
        {/* Vignette douce vers les bords */}
        <div aria-hidden className="hero-vignette" style={{ zIndex: 1 }} />

        {/* ----- Acte 1 : bloc hero, monte en permanence dans le DOM ----- */}
        <div className="scy-copy" ref={copyRef}>
          {/* Badge */}
          <div
            style={{
              paddingTop: 96,
              paddingLeft: 24,
              paddingRight: 24,
              position: 'relative',
              zIndex: 3,
              flexShrink: 0,
            }}
          >
            <div
              className="scy-in-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(8,7,6,0.88)',
                border: '1px solid var(--gold-border)',
                borderRadius: 100,
                padding: '8px 18px',
                fontSize: 'clamp(10px, 2.8vw, 12px)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  flexShrink: 0,
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              Couverture immédiate &middot; 34 pays européens
            </div>
          </div>

          {/* Titre + sous-titre + CTAs */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '0 24px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>

              {/* H1 : reveal ligne par ligne, toujours dans le DOM */}
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  margin: '0 0 24px',
                  color: 'var(--text)',
                }}
              >
                {/* Plus de masque overflow:hidden : le reveal clippe est
                    remplace par un fondu-montee toujours lisible (le texte
                    ne doit jamais etre invisible au premier paint) */}
                <span style={{ display: 'block' }}>
                  {/* Ligne 1 */}
                  <span style={{ display: 'block' }}>
                    <span className="scy-in-line">
                      L&apos;assurance temporaire
                    </span>
                  </span>
                  {/* Ligne 2 */}
                  <span style={{ display: 'block' }}>
                    <span className="scy-in-line scy-in-line2">
                      qui change{' '}
                      <span className="gold-text-animated">tout.</span>
                    </span>
                  </span>
                </span>
              </h1>

              {/* Sous-titre */}
              <p
                className="scy-in-sub"
                style={{
                  color: 'var(--text-muted)',
                  fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                  lineHeight: 1.6,
                  maxWidth: 480,
                  margin: '0 auto 32px',
                }}
              >
                De 1 à 90 jours. Attestation en 5 minutes.
                <br />
                Sans engagement, sans mauvaise surprise.
              </p>

              {/* CTAs */}
              <div
                className="scy-in-ctas"
                style={{
                  display: 'flex',
                  gap: 16,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: 24,
                }}
              >
                <button
                  className="btn-gold"
                  onClick={() => {
                    trackEvent('cta_devis_click', { "cta_label": 'Obtenir mon devis', "page_path": window.location.pathname });
                    navigate('/tarification');
                  }}
                  style={{ padding: '14px 28px', fontSize: 16 }}
                >
                  Obtenir mon devis
                </button>
                <button
                  className="btn-glass"
                  onClick={() => {
                    trackEvent('cta_devis_click', { "cta_label": 'Voir les tarifs', "page_path": window.location.pathname });
                    navigate('/tarification');
                  }}
                  style={{ fontSize: 16 }}
                >
                  Voir les tarifs
                </button>
              </div>

              {/* Ligne de confiance */}
              <p
                className="scy-in-trust"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: '4px 2px',
                  fontSize: 'clamp(11px, 2.5vw, 13px)',
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                <Zap size={16} strokeWidth={1.75} style={{ color: '#C9A84C', flexShrink: 0, marginRight: 4 }} aria-hidden />
                <span>Attestation immédiate</span>
                <span style={{ color: 'var(--text-subtle)', margin: '0 5px' }}>·</span>
                <Globe size={16} strokeWidth={1.75} style={{ color: '#C9A84C', flexShrink: 0, marginRight: 4 }} aria-hidden />
                <span>34 pays couverts</span>
                <span style={{ color: 'var(--text-subtle)', margin: '0 5px' }}>·</span>
                <Check size={16} strokeWidth={2} style={{ color: '#C9A84C', flexShrink: 0, marginRight: 4 }} aria-hidden />
                <span>Prix fixe, zéro surprise</span>
              </p>

            </div>
          </div>

          {/* Espace bas */}
          <div style={{ flexShrink: 0, height: 64 }} />
        </div>

        {/* ----- Acte 2 : module Devis express ----- */}
        <div
          className="scy-module"
          ref={modRef}
          aria-label="Devis express"
          style={{
            opacity: 0,
            visibility: 'hidden',
            pointerEvents: 'none',
            transform: 'translate3d(0, 90px, 0) scale(0.94)',
          }}
        >
          <div className="dx">
            {/* Face de l'instrument : sur mobile, ce groupe est centre DANS
                le cercle du cadran (hauteur = diametre via --scy-dial-d) ;
                sur desktop, display:contents le fond dans la colonne */}
            <div className="dx-face">
              <p className="dx-eyebrow">Devis express</p>

              {/* Grand nombre de jours (le curseur porte la valeur accessible).
                  Le halo dore vit derriere les chiffres, hors de la fenetre
                  clippee de l'odometre, et respire avec la vitesse du ressort */}
              <div className="dx-numwrap">
                <span className="dx-halo" ref={haloRef} aria-hidden="true" style={{ opacity: 0 }} />
                <div className="dx-num" ref={numRef} aria-hidden="true" style={{ transform: 'translateX(-0.5ch)' }}>
                  <span className="dx-col" ref={tensRef} style={{ transform: 'translateY(0em)', opacity: 0 }}>
                    {DIGITS.map((d, i) => <span key={i}>{d}</span>)}
                  </span>
                  <span className="dx-col" ref={unitsRef} style={{ transform: `translateY(${-(INITIAL_DAYS % 10)}em)` }}>
                    {DIGITS.map((d, i) => <span key={i}>{d}</span>)}
                  </span>
                </div>
              </div>
              <p className="dx-label">Jours de couverture</p>
              {/* Contenu statique pour crawlers et lecteurs d'ecran : le
                  nombre anime ci-dessus est decoratif (aria-hidden) */}
              <p className="dx-sr">Durée au choix de 1 à 90 jours, 7 jours par défaut.</p>
            </div>

            <div className="dx-controls">
            <p className="dx-date">Couvert dès aujourd&apos;hui<span ref={dateRef} /></p>

            {/* Un focus pose pendant le roulement (Tab, lecteur d'ecran) gele
                les ecritures du curseur : onBlur resynchronise des que le
                focus s'en va */}
            <input
              className="dx-range"
              ref={rangeRef}
              type="range"
              min="1"
              max="90"
              step="1"
              defaultValue={INITIAL_DAYS}
              aria-valuetext={`${INITIAL_DAYS} jours`}
              onInput={onDays}
              onPointerDown={() => emitDrag(true)}
              onPointerUp={() => emitDrag(false)}
              onPointerCancel={() => emitDrag(false)}
              onLostPointerCapture={() => emitDrag(false)}
              onBlur={() => renderDayMeta(shownDayRef.current)}
              aria-label="Durée de couverture en jours"
            />

            <button className="btn-gold dx-cta" onClick={goTunnel}>
              Continuer mon devis · 2 min
            </button>
            <p className="dx-note">Sans engagement · Aucun paiement avant le récapitulatif</p>
            </div>
          </div>
        </div>

        {/* Indice de scroll */}
        <div className="scy-hint" ref={hintRef} aria-hidden="true">
          <span className="scy-hint-line"><span className="scy-hint-pulse" /></span>
          Faites défiler
        </div>

        {/* Fondu vers la section suivante */}
        <div className="scy-fade" aria-hidden="true" />
      </div>
    </section>
  );
}

export default HeroScrollytelling;
