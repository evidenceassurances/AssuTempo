import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  ArrowRight, Phone, Truck, Package, Users, Briefcase,
  ShieldCheck, AlertOctagon, ChevronRight, Calendar, FileText,
} from 'lucide-react';
import Footer from '../components/Footer';
import AnswerCapsule from '../components/articles/AnswerCapsule';
import AccordionItem from '../components/ui/AccordionItem';
import { fadeUp, stagger } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { jsonLd } from '../lib/seo';

/* ─────────────────────────────────────────────────────────────────────────────
   Page pilier du cluster « type de vehicule ». Elle recupere l'URL historique
   /assurance-temporaire-vehicule-utilitaire (952 impressions Google), qui
   pointait jusqu'ici vers l'article demenagement : une redirection vers un cas
   d'usage unique repondait a cote de la requete. L'article demenagement reste
   la page de detail, cette page couvre l'intention large.

   Chiffres verifies le 1er aout 2026 :
   - permis B : PTAC <= 3,5 t, 9 places max, remorque <= 750 kg (ou somme des
     PTAC <= 3 500 kg), mention 96 jusqu'a 4 250 kg -> service-public.gouv.fr
   - defaut d'assurance : delit, 3 750 EUR d'amende, amende forfaitaire
     delictuelle 500 EUR (400 minoree, 1 000 majoree), suspension jusqu'a 3 ans
     et confiscation possible -> article L324-2 du code de la route
   - obligation d'assurance : article L211-1 du code des assurances
   ────────────────────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1];
const MAJ = '1er août 2026';

/* ── Réponse en bref (GEO) ───────────────────────────────────────────────── */
const CAPSULE = {
  answer:
    "Une assurance temporaire utilitaire couvre une camionnette de 1 à 90 jours, avec attestation immédiate par email. Elle sert quand le besoin est ponctuel : déménagement, achat ou revente, prêt entre proches, mission de convoyage. La responsabilité civile est incluse, sans engagement annuel.",
  facts: [
    {
      anchor: '3,5 t',
      text: "PTAC maximal d'un utilitaire conduit avec un simple permis B, dans la limite de 9 places assises (service-public.gouv.fr, consulté le 1er août 2026).",
    },
    {
      anchor: '1 à 90 jours',
      text: "Durée d'un contrat temporaire AssuTempo, choisie à la journée près, sans reconduction automatique.",
    },
    {
      anchor: '3 750 €',
      text: "Amende encourue pour un utilitaire mis en circulation sans assurance : c'est un délit, pas une contravention (article L324-2 du code de la route).",
    },
  ],
  updated: MAJ,
};

/* ── Les quatre situations qui amènent ici ───────────────────────────────── */
const CAS = [
  {
    Icon: Package,
    title: 'Un déménagement, le temps d’un week-end',
    body:
      "Le cas le plus courant. La camionnette est empruntée à un proche ou tout juste achetée, et il faut être couvert du chargement au retour des clés. Si vous louez en agence, regardez d'abord votre contrat de location : une assurance y est presque toujours incluse, inutile d'en payer une seconde.",
    lien: { text: 'Le guide du déménagement en utilitaire', href: '/articles/assurance-temporaire-utilitaire-demenagement' },
  },
  {
    Icon: Truck,
    title: 'Un utilitaire acheté ou revendu',
    body:
      "Un véhicule d'occasion doit être assuré avant le premier trajet, y compris pour le ramener chez soi. Le contrat temporaire couvre les jours qui séparent l'achat de la mise en place d'une formule annuelle, ou la période de mise en vente d'un utilitaire dont on veut se séparer.",
    lien: { text: 'Assurer un véhicule acheté chez un particulier', href: '/articles/assurer-vehicule-achete-chez-particulier' },
  },
  {
    Icon: Users,
    title: 'Un prêt entre proches ou entre artisans',
    body:
      "Prêter sa camionnette n'est pas neutre. Beaucoup de contrats annuels acceptent le prêt de volant, mais avec une franchise majorée quand le conducteur n'est pas désigné, et certains l'excluent. Vérifier avant, et couvrir le conducteur occasionnel séparément, évite une mauvaise surprise sur le constat.",
    lien: { text: "Ce que couvre le prêt d'un véhicule", href: '/articles/assurance-temporaire-pret-de-vehicule' },
  },
  {
    Icon: Briefcase,
    title: 'Une mission ponctuelle ou un convoyage',
    body:
      "Un utilitaire à déplacer d'un dépôt à l'autre, un véhicule de société à ramener après réparation, un renfort de flotte sur une semaine chargée. Le contrat temporaire s'ajuste à la mission plutôt que d'ouvrir une ligne de plus dans un contrat de flotte.",
    lien: { text: 'Le cadre du convoyage professionnel', href: '/articles/assurance-temporaire-convoyage-professionnel' },
  },
];

