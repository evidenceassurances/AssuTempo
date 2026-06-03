import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const STATUS = {
  ok: { color: '#7E9B79', Icon: CheckCircle2, label: 'Couvert' },
  vigilance: { color: '#C98A3C', Icon: AlertTriangle, label: 'À sécuriser' },
};

const GOLD = 'rgba(201,168,76,0.35)';
const EASE = [0.22, 1, 0.36, 1];

function DecisionSplit({ question, voies, ariaLabel }) {
  const reduce = useReducedMotion();

  return (
    <div role="img" aria-label={ariaLabel} style={{ margin: '32px 0' }}>

      {/* ── Question centrale ── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={reduce ? false : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -40px 0px' }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <div
          style={{
            padding: '12px 28px',
            background: 'var(--gold-glow)',
            border: '1px solid var(--gold-border)',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text)',
            textAlign: 'center',
            maxWidth: 440,
          }}
        >
          {question}
        </div>
      </motion.div>

      {/* ── Connecteur fourche (masqué sur mobile) ── */}
      <div aria-hidden="true" className="ds-fork" style={{ height: 28, position: 'relative' }}>
        {/* Tige verticale centrale */}
        <div style={{
          position: 'absolute', left: '50%', top: 0,
          width: 1, height: 14, background: GOLD,
          transform: 'translateX(-0.5px)',
        }} />
        {/* Barre horizontale */}
        <div style={{
          position: 'absolute', left: '25%', right: '25%', top: 14,
          height: 1, background: GOLD,
        }} />
        {/* Branche gauche */}
        <div style={{
          position: 'absolute', left: '25%', top: 14,
          width: 1, height: 14, background: GOLD,
          transform: 'translateX(-0.5px)',
        }} />
        {/* Branche droite */}
        <div style={{
          position: 'absolute', right: '25%', top: 14,
          width: 1, height: 14, background: GOLD,
          transform: 'translateX(0.5px)',
        }} />
      </div>

      {/* ── Cartes ── */}
      <div className="ds-cards" style={{ display: 'flex', gap: 14 }}>
        {voies.map((voie, i) => {
          const cfg = STATUS[voie.statut];
          const Icon = voie.icon;
          const StatusIcon = cfg.Icon;
          const c = cfg.color;

          return (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={reduce ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1, ease: EASE }}
              style={{
                flex: 1,
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderTop: `3px solid ${c}55`,
                borderRadius: 14,
                padding: '20px 18px',
              }}
            >
              {/* Icône + badge statut */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14, gap: 8,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: `${c}18`, border: `1px solid ${c}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={20} color={c} strokeWidth={1.5} />
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px',
                  background: `${c}18`, border: `1px solid ${c}44`,
                  borderRadius: 999,
                  fontSize: 10, fontWeight: 700,
                  color: c,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  whiteSpace: 'nowrap',
                }}>
                  <StatusIcon size={10} strokeWidth={2.5} />
                  {cfg.label}
                </span>
              </div>

              {/* Titre cas */}
              <p style={{
                fontSize: 13, fontWeight: 700, color: 'var(--text)',
                margin: '0 0 8px', lineHeight: 1.35, letterSpacing: '-0.01em',
              }}>
                {voie.titre}
              </p>

              {/* Verdict */}
              <p style={{
                fontSize: 13, color: 'var(--text-muted)',
                margin: 0, lineHeight: 1.7,
              }}>
                {voie.verdict}
              </p>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 540px) {
          .ds-fork   { display: none; }
          .ds-cards  { flex-direction: column !important; gap: 10px !important; }
        }
      `}</style>
    </div>
  );
}

export default DecisionSplit;
