import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  ArrowRight, Phone, FileText, ChevronRight, Calendar,
  BarChart3, TrendingDown, Repeat, PieChart, ArrowLeftRight,
  CalendarClock, AlertOctagon, ClipboardList, Landmark, Database,
} from 'lucide-react';
import Footer from '../components/Footer';
import AnswerCapsule from '../components/articles/AnswerCapsule';
import { fadeUp } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { jsonLd } from '../lib/seo';

const EASE = [0.22, 1, 0.36, 1];

/* ══════════════════════════════════════════════════════════════════════════
   BAROMÈTRE ASSUTEMPO, édition juillet 2026.

   Chaque chiffre est sourcé et daté, vérifié par lecture directe des pages
   d'origine le 17 juillet 2026. Le marché du neuf (SDES) est suivi tous les
   mois ; le marché de l'occasion n'est publié qu'au rythme annuel par le
   SDES, le dernier bilan disponible reste donc celui de l'année 2025 jusqu'à
   la prochaine publication. Aucun chiffre non confirmé n'est publié : le
   détail figure dans la section Méthodologie de la page.

   Sources vérifiées :
   - SDES, immatriculations de voitures particulières neuves en juin 2026
     (CVS-CJO), publié le 2 juillet 2026.
   - SDES, bilan annuel des immatriculations 2025 (marché de l'occasion),
     publié le 11 février 2026.
   - data.gouv.fr, jeu de données "Immatriculations de véhicules routiers"
     (SDES), dernière mise à jour le 17 juillet 2026.
   ══════════════════════════════════════════════════════════════════════════ */

const EDITION = 'juillet 2026';
const DATE_MAJ = '17 juillet 2026';
const DATE_MAJ_ISO = '2026-07-17';

/* ── Réponse en bref (GEO) ────────────────────────────────────────────────── */
const CAPSULE = {
  answer:
    "Selon le Baromètre AssuTempo de juillet 2026, 141 300 voitures particulières neuves ont été immatriculées en France en juin 2026, en baisse de 2,6 % sur un mois (SDES, données corrigées). Le marché de l'occasion, plus proche des besoins d'assurance immédiate et de carte grise, a représenté 5,5 millions de véhicules vendus sur l'année 2025, soit 76,9 % de l'ensemble des achats de voitures particulières. Chiffres sourcés et datés, mis à jour chaque mois.",
  facts: [
    {
      anchor: '141 300',
      text: 'Voitures neuves immatriculées en juin 2026, données CVS-CJO (SDES, publié le 2 juillet 2026).',
    },
    {
      anchor: '76,9 %',
      text: "Part de l'occasion dans les achats de voitures particulières en France en 2025 (SDES, publié le 11 février 2026).",
    },
    {
      anchor: '1 mois',
      text: "Délai légal pour immatriculer un véhicule au nom du nouveau titulaire, à compter de la date de cession (article R322-5 du code de la route).",
    },
  ],
  updated: DATE_MAJ,
};

/* ── Chiffres clés du mois ────────────────────────────────────────────────── */
const CHIFFRES = [
  {
    Icon: BarChart3,
    value: '141 300',
    label: 'Voitures particulières neuves immatriculées en juin 2026',
    body:
      "Selon le Baromètre AssuTempo de juillet 2026, 141 300 voitures particulières neuves ont été immatriculées en France en juin 2026, en données corrigées des variations saisonnières et des jours ouvrables (CVS-CJO).",
    source: 'SDES, immatriculations de voitures particulières neuves en juin 2026, publié le 2 juillet 2026.',
  },
  {
    Icon: TrendingDown,
    value: '-2,6 %',
    label: 'Évolution du marché du neuf sur un mois',
    body:
      "Selon le Baromètre AssuTempo de juillet 2026, les immatriculations de voitures neuves reculent de 2,6 % entre mai (145 100 unités) et juin 2026, en données CVS-CJO.",
    source: 'SDES, même communiqué, publié le 2 juillet 2026.',
  },
  {
    Icon: Repeat,
    value: '5,5 millions',
    label: "Voitures d'occasion vendues en France en 2025",
    body:
      "Selon le Baromètre AssuTempo de juillet 2026, 5,5 millions de voitures particulières d'occasion ont changé de titulaire en France en 2025, un volume en hausse de 0,9 % sur un an.",
    source: 'SDES, bilan annuel des immatriculations 2025, publié le 11 février 2026.',
  },
  {
    Icon: PieChart,
    value: '76,9 %',
    label: "Part de l'occasion dans les achats de voitures particulières",
    body:
      "Selon le Baromètre AssuTempo de juillet 2026, plus des trois quarts des voitures particulières achetées en France en 2025 provenaient du marché de l'occasion, contre 23,1 % de véhicules neufs.",
    source: 'SDES, bilan annuel des immatriculations 2025, publié le 11 février 2026.',
  },
  {
    Icon: ArrowLeftRight,
    value: '≈ 3,3 pour 1',
    label: "Occasion vendue pour chaque voiture neuve immatriculée",
    body:
      "Selon le Baromètre AssuTempo de juillet 2026, environ 3,3 voitures d'occasion changent de titulaire pour chaque voiture neuve immatriculée en France, d'après la répartition 76,9 % / 23,1 % publiée par le SDES pour 2025 (retraitement AssuTempo : 76,9 divisé par 23,1).",
    source: 'Calcul AssuTempo à partir du bilan SDES 2025, publié le 11 février 2026.',
  },
];

