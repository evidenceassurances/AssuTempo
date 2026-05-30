import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const line1Words = 'Vous avez besoin d\'une assurance maintenant.'.split(' ');
const line2Words = 'AssuTempo. En 5 minutes. Sans paperasse.'.split(' ');

const wordVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerLine = (delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
});

function WordByWord({ words, delay }) {
  return (
    <motion.span
      variants={staggerLine(delay)}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariant}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

function Hero() {
  const [showCTA, setShowCTA] = useState(false);

  // line1 takes ~(words * 0.1 + 0.5)s ≈ 1.8s, then pause 0.8s
  // line2 starts at 1.8+0.8=2.6s, takes ~1.6s → CTA at ~4.5s
  useEffect(() => {
    const t = setTimeout(() => setShowCTA(true), 4500);
    return () => clearTimeout(t);
  }, []);

  const scrollToHow = () => {
    const el = document.getElementById('comment-ca-marche');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else {
      const adv = document.getElementById('avantages');
      if (adv) adv.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 120,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Texte géant cinématique */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          fontSize: '20vw',
          fontWeight: 900,
          color: '#ffffff',
          opacity: 0.03,
          whiteSpace: 'nowrap',
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        ASSURÉ
      </span>

      {/* Fond radial doré */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,168,76,0.12) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      {/* Orbe haut centre */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Grille de points */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(201,168,76,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          opacity: 0.35,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Scanline bas */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'scanline 4s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* TEMPS 1 — L'urgence */}
        <h1
          style={{
            fontSize: 'clamp(30px, 5vw, 62px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'var(--text-muted)',
            marginBottom: 8,
          }}
        >
          <WordByWord words={line1Words} delay={0.3} />
        </h1>

        {/* TEMPS 2 — La solution */}
        <h2
          style={{
            fontSize: 'clamp(30px, 5vw, 62px)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: '#fff',
            marginBottom: 0,
          }}
        >
          <WordByWord words={line2Words} delay={2.6} />
        </h2>

        {/* TEMPS 3 — L'action */}
        <AnimatePresence>
          {showCTA && (
            <>
              {/* Badge EN LIGNE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ marginTop: 40, marginBottom: 36 }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'var(--gold-bg)',
                    border: '1px solid var(--gold-border)',
                    borderRadius: 999,
                    padding: '8px 20px',
                    fontSize: 12,
                    letterSpacing: '0.12em',
                    color: 'var(--gold)',
                    textTransform: 'uppercase',
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: 'var(--gold)',
                      animation: 'pulse-dot 2s infinite',
                      flexShrink: 0,
                    }}
                  />
                  EN LIGNE MAINTENANT
                </div>
              </motion.div>

              {/* Boutons */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 16,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    className="btn-gold"
                    onClick={() =>
                      window.open('https://assutempo.fr/tarification', '_blank')
                    }
                    style={{ fontSize: 16, padding: '18px 40px', fontWeight: 700 }}
                  >
                    Obtenir mon devis gratuit →
                  </button>
                  <button
                    className="btn-outline-gold"
                    onClick={scrollToHow}
                    style={{ fontSize: 15, padding: '18px 32px' }}
                  >
                    Comment ça marche ?
                  </button>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  ⚡ Résultat en 30 secondes • Sans inscription
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Hero;
