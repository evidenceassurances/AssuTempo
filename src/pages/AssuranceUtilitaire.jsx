import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  ArrowRight, Phone, ChevronRight, Truck, KeyRound,
  Briefcase, Package, Link2, Clock, ShieldCheck, FileText,
} from 'lucide-react';
import AccordionItem from '../components/ui/AccordionItem';
import Footer from '../components/Footer';
import { jsonLd } from '../lib/seo';

/* Page servie sur l'URL heritee /assurance-temporaire-vehicule-utilitaire
   (952 impressions GSC) : anciennement une redirection 301 vers l'article
   demenagement, desormais une vraie page dediee au besoin "utilitaire".
   Aucun prix affiche, aucun chiffre legal non source : les faits produits
   (duree 1-90 jours, conditions 20 ans / permis 2 ans, garanties RC +
   defense recours + assistance, conducteur exclusif) reprennent mot pour
   mot ceux publies sur la FAQ et la tarification. */

const EASE = [0.22, 1, 0.36, 1];

const CAS = [
  {
    Icon: KeyRound,
    heading: 'Utilitaire de location : faut-il une assurance en plus ?',
    body: [
      "Chez la plupart des loueurs, une assurance de base est comprise dans le contrat de location : vérifiez ce point avant de chercher une couverture ailleurs, c'est écrit dans les conditions du loueur.",
      "La temporaire AssuTempo répond au cas inverse : un utilitaire qui n'est pas couvert entre vos mains. Fourgon prêté par une connaissance, véhicule tout juste acheté, camion d'entreprise sorti de sa flotte habituelle : vous l'assurez à votre nom, pour la durée exacte du besoin.",
    ],
  },
  {
    Icon: Truck,
    heading: "Emprunter le fourgon d'un proche : qui est couvert ?",
    body: [
      "Le contrat annuel du propriétaire ne couvre pas toujours un autre conducteur, et un accident causé par l'emprunteur peut retomber sur son bonus. Une assurance temporaire à votre nom couvre le prêt sans toucher au contrat du propriétaire.",
      "Vous êtes alors conducteur exclusif pendant toute la durée du contrat, de 1 à 90 jours, avec une attestation reçue par email dès le paiement.",
    ],
    link: { href: '/articles/assurance-temporaire-pret-de-vehicule', label: 'Prêter ou emprunter un véhicule : le guide complet' },
  },
  {
    Icon: Briefcase,
    heading: 'Comment couvrir un utilitaire pour une mission ponctuelle ?',
    body: [
      "Artisans, négociants, convoyeurs : un véhicule qui roule doit être couvert en responsabilité civile, même pour un aller simple entre deux dépôts. Plutôt qu'un contrat annuel pour quelques trajets, la temporaire couvre la mission, puis s'arrête seule, sans résiliation à penser.",
    ],
    link: { href: '/articles/assurance-temporaire-convoyage-professionnel', label: 'Convoyage professionnel : quelle assurance ?' },
  },
  {
    Icon: Package,
    heading: "Déménagement : quelle durée d'assurance choisir ?",
    body: [
      "Un déménagement tient rarement en une journée pile. Comptez le chargement, la route, le retour du véhicule : la plupart des lecteurs partent sur 2 ou 3 jours, ajustables au jour près de 1 à 90 jours.",
    ],
    link: { href: '/articles/assurance-temporaire-utilitaire-demenagement', label: 'Déménager avec un utilitaire : bien assuré à la journée' },
  },
  {
    Icon: Link2,
    heading: 'Et la remorque ?',
    body: [
      "Remorques et semi-remorques font partie des véhicules assurables en temporaire, au même titre que les camions et les tracteurs. Selon son poids, une remorque peut porter sa propre carte grise et exiger sa propre garantie : indiquez le PTAC lors de votre devis, ou appelez l'équipe qui vous confirme la formule adaptée en quelques minutes.",
    ],
  },
];

