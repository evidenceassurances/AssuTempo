import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import TempoDial from './TempoDial';

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
      <div className="home-hero-spacer" style={{ flexShrink: 0, height: 64 }} />

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


export default Hero;
