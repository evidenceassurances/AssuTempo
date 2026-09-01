import { useEffect, useRef, useState } from 'react';
import { jsonLd } from '../lib/seo';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import {
  Phone, MessageCircle, ShieldCheck, Clock, Lock, Globe,
  FileText, CreditCard, Mail, ArrowRight, Moon,
} from 'lucide-react';
import { fadeUp } from '../animations';

/* ----------------------------- contenu de page ---------------------------- */
// Etapes du parcours (rail gauche) : rassure sur la simplicite et la rapidite.
const STEPS = [
  { icon: FileText, title: `Renseignez votre besoin`, text: `Véhicule, conducteur et durée souhaitée, de 1 à 90 jours.` },
  { icon: Clock, title: `Tarif immédiat`, text: `Votre prix s'affiche aussitôt, fixe et sans frais cachés.` },
  { icon: CreditCard, title: `Paiement sécurisé`, text: `Vous réglez en ligne en quelques clics, en toute sécurité.` },
  { icon: Mail, title: `Attestation par email`, text: `Vous la recevez en quelques minutes après le paiement.` },
];

// Reperes de confiance (bandeau sous l'iframe).
const TRUST = [
  { icon: Clock, title: `Attestation immédiate`, text: `Reçue par email juste après le paiement.` },
  { icon: ShieldCheck, title: `Sans reconduction tacite`, text: `Durée fixe : le contrat s'arrête de lui-même.` },
  { icon: Lock, title: `Paiement 100 % sécurisé`, text: `Transaction chiffrée de bout en bout.` },
  { icon: Globe, title: `34 pays européens`, text: `Couverture avec carte verte incluse.` },
];

// Grille tarifaire : memes fourchettes que l'article /articles/prix-assurance-auto-temporaire
// (source unique du chiffrage). Rendu 100 % statique, donc present dans le HTML prerendu.
const TARIFS = [
  { duree: `1 jour`, prix: `15 à 20 €`, usage: `Essai avant achat, dépannage, trajet isolé.` },
  { duree: `3 jours`, prix: `30 à 40 €`, usage: `Week-end, prêt de véhicule, aller-retour.` },
  { duree: `7 jours`, prix: `55 à 70 €`, usage: `Convoyage, séjour court, attente d'un contrat annuel.` },
  { duree: `30 jours`, prix: `140 à 170 €`, usage: `Véhicule en vente, période sans assurance, déplacement long.` },
  { duree: `90 jours`, prix: `320 à 380 €`, usage: `Durée maximale, le temps de retrouver une solution annuelle.` },
];