const FAQ = [
  {
    q: 'Quels utilitaires peut-on assurer temporairement ?',
    a: "Fourgons, fourgonnettes, camions, poids lourds, remorques et semi-remorques, comme les autres véhicules du parc AssuTempo. Pour un gabarit inhabituel, contactez l'équipe : la réponse arrive sous 24h maximum.",
    link: { href: '/tarification', label: 'Vérifier mon véhicule au devis' },
  },
  {
    q: 'Quelle est la durée possible pour un utilitaire ?',
    a: 'De 1 à 90 jours, au jour près, avec possibilité de renouvellement. Le contrat prend fin automatiquement à son échéance, sans reconduction ni démarche de résiliation.',
  },
  {
    q: 'Que couvre le contrat ?',
    a: "La responsabilité civile obligatoire, la défense recours suite à accident et une assistance dépannage. Le vol et le bris de glace ne sont pas couverts. L'attestation et le Mémo Véhicule Assuré arrivent par email dès la validation du paiement.",
  },
  {
    q: 'Qui peut souscrire ?',
    a: "Toute personne de 20 ans minimum, titulaire du permis depuis plus de 2 ans, particulier ou professionnel. Aucun relevé d'information n'est exigé.",
    link: { href: '/articles/assurance-auto-temporaire-jeune-conducteur', label: "La condition d'âge et de permis en détail" },
  },
  {
    q: "Un utilitaire loué doit-il être assuré en plus ?",
    a: "En location, une assurance de base est généralement incluse par le loueur : vérifiez votre contrat de location. La temporaire AssuTempo s'adresse aux utilitaires prêtés, achetés ou sortis de leur couverture habituelle.",
  },
];

const CANONICAL = 'https://assutempo.fr/assurance-temporaire-vehicule-utilitaire';
const TITLE = 'Assurance Temporaire Utilitaire : Attestation en 5 Min | AssuTempo';
const DESC = "Assurez un utilitaire, camion ou fourgon de 1 à 90 jours : location, prêt, usage pro, déménagement, remorque. Attestation immédiate, sans relevé d'information.";

const JSONLD_BREADCRUMB = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Assurance temporaire utilitaire', item: CANONICAL },
  ],
};

const JSONLD_SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Assurance temporaire utilitaire, camion et fourgon',
  name: 'Assurance temporaire utilitaire AssuTempo',
  description: DESC,
  provider: { '@id': 'https://assutempo.fr/#organization' },
  areaServed: ['FR', 'Europe'],
  audience: { '@type': 'Audience', audienceType: 'Particuliers et professionnels' },
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: CANONICAL,
    servicePhone: '+33974197820',
  },
};

const JSONLD_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

const REPERES = [
  { Icon: Clock, label: 'Attestation immédiate par email' },
  { Icon: FileText, label: "Sans relevé d'information" },
  { Icon: ShieldCheck, label: 'De 1 à 90 jours, sans reconduction' },
];

