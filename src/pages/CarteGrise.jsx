import { useState, useEffect, useRef } from 'react';
import { jsonLd } from '../lib/seo';
import { trackEvent } from '../lib/analytics';
import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Phone, ShieldCheck, BadgeCheck, FileCheck, CreditCard,
  Car, FileText, Home, Lock, MessageCircle, Check, Clock, Landmark, Building2,
} from 'lucide-react';
import Footer from '../components/Footer';
import AnswerCapsule from '../components/articles/AnswerCapsule';
import AccordionItem from '../components/ui/AccordionItem';
import { fadeUp, stagger } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';

/* Iframe prescripteur officielle Certimat (AssuCarteGrise), desormais autorisee
   sur notre domaine. Le parametre partner=1153 assure l'attribution et la
   commission : ne jamais le retirer ni le modifier. */
const CERTIMAT_IFRAME_URL = 'https://certimat.fr/iframe/prescripteurs?partner=1153';
const CERTIMAT_ORIGIN = 'https://certimat.fr';

const EASE = [0.22, 1, 0.36, 1];

/* ══════════════════════════════════════════════════════════════════════════════
   CADRE JURIDIQUE : a lire avant toute modification de cette page.

   Le service carte grise passe par la marque CERTIMAT, exploitee par EM Prestige
   Automobiles (EMPA). D'apres les CGU de Certimat (art. 1 et 2), EMPA agit comme
   INTERMEDIAIRE TECHNOLOGIQUE : elle n'est PAS un professionnel habilite au SIV.
   La saisie dans le SIV est realisee par des professionnels habilites par le
   Ministere de l'Interieur, mandates par l'internaute, ou le dossier est transmis
   a l'ANTS (France Titres).

   => Il n'existe donc AUCUN numero d'habilitation SIV ni agrement Tresor Public
      au nom de Certimat / EMPA. Ne JAMAIS ecrire « Certimat est habilite », ni
      afficher un numero d'habilitation a son nom : ce serait une pratique
      commerciale trompeuse (art. L.121-2 du Code de la consommation).
   ══════════════════════════════════════════════════════════════════════════════ */

/* Delai de delivrance du certificat provisoire d'immatriculation (CPI).
   Source du chiffre (verifie le 13 juillet 2026) : les CGU de Certimat portent un
   unique delai contractuel, le « traitement en 24h », defini comme 24 heures
   OUVREES a compter de la reception d'un dossier complet (taxes provisionnees).
   Le site Certimat annonce par ailleurs une edition « immediate » du CPI une fois
   le dossier valide, mais cette immediatete ne figure dans AUCUN engagement
   contractuel : on ne l'affiche donc jamais comme une promesse d'AssuTempo, on
   l'attribue explicitement a Certimat (voir la carte « cadre legal »).
   On tient donc le chiffre conservateur et engageant : sous 24 h ouvrees.
   TODO_A_CONFIRMER : demander a Certimat le delai median REEL constate entre la
   validation du dossier et la mise a disposition du CPI. S'il est notoirement
   plus court (edition immediate dans la journee), le chiffre pourra descendre.
   Une seule constante : hero, timeline, FAQ, meta et JSON-LD la lisent tous. */
const CPI_DELAI = {
  /* Formule courte : puces, badges, chips, title. */
  court: 'sous 24 h ouvrées',
  /* Formule longue : phrases redigees. */
  long: "sous 24 h ouvrées à compter de la réception d'un dossier complet",
  /* Duree ISO 8601 pour le JSON-LD (HowTo / Service). */
  iso: 'PT24H',
};

/* Delai d'acheminement du titre definitif. Certimat annonce « 2 a 3 jours
   ouvres » sur sa home et « 3 a 4 jours ouvres » dans sa FAQ : deux valeurs
   incoherentes, aucune contractuelle. On ne repercute donc aucun des deux
   chiffres et on s'en tient au vrai (fabrication Imprimerie nationale puis envoi).
   TODO_A_CONFIRMER : delai d'acheminement moyen reellement constate. */
