import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  ArrowRight, Phone, Key, FileText, Clock, Globe2, AlertOctagon,
  ChevronRight, Calendar,
} from 'lucide-react';
import Footer from '../components/Footer';
import AnswerCapsule from '../components/articles/AnswerCapsule';
import AccordionItem from '../components/ui/AccordionItem';
import { fadeUp, stagger } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { jsonLd } from '../lib/seo';

const EASE = [0.22, 1, 0.36, 1];

/* ── Réponse en bref (GEO), réutilisation du composant des articles ─────── */
const CAPSULE = {
  answer:
    "Après l'achat d'un véhicule d'occasion, deux obligations se cumulent. L'assurance doit couvrir le véhicule dès la remise des clés, rouler non assuré est un délit. Le nouveau certificat d'immatriculation doit être demandé dans le mois qui suit la date de cession. AssuTempo traite les deux au même endroit : une attestation d'assurance temporaire immédiate et la carte grise en ligne.",
  facts: [
    {
      anchor: 'Dès J0',
      text: "Le véhicule doit être assuré avant le premier trajet, y compris pour ramener la voiture chez soi le jour de l'achat.",
    },
    {
      anchor: '1 mois',
      text: "Délai légal pour immatriculer le véhicule au nom du nouvel acquéreur, à compter de la date de cession (article R322-5 du code de la route).",
    },
    {
      anchor: 'Jusqu\'à 750 €',
      text: "Amende encourue en cas de retard : contravention de 4e classe, 135 € d'amende forfaitaire (90 € minorée, 375 € majorée), jusqu'à 750 € devant le tribunal (article 131-13 du code pénal).",
    },
  ],
  updated: '14 juillet 2026',
};