function AssuranceUtilitaire() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_SERVICE)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_FAQ)}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 130, paddingBottom: 48, position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse 65% 50% at 50% 0%, rgba(201,168,76,0.09) 0%, transparent 60%)',
          }}
        />
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <nav aria-label="Fil d'Ariane" style={{ marginBottom: 24 }}>
            <ol
              style={{
                listStyle: 'none', margin: 0, padding: 0,
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
                fontSize: 13, color: 'var(--text-muted)',
              }}
            >
              <li>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
              </li>
              <li aria-hidden="true"><ChevronRight size={12} style={{ opacity: 0.5 }} /></li>
              <li aria-current="page" style={{ color: 'var(--text-subtle)' }}>Assurance temporaire utilitaire</li>
            </ol>
          </nav>

          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', margin: '0 0 14px' }}>
            UTILITAIRES, CAMIONS, FOURGONS
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.7rem, 4.5vw, 2.6rem)',
              fontWeight: 800,
              color: 'var(--text)',
              margin: '0 0 20px',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}
          >
            Assurance temporaire utilitaire : camion, fourgon, remorque, attestation en 5 minutes
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, margin: '0 0 24px', maxWidth: 640 }}>
            Un utilitaire se conduit rarement toute l&apos;année. Location d&apos;un week-end,
            fourgon prêté, mission professionnelle, déménagement : assurez-le à votre nom
            pour la durée exacte du besoin, de 1 à 90 jours, avec une attestation
            immédiate par email.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 26 }}>
            <Link
              to="/tarification"
              className="btn-gold"
              style={{
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
                gap: 8, padding: '13px 26px', fontSize: 15,
              }}
            >
              Obtenir mon devis utilitaire
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
            <a
              href="tel:0974197820"
              className="btn-glass"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14 }}
            >
              <Phone size={14} strokeWidth={1.5} />
              09 74 19 78 20
            </a>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
            {REPERES.map(({ Icon, label }) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                <Icon size={14} strokeWidth={1.75} style={{ color: 'var(--gold)' }} aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── L'essentiel ──────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 8px' }}>
        <div
          style={{
            background: 'var(--gold-glow)',
            border: '1px solid var(--gold-border)',
            borderLeft: '3px solid var(--gold)',
            borderRadius: '0 14px 14px 0',
            padding: '20px 24px',
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 10px' }}>
            L&apos;essentiel
          </p>
          <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', margin: 0, lineHeight: 1.75 }}>
            Un utilitaire qui roule doit être couvert en responsabilité civile, même pour
            un seul trajet. L&apos;assurance temporaire AssuTempo couvre fourgons, camions et
            remorques de 1 à 90 jours, sans relevé d&apos;information, dès 20 ans avec un
            permis de plus de 2 ans. L&apos;attestation arrive par email dès le paiement.
          </p>
        </div>
      </section>

      {/* ── Les 5 situations ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 8px' }}>
        {CAS.map(({ Icon, heading, body, link }) => (
          <m.div
            key={heading}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -60px 0px' }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ marginBottom: 40 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span
                aria-hidden
                style={{
                  flexShrink: 0, width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon size={18} color="var(--gold)" strokeWidth={1.5} />
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.15rem, 2.6vw, 1.45rem)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                }}
              >
                {heading}
              </h2>
            </div>
            {body.map((p, i) => (
              <p key={i} style={{ fontSize: 15.5, color: 'var(--text-muted)', lineHeight: 1.8, margin: i < body.length - 1 ? '0 0 12px' : 0 }}>
                {p}
              </p>
            ))}
            {link && (
              <Link
                to={link.href}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 12,
                  fontSize: 14, fontWeight: 500, color: 'var(--gold)', textDecoration: 'none',
                }}
              >
                {link.label}
                <ArrowRight size={13} strokeWidth={2} aria-hidden />
              </Link>
            )}
          </m.div>
        ))}
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '8px 24px 8px' }}>
        <h2 style={{ fontSize: 'clamp(1.2rem, 2.8vw, 1.55rem)', fontWeight: 700, color: 'var(--text)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Questions fréquentes sur l&apos;assurance utilitaire
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 20px' }}>
          Les mêmes conditions que le reste du parc AssuTempo, expliquées pour les utilitaires.
        </p>
        {FAQ.map((item, i) => (
          <AccordionItem
            key={item.q}
            item={item}
            isOpen={openFaq === i}
            onToggle={() => setOpenFaq(openFaq === i ? null : i)}
          />
        ))}
      </section>

      {/* ── CTA + maillage cluster ───────────────────────────────────────── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div
          style={{
            background: 'var(--gold-glow)',
            border: '1px solid var(--gold-border)',
            borderRadius: 16,
            padding: '36px 28px',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 700, color: 'var(--text)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Votre utilitaire couvert en 5 minutes.
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
            Durée au jour près, tarif affiché avant paiement, attestation immédiate.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <Link
              to="/tarification"
              className="btn-gold"
              style={{ textDecoration: 'none', padding: '14px 28px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              Obtenir mon devis
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
            <a
              href="tel:0974197820"
              className="btn-glass"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Phone size={15} strokeWidth={1.5} />
              09 74 19 78 20
            </a>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            Lun-Ven 9h-21h · Sam 9h-20h · la nuit et le dimanche via le{' '}
            <Link to="/guichet-de-nuit" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
              Guichet de Nuit
            </Link>
          </p>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 14px', textAlign: 'center' }}>
          Pour aller plus loin
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {[
            { to: '/articles/assurance-temporaire-utilitaire-demenagement', label: 'Déménager avec un utilitaire' },
            { to: '/articles/assurance-temporaire-pret-de-vehicule', label: 'Prêt et emprunt de véhicule' },
            { to: '/articles/assurance-temporaire-convoyage-professionnel', label: 'Convoyage professionnel' },
            { to: '/articles/prix-assurance-auto-temporaire', label: "Les prix de l'assurance temporaire" },
            { to: '/carte', label: 'Les 34 pays couverts' },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontSize: 13.5, fontWeight: 500, textDecoration: 'none',
                padding: '9px 16px', borderRadius: 999,
                border: '1px solid var(--gold-border)',
                background: 'var(--gold-glow)', color: 'var(--gold-light)',
              }}
            >
              {l.label}
              <ArrowRight size={14} strokeWidth={2} aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AssuranceUtilitaire;