/* ── Rappels réglementaires datés ─────────────────────────────────────────── */
const REPERES = [
  {
    Icon: CalendarClock,
    title: '1 mois pour immatriculer le véhicule à son nom',
    body:
      "Le nouveau titulaire d'un véhicule d'occasion dispose d'un mois calendaire à compter de la date de cession pour faire établir le certificat d'immatriculation à son nom.",
    source: 'Légifrance, article R322-5 du code de la route, consulté le 17 juillet 2026.',
  },
  {
    Icon: AlertOctagon,
    title: "Jusqu'à 750 € en cas de retard",
    body:
      "Dépasser ce délai expose à une contravention de 4e classe : amende forfaitaire de 135 €, minorée à 90 € en paiement rapide, majorée à 375 €, et jusqu'à 750 € devant le tribunal.",
    source: 'Service-public.gouv.fr et article 131-13 du code pénal, consultés le 17 juillet 2026.',
  },
  {
    Icon: ClipboardList,
    title: 'Le certificat provisoire classique, un mois en France',
    body:
      "Une fois le dossier d'immatriculation déposé, le certificat provisoire permet de circuler un mois, uniquement sur le territoire français, le temps que le titre définitif soit fabriqué et expédié.",
    source: 'Ants.gouv.fr / France Titres, consulté le 17 juillet 2026.',
  },
  {
    Icon: Landmark,
    title: 'Plaques WW : 4 mois, sans reconduction depuis 2026',
    body:
      "Réservées aux véhicules neufs ou importés sans titre définitif, les plaques provisoires WW et leur certificat associé restent valables 4 mois à compter de la délivrance. Depuis la réforme de 2026, ce délai ne se prolonge plus.",
    source: "Service public +, démarche de prolongation d'un CPI WW, consulté le 17 juillet 2026.",
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

const JSONLD_DATASET = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: `Baromètre AssuTempo des immatriculations, édition ${EDITION}`,
  description:
    "Sélection mensuelle de chiffres sourcés sur les immatriculations de véhicules en France (marché du neuf et de l'occasion), retraités et publiés par AssuTempo à partir des données du SDES et de data.gouv.fr.",
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

/* ── Bloc double CTA, discret ─────────────────────────────────────────────── */
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

/* ── Carte chiffre clé ────────────────────────────────────────────────────── */
function StatCard({ stat }) {
  const { Icon } = stat;
  return (
    <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: 'var(--gold-glow)', border: '1.5px solid var(--gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={18} color="var(--gold)" strokeWidth={1.75} />
        </div>
        <div>
          <p style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            {stat.value}
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: 1.4 }}>
            {stat.label}
          </p>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
        {stat.body}
      </p>
      <p style={{ fontSize: 11.5, color: 'var(--text-subtle)', margin: 0, paddingTop: 10, borderTop: '1px solid rgba(201,168,76,0.15)' }}>
        Source : {stat.source}
      </p>
    </div>
  );
}

/* ── Carte repère réglementaire ───────────────────────────────────────────── */
function RepereCard({ repere }) {
  const { Icon } = repere;
  return (
    <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon size={18} color="var(--gold)" strokeWidth={1.75} style={{ flexShrink: 0 }} />
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.35 }}>
          {repere.title}
        </h3>
      </div>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
        {repere.body}
      </p>
      <p style={{ fontSize: 11.5, color: 'var(--text-subtle)', margin: 0 }}>
        {repere.source}
      </p>
    </div>
  );
}

