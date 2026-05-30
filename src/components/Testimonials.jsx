import { motion } from 'framer-motion';
import { fadeUp, stagger } from '../animations';

const reviews = [
  {
    stars: 5,
    text: "Assuré en 4 minutes montre en main pour l'achat de ma voiture. Attestation reçue immédiatement. Je recommande !",
    author: 'Thomas M.',
    context: 'Achat véhicule',
  },
  {
    stars: 5,
    text: "J'avais un permis étranger et aucun assureur ne voulait me couvrir. AssuTempo a résolu mon problème en quelques clics.",
    author: 'Karim B.',
    context: 'Permis étranger',
  },
  {
    stars: 5,
    text: "Parfait pour ma voiture de collection qui ne sort que l'été. Pas besoin de payer une assurance annuelle.",
    author: 'Marie L.',
    context: 'Véhicule saisonnier',
  },
];

function Stars({ count }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: '#C9A84C', fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

function TestimonialCard({ review }) {
  return (
    <motion.div
      variants={fadeUp}
      className="testimonial-card"
      style={{
        background: 'rgba(201,168,76,0.03)',
        border: '1px solid rgba(201,168,76,0.14)',
        borderRadius: 20,
        padding: '36px 32px',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(201,168,76,0.1)';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.14)';
      }}
    >
      <Stars count={review.stars} />

      <p
        style={{
          fontSize: 15,
          color: '#ffffff',
          lineHeight: 1.75,
          fontStyle: 'italic',
          flex: 1,
          marginBottom: 28,
        }}
      >
        "{review.text}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(201,168,76,0.12)',
            border: '1px solid var(--gold-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: 'var(--gold)',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {review.author[0]}
        </div>
        <div>
          <p style={{ fontSize: 13, color: '#888', fontStyle: 'italic' }}>
            — {review.author}
          </p>
          <p style={{ fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>
            {review.context}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Testimonials() {
  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: '110px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(201,168,76,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 16,
            }}
          >
            AVIS CLIENTS VÉRIFIÉS
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
            }}
          >
            Ils nous ont fait confiance
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
          className="testimonials-grid"
        >
          {reviews.map((review) => (
            <TestimonialCard key={review.author} review={review} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

export default Testimonials;
