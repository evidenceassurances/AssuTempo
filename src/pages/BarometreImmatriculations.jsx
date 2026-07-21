import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  ArrowRight, FileText, ChevronRight, Calendar, TrendingDown, TrendingUp,
} from 'lucide-react';
import Footer from '../components/Footer';
import AnswerCapsule from '../components/articles/AnswerCapsule';
import AccordionItem from '../components/ui/AccordionItem';
import { fadeUp, stagger } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { jsonLd } from '../lib/seo';

const EASE = [0.22, 1, 0.36, 1];

/* ══════════════════════════════════════════════════════════════════════════
   BAROMÈTRE ASSUTEMPO, édition juillet 2026.

   Chiffres vérifiés par lecture directe des pages d'origine le 17 juillet 2026.
   Le neuf est suivi tous les mois par le SDES ; l'occasion n'est publiée qu'au
   rythme annuel (dernier bilan : année 2025). Sources agrégées en une ligne au
   pied de la section données ; détail machine dans le JSON-LD Dataset.

   Sources :
   - SDES, immatriculations de voitures particulières neuves en juin 2026 (CVS-CJO),
     publié le 2 juillet 2026.
   - SDES, bilan annuel des immatriculations 2025, publié le 11 février 2026.
   - data.gouv.fr, "Immatriculations de véhicules routiers" (SDES), maj 17 juillet 2026.
   ══════════════════════════════════════════════════════════════════════════ */

const EDITION = 'juillet 2026';
const DATE_MAJ = '17 juillet 2026';
const DATE_MAJ_ISO = '2026-07-17';

/* ── Réponse en bref (GEO) ────────────────────────────────────────────────── */
const CAPSULE = {
  answer:
    "En France, l'occasion domine le marché automobile : 76,9 % des voitures particulières achetées en 2025 étaient d'occasion, contre 23,1 % de neuves. Sur le neuf, 141 300 voitures ont été immatriculées en juin 2026, en recul de 2,6 % sur un mois. Chaque véhicule qui change de mains doit être assuré dès le premier trajet et réimmatriculé dans le mois qui suit la cession.",
  facts: [
    {
      anchor: '76,9 %',
      text: "Part de l'occasion dans les achats de voitures particulières en France en 2025, contre 23,1 % de neuf (SDES).",
    },
    {
      anchor: '141 300',
      text: 'Voitures neuves immatriculées en juin 2026, en recul de 2,6 % sur un mois (SDES, CVS-CJO).',
    },
    {
      anchor: '1 mois',
      text: "Délai pour immatriculer un véhicule au nom du nouveau titulaire, à compter de la cession (article R322-5 du code de la route).",
    },
  ],
  updated: DATE_MAJ,
};

/* ── Le partage occasion / neuf, cœur visuel de la page ───────────────────── */
const SPLIT = {
  occasion: { pct: 76.9, label: 'Occasion' },
  neuf: { pct: 23.1, label: 'Neuf' },
};

/* ── Bandeau de chiffres, façon registre (pas de cartes) ──────────────────── */
const LEDGER = [
  {
    value: '141 300',
    unit: 'voitures neuves',
    caption: 'immatriculées en juin 2026',
    trend: { dir: 'down', text: '-2,6 % sur un mois' },
  },
  {
    value: '5,5 M',
    unit: "voitures d'occasion",
    caption: 'vendues en France en 2025',
    trend: { dir: 'up', text: '+0,9 % sur un an' },
  },
  {
    value: '3,3 : 1',
    unit: 'le rapport',
    caption: "occasions vendues pour une voiture neuve",
    trend: null,
  },
];

/* ── Repères réglementaires, en lignes à chiffre saillant ─────────────────── */
const RULES = [
  {
    figure: '1 mois',
    title: 'pour immatriculer le véhicule à son nom',
    body:
      "Le nouveau titulaire d'un véhicule d'occasion a un mois calendaire, à compter de la date de cession, pour faire établir le certificat d'immatriculation à son nom.",
    ref: 'Article R322-5 du code de la route',
  },
  {
    figure: '750 €',
    title: 'au maximum en cas de retard',
    body:
      "Dépasser ce délai, c'est une contravention de 4e classe : 135 € forfaitaires, 90 € en paiement rapide, 375 € majorés, jusqu'à 750 € devant le tribunal, avec immobilisation possible.",
    ref: 'Article 131-13 du code pénal, service-public.gouv.fr',
  },
  {
    figure: '1 mois',
    title: 'de circulation avec le certificat provisoire',
    body:
      "Une fois la demande déposée, le certificat provisoire d'immatriculation autorise à rouler un mois, uniquement en France, le temps que le titre définitif soit fabriqué et expédié.",
    ref: 'ANTS / France Titres',
  },
  {
    figure: '4 mois',
    title: 'pour les plaques WW, sans reconduction',
    body:
      "Réservées aux véhicules neufs ou importés sans titre, les plaques provisoires WW valent 4 mois. Depuis la réforme de 2026, ce délai ne se prolonge plus.",
    ref: 'Service-public.gouv.fr',
  },
];

