import { motion } from 'framer-motion';
import { fadeUp } from '../animations';

function Pricing() {
  return (
    <div
      style={{
        background: 'var(--bg)',
        minHeight: '100vh',
        paddingTop: 100,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Orbe haut */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto', paddingLeft: 24, paddingRight: 24, position: 'relative', zIndex: 1 }}>

        {/* Header SEO */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            SOUSCRIPTION EN LIGNE
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 24 }}>
            Tarification — Assurance Temporaire en Ligne
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '0 24px 40px', lineHeight: 1.75 }}>
            Obtenez votre devis d'assurance temporaire instantanément. De 1 à 90 jours, pour particuliers et professionnels. Souscription 100% en ligne, attestation immédiate.
            <br /><br />
            Besoin d'aide ? Appelez-nous au{' '}
            <a href="tel:0974197820" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
              09 74 19 78 20
            </a>
            {' '}du lundi au vendredi de 9h à 21h et le samedi de 9h à 20h.
          </p>
        </motion.div>

        {/* Wrapper iframe */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--gold-border)',
            borderRadius: 8,
            overflow: 'hidden',
            maxWidth: 1100,
            width: '95%',
            margin: '0 auto',
            padding: 0,
          }}
        >
          <iframe
            src="https://www.jlassure.com/sousfiche/assure_tempo_rapide_mb.php?cat=&&tip=09.74.19.78.20&&id=1323&&cd=13ELA322&&adrsite=https://assutempo.fr/"
            width="100%"
            height="1400"
            frameBorder="0"
            title="Souscription assurance temporaire AssuTempo"
            style={{ display: 'block', border: 'none', borderRadius: 0 }}
          />
        </motion.div>

        {/* Card aide */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          style={{
            maxWidth: 700,
            margin: '48px auto 0',
            background: 'rgba(201,168,76,0.04)',
            border: '1px solid var(--gold-border)',
            borderRadius: 16,
            backdropFilter: 'blur(10px)',
            padding: '40px 32px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 12 }}>
            Besoin d'aide pour votre souscription ?
          </h3>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
            Notre équipe est disponible pour vous accompagner dans votre démarche.
          </p>
          <a
            href="tel:0974197820"
            style={{ fontSize: 24, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none', display: 'block', marginBottom: 12 }}
          >
            📞 09 74 19 78 20
          </a>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Lun–Ven 9h–21h | Sam 9h–20h
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Pricing;
