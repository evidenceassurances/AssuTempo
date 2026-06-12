import { m } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Zap, Globe, Check } from 'lucide-react';
import TempoDial from './TempoDial';
import { EASE_PREMIUM } from '../lib/motion';

const lineContainerVar = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const lineVar = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 0.8, ease: EASE_PREMIUM } },
};

function Hero() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const skip = prefersReducedMotion;

  return (
    <section
      className="home-hero"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <TempoDial />

      {/* Halo d'ambiance dore */}
      <div aria-hidden className="halo-gold" style={{ zIndex: 1 }} />
      {/* Vignette douce vers les bords */}
      <div aria-hidden className="hero-vignette" style={{ zIndex: 1 }} />

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
        <m.div
          initial={skip ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={skip ? { duration: 0 } : { duration: 0.6, ease: EASE_PREMIUM }}
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
        </m.div>
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
            <m.span
              variants={lineContainerVar}
              initial={skip ? false : 'hidden'}
              animate="show"
              style={{ display: 'block' }}
            >
              {/* Ligne 1 */}
              <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.15em', marginBottom: '-0.15em' }}>
                <m.span variants={lineVar} style={{ display: 'block' }}>
                  L&apos;assurance temporaire
                </m.span>
              </span>
              {/* Ligne 2 */}
              <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '0.15em', marginBottom: '-0.15em' }}>
                <m.span variants={lineVar} style={{ display: 'block' }}>
                  qui change{' '}
                  <span className="gold-text-animated">tout.</span>
                </m.span>
              </span>
            </m.span>
          </h1>

          {/* Sous-titre */}
          <m.p
            initial={skip ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={skip ? { duration: 0 } : { duration: 0.6, delay: 0.55, ease: EASE_PREMIUM }}
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
          </m.p>

          {/* CTAs */}
          <m.div
            initial={skip ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={skip ? { duration: 0 } : { duration: 0.6, delay: 0.7, ease: EASE_PREMIUM }}
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
              onClick={() => navigate('/tarification')}
              style={{ padding: '14px 28px', fontSize: 16 }}
            >
              Obtenir mon devis
            </button>
            <button
              className="btn-glass"
              onClick={() => navigate('/tarification')}
              style={{ fontSize: 16 }}
            >
              Voir les tarifs
            </button>
          </m.div>

          {/* Ligne de confiance */}
          <m.p
            initial={skip ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={skip ? { duration: 0 } : { duration: 0.6, delay: 0.85, ease: EASE_PREMIUM }}
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
          </m.p>

        </div>
      </div>

      {/* Espace bas */}
      <div className="home-hero-spacer" style={{ flexShrink: 0, height: 64 }} />

      {/* Indicateur scroll */}
      <m.div
        initial={skip ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={skip ? { duration: 0 } : { delay: 1.4, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          animation: 'bounce-scroll 1.8s ease-in-out infinite',
          color: 'var(--text-subtle)',
          zIndex: 2,
        }}
      >
        <ChevronDown size={22} />
      </m.div>

      {/* Fondu vers la section suivante */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: 'linear-gradient(to bottom, transparent, var(--bg-2))',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </section>
  );
}

export default Hero;