/* ── FAQ, aimant GEO sur les requêtes immatriculation ─────────────────────── */
const FAQ = [
  {
    q: "Combien de voitures sont immatriculées en France chaque année ?",
    a: "L'occasion représente l'essentiel du marché : 5,5 millions de voitures particulières ont changé de titulaire en France en 2025, soit 76,9 % des achats. Le neuf en compte environ un quart, sur un rythme récent d'à peu près 141 000 immatriculations par mois (juin 2026). Au total, plusieurs millions de véhicules changent de mains chaque année, et chacun doit être assuré puis réimmatriculé.",
  },
  {
    q: "Y a-t-il plus de voitures neuves ou d'occasion vendues en France ?",
    a: "L'occasion l'emporte largement. En 2025, 76,9 % des voitures particulières achetées étaient d'occasion, contre 23,1 % de neuves, soit environ 3,3 véhicules d'occasion pour une voiture neuve. C'est ce marché de la revente entre particuliers et professionnels qui génère le plus de besoins d'assurance immédiate et de carte grise à refaire.",
  },
  {
    q: "Combien de temps a-t-on pour immatriculer une voiture après l'achat ?",
    a: "Un mois calendaire à compter de la date de cession, délai fixé par l'article R322-5 du code de la route. Pendant ce mois, on peut rouler avec la carte grise barrée par le vendeur portant la mention « vendu le » et la date, accompagnée du certificat de cession ou de l'accusé d'enregistrement.",
  },
  {
    q: "Que risque-t-on en cas de dépassement du délai d'immatriculation ?",
    a: "Une contravention de 4e classe : amende forfaitaire de 135 euros, minorée à 90 euros en paiement rapide, majorée à 375 euros. Devant le tribunal, elle peut atteindre 750 euros (article 131-13 du code pénal), avec une immobilisation du véhicule possible tant que la carte grise n'est pas à jour.",
  },
  {
    q: "Peut-on rouler en attendant la carte grise définitive ?",
    a: "Oui. Après le dépôt de la demande, le certificat provisoire d'immatriculation autorise à circuler un mois, uniquement en France, le temps que le titre définitif arrive par courrier. Une condition reste incontournable à chaque trajet : le véhicule doit être assuré.",
  },
  {
    q: "Faut-il assurer la voiture avant de l'immatriculer ?",
    a: "Avant, systématiquement. L'obligation d'assurance s'applique dès le premier trajet, y compris pour ramener la voiture le jour de l'achat, indépendamment du statut de la carte grise. Rouler non assuré est un délit distinct (article L324-2 du code de la route), plus lourd que le simple retard d'immatriculation.",
  },
];

/* ── Données structurées (SEO / GEO) ─────────────────────────────────────── */
const JSONLD_BREADCRUMB = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Baromètre immatriculations', item: 'https://assutempo.fr/barometre-immatriculations' },
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

const JSONLD_DATASET = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: `Baromètre AssuTempo des immatriculations, édition ${EDITION}`,
  description:
    "Sélection mensuelle de chiffres sourcés sur les immatriculations de véhicules en France (marché du neuf et de l'occasion), à partir des données du SDES et de data.gouv.fr.",
  url: 'https://assutempo.fr/barometre-immatriculations',
  creator: { '@id': 'https://assutempo.fr/#organization' },
  publisher: { '@id': 'https://assutempo.fr/#organization' },
  license: 'https://www.data.gouv.fr/pages/legal/licences/#licence-ouverte-version-2-0',
  dateModified: DATE_MAJ_ISO,
  isBasedOn: [
    {
      '@type': 'Dataset',
      name: 'Immatriculations de voitures particulières neuves en juin 2026',
      creator: 'SDES',
      url: 'https://www.statistiques.developpement-durable.gouv.fr/immatriculations-de-voitures-particulieres-neuves-en-juin-2026',
    },
    {
      '@type': 'Dataset',
      name: 'Immatriculations de voitures en 2025 : le marché du neuf baisse, celui de l’occasion résiste',
      creator: 'SDES',
      url: 'https://www.statistiques.developpement-durable.gouv.fr/immatriculations-de-voitures-en-2025-le-marche-du-neuf-baisse-celui-de-loccasion-resiste',
    },
    {
      '@type': 'Dataset',
      name: 'Immatriculations de véhicules routiers',
      creator: 'SDES',
      url: 'https://www.data.gouv.fr/datasets/immatriculations-de-vehicules-routiers',
    },
  ],
  keywords: ['immatriculations', 'voitures occasion', 'voitures neuves', 'France', 'SDES', 'baromètre automobile'],
  variableMeasured: [
    'Immatriculations de voitures particulières neuves',
    "Changements de titulaire de voitures particulières d'occasion",
  ],
};