// FAQ : sert a la fois au rendu et au JSON-LD (FAQPage) pour le SEO / GEO.
const FAQ = [
  {
    q: `Combien coûte une assurance auto temporaire pour 1 jour ?`,
    a: `Comptez 15 à 20 € pour 24 heures de couverture. Le montant exact dépend du véhicule et du profil du conducteur, et s'affiche avant paiement, à l'issue de la simulation. Sur le marché, les tarifs constatés pour une journée vont de 11 € à 25 € selon les acteurs.`,
  },
  {
    q: `Le prix change-t-il selon le véhicule ?`,
    a: `Oui. La puissance, la valeur et l'usage du véhicule entrent dans le calcul, comme pour un contrat annuel. Un utilitaire de déménagement ne se tarife pas au même niveau qu'une citadine. Ces éléments sont pris en compte avant que le prix ne s'affiche.`,
  },
  {
    q: `Y a-t-il des frais de dossier ou des frais cachés ?`,
    a: `Non. Le prix affiché à l'écran, durée et véhicule renseignés, est celui qui est prélevé. Aucune ligne supplémentaire n'apparaît au moment du paiement. Le contrat ne se reconduit pas non plus : rien n'est prélevé après l'échéance.`,
  },
  {
    q: `Une assurance temporaire de 30 jours revient-elle moins cher qu'un contrat annuel résilié ?`,
    a: `Sur un mois isolé, le plus souvent oui : 140 à 170 € face à une prime annuelle majorée après résiliation. Sur douze mois consécutifs en revanche, enchaîner des contrats temporaires coûte plus cher qu'un contrat annuel, même spécialisé. La formule temporaire répond à un besoin ponctuel, pas à une couverture permanente.`,
  },
  {
    q: `Le tarif est-il plus élevé pour un jeune conducteur ou un conducteur malussé ?`,
    a: `Le profil du conducteur entre dans le calcul, comme partout en assurance auto : une expérience courte ou un malus récent placent le tarif dans le haut de la fourchette. La souscription reste possible sans relevé d'information, ce qui rend la formule accessible quand un contrat annuel est refusé.`,
  },
  {
    q: `Le prix affiché au devis est-il définitif ?`,
    a: `Oui, dès lors que les informations saisies sont exactes : le montant présenté à la fin de la simulation est celui qui est prélevé, sans révision après coup. Une erreur sur la date de permis ou sur le véhicule peut en revanche fragiliser le contrat. C'est le point à vérifier avant de valider.`,
  },
  {
    q: `En combien de temps vais-je recevoir mon attestation ?`,
    a: `Votre attestation d'assurance vous est envoyée par email quelques minutes après la validation de votre paiement. Vous pouvez ensuite prendre la route immédiatement.`,
  },
  {
    q: `Quelle durée de couverture puis-je choisir ?`,
    a: `Vous fixez librement la durée de votre contrat, de 1 à 90 jours, selon votre besoin réel. C'est utile pour un essai, un prêt de véhicule, un convoyage ou une période sans assurance annuelle.`,
  },
  {
    q: `Puis-je rouler à l'étranger avec ce contrat ?`,
    a: `Oui. La couverture s'étend à 34 pays européens, avec la carte verte correspondante. Pensez à vérifier la durée nécessaire avant votre départ.`,
  },
  {
    q: `Le contrat se renouvelle-t-il automatiquement ?`,
    a: `Non. L'assurance temporaire est un contrat à durée déterminée : il prend fin à l'échéance que vous avez choisie, sans reconduction tacite et sans engagement.`,
  },
  {
    q: `Que faut-il pour souscrire en ligne ?`,
    a: `Les informations de votre véhicule et de son conducteur principal, ainsi qu'un moyen de paiement. L'ensemble du parcours se fait en ligne, sans déplacement.`,
  },
  {
    q: `J'ai une question pendant la souscription, que faire ?`,
    a: `Notre concierge Tempo vous répond en direct dans le chat, en bas à droite de votre écran. Vous pouvez aussi nous appeler au 09 74 19 78 20, du lundi au vendredi de 9h à 21h et le samedi de 9h à 20h.`,
  },
];

/* ------------------------------- JSON-LD SEO ------------------------------ */
const JSONLD_BREADCRUMB = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Tarification', item: 'https://assutempo.fr/tarification' },
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
  serviceType: 'Assurance auto temporaire 1 à 90 jours',
  name: 'Assurance auto temporaire AssuTempo',
  description:
    "Assurance auto temporaire de 1 à 90 jours, souscription 100 % en ligne avec attestation immédiate par email, valable dans 34 pays européens.",
  /* Reference vers l'entite Organization/InsuranceAgency du template
     (index.html) : une seule entite etablie sur tout le site. */
  provider: { '@id': 'https://assutempo.fr/#organization' },
  areaServed: ['FR', 'Europe'],
  /* Fourchette de prix affichee sur la page (grille TARIFS) : rattachee au
     Service plutot qu'isolee, pour rester un seul graphe coherent. */
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'EUR',
    lowPrice: 15,
    highPrice: 380,
    url: 'https://assutempo.fr/tarification',
    availability: 'https://schema.org/InStock',
  },
  audience: { '@type': 'Audience', audienceType: 'Particuliers et professionnels' },
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: 'https://assutempo.fr/tarification',
    servicePhone: '+33974197820',
  },
};

/* --------------------------------- styles --------------------------------- */
const cardBase = {
  background: 'var(--bg-card)',
  border: '1px solid var(--gold-border)',
  borderRadius: 16,
  padding: '22px 20px',
};

/* URL du tunnel JL Assure. Le parametre GET duree (1 a 90) est le mecanisme
   de pre-remplissage natif du tunnel : il alimente son champ cache pref_duree
   cote serveur. Structure du tunnel intacte. */
const IFRAME_SRC = 'https://www.jlassure.com/sousfiche/assure_tempo_rapide_mb.php?cat=&&tip=09.74.19.78.20&&id=1323&&cd=13ELA322&&adrsite=https://assutempo.fr/';