const TITRE_DELAI = 'quelques jours ouvrés';

/* TODO_A_CONFIRMER : numero d'habilitation SIV (et, le cas echeant, agrement du
   Tresor Public) du PROFESSIONNEL HABILITE partenaire qui realise la saisie.
   Ce numero n'appartient pas a Certimat / EMPA (voir cadre juridique ci-dessus).
   Laisser a null tant qu'il n'est pas fourni par ecrit ET verifiable : un numero
   approximatif ou attribue a la mauvaise entite est un risque juridique direct.
   Format attendu : { nom: 'Raison sociale du pro', habilitation: 'XXXXXXX', agrement: 'XXXXXXX' } */
const PRO_HABILITE = null;

/* TODO_A_CONFIRMER : prix de la prestation (frais de service, hors taxes
   d'immatriculation percues par l'Etat). Non affiche tant qu'il n'est pas
   confirme : le module Certimat affiche de toute facon le total avant paiement. */
const PRIX_PRESTATION = null;

/* Identite verifiable de l'operateur du service (signaux de confiance reels,
   verifies le 13 juillet 2026 : annuaire-entreprises.data.gouv.fr pour le SIRET
   et l'etat actif, mentions legales + CGU de certimat.fr pour le RCS et le siege). */
const OPERATEUR = {
  raisonSociale: 'EM Prestige Automobiles',
  formeJuridique: 'SAS',
  marque: 'Certimat',
  siret: '832 468 755 00018',
  rcs: 'RCS Versailles 832 468 755',
  siege: '30 bis rue du Vieil Abreuvoir, 78100 Saint-Germain-en-Laye',
};

/* Phrase d'officialite : formulation conforme aux CGU Certimat. Toute
   reecriture doit conserver les trois elements : mise en relation, pros
   habilites par le Ministere de l'Interieur pour la saisie SIV, ou transmission
   a l'ANTS / France Titres. */
const PHRASE_OFFICIALITE =
  `Votre demande est traitée via Certimat, qui vous met en relation avec des professionnels habilités par le Ministère de l'Intérieur pour la saisie dans le SIV, ou transmise à l'Agence Nationale des Titres Sécurisés (ANTS / France Titres).`;

/* ── Reponse en bref (GEO) : reprise du composant des articles ─────────────── */
const CAPSULE = {
  answer:
    `Votre demande de carte grise se fait 100 % en ligne. Le certificat provisoire d'immatriculation (CPI) est délivré ${CPI_DELAI.long} : il vous autorise à rouler en France pendant 1 mois, le temps que la carte grise définitive soit fabriquée et expédiée chez vous.`,
  facts: [
    {
      anchor: CPI_DELAI.court,
      text: `Le certificat provisoire est délivré ${CPI_DELAI.long}, et autorise la circulation en France dès sa délivrance.`,
    },
    {
      anchor: '1 mois',
      text: "Délai légal pour immatriculer un véhicule à son nom après l'achat (article R322-5 du code de la route), et durée de validité du CPI (service-public.gouv.fr).",
    },
    {
      anchor: '135 €',
      text: "Amende forfaitaire encourue si le véhicule circule sans carte grise à votre nom passé ce délai : contravention de 4e classe, jusqu'à 750 € devant le tribunal (article 131-13 du code pénal).",
    },
  ],
  updated: '13 juillet 2026',
};

/* ── Bande de confiance ───────────────────────────────────────────────────── */
const BADGES = [
  { Icon: ShieldCheck, title: 'Saisie SIV par des professionnels habilités' },
  { Icon: BadgeCheck, title: 'Dossier transmis à France Titres (ANTS)' },
  { Icon: FileCheck, title: 'CERFA préremplis et signature électronique' },
  { Icon: CreditCard, title: 'Paiement des taxes en plusieurs fois' },
];