function BarometreImmatriculations() {
  const [statsRef, statsInView] = useScrollReveal();
  const [repereRef, repereInView] = useScrollReveal();

  return (
    <>
      <Helmet>
        <title>{`Baromètre immatriculations ${EDITION} | AssuTempo`}</title>
        <meta
          name="description"
          content={`Chiffres immatriculations ${EDITION} en France : neuf, occasion, évolutions mensuelles. Baromètre sourcé SDES et data.gouv.fr, mis à jour chaque mois.`}
        />
        <link rel="canonical" href="https://assutempo.fr/barometre-immatriculations" />
        <meta property="og:title" content={`Baromètre immatriculations ${EDITION} | AssuTempo`} />
        <meta
          property="og:description"
          content={`Chiffres immatriculations ${EDITION} en France : neuf, occasion, évolutions mensuelles. Baromètre sourcé SDES et data.gouv.fr, mis à jour chaque mois.`}
        />
        <meta property="og:url" content="https://assutempo.fr/barometre-immatriculations" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_DATASET)}</script>
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
            BAROMÈTRE MENSUEL DES IMMATRICULATIONS
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
            Baromètre AssuTempo des immatriculations, {EDITION}
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: 680,
            margin: '0 auto 12px',
            lineHeight: 1.75,
          }}>
            Chaque mois, quelques chiffres vérifiables sur le marché français des
            immatriculations, neuf et occasion, sourcés et datés.
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
            Mis à jour le {DATE_MAJ} · nouvelle édition chaque mois
          </p>

          <div style={{ maxWidth: 820, margin: '0 auto 8px' }}>
            <AnswerCapsule capsule={CAPSULE} />
          </div>
        </m.div>
      </section>

      {/* ── B. Chiffres clés ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '80px 24px 96px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <m.div
            ref={statsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ marginBottom: 44, textAlign: 'center' }}
          >
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              CHIFFRES CLÉS DU MOIS
            </p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}>
              Immatriculations de voitures en France : neuf et occasion
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 auto', lineHeight: 1.7, maxWidth: 640 }}>
              Le marché du neuf est suivi mois par mois par le SDES. Celui de
              l&apos;occasion, plus proche des besoins d&apos;assurance immédiate,
              n&apos;est publié qu&apos;une fois par an : le dernier bilan complet reste
              celui de 2025.
            </p>
          </m.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {CHIFFRES.map((stat) => (
              <StatCard key={stat.value} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── C. Rappels réglementaires ────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <m.div
            ref={repereRef}
            initial={{ opacity: 0, y: 30 }}
            animate={repereInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ marginBottom: 44, textAlign: 'center' }}
          >
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              REPÈRES RÉGLEMENTAIRES
            </p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}>
              Ce que dit la loi après un changement de titulaire
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 auto', lineHeight: 1.7, maxWidth: 640 }}>
              Les délais et montants ci-dessous sont vérifiés à chaque mise à jour
              du baromètre, avec leur source et leur date de consultation.
            </p>
          </m.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {REPERES.map((repere) => (
              <RepereCard key={repere.title} repere={repere} />
            ))}
          </div>
        </div>
      </section>

      {/* ── D. Méthodologie ──────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Database size={20} color="var(--gold)" strokeWidth={1.75} />
            <h2 style={{
              fontSize: 'clamp(1.4rem, 2.8vw, 1.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              margin: 0,
            }}>
              Méthodologie
            </h2>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.8 }}>
            Le baromètre s&apos;appuie sur deux sources publiques : les communiqués
            mensuels du SDES (Service des données et études statistiques,
            ministère chargé de la Transition écologique) pour le marché du
            neuf, et le jeu de données &laquo;&nbsp;Immatriculations de véhicules
            routiers&nbsp;&raquo; publié sur data.gouv.fr, qui couvre aussi les
            changements de titulaire des véhicules d&apos;occasion au niveau
            communal.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.8 }}>
            Les retraitements se limitent à des calculs simples et vérifiables :
            une part de marché, un écart en pourcentage entre deux volumes
            publiés, un ratio entre deux chiffres officiels. Aucune
            extrapolation ni modèle statistique propre à AssuTempo.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.8 }}>
            Limite assumée : le marché de l&apos;occasion n&apos;est publié par le SDES
            qu&apos;au rythme annuel, contrairement au neuf, suivi chaque mois. Les
            chiffres occasion de cette édition restent donc ceux du dernier
            bilan disponible (année 2025) jusqu&apos;à la publication du prochain
            par le SDES.
          </p>
        </div>
      </section>

      {/* ── E. Maillage interne ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '72px 24px' }}>
        <p style={{
          textAlign: 'center',
          fontSize: 14,
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          margin: '0 auto',
          maxWidth: 760,
        }}>
          Pour comprendre ce que ces chiffres impliquent après un achat :{' '}
          <Link to="/roulez-legal-apres-achat" style={{ color: 'var(--gold-light)' }}>
            rouler légal après avoir acheté une voiture
          </Link>
          , le rétroplanning complet de J0 à J+30.
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
            <Phone size={14} strokeWidth={1.5} />
            09 74 19 78 20, Lun-Ven 9h-21h, Sam 9h-20h
          </p>
        </m.div>
      </section>

      <Footer />
    </>
  );
}

export default BarometreImmatriculations;
