import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Globe, Check } from 'lucide-react';
import CadranAssutempo from './CadranAssutempo';
import { trackEvent } from '../lib/analytics';
import './HeroScrollytelling.css';

/* Hero scrollytelling "Cadran Assutempo".
   Zone de ~280vh avec etage sticky plein ecran : le cadran est epingle,
   le bloc hero s'eleve et s'estompe (acte 1), le module Devis express
   entre par le bas (acte 2). Tout derive d'une seule progression p,
   recalculee a chaque frame : systeme idempotent (scroll rapide,
   rechargement a mi-page, retour navigateur, rotation d'ecran).

   La choregraphie d'entree (badge, H1, sous-titre, CTAs, confiance) est
   en CSS pur (classes scy-in-*) : elle joue des le premier paint, sans
   attendre l'hydratation JS. Le LCP (ligne du H1) ne depend plus du
   telechargement du bundle sur mobile. */

const INITIAL_DAYS = 7;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
/* Date de fin incluse : 1 jour = couvert aujourd'hui seulement */
const fmtDateFin = (days) =>
  new Date(Date.now() + (days - 1) * 864e5).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

function HeroScrollytelling() {
  const navigate = useNavigate();

  const zoneRef = useRef(null);
  const copyRef = useRef(null);
  const hintRef = useRef(null);
  const modRef = useRef(null);
  const cadranRef = useRef(null);
  const numRef = useRef(null);
  const tensRef = useRef(null);
  const unitsRef = useRef(null);
  const dateRef = useRef(null);
  const rangeRef = useRef(null);
  const daysRef = useRef(INITIAL_DAYS);

  /* Police de l'odometre arrondie au pixel entier : 22vw donne des em
     fractionnaires et les translations de colonnes laissent alors un
     lisere du chiffre voisin sur iOS (residu au repos) */
  const roundNumFont = () => {
    const el = numRef.current;
    if (!el) return;
    el.style.fontSize = '';
    el.style.fontSize = `${Math.round(parseFloat(getComputedStyle(el).fontSize))}px`;
  };

  /* Grand nombre + piste du curseur + date de fin (aucun etat React : zero re-render) */
  const renderDays = (days) => {
    const t = Math.floor(days / 10);
    const u = days % 10;
    tensRef.current.style.transform = `translateY(${-t}em)`;
    tensRef.current.style.opacity = t ? '1' : '0';
    unitsRef.current.style.transform = `translateY(${-u}em)`;
    numRef.current.style.transform = t ? 'translateX(0ch)' : 'translateX(-0.5ch)';
    rangeRef.current.style.setProperty('--f', `${(((days - 1) / 89) * 100).toFixed(1)}%`);
    rangeRef.current.setAttribute('aria-valuetext', `${days} jours`);
    dateRef.current.textContent = `, jusqu'au ${fmtDateFin(days)}`;
  };

  const onDays = (e) => {
    const days = +e.target.value;
    /* Bonus haptique : pulsation discrete a chaque dizaine franchie (Android) */
    if (Math.floor(days / 10) !== Math.floor(daysRef.current / 10)) navigator.vibrate?.(5);
    daysRef.current = days;
    renderDays(days);
    cadranRef.current?.interact(days);
  };

  const goTunnel = () => {
    const days = daysRef.current;
    trackEvent('cta_devis_click', {
      "cta_label": 'Continuer mon devis',
      "page_path": window.location.pathname,
      "duree_jours": days,
    });
    navigate(`/tarification?duree=${days}`);
  };

  /* Orchestration : un seul listener scroll (passive) throttle par rAF */
  useEffect(() => {
    const zone = zoneRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let inView = true;
    let pageHidden = document.hidden;
    let revealSent = false;

    const apply = () => {
      raf = 0;
      /* Garde : un frame en attente peut arriver apres le detachement du
         DOM (navigation), quand les refs sont deja nulles */
      const copy = copyRef.current;
      if (!copy || !modRef.current || !hintRef.current) return;
      const rect = zone.getBoundingClientRect();
      const span = zone.offsetHeight - window.innerHeight;
      const p = clamp01(span > 0 ? -rect.top / span : 0);
      const rm = reduce.matches;

      /* Acte 1 : seul le bloc texte s'eleve et s'estompe */
      const e1 = easeOutCubic(clamp01(p / 0.38));
      copy.style.transform = rm ? '' : `translate3d(0, ${(-140 * e1).toFixed(1)}px, 0)`;
      copy.style.opacity = (1 - e1).toFixed(3);
      copy.style.visibility = e1 >= 0.985 ? 'hidden' : '';
      copy.style.pointerEvents = e1 > 0.5 ? 'none' : '';

      /* Indice de scroll : disparait dans les premiers 12 % */
      hintRef.current.style.opacity = (1 - clamp01(p / 0.12)).toFixed(3);

      /* Acte 2 : le module Devis express entre par le bas */
      const p2 = easeOutCubic(clamp01((p - 0.42) / 0.33));
      const mod = modRef.current;
      mod.style.transform = rm
        ? ''
        : `translate3d(0, ${(90 - 90 * p2).toFixed(1)}px, 0) scale(${(0.94 + 0.06 * p2).toFixed(4)})`;
      mod.style.opacity = p2.toFixed(3);
      mod.style.visibility = p2 > 0.02 ? '' : 'hidden';
      mod.style.pointerEvents = p2 > 0.6 ? 'auto' : 'none';

      cadranRef.current?.setPresence(p2);

      if (p2 > 0.6 && !revealSent) {
        revealSent = true;
        trackEvent('devis_express_view', { "page_path": window.location.pathname });
      }
    };

    const schedule = () => {
      if (!raf && inView && !pageHidden) raf = requestAnimationFrame(apply);
    };

    const onVisibility = () => {
      pageHidden = document.hidden;
      cadranRef.current?.setActive(inView && !pageHidden);
      if (!pageHidden) schedule();
    };

    /* Tout s'arrete hors ecran et onglet cache */
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      cadranRef.current?.setActive(inView && !pageHidden);
      if (inView) schedule();
    }, { threshold: 0 });
    io.observe(zone);

    const onResize = () => { roundNumFont(); schedule(); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', schedule);
    window.addEventListener('pageshow', schedule);
    reduce.addEventListener?.('change', schedule);

    roundNumFont();
    renderDays(daysRef.current);
    apply(); /* etat correct des le montage (rechargement a mi-page, bfcache) */

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', schedule);
      window.removeEventListener('pageshow', schedule);
      reduce.removeEventListener?.('change', schedule);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <span style={{ display: 'block' }}>
                  {/* Ligne 1 */}
                  <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.15em', marginBottom: '-0.15em' }}>
                    <span className="scy-in-line">
                      L&apos;assurance temporaire
                    </span>
                  </span>
                  {/* Ligne 2 */}
                  <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.15em', marginBottom: '-0.15em' }}>
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

              {/* Grand nombre de jours (le curseur porte la valeur accessible) */}
              <div className="dx-num" ref={numRef} aria-hidden="true" style={{ transform: 'translateX(-0.5ch)' }}>
                <span className="dx-col" ref={tensRef} style={{ transform: 'translateY(0em)', opacity: 0 }}>
                  {DIGITS.map((d) => <span key={d}>{d}</span>)}
                </span>
                <span className="dx-col" ref={unitsRef} style={{ transform: `translateY(${-(INITIAL_DAYS % 10)}em)` }}>
                  {DIGITS.map((d) => <span key={d}>{d}</span>)}
                </span>
              </div>
              <p className="dx-label">Jours de couverture</p>
            </div>

            <div className="dx-controls">
            <p className="dx-date">Couvert dès aujourd&apos;hui<span ref={dateRef} /></p>

            <input
              className="dx-range"
              ref={rangeRef}
              type="range"
              min="1"
              max="90"
              step="1"
              defaultValue={INITIAL_DAYS}
              onInput={onDays}
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
