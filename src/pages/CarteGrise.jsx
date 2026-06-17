import { useState, useEffect, useRef } from 'react';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, ShieldCheck, BadgeCheck, FileCheck, CreditCard,
  Car, FileText, Home, Lock,
} from 'lucide-react';
import Footer from '../components/Footer';
import AccordionItem from '../components/ui/AccordionItem';
import { fadeUp, stagger } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* Iframe prescripteur officielle Certimat (AssuCarteGrise), desormais autorisee
   sur notre domaine. Le parametre partner=1153 assure l'attribution et la
   commission : ne jamais le retirer ni le modifier. */
const CERTIMAT_IFRAME_URL = 'https://certimat.fr/iframe/prescripteurs?partner=1153';
const CERTIMAT_ORIGIN = 'https://certimat.fr';

const EASE = [0.22, 1, 0.36, 1];

/* ── Bande de confiance ───────────────────────────────────────────────────── */
const BADGES = [
  { Icon: ShieldCheck, title: "Habilité par le Ministère de l'Intérieur" },
  { Icon: BadgeCheck, title: 'Partenaire France Titres' },
  { Icon: FileCheck, title: 'CERFA préremplis et signature électronique' },
  { Icon: CreditCard, title: 'Paiement des taxes en plusieurs fois' },
];

/* ── Comment ca marche : 3 etapes ─────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    Icon: Car,
    title: 'Identifiez votre véhicule',
    body: 'Saisissez votre plaque, le coût des taxes se calcule automatiquement.',
  },
  {
    num: '02',
    Icon: FileText,
    title: 'Complétez votre dossier',
    body: 'Vos informations et justificatifs en ligne, vos CERFA sont préremplis.',
  },
  {
    num: '03',
    Icon: Home,
    title: 'Recevez votre carte grise',
    body: 'Certificat provisoire immédiat, carte grise définitive livrée à domicile.',
  },
];

/* ── Micro-confiance du hero ──────────────────────────────────────────────── */
const MICRO = [
  { Icon: ShieldCheck, label: "Habilité Ministère de l'Intérieur" },
  { Icon: BadgeCheck, label: 'Partenaire France Titres' },
  { Icon: Lock, label: 'Paiement sécurisé' },
];

