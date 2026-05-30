import { motion } from 'framer-motion';
import { Shield, Globe, Zap } from 'lucide-react';
import { fadeUp, stagger } from '../animations';

const cards = [
  {
    Icon: Shield,
    title: 'Certifié sans surprise',
    text: "Prix fixe à l'euro près. Aucun frais caché, aucune mauvaise surprise. Ce que vous voyez est ce que vous payez.",
  },
  {
    Icon: Globe,
    title: 'Assistance partout en Europe',
    text: 'Couverts en cas de panne ou accident dans 34 pays européens dès le premier jour de votre contrat.',
  },
  {
    Icon: Zap,
    title: 'Attestation en 5 minutes',
    text: 'Souscription 100% en ligne, disponible 24h/24 et 7j/7. Votre attestation téléchargeable immédiatement après paiement.',
  },
];

function Advantages() {
  return (
    <section
      id="avantages"
      style={{
        background: 'var(--bg)',
        padding: '120px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Fond radial bas de section */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(201,168,76,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            POURQUOI ASSUTEMPO
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: '#fff', marginBottom: 20 }}>
            Certifié sans surprise, à chaque fois
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Chaque option est pensée pour offrir une expérience haut de gamme, sans complexité et sans compromis.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
          className="adv-grid"
        >
          {cards.map(({ Icon, title, text }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="card-glass"
              style={{ padding: 40 }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid var(--gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 28,
                }}
              >
                <Icon size={26} style={{ color: 'var(--gold)' }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 14 }}>{title}</h3>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7 }}>{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .adv-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default Advantages;