/* ── Ce que le permis B autorise ─────────────────────────────────────────── */
const PERMIS = [
  {
    cle: '3,5 t de PTAC',
    txt: "C'est la limite du permis B. Elle englobe la quasi-totalité des fourgons de déménagement du marché, jusqu'aux volumes de 20 m³, qui sont précisément calibrés pour rester sous cette barre une fois chargés.",
  },
  {
    cle: '9 places assises',
    txt: 'Conducteur inclus. Au-delà, le permis D devient nécessaire, même si le véhicule ressemble à un utilitaire ordinaire.',
  },
  {
    cle: 'Remorque : 750 kg',
    txt: "Une remorque de 750 kg de PTAC ou moins s'attelle librement. Au-dessus, elle reste possible tant que la somme des deux PTAC ne dépasse pas 3 500 kg.",
  },
  {
    cle: 'Mention 96 : 4 250 kg',
    txt: "Pour un attelage dont la somme des PTAC dépasse 3 500 kg sans excéder 4 250 kg, une formation de 7 heures ajoute la mention 96 au permis B. Utile pour un déménagement avec remorque chargée.",
  },
];

/* ── FAQ (identique au JSON-LD FAQPage) ──────────────────────────────────── */
const FAQ = [
  {
    q: 'Peut-on assurer un utilitaire pour une seule journée ?',
    a: "Oui. Un contrat temporaire se souscrit à la journée près, de 1 à 90 jours, et l'attestation part par email en quelques minutes. C'est la formule adaptée à un déménagement d'un week-end ou à un aller-retour de livraison, sans souscrire un contrat annuel pour deux trajets.",
  },
  {
    q: 'Quel utilitaire peut-on conduire avec un permis B ?',
    a: "Tout véhicule dont le poids total autorisé en charge ne dépasse pas 3,5 tonnes et qui compte au maximum 9 places assises, conducteur compris. Les fourgons de 20 m³ proposés en location entrent dans cette limite. Au-delà de 3,5 tonnes, il faut un permis du groupe lourd.",
  },
  {
    q: "L'assurance temporaire couvre-t-elle la marchandise transportée ?",
    a: "Non. La responsabilité civile obligatoire couvre les dommages causés aux tiers, pas le chargement lui-même. Les meubles, le matériel professionnel ou les biens transportés relèvent d'une garantie distincte, souvent de l'assurance habitation ou d'un contrat marchandises transportées. C'est le point que les clients découvrent le plus souvent trop tard.",
  },
  {
    q: 'Faut-il assurer un utilitaire loué en agence ?',
    a: "Dans la grande majorité des cas, non : le loueur inclut la responsabilité civile dans le contrat de location. La vraie question est le montant de la franchise et l'étendue des garanties. Lisez le contrat avant de souscrire quoi que ce soit en plus, une seconde assurance ferait double emploi.",
  },
  {
    q: "Que risque-t-on à rouler avec un utilitaire non assuré ?",
    a: "Mettre ou maintenir en circulation un véhicule sans assurance de responsabilité civile est un délit puni de 3 750 euros d'amende (article L324-2 du code de la route). En pratique, l'infraction est le plus souvent traitée par une amende forfaitaire délictuelle de 500 euros, minorée à 400 euros et majorée à 1 000 euros. S'y ajoutent des peines complémentaires possibles : suspension du permis jusqu'à 3 ans, voire confiscation du véhicule.",
  },
  {
    q: 'Un artisan peut-il utiliser une assurance temporaire pour son activité ?',
    a: "L'usage professionnel doit être déclaré à la souscription, car il change la nature du risque. Un utilitaire qui sert à transporter du matériel de chantier ne s'assure pas comme un fourgon de déménagement privé. Indiquez l'usage réel : une déclaration inexacte peut être opposée au moment du sinistre.",
  },
];

/* ── Données structurées ─────────────────────────────────────────────────── */
const JSONLD_BREADCRUMB = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr/' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Assurance temporaire utilitaire',
      item: 'https://assutempo.fr/assurance-temporaire-utilitaire',
    },
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

const JSONLD_SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Assurance auto temporaire pour véhicule utilitaire',
  name: 'Assurance temporaire utilitaire AssuTempo',
  description:
    "Contrat d'assurance auto temporaire pour un véhicule utilitaire, de 1 à 90 jours, responsabilité civile incluse, attestation transmise par email après souscription. Adapté au déménagement, à l'achat ou à la revente, au prêt entre proches et aux missions ponctuelles.",
  /* Une seule entite etablie sur tout le site (index.html). */
  provider: { '@id': 'https://assutempo.fr/#organization' },
  areaServed: { '@type': 'Country', name: 'France' },
  audience: { '@type': 'Audience', audienceType: 'Conducteurs de véhicules utilitaires légers' },
};

