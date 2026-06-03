import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const words1 = ['L\'assurance', 'temporaire'];
const words2 = ['qui', 'change', 'tout.'];

const wordVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <GoldenRing />

      {/* ── HAUT : Badge ── */}
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
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(8,7,6,0.82)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
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
        </motion.div>
      </div>

      {/* ── MILIEU : Titre + Sous-titre + CTAs ── */}
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

          {/* H1 */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: '0 0 24px',
              color: 'var(--text)',
            }}
          >
            <motion.span
              style={{ display: 'block' }}
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } } }}
            >
              {words1.map((w, i) => (
                <motion.span
                  key={i}
                  variants={wordVariant}
                  style={{ display: 'inline-block', marginRight: '0.3em' }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.span>

            <motion.span
              style={{ display: 'block' }}
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.38 } } }}
            >
              {words2.map((w, i) => (
                <motion.span
                  key={i}
                  variants={wordVariant}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.3em',
                    background: i === words2.length - 1
                      ? 'linear-gradient(135deg, var(--gold), var(--gold-light))'
                      : 'none',
                    WebkitBackgroundClip: i === words2.length - 1 ? 'text' : 'unset',
                    WebkitTextFillColor: i === words2.length - 1 ? 'transparent' : 'var(--text)',
                    backgroundClip: i === words2.length - 1 ? 'text' : 'unset',
                  }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.span>
          </h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
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
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
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
          </motion.div>

          {/* Ligne de confiance - discrète, secondaire, pas de conteneur */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.05 }}
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
            <span style={{ color: 'var(--gold)', opacity: 0.85 }}>⚡</span>
            <span>Attestation immédiate</span>
            <span style={{ color: 'var(--text-subtle)', margin: '0 5px' }}>·</span>
            <span style={{ color: 'var(--gold)', opacity: 0.85 }}>🌍</span>
            <span>34 pays couverts</span>
            <span style={{ color: 'var(--text-subtle)', margin: '0 5px' }}>·</span>
            <span style={{ color: 'var(--gold)', opacity: 0.85 }}>✓</span>
            <span>Prix fixe, zéro surprise</span>
          </motion.p>

        </div>
      </div>

      {/* ── BAS : Espace bas + chevron ── */}
      <div style={{ flexShrink: 0, height: 64 }} />

      {/* Indicateur scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
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
      </motion.div>

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

/* Anneau lumineux doré - pièce maîtresse (aria-hidden, décoratif) */
function GoldenRing() {
  return (
    <>
      <div
        aria-hidden
        className="golden-ring-outer"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        {/* Halo flou */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 440,
            height: 440,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)',
            animation: 'halo-pulse 6s ease-in-out infinite',
            willChange: 'transform',
          }}
        />

        {/* Anneau principal - 520×520 rendu, viewBox 700×700 conservé */}
        <svg
          width="520"
          height="520"
          viewBox="0 0 700 700"
          style={{
            display: 'block',
            animation: 'rotate-slow 40s linear infinite',
            willChange: 'transform',
          }}
        >
          <defs>
            <linearGradient id="ring-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--gold-deep)" />
              <stop offset="50%" stopColor="var(--gold-light)" />
              <stop offset="100%" stopColor="var(--gold-deep)" />
            </linearGradient>
          </defs>
          <circle
            cx="350"
            cy="350"
            r="340"
            fill="none"
            stroke="url(#ring-grad-1)"
            strokeWidth="1.5"
            opacity="0.5"
            strokeDasharray="60 24"
          />
        </svg>

        {/* Second anneau concentrique */}
        <svg
          width="520"
          height="520"
          viewBox="0 0 700 700"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'block',
            animation: 'rotate-slow-reverse 60s linear infinite',
            willChange: 'transform',
          }}
        >
          <defs>
            <linearGradient id="ring-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--gold-deep)" />
              <stop offset="100%" stopColor="var(--gold)" />
            </linearGradient>
          </defs>
          <circle
            cx="350"
            cy="350"
            r="290"
            fill="none"
            stroke="url(#ring-grad-2)"
            strokeWidth="1"
            opacity="0.25"
            strokeDasharray="40 30"
          />
        </svg>
      </div>

      <style>{`
        .golden-ring-outer {
          transform: translate(-50%, -50%);
        }
        @media (max-height: 800px) {
          .golden-ring-outer {
            transform: translate(-50%, -50%) scale(0.8);
          }
        }
        @media (max-height: 680px) {
          .golden-ring-outer {
            transform: translate(-50%, -50%) scale(0.62);
          }
        }
        @media (max-width: 480px) {
          .golden-ring-outer {
            transform: translate(-50%, -50%) scale(0.68);
          }
        }
        @media (max-width: 480px) and (max-height: 700px) {
          .golden-ring-outer {
            transform: translate(-50%, -50%) scale(0.52);
          }
        }
      `}</style>
    </>
  );
}

export default Hero;