/* ── FAQ ──────────────────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: 'Quels documents faut-il pour ma carte grise ?',
    a: "En général, votre pièce d'identité, un justificatif de domicile, le certificat de cession ou l'ancienne carte grise, et le contrôle technique en cours de validité s'il est requis. Le formulaire vous indique précisément les pièces à fournir.",
  },
  {
    q: 'Combien de temps pour recevoir ma carte grise ?',
    a: "Vous obtenez un certificat provisoire d'immatriculation immédiatement, qui vous autorise à circuler. La carte grise définitive est ensuite envoyée chez vous par voie postale sécurisée.",
  },
  {
    q: 'Puis-je rouler en attendant ?',
    a: "Oui. Le certificat provisoire d'immatriculation vous permet de circuler en France le temps de recevoir votre titre définitif.",
  },
  {
    q: 'Puis-je payer en plusieurs fois ?',
    a: 'Oui, le règlement des taxes peut être échelonné en plusieurs fois lors de votre demande.',
  },
  {
    q: 'Le service est-il officiel ?',
    a: "Oui. Le service est habilité par le Ministère de l'Intérieur et partenaire de France Titres pour le traitement des demandes d'immatriculation.",
  },
];

function CarteGrise() {
  const [stepsRef, stepsInView] = useScrollReveal();
  const [badgesRef, badgesInView] = useScrollReveal();
  const [openIndex, setOpenIndex] = useState(0);

  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(null);

  /* CTA hero : defilement doux vers le module + event GA4 */
  const handleStartClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'clic_carte_grise');
    }
    if (typeof document !== 'undefined') {
      const target = document.getElementById('demande');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /* Event GA4 au chargement de l'iframe */
  const handleIframeLoad = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'carte_grise_view');
    }
  };

  /* Auto-redimensionnement defensif : on n'accepte que les messages de Certimat */
  useEffect(() => {
    function onMessage(event) {
      if (event.origin !== CERTIMAT_ORIGIN) return;
      const data = event.data;
      let height;
      if (data && typeof data === 'object') {
        if (typeof data.height === 'number') height = data.height;
        else if (typeof data.frameHeight === 'number') height = data.frameHeight;
      } else if (typeof data === 'number') {
        height = data;
      }
      if (height && height > 0) setIframeHeight(height);
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <>
      <Helmet>
        <title>Carte grise en ligne, certificat provisoire immédiat | AssuTempo</title>
        <meta name="description" content="Faites votre carte grise 100% en ligne avec notre partenaire agréé, habilité par le Ministère de l'Intérieur : CERFA préremplis, certificat provisoire immédiat et carte grise livrée chez vous." />
        <link rel="canonical" href="https://assutempo.fr/carte-grise" />
      </Helmet>

      {/* ── A. Hero ──────────────────────────────────────────────────────── */}
      <section style={{
        paddingTop: 170,
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
          background: 'radial-gradient(ellipse 60% 42% at 50% 0%, rgba(232,201,122,0.12) 0%, rgba(201,168,76,0.06) 35%, transparent 64%)',
        }} />
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', zIndex: 2, padding: '0 24px' }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>
            CARTE GRISE EN LIGNE
          </p>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 60px)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: 22,
            letterSpacing: '-0.03em',
          }}>
            Votre carte grise en ligne, sans la paperasse
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: 620,
            margin: '0 auto 28px',
            lineHeight: 1.75,
          }}>
            Service habilité par le Ministère de l'Intérieur. Démarche 100% en ligne,
            certificat provisoire immédiat, et votre carte grise livrée chez vous.
          </p>

          {/* Micro-confiance */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px 22px',
            marginBottom: 38,
          }}>
            {MICRO.map(({ Icon, label }) => (
              <span key={label} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 13,
                color: 'var(--text-muted)',
              }}>
                <Icon size={15} color="var(--gold-light)" strokeWidth={1.75} />
                {label}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleStartClick}
              className="btn-gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Démarrer ma demande
              <ArrowRight size={16} strokeWidth={2} />
            </button>
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

      {/* ── B. Bande de confiance ────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '0 24px 96px' }}>
        <m.div
          ref={badgesRef}
          initial={{ opacity: 0, y: 24 }}
          animate={badgesInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="cg-trustband"
          style={{
            maxWidth: 1040,
            margin: '0 auto',
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            background: 'linear-gradient(180deg, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.03) 100%)',
            border: '1px solid var(--gold-border)',
            borderRadius: 22,
            padding: '34px 28px',
            overflow: 'hidden',
          }}
        >
          {/* Filet dore superieur */}
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'linear-gradient(90deg, transparent, var(--gold-light), transparent)',
          }} />
          {BADGES.map(({ Icon, title }, i) => (
            <div
              key={title}
              className="cg-badge"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 12,
                padding: '0 14px',
                borderLeft: i === 0 ? 'none' : '1px solid var(--glass-border)',
              }}
            >
              <Icon size={26} color="var(--gold-light)" strokeWidth={1.5} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.45 }}>
                {title}
              </span>
            </div>
          ))}
        </m.div>
      </section>

      {/* ── C. Comment ca marche ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '104px 0' }}>
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
              Comment ça marche ?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
              Simple, rapide, sans déplacement.
            </p>
          </m.div>

          <div className="cg-steps" style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            {/* Connecteur dore */}
            <span className="cg-connector" aria-hidden="true" style={{
              position: 'absolute',
              top: 27,
              left: '16%',
              right: '16%',
              height: 2,
              background: 'linear-gradient(90deg, transparent, var(--gold-light), var(--gold-light), transparent)',
              opacity: 0.5,
            }} />
            {STEPS.map((step, i) => (
              <m.div
                key={step.num}
                className="cg-step"
                initial={{ opacity: 0, y: 40 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: EASE }}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0 16px',
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'var(--bg-2)',
                  backgroundImage: 'linear-gradient(180deg, rgba(232,201,122,0.16), rgba(201,168,76,0.04))',
                  border: '1px solid var(--gold-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 22,
                  flexShrink: 0,
                }}>
                  <step.Icon size={24} color="var(--gold-light)" strokeWidth={1.5} />
                </div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--gold-light)',
                  letterSpacing: '0.15em',
                  marginBottom: 12,
                }}>
                  {step.num}
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

      {/* ── D. Module Certimat (iframe officielle) ───────────────────────── */}
      <section id="demande" style={{ background: 'var(--bg)', padding: '104px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
              fontWeight: 700,
              color: 'var(--text)',
              margin: '0 0 12px',
              letterSpacing: '-0.025em',
            }}>
              Faites votre carte grise maintenant
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
              Démarche sécurisée, propulsée par notre partenaire agréé Certimat.
            </p>
          </div>

          <div data-assistant-target="carte-grise-iframe" style={{
            background: '#111',
            border: '1px solid rgba(201,168,76,0.28)',
            borderRadius: 20,
            padding: 12,
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(232,201,122,0.05), 0 0 60px rgba(201,168,76,0.06)',
          }}>
            <iframe
              ref={iframeRef}
              src={CERTIMAT_IFRAME_URL}
              title="Demande de carte grise Certimat"
              loading="lazy"
              allow="payment"
              onLoad={handleIframeLoad}
              className="cg-iframe"
              style={{
                width: '100%',
                border: 0,
                display: 'block',
                borderRadius: 'inherit',
                height: iframeHeight ? `${iframeHeight}px` : undefined,
              }}
            />
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', margin: '18px 0 0' }}>
            Le module ne s'affiche pas ?{' '}
            <a href={CERTIMAT_IFRAME_URL} style={{ color: 'var(--gold-light)', textDecoration: 'underline' }}>
              Ouvrir la demande
            </a>
          </p>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-subtle)', margin: '10px 0 0' }}>
            Service fourni par notre partenaire Certimat (AssuCarteGrise).
          </p>
        </div>
      </section>

      {/* ── E. FAQ ───────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '104px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              QUESTIONS FRÉQUENTES
            </p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}>
              Vos questions sur la carte grise
            </h2>
          </div>
          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {FAQ.map((item, i) => (
              <m.div key={item.q} variants={fadeUp}>
                <AccordionItem
                  item={item}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ── F. Cross-sell assurance ──────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '96px 0' }}>
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
        .cg-iframe { min-height: 820px; }
        @media (max-width: 900px) {
          .cg-trustband { grid-template-columns: repeat(2, 1fr) !important; row-gap: 28px !important; }
          .cg-badge:nth-child(3) { border-left: none !important; }
          .cg-badge { border-left: none !important; }
        }
        @media (max-width: 768px) {
          .cg-steps { flex-direction: column !important; align-items: center !important; gap: 48px !important; }
          .cg-connector { display: none !important; }
          .cg-step { width: 100% !important; max-width: 340px !important; }
          .cg-iframe { min-height: 1000px; }
        }
        @media (max-width: 560px) {
          .cg-trustband { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

export default CarteGrise;