/* ── Comment ca marche : timeline chiffree ────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    time: 'T+0',
    Icon: Car,
    title: 'Identifiez votre véhicule',
    body: 'Saisissez votre plaque, le coût des taxes se calcule automatiquement.',
  },
  {
    num: '02',
    time: '10 min',
    Icon: FileText,
    title: 'Complétez votre dossier',
    body: 'Vos informations et justificatifs en ligne, vos CERFA sont préremplis.',
  },
  {
    num: '03',
    time: CPI_DELAI.court,
    Icon: Clock,
    title: 'Recevez votre certificat provisoire',
    body: "Une fois le dossier vérifié, le certificat provisoire est édité : il vous autorise à rouler en France pendant 1 mois.",
  },
  {
    num: '04',
    time: TITRE_DELAI,
    Icon: Home,
    title: 'Recevez votre carte grise',
    body: "Le titre définitif est fabriqué par l'Imprimerie nationale, puis expédié chez vous sous pli sécurisé.",
  },
];

/* ── Micro-confiance du hero ──────────────────────────────────────────────────
   Trois puces au maximum : au-dela, elles passent sur une ligne de plus sur
   mobile et repoussent l'iframe Certimat sous la ligne de flottaison, ce qui
   annule la reorganisation du 5 juillet (module visible des l'entree de page). */
const MICRO = [
  { Icon: Clock, label: `Certificat provisoire ${CPI_DELAI.court}` },
  { Icon: ShieldCheck, label: 'Saisie SIV par des pros habilités' },
  { Icon: Lock, label: 'Paiement sécurisé' },
];

/* ── FAQ ──────────────────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: 'Quel est le délai légal pour faire sa carte grise après un achat ?',
    a: "Un mois à compter de la date de cession (article R322-5 du code de la route). Passé ce délai, maintenir le véhicule en circulation sans carte grise à votre nom est une contravention de 4e classe : amende forfaitaire de 135 €, jusqu'à 750 € devant le tribunal (article 131-13 du code pénal), et immobilisation possible du véhicule.",
  },
  {
    q: 'Combien de temps pour obtenir le certificat provisoire (CPI) ?',
    a: `Le certificat provisoire d'immatriculation est délivré ${CPI_DELAI.long} : Certimat s'engage dans ses conditions générales sur une vérification du dossier sous 24 heures ouvrées, et annonce une édition immédiate du certificat provisoire une fois le dossier validé. Le CPI s'imprime depuis votre espace et vous autorise à circuler sans attendre le titre définitif.`,
  },
  {
    q: 'Combien de temps le certificat provisoire est-il valable, et où ?',
    a: "Un mois, et en France uniquement (service-public.gouv.fr). Il couvre la période de fabrication et d'expédition de la carte grise définitive. Pour un trajet à l'étranger avant réception du titre, c'est l'assurance qui doit être en règle, pas la carte grise.",
  },
  {
    q: 'Certimat est-il habilité par le Ministère de l\'Intérieur ?',
    a: `Non, et c'est une distinction importante. Certimat est un intermédiaire technologique : la plateforme recueille votre dossier, prépare les CERFA et vérifie les pièces. ${PHRASE_OFFICIALITE} Seuls les professionnels habilités par le Ministère de l'Intérieur peuvent saisir un dossier dans le SIV, et seule l'ANTS (France Titres) délivre le titre.`,
  },
  {
    q: 'Qui opère le service carte grise proposé sur AssuTempo ?',
    a: `Le service est opéré par ${OPERATEUR.raisonSociale} (${OPERATEUR.formeJuridique}) sous la marque ${OPERATEUR.marque}, SIRET ${OPERATEUR.siret}, ${OPERATEUR.rcs}, siège au ${OPERATEUR.siege}. AssuTempo (Evidence Assurances) met le module à votre disposition et vous accompagne, mais ne traite pas lui-même les demandes d'immatriculation. Le service n'est pas une administration : la démarche reste réalisable directement auprès de l'ANTS (France Titres).`,
  },
  {
    q: 'Quels documents faut-il pour ma carte grise ?',
    a: "En général, votre pièce d'identité, un justificatif de domicile, le certificat de cession ou l'ancienne carte grise, et le contrôle technique en cours de validité s'il est requis. Le formulaire vous indique précisément les pièces à fournir.",
  },
  {
    q: 'Puis-je rouler en attendant la carte grise définitive ?',
    a: "Oui, avec le certificat provisoire d'immatriculation, en France, pendant un mois. Attention : le CPI ne dispense jamais d'assurance, la responsabilité civile reste obligatoire dès le premier trajet.",
  },
  {
    q: 'Puis-je payer en plusieurs fois ?',
    a: "Oui, le règlement des taxes peut être échelonné en plusieurs fois lors de votre demande. Le total, taxes et frais de service compris, s'affiche avant tout paiement.",
  },
];

/* ── Documents a preparer (rail gauche du module) ─────────────────────────── */
const DOCS = [
  `Votre plaque ou numéro de formule`,
  `Le certificat de cession ou l'ancienne carte grise`,
  `Un justificatif de domicile récent`,
  `Le contrôle technique en cours de validité, si requis`,
  `Une pièce d'identité et un moyen de paiement`,
];