function Pricing() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef(null);
  const { search } = useLocation();

  /* Duree pre-choisie depuis le hero (?duree=N) : appliquee apres hydratation
     pour garder le HTML prerendu identique cote client et serveur. */
  useEffect(() => {
    const n = parseInt(new URLSearchParams(search).get('duree'), 10);
    const el = iframeRef.current;
    if (el && Number.isInteger(n) && n >= 1 && n <= 90 && !el.src.includes('&duree=')) {
      el.src = `${IFRAME_SRC}&duree=${n}`;
    }
  }, [search]);

  // Ouvre l'assistant Tempo depuis n'importe quel bouton de la page.
  const openAssistant = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('assutempo:open-assistant'));
    }
  };

  return (
    <>
      <Helmet>
        <title>Tarif assurance temporaire : de 15 à 380 € | AssuTempo</title>
        <meta name="description" content="Prix d'une assurance auto temporaire : 15 à 20 € la journée, 140 à 170 € le mois. Grille complète, sans frais cachés, devis immédiat en ligne." />
        <link rel="canonical" href="https://assutempo.fr/tarification" />
        <meta property="og:title" content="Tarif assurance temporaire : de 15 à 380 € | AssuTempo" />
        <meta property="og:description" content="Prix d'une assurance auto temporaire : 15 à 20 € la journée, 140 à 170 € le mois. Grille complète, sans frais cachés, devis immédiat en ligne." />
        <meta property="og:url" content="https://assutempo.fr/tarification" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_SERVICE)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_FAQ)}</script>
      </Helmet>

      <div
        style={{
          background: 'var(--bg)',
          minHeight: '100vh',
          paddingTop: 100,
          paddingBottom: 80,
          paddingLeft: 24,
          paddingRight: 24,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Orbe haut */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Header SEO */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ textAlign: 'center', marginBottom: 48, position: 'relative', zIndex: 1, maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            SOUSCRIPTION EN LIGNE
          </p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 24 }}>
            Tarif assurance temporaire en ligne
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, margin: '0 auto', lineHeight: 1.75 }}>
            Obtenez votre devis d'assurance auto temporaire instantanément. De 1 à 90 jours, pour
            particuliers et professionnels. Souscription 100 % en ligne, attestation immédiate par email.
            <br /><br />
            Besoin d'aide ? Appelez-nous au{' '}
            <a href="tel:0974197820" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
              09 74 19 78 20
            </a>
            {' '}du lundi au vendredi de 9h à 21h et le samedi de 9h à 20h.
          </p>
        </m.div>

        {/* ---------- GRILLE TARIFAIRE (SEO / GEO) ----------
             Bloc 100 % statique : les chiffres sont dans le HTML prerendu, donc
             lisibles par Google et citables par les assistants IA. L'iframe de
             souscription reste inchangee, juste en dessous. */}
        <section
          aria-labelledby="grille-tarifaire"
          style={{ maxWidth: 820, margin: '0 auto 48px', position: 'relative', zIndex: 1 }}
        >
          <h2
            id="grille-tarifaire"
            style={{ fontSize: 'clamp(20px, 2.6vw, 26px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 14px' }}
          >
            Combien coûte une assurance auto temporaire
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--text-muted)', lineHeight: 1.8, margin: '0 0 24px' }}>
            Une assurance auto temporaire coûte entre 15 € pour une journée et 380 € pour 90 jours.
            Le tarif dépend de trois choses : la durée retenue, le véhicule et le profil du conducteur.
            Plus la période est longue, moins la journée revient cher, car les frais d'ouverture du
            contrat se répartissent sur davantage de jours. Le prix affiché à la fin de la simulation
            est celui qui est prélevé.
          </p>

          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 480,
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <thead>
                <tr>
                  {['Durée', 'Tarif AssuTempo', 'Ce que ça couvre'].map((col) => (
                    <th
                      key={col}
                      scope="col"
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--gold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        background: 'var(--gold-glow)',
                        borderBottom: '1px solid var(--gold-border)',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TARIFS.map((t, i) => (
                  <tr key={t.duree}>
                    <th
                      scope="row"
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--text)',
                        borderTop: i > 0 ? '1px solid var(--glass-border)' : 'none',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.5,
                      }}
                    >
                      {t.duree}
                    </th>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--gold-light)',
                        borderTop: i > 0 ? '1px solid var(--glass-border)' : 'none',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.5,
                      }}
                    >
                      {t.prix}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        fontSize: 14,
                        color: 'var(--text-muted)',
                        borderTop: i > 0 ? '1px solid var(--glass-border)' : 'none',
                        lineHeight: 1.5,
                      }}
                    >
                      {t.usage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--text-subtle)', lineHeight: 1.6, margin: '12px 0 0' }}>
            Tarifs indicatifs constatés, variables selon le véhicule, le profil du conducteur et la
            durée. Votre prix exact s'affiche immédiatement dans le simulateur ci-dessous, sans
            engagement.
          </p>
        </section>

        {/* GRILLE 3 colonnes : rail gauche / iframe / rail droit */}
        <div className="tarif-grid" style={{ position: 'relative', zIndex: 1 }}>

          {/* ---------- RAIL GAUCHE : le parcours pas a pas ---------- */}
          <m.aside
            className="tarif-col tarif-col-left tarif-rail"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            aria-label="Comment souscrire"
          >
            <div style={cardBase}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 18px' }}>
                Votre souscription, pas à pas
              </h2>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {STEPS.map((s, i) => {
                  const StepIcon = s.icon;
                  return (
                    <li key={i} style={{ display: 'flex', gap: 12 }}>
                      <span
                        aria-hidden
                        style={{
                          flexShrink: 0,
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: 'var(--gold-dim)',
                          border: '1px solid var(--gold-border)',
                          color: 'var(--gold-light)',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <StepIcon size={17} strokeWidth={1.75} />
                      </span>
                      <span>
                        <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
                          {i + 1}. {s.title}
                        </span>
                        <span style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>
                          {s.text}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p style={{ fontSize: 12.5, color: 'var(--text-subtle)', margin: '18px 0 0', lineHeight: 1.55 }}>
                Un parcours pensé pour aller à l'essentiel, sans paperasse inutile.
              </p>
            </div>
          </m.aside>

          {/* ---------- CENTRE : iframe de souscription ---------- */}
          <m.div
            className="tarif-col tarif-col-iframe"
            data-assistant-target="tarif-iframe"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 16,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <iframe
              ref={iframeRef}
              src={IFRAME_SRC}
              width="100%"
              height="1450"
              frameBorder="0"
              title="Souscription assurance temporaire AssuTempo"
              style={{ display: 'block', border: 'none', borderRadius: 0 }}
              onLoad={() => setIframeLoaded(true)}
            />

            {/* Skeleton de chargement : fondu de sortie 400ms au onLoad */}
            <div
              aria-hidden={iframeLoaded}
              style={{
                position: 'absolute',
                inset: 0,
                background: '#141414',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                opacity: iframeLoaded ? 0 : 1,
                transition: 'opacity 400ms var(--ease-out)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ width: 'min(420px, 70%)', height: 14, borderRadius: 7, position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                <div className="skeleton-shimmer" />
              </div>
              <div style={{ width: 'min(320px, 55%)', height: 14, borderRadius: 7, position: 'relative', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                <div className="skeleton-shimmer" />
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '12px 0 0' }}>
                Chargement du module de souscription sécurisé...
              </p>
            </div>
          </m.div>

          {/* ---------- RAIL DROIT : aide et confiance ---------- */}
          <m.aside
            className="tarif-col tarif-col-right tarif-rail"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.25 }}
            aria-label="Aide à la souscription"
          >
            {/* Carte chat */}
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
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
                Un doute ? On reste à vos côtés
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
                Une question pendant la souscription ? Notre concierge Tempo vous répond en direct,
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

            {/* Carte telephone */}
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

            {/* Mention partenaire : nommee et verifiable (le tunnel de souscription
                est bien opere par JL Assure), suivie de l'immatriculation ORIAS du
                courtier. Lien reciproque vers le partenaire, sobre et en contexte. */}
            <p style={{ fontSize: 12, color: 'var(--text-subtle)', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
              Souscription opérée via notre partenaire assureur{' '}
              <a
                href="https://www.jlassure.com"
                target="_blank"
                rel="noopener"
                style={{ color: 'var(--gold-light)', textDecoration: 'none', fontWeight: 600 }}
              >
                JL Assure
              </a>
              . AssuTempo est une marque d&apos;Evidence Assurances, courtier immatriculé à l&apos;ORIAS
              sous le n° 20005719.
            </p>
          </m.aside>
        </div>

        {/* ---------- BANDEAU CONFIANCE ---------- */}
        <m.div
          className="tarif-trust"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {TRUST.map((t, i) => {
            const TIcon = t.icon;
            return (
              <div key={i} style={{ ...cardBase, textAlign: 'center', padding: '24px 18px' }}>
                <span
                  aria-hidden
                  style={{
                    width: 44, height: 44, borderRadius: 12, margin: '0 auto 12px',
                    background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
                    color: 'var(--gold-light)', display: 'grid', placeItems: 'center',
                  }}
                >
                  <TIcon size={20} strokeWidth={1.75} />
                </span>
                <h3 style={{ fontSize: 14.5, fontWeight: 600, color: '#fff', margin: '0 0 6px' }}>{t.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>{t.text}</p>
              </div>
            );
          })}
        </m.div>

        {/* ---------- CONTENU GEO : pourquoi / pour qui ---------- */}
        <m.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          style={{ maxWidth: 820, margin: '72px auto 0', position: 'relative', zIndex: 1 }}
        >
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 18, textAlign: 'center' }}>
            Pourquoi choisir l'assurance temporaire AssuTempo
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--text-muted)', lineHeight: 1.8, margin: '0 0 16px' }}>
            L'assurance auto temporaire couvre votre véhicule pour une durée précise, de 1 à 90 jours,
            sans souscrire un contrat annuel. Elle répond aux situations ponctuelles : essai avant
            achat, prêt ou emprunt de véhicule, convoyage, trajet à l'étranger, ou période d'attente
            entre deux assurances. La couverture démarre à la date que vous choisissez et s'arrête
            seule à l'échéance, sans reconduction tacite.
          </p>
          <p style={{ fontSize: 15.5, color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>
            Tout se règle en ligne : vous renseignez votre besoin, vous voyez votre tarif
            immédiatement, vous payez de façon sécurisée et vous recevez votre attestation par email
            en quelques minutes. La garantie est valable dans 34 pays européens, carte verte incluse.
            Une question pendant le parcours ? Le concierge Tempo répond dans le chat, ou un conseiller
            au téléphone.
          </p>
        </m.section>

        {/* ---------- FAQ (SEO / GEO) ---------- */}
        <m.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          style={{ maxWidth: 820, margin: '64px auto 0', position: 'relative', zIndex: 1 }}
        >
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 24, textAlign: 'center' }}>
            Questions fréquentes sur le prix et la souscription
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FAQ.map((f, i) => (
              <div key={i} style={{ ...cardBase, padding: '20px 22px' }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 600, color: '#fff', margin: '0 0 8px' }}>{f.q}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </m.section>

        {/* ---------- GUICHET DE NUIT (lien contextuel) ----------
             Bloc 100 % statique (aucun etat initial invisible) : le texte et le
             lien sont lus tels quels dans le HTML prerendu, sans JavaScript. */}
        <section
          style={{
            maxWidth: 820,
            margin: '64px auto 0',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid var(--gold-border)',
            borderRadius: 16,
            padding: '24px 24px',
          }}
        >
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              width: 40, height: 40, borderRadius: 11,
              background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
              color: 'var(--gold-light)', display: 'grid', placeItems: 'center',
            }}
          >
            <Moon size={19} strokeWidth={1.75} />
          </span>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
              Une urgence la nuit ?
            </h2>
            <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 12px' }}>
              Après 21h et le dimanche, le Guichet de Nuit prépare votre contrat pendant que tout
              est fermé.
            </p>
            <Link
              to="/guichet-de-nuit"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontSize: 14, fontWeight: 600, color: 'var(--gold)', textDecoration: 'none',
              }}
            >
              Découvrir le Guichet de Nuit
              <ArrowRight size={15} strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </section>

        {/* ---------- MAILLAGE INTERNE ---------- */}
        <m.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{ maxWidth: 820, margin: '56px auto 0', position: 'relative', zIndex: 1, textAlign: 'center' }}
        >
          <p style={{ fontSize: 13, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 16px' }}>
            Pour aller plus loin
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {[
              { to: '/carte-grise', label: 'Rouler en attendant la carte grise' },
              { to: '/assurance-internationale', label: 'Assurance pour l’étranger' },
              { to: '/carte', label: 'Pays couverts' },
              { to: '/faq', label: 'Toutes les questions fréquentes' },
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
                <ArrowRight size={15} strokeWidth={2} aria-hidden />
              </Link>
            ))}
          </div>
        </m.section>
      </div>

      <style>{`
        .tarif-grid {
          display: grid;
          grid-template-columns: 220px minmax(0, 1fr) 220px;
          gap: 24px;
          align-items: start;
          max-width: 1460px;
          margin: 0 auto;
        }
        .tarif-rail {
          position: sticky;
          top: 96px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .tarif-trust {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          max-width: 1100px;
          margin: 56px auto 0;
        }
        @media (max-width: 1180px) {
          .tarif-grid {
            grid-template-columns: 1fr;
            max-width: 760px;
            gap: 24px;
          }
          .tarif-rail { position: static; top: auto; }
          .tarif-col-iframe { order: 0; }
          .tarif-col-left { order: 1; }
          .tarif-col-right { order: 2; }
        }
        @media (max-width: 720px) {
          .tarif-trust { grid-template-columns: repeat(2, 1fr); }
        }
        .skeleton-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 30%, rgba(201,168,76,0.12) 50%, transparent 70%);
          transform: translateX(-100%);
          animation: skeleton-sweep 1.6s ease-in-out infinite;
        }
        @keyframes skeleton-sweep {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
}

export default Pricing;
