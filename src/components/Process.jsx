import { m, useInView } from 'framer-motion';
import { Search, FileText, Download } from 'lucide-react';
import { useRef } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const steps = [
  {
    num: '01',
    Icon: Search,
    title: 'Choisissez votre durée',
    body: 'De 1 à 90 jours, au jour près, selon votre besoin.',
  },
  {
    num: '02',
    Icon: FileText,
    title: 'Renseignez votre véhicule',
    body: "Permis, carte grise, carte bancaire. Aucun relevé d'information exigé.",
  },
  {
    num: '03',
    Icon: Download,
    title: 'Recevez votre attestation',
    body: "Paiement sécurisé. Votre Mémo Véhicule Assuré et votre carte internationale d'assurance automobile (valable dans les 34 pays cités) sont disponibles immédiatement en téléchargement.",
  },
];

function ProcessStep({ step, index, inView }) {
  return (
    <m.div
      className="process-step"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 16px',
      }}
    >
      {/* Numéro - flux normal, jamais en position absolute */}
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--gold)',
          letterSpacing: '0.15em',
          marginBottom: 24,
        }}
      >
        {step.num}
      </div>

      {/* Icône */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'var(--gold-glow)',
          border: '1px solid var(--gold-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          flexShrink: 0,
        }}
      >
        <step.Icon size={24} color="var(--gold)" strokeWidth={1.5} />
      </div>

      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 10px',
          letterSpacing: '-0.01em',
        }}
      >
        {step.title}
      </h3>
      <p
        style={{
          fontSize: 15,
          color: 'var(--text-muted)',
          margin: 0,
          lineHeight: 1.65,
          maxWidth: 240,
        }}
      >
        {step.body}
      </p>
    </m.div>
  );
}

/* Ligne de connexion - uniquement desktop */
function ConnectingLine({ inView }) {
  return (
    <div
      className="process-line"
      style={{
        position: 'absolute',
        top: 142,
        left: '20%',
        right: '20%',
        height: 1,
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox="0 0 100 1"
        preserveAspectRatio="none"
        style={{ width: '100%', height: 1, display: 'block', overflow: 'visible' }}
      >
        <m.line
          x1="0"
          y1="0.5"
          x2="100"
          y2="0.5"
          stroke="var(--gold)"
          strokeWidth="0.5"
          opacity="0.4"
          strokeDasharray="100"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function Process() {
  const [headRef, headInView] = useScrollReveal();
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-60px 0px' });

  return (
    <section style={{ background: 'var(--bg)', padding: '100px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <m.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}
          >
            Assuré en 3 étapes
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            Simple, rapide, sans paperasse.
          </p>
        </m.div>

        {/* Conteneur des étapes */}
        <div
          ref={stepsRef}
          className="process-steps"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          <ConnectingLine inView={stepsInView} />
          {steps.map((step, i) => (
            <ProcessStep key={step.num} step={step} index={i} inView={stepsInView} />
          ))}
        </div>
      </div>

      <style>{`
        /* ── Desktop : inchangé ── */

        /* ── Mobile : colonne propre, centrée, espacée ── */
        @media (max-width: 768px) {
          .process-steps {
            flex-direction: column !important;
            align-items: center !important;
            gap: 0 !important;
          }
          .process-step {
            width: 100% !important;
            max-width: 340px !important;
            padding: 0 8px !important;
            margin-bottom: 56px !important;
          }
          .process-step:last-child {
            margin-bottom: 0 !important;
          }
          .process-line {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default Process;