/* ── Rétroplanning J0 vers J+30 ──────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    time: 'J0',
    Icon: Key,
    title: 'Remise des clés : le véhicule doit être assuré avant de rouler',
    body:
      "Une assurance temporaire, de 1 à 90 jours, couvre immédiatement le trajet de retour et les premiers jours qui suivent l'achat, le temps de finaliser un contrat annuel ou de revendre. Sans attestation valide, prendre la route est un délit (article L324-2 du code de la route).",
    relatedLink: { text: 'Assurer mon véhicule maintenant', href: '/tarification' },
  },
  {
    num: '02',
    time: 'J0 à J+30',
    Icon: FileText,
    title: "La carte grise : un mois pour l'immatriculer à son nom",
    body:
      "Le nouveau titulaire dispose d'un mois à compter de la date de cession pour demander le certificat d'immatriculation (article R322-5 du code de la route). Pendant ce délai, il peut circuler avec la carte grise barrée, portant la mention « vendu le » et la date, accompagnée de l'accusé d'enregistrement ou du certificat provisoire d'immatriculation une fois la demande déposée.",
    relatedLink: { text: 'Voir les délais réels de la carte grise', href: '/articles/combien-de-temps-carte-grise' },
  },
  {
    num: '03',
    time: 'Dès le dépôt du dossier',
    Icon: Clock,
    title: "Le certificat provisoire d'immatriculation (CPI)",
    body:
      "Délivré à la fin de la démarche d'immatriculation, il permet de circuler un mois, uniquement en France, en attendant que le titre définitif soit fabriqué et expédié par France Titres (ANTS).",
    relatedLink: { text: 'Obtenir un certificat provisoire en urgence', href: '/articles/carte-grise-urgence-cpi-immediat' },
  },
  {
    num: '04',
    time: 'Cas particulier',
    Icon: Globe2,
    title: 'Véhicule importé ou neuf : les plaques WW, valables 4 mois',
    body:
      "Un véhicule neuf ou importé sans titre définitif circule avec des plaques provisoires WW et un CPI WW distinct, valables 4 mois au total. Ne pas confondre avec le CPI classique d'un véhicule d'occasion, limité à un mois : les deux documents portent le même nom, pas la même durée.",
    relatedLink: { text: 'Comprendre la différence entre CPI et plaques WW', href: '/articles/rouler-sans-carte-grise-a-son-nom' },
  },
  {
    num: '05',
    time: 'Après J+30',
    Icon: AlertOctagon,
    title: 'Retard : une contravention de 4e classe',
    body:
      "Demander la carte grise après le délai d'un mois expose à une amende forfaitaire de 135 euros, minorée à 90 euros en paiement rapide, majorée à 375 euros. Devant le tribunal, elle peut grimper jusqu'à 750 euros (article 131-13 du code pénal), avec une immobilisation du véhicule possible.",
    relatedLink: { text: 'Faire ma carte grise en ligne', href: '/carte-grise' },
  },
];

/* ── FAQ (identique au JSON-LD FAQPage) ──────────────────────────────────── */
const FAQ = [
  {
    q: "Peut-on rouler juste après l'achat sans avoir la carte grise à son nom ?",
    a: "Oui, pendant le mois qui suit l'achat. La carte grise barrée par le vendeur, portant la mention « vendu le » et la date, avec le certificat de cession ou l'accusé d'enregistrement, suffit à circuler. Le véhicule doit en revanche être assuré dès la remise des clés.",
  },
  {
    q: "Combien de temps pour faire la carte grise après l'achat ?",
    a: "Un mois calendaire à compter de la date de cession, délai fixé par l'article R322-5 du code de la route. Passé ce délai sans certificat provisoire ni carte grise à jour, le véhicule ne peut plus circuler légalement.",
  },
  {
    q: "Quel risque en cas de dépassement du délai d'un mois ?",
    a: "Une contravention de 4e classe : amende forfaitaire de 135 euros, minorée à 90 euros en paiement rapide, majorée à 375 euros en retard. Devant le tribunal, elle peut atteindre 750 euros (article 131-13 du code pénal), avec une immobilisation du véhicule possible.",
  },
  {
    q: 'Faut-il assurer la voiture avant ou après la carte grise ?',
    a: "Avant, systématiquement. L'obligation d'assurance s'applique dès le premier trajet, indépendamment du statut de la carte grise. Rouler non assuré est un délit distinct (article L324-2 du code de la route), plus lourd que le simple dépassement du délai d'immatriculation.",
  },
  {
    q: "Le certificat provisoire d'immatriculation permet-il de rouler à l'étranger ?",
    a: "Non, pas dans le cas général. Le CPI d'un véhicule d'occasion autorise à circuler uniquement en France, pendant un mois, le temps que le titre définitif soit fabriqué et expédié. Pour un trajet hors de France pendant cette période, c'est la carte grise définitive qu'il faut, pas le CPI.",
  },
  {
    q: 'Comment assurer immédiatement un véhicule acheté un week-end ou en soirée ?',
    a: "Une assurance temporaire souscrite en ligne délivre une attestation par email en quelques minutes, sans dépendre des horaires d'un cabinet classique. Elle couvre le trajet retour et les premiers jours, le temps de finaliser un contrat annuel ou de revendre.",
  },
];

/* ── Données structurées (SEO / GEO) ─────────────────────────────────────── */
const JSONLD_BREADCRUMB = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Roulez légal après achat', item: 'https://assutempo.fr/roulez-legal-apres-achat' },
  ],
};

const JSONLD_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const cardBase = {
  background: 'var(--bg-card)',
  border: '1px solid var(--gold-border)',
  borderRadius: 16,
  padding: '22px 20px',
};