/* ── Donnees structurees (SEO / GEO) ──────────────────────────────────────── */
const JSONLD_BREADCRUMB = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Carte grise', item: 'https://assutempo.fr/carte-grise' },
  ],
};

const JSONLD_SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: "Démarche de carte grise en ligne (certificat d'immatriculation)",
  name: 'Carte grise en ligne AssuTempo',
  description:
    `Demande de carte grise 100 % en ligne. Le certificat provisoire d'immatriculation (CPI) est délivré ${CPI_DELAI.long} : il autorise à rouler en France pendant 1 mois, le temps que le titre définitif soit fabriqué et expédié. ${PHRASE_OFFICIALITE}`,
  /* Reference vers l'entite Organization/InsuranceAgency du template
     (index.html) : une seule entite etablie sur tout le site. */
  provider: { '@id': 'https://assutempo.fr/#organization' },
  /* L'operateur du service est un intermediaire technologique : schema.org
     « broker » decrit exactement ce role (met en relation, n'execute pas la
     prestation reglementee lui-meme). Ne pas le declarer comme « provider »
     habilite : il ne l'est pas (voir cadre juridique en tete de fichier). */
  broker: {
    '@type': 'Organization',
    name: OPERATEUR.raisonSociale,
    alternateName: OPERATEUR.marque,
    url: 'https://certimat.fr',
    identifier: [
      { '@type': 'PropertyValue', name: 'SIRET', value: OPERATEUR.siret.replace(/\s/g, '') },
      { '@type': 'PropertyValue', name: 'RCS', value: OPERATEUR.rcs },
    ],
  },
  areaServed: 'FR',
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: 'https://assutempo.fr/carte-grise',
    servicePhone: '+33974197820',
  },
};

/* HowTo : le delai chiffre, lisible par les moteurs generatifs, adosse a la
   timeline affichee (meme tableau STEPS, jamais de contenu invisible). */
const JSONLD_HOWTO = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: "Obtenir sa carte grise et son certificat provisoire d'immatriculation en ligne",
  totalTime: CPI_DELAI.iso,
  step: STEPS.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: `${s.time} : ${s.title}`,
    text: s.body,
  })),
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

