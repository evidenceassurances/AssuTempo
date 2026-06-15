import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, ScanLine, FileText, Download,
  ShieldCheck, PenLine, FileCheck, Coins,
} from 'lucide-react';
import Footer from '../components/Footer';
import { fadeUp } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* Lien prescripteur Certimat (AssuCarteGrise). Le parametre partner=1153
   assure l'attribution et la commission : ne jamais le retirer ni le modifier.
   Toujours ouvert dans un nouvel onglet. */
const CERTIMAT_URL = 'https://certimat.fr/prescripteurs?partner=1153';

/* ── CTA Certimat reutilisable : bouton or plein + event GA4 ──────────────── */
function CtaCertimat({ children, style }) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'clic_carte_grise');
    }
  };
  return (
    <a
      href={CERTIMAT_URL}
      target="_blank"
      rel="noopener"
      onClick={handleClick}
      className="btn-gold"
      style={{
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        ...style,
      }}
    >
      {children}
      <ArrowRight size={16} strokeWidth={2} />
    </a>
  );
}

/* ── Etapes 01 / 02 / 03 ──────────────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    Icon: ScanLine,
    title: 'Identifiez votre véhicule',
    body: 'Saisissez la plaque, le coût des taxes est calculé automatiquement.',
  },
  {
    num: '02',
    Icon: FileText,
    title: 'Complétez votre dossier',
    body: 'Informations et justificatifs en ligne, CERFA préremplis automatiquement.',
  },
  {
    num: '03',
    Icon: Download,
    title: 'Recevez votre carte grise',
    body: 'Certificat provisoire immédiat, carte grise définitive envoyée à domicile.',
  },
];

/* ── Atouts Certimat ──────────────────────────────────────────────────────── */
const ATOUTS = [
  {
    Icon: ShieldCheck,
    title: 'Service habilité',
    body: "Habilité par le Ministère de l'Intérieur, partenaire France Titres.",
  },
  {
    Icon: PenLine,
    title: 'Dossier dématérialisé',
    body: 'CERFA préremplis et signature électronique, sans déplacement.',
  },
  {
    Icon: FileCheck,
    title: 'Certificat provisoire',
    body: "Certificat provisoire d'immatriculation disponible immédiatement.",
  },
  {
    Icon: Coins,
    title: 'Paiement échelonné',
    body: 'Paiement des taxes en plusieurs fois.',
  },
];

const EASE = [0.22, 1, 0.36, 1];

function CarteGrise() {
  const [stepsRef, stepsInView]   = useScrollReveal();
  const [atoutsRef, atoutsInView] = useScrollReveal();

  return (
    <>
      <Helmet>
        <title>Carte grise en ligne sans déplacement | AssuTempo</title>
        <meta name="description" content="Faites votre carte grise en ligne avec notre partenaire agréé : plaque, CERFA préremplis, certificat provisoire immédiat et carte grise envoyée à domicile." />
        <link rel="canonical" href="https://assutempo.fr/carte-grise" />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        paddingTop: 160,
        paddingBottom: 80,
        textAlign: 'center',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)',
        }} />
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', zIndex: 2, padding: '0 24px' }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            DÉMARCHE CARTE GRISE
          </p>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 60px)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: 20,
            letterSpacing: '-0.03em',
          }}>
            Votre carte grise en ligne, sans déplacement
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: 600,
            margin: '0 auto 36px',
            lineHeight: 1.75,
          }}>
            Vous venez d&apos;acheter un véhicule ? Faites-le immatriculer en quelques
            minutes avec notre partenaire agréé, et roulez en règle dès le premier jour.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <CtaCertimat style={{ padding: '14px 28px', fontSize: 15 }}>
              Faire ma carte grise
            </CtaCertimat>
            <a
              href="tel:0974197820"
              className="btn-glass"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                fontSize: 15,
              }}
            >
              <Phone size={16} strokeWidth={1.5} />
              Nous appeler
            </a>
          </div>
        </m.div>
      </section>

      {/* ── Comment ca marche ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '100px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
          <m.div
            ref={stepsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}>
              Comment ça marche
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
              Trois étapes, entièrement en ligne.
            </p>
          </m.div>

          <div className="cg-steps" style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            {STEPS.map((step, i) => (
              <m.div
                key={step.num}
                className="cg-step"
                initial={{ opacity: 0, y: 40 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: EASE }}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0 16px',
                }}
              >
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  letterSpacing: '0.15em',
                  marginBottom: 24,
                }}>
                  {step.num}
                </div>
                <div style={{
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
                }}>
                  <step.Icon size={24} color="var(--gold)" strokeWidth={1.5} />
                </div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: '0 0 10px',
                  letterSpacing: '-0.01em',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: 15,
                  color: 'var(--text-muted)',
                  margin: 0,
                  lineHeight: 1.65,
                  maxWidth: 260,
                }}>
                  {step.body}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pourquoi Certimat ────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '100px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
          <m.div
            ref={atoutsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={atoutsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
              POURQUOI CERTIMAT
            </p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}>
              Un partenaire agréé et sécurisé
            </h2>
          </m.div>

          <div className="cg-atouts" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {ATOUTS.map((item, i) => (
              <m.div
                key={item.title}
                className="card-jewel"
                initial={{ opacity: 0, y: 30 }}
                animate={atoutsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                style={{
                  padding: '28px 22px',
                  background: 'var(--glass)',
                  borderRadius: 20,
                  cursor: 'default',
                }}
                whileHover={{ y: -4, transition: { duration: 0.25, ease: EASE } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.15, ease: EASE } }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'var(--gold-glow)',
                  border: '1px solid var(--gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 18,
                }}>
                  <item.Icon size={22} color="var(--gold)" strokeWidth={1.5} />
                </div>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: 'var(--text)',
                  margin: '0 0 8px',
                  letterSpacing: '-0.01em',
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  {item.body}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bloc d'action Certimat ───────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '40px 0 100px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              textAlign: 'center',
              background: 'var(--gold-glow)',
              border: '1px solid var(--gold-border)',
              borderRadius: 24,
              padding: '48px 32px',
            }}
          >
            <h2 style={{
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--text)',
              margin: '0 0 24px',
              letterSpacing: '-0.02em',
            }}>
              Prêt à faire votre carte grise ?
            </h2>
            <CtaCertimat style={{ padding: '15px 32px', fontSize: 16 }}>
              Démarrer ma demande de carte grise
            </CtaCertimat>
            <p style={{ fontSize: 13, color: 'var(--text-subtle)', margin: '18px 0 0', lineHeight: 1.6 }}>
              Service fourni par notre partenaire Certimat (AssuCarteGrise).
            </p>
          </m.div>
        </div>
      </section>

      {/* ── Cross-sell assurance ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '0 0 100px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 20,
              padding: '32px 36px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ maxWidth: 540 }}>
              <h2 style={{
                fontSize: 'clamp(1.2rem, 2.6vw, 1.6rem)',
                fontWeight: 700,
                color: 'var(--text)',
                margin: '0 0 10px',
                letterSpacing: '-0.02em',
              }}>
                Pas encore assuré ? Roulez couvert dès aujourd&apos;hui.
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
                Attestation immédiate, de 1 à 90 jours, valable dans 34 pays.
              </p>
            </div>
            <Link
              to="/tarification"
              className="btn-gold"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              Obtenir mon devis
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </m.div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .cg-atouts { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .cg-steps { flex-direction: column !important; align-items: center !important; gap: 48px !important; }
          .cg-step { width: 100% !important; max-width: 340px !important; }
        }
        @media (max-width: 560px) {
          .cg-atouts { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

export default CarteGrise;