/* ── Bloc double CTA, réutilisable (répété en tête et en pied de page) ──── */
function DoubleCta() {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      <Link
        to="/tarification"
        className="btn-gold"
        style={{ textDecoration: 'none', padding: '14px 26px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        Assurer mon véhicule maintenant
        <ArrowRight size={15} strokeWidth={2} />
      </Link>
      <Link
        to="/carte-grise"
        className="btn-glass"
        style={{ textDecoration: 'none', padding: '14px 26px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        <FileText size={15} strokeWidth={1.75} />
        Faire ma carte grise en ligne
      </Link>
    </div>
  );
}

/* ── Étape de la frise ────────────────────────────────────────────────────── */
function TimelineStep({ step, isLast }) {
  const { Icon } = step;
  return (
    <div style={{ display: 'flex', gap: 20, position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'var(--gold-glow)',
            border: '1.5px solid var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <Icon size={20} color="var(--gold)" strokeWidth={1.75} />
        </div>
        {!isLast && (
          <div
            style={{
              width: 1,
              flexGrow: 1,
              minHeight: 40,
              background: 'linear-gradient(to bottom, var(--gold-border), transparent)',
              marginTop: 6,
            }}
          />
        )}
      </div>

      <div style={{ paddingBottom: isLast ? 0 : 40, paddingTop: 4, minWidth: 0 }}>
        <span
          style={{
            display: 'inline-block',
            padding: '3px 11px',
            marginBottom: 10,
            borderRadius: 999,
            background: 'rgba(201,168,76,0.12)',
            border: '1px solid var(--gold-border)',
            fontSize: 11.5,
            fontWeight: 700,
            color: 'var(--gold)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        >
          {step.time}
        </span>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.35 }}>
          {step.title}
        </h3>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.75, maxWidth: 620 }}>
          {step.body}
        </p>
        {step.relatedLink && (
          <Link
            to={step.relatedLink.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontSize: 13.5,
              fontWeight: 600,
              color: 'var(--gold-light)',
              textDecoration: 'none',
            }}
          >
            {step.relatedLink.text}
            <ArrowRight size={13} strokeWidth={2} />
          </Link>
        )}
      </div>
    </div>
  );
}

function RoulezLegalApresAchat() {
  const [stepsRef, stepsInView] = useScrollReveal();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <Helmet>
        <title>Rouler légal après achat voiture | AssuTempo</title>
        <meta
          name="description"
          content="Après l'achat d'une voiture : assurance immédiate obligatoire, carte grise à demander sous 1 mois. Les deux démarches, au même endroit."
        />
        <link rel="canonical" href="https://assutempo.fr/roulez-legal-apres-achat" />
        <meta property="og:title" content="Rouler légal après achat voiture | AssuTempo" />
        <meta
          property="og:description"
          content="Après l'achat d'une voiture : assurance immédiate obligatoire, carte grise à demander sous 1 mois. Les deux démarches, au même endroit."
        />
        <meta property="og:url" content="https://assutempo.fr/roulez-legal-apres-achat" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_FAQ)}</script>
      </Helmet>

      {/* ── A. Hero ──────────────────────────────────────────────────────── */}
      <section style={{
        paddingTop: 140,
        paddingBottom: 48,
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
          {/* Fil d'Ariane, aligné sur le BreadcrumbList JSON-LD */}
          <nav aria-label="Fil d'Ariane" style={{ marginBottom: 22, display: 'flex', justifyContent: 'center' }}>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
              </li>
              <li aria-hidden="true"><ChevronRight size={12} style={{ opacity: 0.5 }} /></li>
              <li aria-current="page" style={{ color: 'var(--text-subtle)' }}>Roulez légal après achat</li>
            </ol>
          </nav>

          <p style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>
            APRÈS L&apos;ACHAT D&apos;UNE VOITURE
          </p>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 58px)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: 16,
            letterSpacing: '-0.03em',
            maxWidth: 900,
            margin: '0 auto 16px',
          }}>
            Roulez légal après avoir acheté une voiture
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: 680,
            margin: '0 auto 12px',
            lineHeight: 1.75,
          }}>
            Deux démarches, un seul endroit : assurez le véhicule dès aujourd&apos;hui et lancez
            votre carte grise en ligne, sans attendre.
          </p>
          <p style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 13,
            color: 'var(--text-subtle)',
            margin: '0 0 32px',
          }}>
            <Calendar size={13} strokeWidth={1.5} />
            Mis à jour le 14 juillet 2026
          </p>

          <div style={{ maxWidth: 820, margin: '0 auto 8px' }}>
            <AnswerCapsule capsule={CAPSULE} />
          </div>
        </m.div>
      </section>

      {/* ── B. Positionnement unique ─────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '16px 24px 64px' }}>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            maxWidth: 820,
            margin: '0 auto 40px',
            background: 'var(--gold-glow)',
            border: '1px solid var(--gold-border)',
            borderLeft: '3px solid var(--gold)',
            borderRadius: '0 14px 14px 0',
            padding: '24px 26px',
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>
            Le positionnement AssuTempo
          </p>
          <p style={{ fontSize: 16, color: 'var(--text)', margin: 0, lineHeight: 1.8 }}>
            AssuTempo est le seul parcours en France qui réunit l&apos;assurance auto temporaire
            immédiate et la carte grise en ligne au même endroit. Plutôt que de renvoyer
            l&apos;acheteur vers un assureur, un mandataire et un service d&apos;immatriculation
            distincts, les deux démarches se traitent depuis le même compte, dans la même
            session.
          </p>
        </m.div>

        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <DoubleCta />
        </div>
      </section>

      {/* ── C. Rétroplanning J0 vers J+30 ────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <m.div
            ref={stepsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ marginBottom: 48 }}
          >
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              RÉTROPLANNING
            </p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}>
              De J0 à J+30 : ce qu&apos;il faut faire, dans l&apos;ordre
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
              Le jour de l&apos;achat déclenche deux horloges différentes : celle de
              l&apos;assurance, immédiate, et celle de la carte grise, comptée en semaines.
            </p>
          </m.div>

          <div>
            {STEPS.map((step, i) => (
              <TimelineStep key={step.num} step={step} isLast={i === STEPS.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── D. Maillage interne ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '72px 24px' }}>
        <p style={{
          textAlign: 'center',
          fontSize: 14,
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          margin: '0 auto',
          maxWidth: 760,
        }}>
          Pour approfondir un cas particulier :{' '}
          <Link to="/articles/assurer-vehicule-achete-chez-particulier" style={{ color: 'var(--gold-light)' }}>
            assurer un véhicule acheté chez un particulier
          </Link>
          ,{' '}
          <Link to="/articles/assurance-temporaire-rouler-en-attendant-carte-grise" style={{ color: 'var(--gold-light)' }}>
            rouler en attendant sa carte grise définitive
          </Link>
          , ou{' '}
          <Link to="/articles/rouler-sans-carte-grise-a-son-nom" style={{ color: 'var(--gold-light)' }}>
            ce que la loi sanctionne vraiment en cas de retard
          </Link>
          . Le volume de véhicules concernés chaque mois est suivi dans le{' '}
          <Link to="/barometre-immatriculations" style={{ color: 'var(--gold-light)' }}>
            Baromètre AssuTempo des immatriculations
          </Link>
          . Des particularités locales à connaître :{' '}
          <Link to="/assurance-temporaire-carte-grise-paris" style={{ color: 'var(--gold-light)' }}>
            à Paris
          </Link>
          ,{' '}
          <Link to="/assurance-temporaire-carte-grise-lyon" style={{ color: 'var(--gold-light)' }}>
            à Lyon
          </Link>
          {' '}et{' '}
          <Link to="/assurance-temporaire-carte-grise-marseille" style={{ color: 'var(--gold-light)' }}>
            à Marseille
          </Link>
          . Pour vérifier qui édite AssuTempo et notre numéro ORIAS, consultez{' '}
          <Link to="/avis-et-garanties" style={{ color: 'var(--gold-light)' }}>
            avis et garanties AssuTempo
          </Link>
          .
        </p>
      </section>

      {/* ── E. FAQ ────────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '104px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              QUESTIONS FRÉQUENTES
            </p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}>
              Rouler légal après achat : vos questions
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

      {/* ── F. CTA final ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '96px 24px' }}>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            ...cardBase,
            maxWidth: 820,
            margin: '0 auto',
            textAlign: 'center',
            padding: '40px 32px',
          }}
        >
          <h2 style={{
            fontSize: 'clamp(1.3rem, 2.8vw, 1.7rem)',
            fontWeight: 700,
            color: 'var(--text)',
            margin: '0 0 10px',
            letterSpacing: '-0.02em',
          }}>
            Deux démarches, un seul endroit
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 26px', lineHeight: 1.7 }}>
            Attestation d&apos;assurance immédiate, carte grise en ligne. Roulez couvert et en
            règle dès aujourd&apos;hui.
          </p>
          <DoubleCta />
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '20px 0 0', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Phone size={14} strokeWidth={1.5} />
            09 74 19 78 20, Lun-Ven 9h-21h, Sam 9h-20h
          </p>
        </m.div>
      </section>

      <Footer />
    </>
  );
}

export default RoulezLegalApresAchat;