function CarteGrise() {
  const [stepsRef, stepsInView] = useScrollReveal();
  const [badgesRef, badgesInView] = useScrollReveal();
  const [openIndex, setOpenIndex] = useState(0);

  const iframeRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState(null);

  /* Ouvre l'assistant Tempo depuis n'importe quel bouton de la page. */
  const openAssistant = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('assutempo:open-assistant'));
    }
  };

  /* Event GA4 au chargement de l'iframe */
  const handleIframeLoad = () => {
    trackEvent('carte_grise_view');
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
        <title>Carte grise en ligne : CPI sous 24 h ouvrées | AssuTempo</title>
        <meta name="description" content="Carte grise 100% en ligne : certificat provisoire d'immatriculation délivré sous 24 h ouvrées, valable 1 mois pour rouler en France. Titre définitif livré chez vous." />
        <link rel="canonical" href="https://assutempo.fr/carte-grise" />
        <meta property="og:title" content="Carte grise en ligne : CPI sous 24 h ouvrées | AssuTempo" />
        <meta property="og:description" content="Carte grise 100% en ligne : certificat provisoire d'immatriculation délivré sous 24 h ouvrées, valable 1 mois pour rouler en France. Titre définitif livré chez vous." />
        <meta property="og:url" content="https://assutempo.fr/carte-grise" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_SERVICE)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_HOWTO)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_FAQ)}</script>
      </Helmet>

      {/* ── A. Hero compact : le module Certimat est juste dessous, visible
             des l'arrivee. L'explication tient en trois lignes. ──────────── */}
      <section style={{
        paddingTop: 140,
        paddingBottom: 40,
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
            marginBottom: 16,
            letterSpacing: '-0.03em',
          }}>
            Votre carte grise en ligne, sans la paperasse
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: 660,
            margin: '0 auto 20px',
            lineHeight: 1.75,
          }}>
            Démarche 100% en ligne. Certificat provisoire d&apos;immatriculation délivré
            {' '}{CPI_DELAI.court} : vous roulez en France pendant 1 mois, le temps que la
            carte grise définitive arrive chez vous.
          </p>

          {/* Micro-confiance */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px 22px',
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
        </m.div>
      </section>

      {/* ── B. Module Certimat (iframe officielle), directement sous le
             hero : visible des l entree de page, l explication au-dessus. ── */}
      <section id="demande" style={{ background: 'var(--bg)', padding: '24px 24px 96px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto 28px', textAlign: 'center' }}>
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
            Identifiez votre véhicule, complétez votre dossier, recevez votre titre :
            tout se passe ci-dessous, avec notre partenaire Certimat.
          </p>
        </div>

        {/* GRILLE 3 colonnes : documents / module / aide */}
        <div className="cg-demande-grid">

          {/* ---------- RAIL GAUCHE : documents a preparer ---------- */}
          <aside className="cg-col cg-col-left cg-rail" aria-label="Documents à préparer">
            <div style={cardBase}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
                Préparez votre demande
              </h3>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 13 }}>
                {DOCS.map((d, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span
                      aria-hidden
                      style={{
                        flexShrink: 0, width: 22, height: 22, borderRadius: 7, marginTop: 1,
                        background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
                        color: 'var(--gold-light)', display: 'grid', placeItems: 'center',
                      }}
                    >
                      <Check size={13} strokeWidth={2.5} />
                    </span>
                    <span style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>{d}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 12.5, color: 'var(--text-subtle)', margin: '16px 0 0', lineHeight: 1.55 }}>
                Le formulaire vous indique précisément les pièces selon votre situation.
              </p>
            </div>
          </aside>

          {/* ---------- CENTRE : iframe Certimat ---------- */}
          <div className="cg-col cg-col-iframe">
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
              Service opéré par {OPERATEUR.raisonSociale} sous la marque {OPERATEUR.marque}
              {' '}(SIRET {OPERATEUR.siret}).
            </p>
          </div>

          {/* ---------- RAIL DROIT : aide et chat ---------- */}
          <aside className="cg-col cg-col-right cg-rail" aria-label="Aide à la demande">
            <div style={{ ...cardBase, background: 'rgba(201,168,76,0.05)' }}>
              <span
                aria-hidden
                style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
                  color: 'var(--gold-light)', display: 'grid', placeItems: 'center', marginBottom: 14,
                }}
              >
                <MessageCircle size={19} strokeWidth={1.75} />
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
                Une question ? On vous guide
              </h3>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
                Un doute pendant votre demande ? Notre concierge Tempo vous répond en direct,
                tout de suite.
              </p>
              <button
                type="button"
                onClick={openAssistant}
                style={{
                  width: '100%',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                  padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
                  border: '1px solid transparent',
                  background: 'linear-gradient(135deg, var(--gold), var(--gold-deep))',
                  color: '#1a1206',
                }}
              >
                <MessageCircle size={17} strokeWidth={2} aria-hidden />
                Discuter avec Tempo
              </button>
            </div>

            <div style={{ ...cardBase, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 6px' }}>
                Vous préférez la voix ?
              </p>
              <a
                href="tel:0974197820"
                style={{ fontSize: 20, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Phone size={18} strokeWidth={1.75} aria-hidden />
                09 74 19 78 20
              </a>
              <p style={{ fontSize: 12.5, color: 'var(--text-subtle)', margin: '8px 0 0' }}>
                Lun-Ven 9h-21h | Sam 9h-20h
              </p>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-subtle)', lineHeight: 1.5, margin: 0, textAlign: 'center' }}>
              La saisie dans le SIV est réalisée par des professionnels habilités par le
              Ministère de l&apos;Intérieur. Données traitées de façon sécurisée.
            </p>
          </aside>
        </div>
      </section>

      {/* ── C. Delais : reponse en bref (statique, GEO) + timeline chiffree ── */}
      <section style={{ background: 'var(--bg-2)', padding: '104px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>

          {/* Reponse en bref : contenu critique, 100 % statique, aucune
              animation ni etat initial invisible (regle du 8 juillet). */}
          <div style={{ maxWidth: 820, margin: '0 auto 64px' }}>
            <AnswerCapsule capsule={CAPSULE} />
          </div>

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
              Combien de temps ça prend ?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
              De la plaque au titre définitif, les délais étape par étape.
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
                {/* Delai chiffre de l'etape : signal GEO, present dans le HTML prerendu. */}
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  marginBottom: 12,
                  borderRadius: 999,
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid var(--gold-border)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}>
                  {step.time}
                </span>
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

      {/* ── D. Bande de confiance ────────────────────────────────────────── */}
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

      {/* ── E. Cadre legal et identite verifiable ────────────────────────────
             Contenu 100 % statique : ce sont les signaux d'officialite lus par
             les moteurs generatifs, ils doivent etre dans le HTML prerendu et
             lisibles des le premier paint, sans JS. Formulation verrouillee :
             voir le cadre juridique en tete de fichier avant toute reecriture. */}
      <section style={{ background: 'var(--bg)', padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              CADRE LÉGAL
            </p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}>
              Qui traite votre demande, exactement ?
            </h2>
          </div>

          <div className="cg-legal-grid">
            {/* ---------- Officialite : formulation conforme aux CGU Certimat ---------- */}
            <div style={cardBase}>
              <span
                aria-hidden
                style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
                  color: 'var(--gold-light)', display: 'grid', placeItems: 'center', marginBottom: 14,
                }}
              >
                <Landmark size={19} strokeWidth={1.75} />
              </span>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
                Le cadre légal de votre demande
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 14px' }}>
                {PHRASE_OFFICIALITE}
              </p>
              <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 14px' }}>
                Certimat intervient comme intermédiaire technologique : la plateforme recueille
                votre dossier, prépare les CERFA et vérifie les pièces. Elle n&apos;est pas
                elle-même habilitée au SIV, et ne délivre aucun titre. Seule l&apos;ANTS
                (France Titres) délivre le certificat d&apos;immatriculation définitif. Le service
                n&apos;est pas une administration publique : la démarche reste réalisable
                directement auprès de l&apos;ANTS.
              </p>
              <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 14px' }}>
                Sur le délai : Certimat s&apos;engage dans ses conditions générales sur une
                vérification du dossier {CPI_DELAI.long}, et annonce une édition immédiate du
                certificat provisoire une fois le dossier validé.
              </p>
              {PRO_HABILITE ? (
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                  Saisie dans le SIV réalisée par {PRO_HABILITE.nom}, professionnel habilité par le
                  Ministère de l&apos;Intérieur (habilitation n° {PRO_HABILITE.habilitation}
                  {PRO_HABILITE.agrement ? `, agrément Trésor Public n° ${PRO_HABILITE.agrement}` : ''}).
                </p>
              ) : null}
              <p style={{ fontSize: 12.5, color: 'var(--text-subtle)', lineHeight: 1.55, margin: '16px 0 0' }}>
                Le certificat provisoire (CPI) autorise à circuler en France pendant 1 mois. Il ne
                dispense jamais d&apos;assurance : la responsabilité civile reste obligatoire dès le
                premier trajet.
              </p>
            </div>

            {/* ---------- Identite verifiable de l'operateur ---------- */}
            <div style={cardBase}>
              <span
                aria-hidden
                style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
                  color: 'var(--gold-light)', display: 'grid', placeItems: 'center', marginBottom: 14,
                }}
              >
                <Building2 size={19} strokeWidth={1.75} />
              </span>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
                L&apos;identité de l&apos;opérateur
              </h3>

              <dl style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { k: 'Service opéré par', v: `${OPERATEUR.raisonSociale} ${OPERATEUR.formeJuridique} (marque ${OPERATEUR.marque})` },
                  { k: 'SIRET', v: OPERATEUR.siret },
                  { k: 'Immatriculation', v: OPERATEUR.rcs },
                  { k: 'Siège social', v: OPERATEUR.siege },
                  { k: 'Partenaire', v: 'France Titres (ANTS)' },
                  { k: 'Mise à disposition par', v: 'AssuTempo, marque d\'Evidence Assurances' },
                ].map(({ k, v }) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <dt style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--gold)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}>
                      {k}
                    </dt>
                    <dd style={{ margin: 0, fontSize: 14.5, color: 'var(--text)', lineHeight: 1.5 }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>

              {PRIX_PRESTATION ? (
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.65, margin: '16px 0 0' }}>
                  Frais de service : {PRIX_PRESTATION}, hors taxes d&apos;immatriculation perçues par
                  l&apos;État.
                </p>
              ) : (
                <p style={{ fontSize: 12.5, color: 'var(--text-subtle)', lineHeight: 1.55, margin: '16px 0 0' }}>
                  Le total, taxes d&apos;immatriculation et frais de service compris, s&apos;affiche
                  dans le module avant tout paiement.
                </p>
              )}
            </div>
          </div>

          {/* Maillage interne */}
          <p style={{
            textAlign: 'center',
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.8,
            margin: '32px auto 0',
            maxWidth: 720,
          }}>
            Pour aller plus loin :{' '}
            <Link to="/articles/carte-grise-urgence-cpi-immediat" style={{ color: 'var(--gold-light)' }}>
              obtenir un certificat provisoire en urgence
            </Link>
            ,{' '}
            <Link to="/articles/assurance-temporaire-rouler-en-attendant-carte-grise" style={{ color: 'var(--gold-light)' }}>
              rouler en attendant sa carte grise définitive
            </Link>
            , ou{' '}
            <Link to="/tarification" style={{ color: 'var(--gold-light)' }}>
              assurer le véhicule dès aujourd&apos;hui
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── F. FAQ ───────────────────────────────────────────────────────── */}
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

      {/* ── G. Cross-sell assurance ──────────────────────────────────────── */}
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
        .cg-legal-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .cg-legal-grid { grid-template-columns: 1fr; }
        }
        .cg-demande-grid {
          display: grid;
          grid-template-columns: 230px minmax(0, 1fr) 230px;
          gap: 24px;
          align-items: start;
          max-width: 1360px;
          margin: 0 auto;
        }
        .cg-rail {
          position: sticky;
          top: 96px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (max-width: 1180px) {
          .cg-demande-grid {
            grid-template-columns: 1fr;
            max-width: 760px;
            gap: 24px;
          }
          .cg-rail { position: static; top: auto; }
          .cg-col-iframe { order: 0; }
          .cg-col-left { order: 1; }
          .cg-col-right { order: 2; }
        }
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
