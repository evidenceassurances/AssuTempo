import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ParkingSquare, AlertTriangle, FileText, Lock,
  Tag, GraduationCap, AlertOctagon, Percent, ArrowRight, Truck,
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import CrescentMoon from './ui/CrescentMoon';

/* Hub "Guides & demarches" de la Home : vrais liens crawlables vers les
   guides qui repondent aux situations les plus cherchees. Chaque entree est
   un <a> present dans le HTML prerendu (maillage interne, ancres
   descriptives). Le carrousel et les cartes situations couvrent le reste. */
const GUIDES = [
  { Icon: ParkingSquare, label: 'Sortir un véhicule de fourrière', to: '/articles/combien-de-jours-assurance-sortir-fourriere' },
  { Icon: AlertTriangle, label: "Voiture immobilisée pour défaut d'assurance", to: '/articles/voiture-immobilisee-defaut-assurance' },
  { Icon: FileText, label: 'Carte grise en urgence : le CPI immédiat', to: '/articles/carte-grise-urgence-cpi-immediat' },
  { Icon: Lock, label: "Dossier carte grise bloqué sur l'ANTS", to: '/articles/carte-grise-ants-bloquee' },
  { Icon: Tag, label: "Prix d'une assurance auto temporaire", to: '/articles/prix-assurance-auto-temporaire' },
  { Icon: GraduationCap, label: 'Assurance temporaire jeune conducteur', to: '/articles/assurance-auto-temporaire-jeune-conducteur' },
  { Icon: AlertOctagon, label: 'Rouler sans carte grise à son nom', to: '/articles/rouler-sans-carte-grise-a-son-nom' },
  { Icon: Percent, label: 'Assurance temporaire avec malus ou résilié', to: '/articles/assurance-temporaire-malus' },
  { Icon: Truck, label: 'Assurance temporaire utilitaire et camion', to: '/assurance-temporaire-vehicule-utilitaire' },
];

export function GuidesDemarches() {
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg-2)', padding: '90px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <m.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', marginBottom: 44 }}
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
            Guides &amp; démarches
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            Les réponses concrètes aux situations les plus fréquentes.
          </p>
        </m.div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
          className="guides-grid"
        >
          {GUIDES.map((g, i) => (
            <m.div
              key={g.to}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={g.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  height: '100%',
                  padding: '16px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 14,
                  textDecoration: 'none',
                  transition: 'border-color 0.25s, background 0.25s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-border)';
                  e.currentTarget.style.background = 'var(--gold-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <g.Icon size={17} color="var(--gold)" strokeWidth={1.5} />
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  {g.label}
                </span>
              </Link>
            </m.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .guides-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .guides-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* Section courte "Apres 21h ?" : le Guichet de Nuit est le differenciant du
   site, la Home doit y mener en clair (en plus du header et du footer). */
export function ApresNuit() {
  const [ref, inView] = useScrollReveal();

  return (
    <section style={{ background: 'var(--bg)', padding: '0 24px 72px' }}>
      <m.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: 640,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          background: 'rgba(201,168,76,0.05)',
          border: '1px solid var(--gold-border)',
          borderRadius: 16,
          padding: '26px 28px',
        }}
      >
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: 40,
            height: 40,
            borderRadius: 11,
            background: 'var(--gold-dim)',
            border: '1px solid var(--gold-border)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <CrescentMoon uid="home-nuit" size={17} />
        </span>
        <div>
          <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            Après 21h ? Un dimanche ?
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.65 }}>
            Quand tout est fermé, le Guichet de Nuit reçoit votre demande de 21h à 9h
            et le dimanche toute la journée : devis dans les 30 minutes, attestation
            par email dès le paiement.
          </p>
          <Link
            to="/guichet-de-nuit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--gold)',
              textDecoration: 'none',
            }}
          >
            Découvrir le Guichet de Nuit
            <ArrowRight size={15} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </m.div>
    </section>
  );
}