const cardBase = {
  background: 'var(--bg-card)',
  border: '1px solid var(--gold-border)',
  borderRadius: 16,
  padding: '22px 20px',
};

const eyebrowStyle = {
  fontSize: 12,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--gold)',
  margin: '0 0 14px',
};

/* ── Bloc double CTA ──────────────────────────────────────────────────────── */
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

/* ── Visualisation du partage occasion / neuf ─────────────────────────────────
   La barre garde une géométrie fixe (aucun layout shift) : les segments portent
   leur largeur définitive en flex-ratio, seul le remplissage doré grandit par
   transform: scaleX (GPU) à l'entrée dans le viewport. Les deux parts sont
   étiquetées en clair, rien n'est masqué : aucune infobulle nécessaire. */
function SplitBar({ inView }) {
  const grow = {
    hidden: { scaleX: 0 },
    visible: (i) => ({
      scaleX: 1,
      transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE },
    }),
  };
  return (
    <div>
      {/* étiquettes alignées sur les segments */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        <div style={{ flexGrow: SPLIT.occasion.pct, minWidth: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-light)', letterSpacing: '0.02em' }}>
            {SPLIT.occasion.label}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8, fontVariantNumeric: 'tabular-nums' }}>
            {SPLIT.occasion.pct.toLocaleString('fr-FR')} %
          </span>
        </div>
        <div style={{ flexGrow: SPLIT.neuf.pct, minWidth: 0, textAlign: 'right' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.02em' }}>
            {SPLIT.neuf.label}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 6, fontVariantNumeric: 'tabular-nums' }}>
            {SPLIT.neuf.pct.toLocaleString('fr-FR')} %
          </span>
        </div>
      </div>

      {/* la barre : 2 pistes fixes, remplissage animé en scaleX, écart de 4px */}
      <div style={{ display: 'flex', gap: 4, height: 18 }}>
        <div style={{ flexGrow: SPLIT.occasion.pct, borderRadius: 5, overflow: 'hidden', background: 'rgba(201,168,76,0.10)' }}>
          <m.div
            custom={0}
            variants={grow}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{
              height: '100%',
              transformOrigin: 'left',
              borderRadius: 5,
              background: 'linear-gradient(90deg, var(--gold-deep), var(--gold) 55%, var(--gold-light))',
              boxShadow: '0 0 22px rgba(201,168,76,0.35)',
            }}
          />
        </div>
        <div style={{ flexGrow: SPLIT.neuf.pct, borderRadius: 5, overflow: 'hidden', background: 'rgba(255,255,255,0.04)' }}>
          <m.div
            custom={1}
            variants={grow}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{
              height: '100%',
              transformOrigin: 'left',
              borderRadius: 5,
              background: 'rgba(244,241,234,0.16)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Chiffre du bandeau registre ──────────────────────────────────────────── */
function LedgerFigure({ item }) {
  const Trend = item.trend?.dir === 'up' ? TrendingUp : TrendingDown;
  return (
    <div style={{ flex: '1 1 220px', padding: '4px 8px' }}>
      <p style={{
        fontSize: 'clamp(2rem, 4.4vw, 2.9rem)',
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '-0.03em',
        margin: '0 0 10px',
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span className="text-gold-gradient">{item.value}</span>
      </p>
      <p style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)', margin: '0 0 3px' }}>
        {item.unit}
      </p>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
        {item.caption}
      </p>
      {item.trend && (
        <p style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          marginTop: 12, fontSize: 12.5, fontWeight: 600,
          color: item.trend.dir === 'up' ? 'var(--gold-light)' : 'var(--text-muted)',
        }}>
          <Trend size={13} strokeWidth={2} />
          {item.trend.text}
        </p>
      )}
    </div>
  );
}