const cardBase = {
  background: 'var(--bg-card)',
  border: '1px solid var(--gold-border)',
  borderRadius: 16,
  padding: '22px 20px',
};

/* ── Bloc CTA réutilisable ───────────────────────────────────────────────── */
function DoubleCta() {
  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      <Link
        to="/tarification"
        className="btn-gold"
        style={{ textDecoration: 'none', padding: '14px 26px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
      >
        Assurer mon utilitaire
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

/* ── Carte de cas d'usage ────────────────────────────────────────────────── */
function CasCard({ cas }) {
  const { Icon } = cas;
  return (
    <m.article variants={fadeUp} style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--gold-glow)',
          border: '1px solid var(--gold-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={20} color="var(--gold)" strokeWidth={1.75} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.35 }}>
        {cas.title}
      </h3>
      <p style={{ fontSize: 14.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75 }}>
        {cas.body}
      </p>
      <Link
        to={cas.lien.href}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 13.5,
          fontWeight: 600,
          color: 'var(--gold-light)',
          textDecoration: 'none',
          marginTop: 'auto',
        }}
      >
        {cas.lien.text}
        <ArrowRight size={13} strokeWidth={2} />
      </Link>
    </m.article>
  );
}

function AssuranceTemporaireUtilitaire() {
  const [permisRef, permisInView] = useScrollReveal();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <Helmet>
        <title>Assurance temporaire utilitaire | AssuTempo</title>
        <meta
          name="description"
          content="Assurez un utilitaire de 1 à 90 jours : attestation immédiate par email, responsabilité civile incluse. Déménagement, achat, prêt, convoyage."
        />
        <link rel="canonical" href="https://assutempo.fr/assurance-temporaire-utilitaire" />
        <meta property="og:title" content="Assurance temporaire utilitaire | AssuTempo" />
        <meta
          property="og:description"
          content="Assurez un utilitaire de 1 à 90 jours : attestation immédiate par email, responsabilité civile incluse. Déménagement, achat, prêt, convoyage."
        />
        <meta property="og:url" content="https://assutempo.fr/assurance-temporaire-utilitaire" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_SERVICE)}</script>
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
              <li aria-current="page" style={{ color: 'var(--text-subtle)' }}>Assurance temporaire utilitaire</li>
            </ol>
          </nav>

          <p style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>
            VÉHICULE UTILITAIRE
          </p>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 58px)',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.03em',
            maxWidth: 900,
            margin: '0 auto 16px',
          }}>
            Assurance temporaire pour véhicule utilitaire
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: 680,
            margin: '0 auto 12px',
            lineHeight: 1.75,
          }}>
            De la camionnette empruntée un samedi au fourgon acheté d&apos;occasion : couvrez
            l&apos;utilitaire exactement le temps qu&apos;il roule, de 1 à 90 jours.
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
            Mis à jour le {MAJ}
          </p>

          <div style={{ maxWidth: 820, margin: '0 auto 8px' }}>
            <AnswerCapsule capsule={CAPSULE} />
          </div>
        </m.div>
      </section>

      {/* ── B. CTA haut ──────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '16px 24px 64px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <DoubleCta />
        </div>
      </section>

      {/* ── C. Les quatre situations ─────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ marginBottom: 48, maxWidth: 720 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              CAS D&apos;USAGE
            </p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}>
              Dans quels cas assure-t-on un utilitaire à la journée ?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
              Quatre situations reviennent en permanence. Elles ont un point commun : le besoin
              dure quelques jours, le contrat annuel en dure trois cent soixante-cinq.
            </p>
          </div>

          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 18,
            }}
          >
            {CAS.map((cas) => <CasCard key={cas.title} cas={cas} />)}
          </m.div>
        </div>
      </section>

      {/* ── D. Permis B ──────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <m.div
            ref={permisRef}
            initial={{ opacity: 0, y: 30 }}
            animate={permisInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ marginBottom: 40 }}
          >
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              PERMIS ET GABARIT
            </p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}>
              Quel utilitaire peut-on conduire avec un permis B ?
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
              La question se pose surtout au moment de réserver un volume de chargement. Les
              seuils sont fixés par la réglementation du permis de conduire, pas par le loueur.
            </p>
          </m.div>

          <div style={{ display: 'grid', gap: 12 }}>
            {PERMIS.map((p) => (
              <m.div
                key={p.cle}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{
                  ...cardBase,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  padding: '18px 20px',
                }}
              >
                <span style={{
                  flexShrink: 0,
                  padding: '5px 12px',
                  borderRadius: 999,
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid var(--gold-border)',
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  whiteSpace: 'nowrap',
                }}>
                  {p.cle}
                </span>
                <p style={{ fontSize: 14.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
                  {p.txt}
                </p>
              </m.div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-subtle)', margin: '18px 0 0', lineHeight: 1.7 }}>
            Source : service-public.gouv.fr, catégories de véhicules autorisées par le permis B,
            consulté le {MAJ}.
          </p>
        </div>
      </section>

      {/* ── E. Ce qui est couvert, et ce qui ne l'est pas ────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--text)',
            margin: '0 0 32px',
          }}>
            Que couvre exactement le contrat, et que laisse-t-il de côté ?
          </h2>

          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ ...cardBase, display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 14 }}
          >
            <ShieldCheck size={22} color="var(--gold)" strokeWidth={1.75} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>
                Inclus : la responsabilité civile, obligatoire pour rouler
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75 }}>
                Un utilitaire est un véhicule terrestre à moteur comme un autre. Il doit être
                couvert au minimum en responsabilité civile pour circuler, même sur trois
                kilomètres (article L211-1 du code des assurances). C&apos;est cette garantie qui
                indemnise les dommages causés aux autres, et c&apos;est elle que réclame le
                gendarme au bord de la route.
              </p>
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
            style={{ ...cardBase, display: 'flex', gap: 16, alignItems: 'flex-start' }}
          >
            <Package size={22} color="var(--gold)" strokeWidth={1.75} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>
                Exclu : ce que vous transportez dans la camionnette
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75 }}>
                La responsabilité civile protège les tiers, pas le chargement. Un carton de
                vaisselle brisé dans un freinage, une machine à laver qui bascule, du matériel de
                chantier volé pendant une pause : ces dommages relèvent d&apos;une autre garantie,
                le plus souvent l&apos;assurance habitation ou un contrat marchandises
                transportées. Autant le savoir avant de charger, pas après.
              </p>
            </div>
          </m.div>
        </div>
      </section>

      {/* ── F. Sanction ──────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '96px 24px' }}>
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            maxWidth: 820,
            margin: '0 auto',
            background: 'var(--gold-glow)',
            border: '1px solid var(--gold-border)',
            borderLeft: '3px solid var(--gold)',
            borderRadius: '0 14px 14px 0',
            padding: '24px 26px',
          }}
        >
          <p style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 12px' }}>
            <AlertOctagon size={15} strokeWidth={2} />
            Ce que dit la loi
          </p>
          <p style={{ fontSize: 15.5, color: 'var(--text)', margin: 0, lineHeight: 1.8 }}>
            Mettre ou maintenir en circulation un utilitaire non assuré est un délit, pas une
            simple contravention : l&apos;amende encourue s&apos;élève à 3 750 euros (article
            L324-2 du code de la route). Le traitement courant passe par une amende forfaitaire
            délictuelle de 500 euros, ramenée à 400 euros en paiement rapide et portée à
            1 000 euros en cas de retard. Le juge peut y ajouter une suspension de permis
            jusqu&apos;à trois ans, et la confiscation du véhicule si le conducteur en est le
            propriétaire.
          </p>
        </m.div>
      </section>

      {/* ── G. Maillage interne ──────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '72px 24px' }}>
        <p style={{
          textAlign: 'center',
          fontSize: 14,
          color: 'var(--text-muted)',
          lineHeight: 1.8,
          margin: '0 auto',
          maxWidth: 760,
        }}>
          Pour aller plus loin :{' '}
          <Link to="/articles/assurance-temporaire-utilitaire-demenagement" style={{ color: 'var(--gold-light)' }}>
            le guide complet du déménagement en utilitaire
          </Link>
          ,{' '}
          <Link to="/articles/assurance-temporaire-convoyage-professionnel" style={{ color: 'var(--gold-light)' }}>
            le convoyage professionnel
          </Link>
          , ou, si l&apos;utilitaire vient d&apos;être acheté,{' '}
          <Link to="/roulez-legal-apres-achat" style={{ color: 'var(--gold-light)' }}>
            les deux démarches à mener après l&apos;achat
          </Link>
          . La carte grise du véhicule se demande{' '}
          <Link to="/carte-grise" style={{ color: 'var(--gold-light)' }}>
            en ligne au même endroit
          </Link>
          .
        </p>
      </section>

      {/* ── H. FAQ ───────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '104px 24px' }}>
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
              Assurer un utilitaire : vos questions
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

      {/* ── I. CTA final ─────────────────────────────────────────────────── */}
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
            Votre utilitaire, couvert le temps qu&apos;il roule
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 26px', lineHeight: 1.7 }}>
            Durée choisie à la journée près, attestation par email, responsabilité civile incluse.
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

export default AssuranceTemporaireUtilitaire;
