import { m } from 'framer-motion';
import { FileText, CreditCard, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fadeUp } from '../animations';

const steps = [
  {
    num: '01',
    Icon: FileText,
    title: 'Renseignez votre véhicule',
    text: 'Immatriculation, type de véhicule, durée souhaitée. 2 minutes maximum.',
  },
  {
    num: '02',
    Icon: CreditCard,
    title: 'Choisissez et payez',
    text: 'Carte bancaire uniquement. Paiement 100% sécurisé. Aucun frais caché.',
  },
  {
    num: '03',
    Icon: Download,
    title: 'Téléchargez votre attestation',
    text: 'Disponible immédiatement après paiement. Valable dans 34 pays européens.',
  },
];

const stepVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Step({ step, index }) {
  const { num, Icon, title, text } = step;
  return (
    <m.div
      custom={index}
      variants={stepVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{
        padding: '32px 28px 28px',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Numéro au-dessus de la ligne */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.15em',
          marginBottom: 12,
        }}
      >
        {num}
      </p>

      {/* Ligne fine dorée */}
      <div
        style={{
          width: 32,
          height: 2,
          background: 'var(--gold)',
          marginBottom: 16,
          borderRadius: 2,
        }}
      />

      {/* Icône */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: 'rgba(201,168,76,0.08)',
          border: '1px solid var(--gold-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
        }}
      >
        <Icon size={24} style={{ color: 'var(--gold)' }} />
      </div>

      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#fff',
          marginBottom: 12,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75 }}>{text}</p>
    </m.div>
  );
}

const Arrow = () => (
  <div
    className="how-arrow"
    style={{
      display: 'flex',
      alignItems: 'center',
      color: 'var(--gold)',
      opacity: 0.5,
      fontSize: 28,
      flexShrink: 0,
      paddingTop: 28,
    }}
  >
    →
  </div>
);

function HowItWorks() {
  const navigate = useNavigate();
  return (
    <section
      style={{
        background: '#0D0D0D',
        padding: '110px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Orbe doré centre */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 700,
          height: 400,
          background:
            'radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
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
        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          style={{ textAlign: 'center', marginBottom: 72 }}
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
            LE PROCESSUS LE PLUS SIMPLE DU MARCHÉ
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
            }}
          >
            Assuré en 3 étapes
          </h2>
        </m.div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 0,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 20,
            overflow: 'hidden',
          }}
          className="how-row"
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flex: i < steps.length - 1 ? '1 1 0' : '1 1 0',
                minWidth: 0,
              }}
            >
              <Step step={step} index={i} />
              {i < steps.length - 1 && <Arrow />}
            </div>
          ))}
        </div>

        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginTop: 48 }}
        >
          <button
            className="btn-gold"
            onClick={() => navigate('/tarification')}
            style={{ fontSize: 15, padding: '16px 40px' }}
          >
            Commencer maintenant →
          </button>
        </m.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .how-row { flex-direction: column !important; }
          .how-arrow { display: none !important; }
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;