/* ── Ligne de repère réglementaire ────────────────────────────────────────── */
function RuleRow({ rule }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(96px, 132px) 1fr',
      gap: 'clamp(18px, 4vw, 40px)',
      alignItems: 'start',
      padding: '26px 0',
      borderTop: '1px solid rgba(201,168,76,0.14)',
    }}>
      <p style={{
        fontSize: 'clamp(1.8rem, 3.6vw, 2.5rem)',
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '-0.03em',
        margin: 0,
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span className="text-gold-gradient">{rule.figure}</span>
      </p>
      <div style={{ minWidth: 0 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: '2px 0 8px', lineHeight: 1.35 }}>
          {rule.title}
        </h3>
        <p style={{ fontSize: 14.5, color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.7, maxWidth: 620 }}>
          {rule.body}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-subtle)', margin: 0, letterSpacing: '0.01em' }}>
          {rule.ref}
        </p>
      </div>
    </div>
  );
}

function BarometreImmatriculations() {
  const [dataRef, dataInView] = useScrollReveal();
  const [rulesRef, rulesInView] = useScrollReveal();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <Helmet>
        <title>{`Baromètre immatriculations ${EDITION} | AssuTempo`}</title>
        <meta
          name="description"
          content={`Immatriculations en France ${EDITION} : occasion 76,9 % vs neuf, volumes, délais légaux et carte grise. Baromètre sourcé SDES, mis à jour chaque mois.`}
        />
        <link rel="canonical" href="https://assutempo.fr/barometre-immatriculations" />
        <meta property="og:title" content={`Baromètre immatriculations ${EDITION} | AssuTempo`} />
        <meta
          property="og:description"
          content={`Immatriculations en France ${EDITION} : occasion vs neuf, volumes, délais légaux et carte grise. Baromètre sourcé SDES, mis à jour chaque mois.`}
        />
        <meta property="og:url" content="https://assutempo.fr/barometre-immatriculations" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_DATASET)}</script>
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
          <nav aria-label="Fil d'Ariane" style={{ marginBottom: 22, display: 'flex', justifyContent: 'center' }}>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
              </li>
              <li aria-hidden="true"><ChevronRight size={12} style={{ opacity: 0.5 }} /></li>
              <li aria-current="page" style={{ color: 'var(--text-subtle)' }}>Baromètre immatriculations</li>
            </ol>
          </nav>

          <p style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>
            L&apos;OBSERVATOIRE ASSUTEMPO DES IMMATRICULATIONS
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
            Qui achète quoi, et combien de temps pour être en règle
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: 660,
            margin: '0 auto 12px',
            lineHeight: 1.75,
          }}>
            L&apos;état du marché français de l&apos;immatriculation, neuf et occasion, et les
            délais qui s&apos;imposent dès qu&apos;une voiture change de mains.
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
            Édition {EDITION} · mise à jour le {DATE_MAJ}
          </p>

          <div style={{ maxWidth: 820, margin: '0 auto 8px' }}>
            <AnswerCapsule capsule={CAPSULE} />
          </div>
        </m.div>
      </section>

      {/* ── B. Le marché en clair (visualisation + registre) ─────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '80px 24px 92px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 46% 60% at 12% 8%, rgba(201,168,76,0.09) 0%, transparent 60%)',
        }} />
        <div ref={dataRef} style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <m.div
            initial={{ opacity: 0, y: 28 }}
            animate={dataInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ marginBottom: 40 }}
          >
            <p style={eyebrowStyle}>LE MARCHÉ EN CLAIR</p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
              maxWidth: 780,
            }}>
              En France, l&apos;occasion fait la loi
            </h2>
            <p style={{ fontSize: 15.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75, maxWidth: 660 }}>
              On y achète bien plus de voitures d&apos;occasion que de neuves. C&apos;est ce
              marché de la revente qui a besoin d&apos;une attestation d&apos;assurance
              immédiate et d&apos;une carte grise à refaire.
            </p>
          </m.div>

          {/* Le partage occasion / neuf : grand chiffre + barre */}
          <m.div
            initial={{ opacity: 0, y: 28 }}
            animate={dataInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.06, ease: EASE }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(28px, 5vw, 56px)',
              alignItems: 'center',
              padding: 'clamp(26px, 4vw, 40px)',
              borderRadius: 20,
              border: '1px solid var(--gold-border)',
              background: 'linear-gradient(160deg, rgba(201,168,76,0.06), rgba(255,255,255,0.014))',
            }}
          >
            <div>
              <p style={{
                fontSize: 'clamp(3.4rem, 8vw, 5.4rem)',
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                margin: '0 0 12px',
                fontVariantNumeric: 'tabular-nums',
              }}>
                <span className="text-gold-gradient">76,9 %</span>
              </p>
              <p style={{ fontSize: 17, color: 'var(--text)', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.4 }}>
                des voitures achetées en France sont d&apos;occasion
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                soit près de 3,3 véhicules d&apos;occasion pour chaque voiture neuve immatriculée.
              </p>
            </div>
            <SplitBar inView={dataInView} />
          </m.div>

          {/* Registre de chiffres, séparateurs filaires */}
          <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={dataInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 44,
              paddingTop: 8,
            }}
          >
            {LEDGER.map((item, i) => (
              <div
                key={item.value}
                style={{
                  display: 'flex',
                  flex: '1 1 220px',
                  borderLeft: i === 0 ? 'none' : '1px solid rgba(201,168,76,0.14)',
                  paddingLeft: i === 0 ? 0 : 'clamp(14px, 2.5vw, 28px)',
                }}
              >
                <LedgerFigure item={item} />
              </div>
            ))}
          </m.div>

          <p style={{ fontSize: 12, color: 'var(--text-subtle)', margin: '30px 0 0', lineHeight: 1.6 }}>
            Sources : SDES, immatriculations de voitures neuves (juin 2026) et bilan annuel 2025 ; data.gouv.fr.
          </p>
        </div>
      </section>

      {/* ── C. Repères réglementaires ────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '96px 24px' }}>
        <div ref={rulesRef} style={{ maxWidth: 900, margin: '0 auto' }}>
          <m.div
            initial={{ opacity: 0, y: 28 }}
            animate={rulesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ marginBottom: 20 }}
          >
            <p style={eyebrowStyle}>APRÈS UN CHANGEMENT DE TITULAIRE</p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
              maxWidth: 720,
            }}>
              Les quatre horloges de l&apos;immatriculation
            </h2>
            <p style={{ fontSize: 15.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75, maxWidth: 640 }}>
              Dès qu&apos;une voiture change de mains, plusieurs délais se déclenchent. Les
              connaître, c&apos;est éviter l&apos;amende et l&apos;immobilisation.
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={rulesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            style={{ borderBottom: '1px solid rgba(201,168,76,0.14)' }}
          >
            {RULES.map((rule) => (
              <RuleRow key={rule.title} rule={rule} />
            ))}
          </m.div>

          <div style={{ marginTop: 40 }}>
            <DoubleCta />
          </div>
        </div>
      </section>

      {/* ── D. FAQ (aimant GEO immatriculation) ──────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '104px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={eyebrowStyle}>QUESTIONS FRÉQUENTES</p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}>
              Immatriculation en France : vos questions
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

      {/* ── E. Maillage interne ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '72px 24px' }}>
        <p style={{
          textAlign: 'center',
          fontSize: 14,
          color: 'var(--text-muted)',
          lineHeight: 1.85,
          margin: '0 auto',
          maxWidth: 760,
        }}>
          Ce que ces chiffres impliquent, concrètement :{' '}
          <Link to="/roulez-legal-apres-achat" style={{ color: 'var(--gold-light)' }}>
            rouler légal après avoir acheté une voiture
          </Link>
          {', '}
          <Link to="/articles/assurer-vehicule-achete-chez-particulier" style={{ color: 'var(--gold-light)' }}>
            assurer un véhicule acheté chez un particulier
          </Link>
          {', ou '}
          <Link to="/carte-grise" style={{ color: 'var(--gold-light)' }}>
            faire sa carte grise en ligne
          </Link>
          .
        </p>
      </section>

      {/* ── F. CTA final ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '96px 24px' }}>
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
            Un véhicule qui vient de changer de titulaire ?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 26px', lineHeight: 1.7 }}>
            Attestation d&apos;assurance immédiate, carte grise en ligne. Roulez
            couvert et en règle dès aujourd&apos;hui.
          </p>
          <DoubleCta />
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '20px 0 0', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Souscription 100 % en ligne, 24h/24 et 7j/7, attestation immédiate.
          </p>
        </m.div>
      </section>

      <Footer />
    </>
  );
}

export default BarometreImmatriculations;
