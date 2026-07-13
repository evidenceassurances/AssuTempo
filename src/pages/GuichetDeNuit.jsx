import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, Camera, Car, ClipboardList, FileSignature, KeyRound,
  MailCheck, ShieldAlert, ShieldCheck, Timer, Landmark,
} from 'lucide-react';
import { jsonLd } from '../lib/seo';
import { trackEvent } from '../lib/analytics';
import AnswerCapsule from '../components/articles/AnswerCapsule';
import Footer from '../components/Footer';

/* Endpoint Web3Forms du Guichet de Nuit. L'envoi est multipart (FormData, pas
   de JSON) : c'est la seule forme qui accepte les pieces jointes. Les photos
   partent donc avec la demande, en une seule soumission. */
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = '1dbb89c0-8b09-4abe-888d-f89f001d0627';
const GUICHET_EMAIL = 'guichetassutempo@gmail.com';

/* Web3Forms plafonne la taille totale d'une soumission : au-dela, la requete
   est rejetee cote serveur. On controle avant l'envoi pour rendre la main a
   l'utilisateur avec un message utile plutot qu'une erreur reseau opaque. */
const MAX_FILES_BYTES = 10 * 1024 * 1024;
const FILE_FIELDS = ['permis_recto', 'permis_verso', 'carte_grise'];

const EASE = [0.22, 1, 0.36, 1];

/* ── Ciel etoile ──────────────────────────────────────────────────────────────
   Positions FIXES (jamais de Math.random : le rendu serveur et l'hydratation
   doivent produire exactement le meme arbre). 32 etoiles, 8 scintillent par
   animation d'opacity (coupee par prefers-reduced-motion dans le <style>). */
const STARS = [
  { t: 6, l: 4, s: 2, o: 0.4 },
  { t: 12, l: 11, s: 1, o: 0.3, tw: true, d: 5.2, dl: 0.4 },
  { t: 22, l: 7, s: 1, o: 0.25 },
  { t: 9, l: 18, s: 1.5, o: 0.35 },
  { t: 30, l: 14, s: 1, o: 0.2 },
  { t: 17, l: 26, s: 1, o: 0.3, tw: true, d: 6.1, dl: 1.8 },
  { t: 5, l: 33, s: 1, o: 0.25 },
  { t: 26, l: 31, s: 2, o: 0.35 },
  { t: 38, l: 22, s: 1, o: 0.2 },
  { t: 11, l: 42, s: 1, o: 0.3 },
  { t: 21, l: 47, s: 1.5, o: 0.4, tw: true, d: 4.4, dl: 0.9 },
  { t: 33, l: 41, s: 1, o: 0.22 },
  { t: 7, l: 52, s: 1, o: 0.28 },
  { t: 16, l: 58, s: 1, o: 0.32 },
  { t: 28, l: 55, s: 1, o: 0.2, tw: true, d: 6.8, dl: 2.6 },
  { t: 40, l: 49, s: 1.5, o: 0.25 },
  { t: 4, l: 64, s: 1, o: 0.35 },
  { t: 13, l: 70, s: 2, o: 0.4, tw: true, d: 5.6, dl: 1.2 },
  { t: 24, l: 66, s: 1, o: 0.25 },
  { t: 35, l: 72, s: 1, o: 0.2 },
  { t: 8, l: 78, s: 1, o: 0.3 },
  { t: 19, l: 83, s: 1, o: 0.28, tw: true, d: 4.9, dl: 3.1 },
  { t: 31, l: 80, s: 1.5, o: 0.35 },
  { t: 44, l: 76, s: 1, o: 0.18 },
  { t: 6, l: 90, s: 1, o: 0.32 },
  { t: 15, l: 95, s: 1, o: 0.25 },
  { t: 27, l: 92, s: 1, o: 0.3, tw: true, d: 6.4, dl: 0.2 },
  { t: 39, l: 88, s: 1, o: 0.22 },
  { t: 47, l: 35, s: 1, o: 0.2 },
  { t: 50, l: 61, s: 1, o: 0.25, tw: true, d: 5.9, dl: 2.2 },
  { t: 52, l: 12, s: 1.5, o: 0.22 },
  { t: 45, l: 5, s: 1, o: 0.28 },
];

/* ── Etat du guichet (heure Europe/Paris) ─────────────────────────────────────
   a : souscription en ligne classique ouverte (lun-ven 9h-21h, sam 9h-20h)
   b : guichet actif (21h-9h en semaine, samedi des 20h, et toutes les heures
       hors plage classique du lundi au samedi)
   c : dimanche, permanence toute la journee */
function computeEtat() {
  try {
    const parts = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      weekday: 'short',
      hour: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(new Date());
    const wd = parts.find((p) => p.type === 'weekday')?.value || '';
    const h = parseInt(parts.find((p) => p.type === 'hour')?.value || '12', 10);
    if (wd.startsWith('dim')) return 'c';
    const fermeture = wd.startsWith('sam') ? 20 : 21;
    return h >= 9 && h < fermeture ? 'a' : 'b';
  } catch {
    return 'a';
  }
}

function heureParis() {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date()).replace(':', 'h');
  } catch {
    return '';
  }
}

const DATE_MAJ = '13 juillet 2026';
const DATE_MAJ_ISO = '2026-07-13';

/* ── Reponse en bref (AEO) ────────────────────────────────────────────────
   Bloc "La reponse en bref" du site : reponse directe de 50 mots max, faits
   ancres, date de mise a jour. C'est ce bloc que les moteurs de reponse
   (ChatGPT, Perplexity, AI Overviews) citent le plus volontiers, et il est
   100 % statique dans le HTML prerendu. */
const CAPSULE = {
  answer: "Oui. Le Guichet de Nuit AssuTempo prépare votre assurance auto temporaire de 21h à 9h du lundi au samedi, et le dimanche toute la journée. Vous déposez votre demande avec 3 photos, le devis part dans les 30 minutes, et l'attestation arrive par mail dès le paiement.",
  facts: [
    {
      anchor: '21h à 9h',
      text: "La souscription en ligne classique ferme à 21h en semaine et à 20h le samedi. Le Guichet de Nuit prend le relais sur ces heures, et le dimanche sans interruption.",
    },
    {
      anchor: '30 minutes',
      text: 'Le devis part dans les 30 minutes suivant le dépôt de la demande complète, photos comprises. Au-delà, la majoration de nuit est offerte.',
    },
    {
      anchor: 'ORIAS 20005719',
      text: "Evidence Assurances, intermédiaire immatriculé à l'ORIAS. Le risque est porté par un assureur agréé, via notre partenaire de souscription.",
    },
  ],
  updated: DATE_MAJ,
};

/* ── Comment ca marche : 3 etapes ────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    Icon: ClipboardList,
    title: 'Déposez votre demande',
    body: 'Le formulaire prend 3 minutes, depuis votre téléphone. Aucun paiement à cette étape.',
  },
  {
    num: '02',
    Icon: Camera,
    title: 'Joignez vos 3 photos',
    body: 'Permis recto et verso, carte grise : les photos partent directement dans le formulaire, depuis votre téléphone.',
  },
  {
    num: '03',
    Icon: FileSignature,
    title: 'Signez et payez, vous êtes assuré',
    body: "Vous recevez votre devis, le lien de signature électronique par mail et SMS, puis le lien de paiement. L'attestation arrive dès le paiement.",
  },
];

/* ── Reassurance de l'equipe de nuit ─────────────────────────────────────── */
const REASSURANCE = [
  { Icon: ShieldCheck, label: 'Intermédiaire immatriculé à l\'ORIAS sous le n° 20005719' },
  { Icon: Landmark, label: 'Assureur porteur du risque via notre partenaire de souscription JL Assure' },
  { Icon: MailCheck, label: 'Attestation officielle envoyée par mail dès le paiement' },
];

/* ── Maillage : cas d'usage vers les articles ────────────────────────────── */
const CAS_GUICHET = [
  {
    Icon: Car,
    title: 'Sortie de fourrière',
    body: "La fourrière exige une attestation avant de rendre le véhicule, souvent dès l'ouverture. Préparez la vôtre pendant la nuit.",
    to: '/articles/combien-de-jours-assurance-sortir-fourriere',
    cta: 'Lire le guide fourrière',
  },
  {
    Icon: KeyRound,
    title: 'Voiture achetée le week-end',
    body: 'Le vendeur vous tend les clés un samedi soir ou un dimanche : il faut être assuré avant le trajet retour.',
    to: '/articles/assurance-trajet-retour-achat-voiture',
    cta: 'Lire le guide trajet retour',
  },
  {
    Icon: ShieldAlert,
    title: 'Contrôle sans assurance',
    body: 'Rouler sans assurance coûte cher, même pour un seul trajet. Régularisez avant de reprendre la route.',
    to: '/articles/controle-sans-assurance-risques-amende',
    cta: 'Lire le guide contrôle',
  },
];

/* ── FAQ : les memes textes alimentent la page ET le schema FAQPage ──────── */
const FAQ = [
  {
    q: 'Peut-on vraiment être assuré à 3h du matin ?',
    a: "Oui. Le Guichet de Nuit prépare votre contrat d'assurance temporaire en pleine nuit : vous déposez votre demande, vous recevez le devis puis le lien de signature, et l'attestation arrive par mail dès le paiement.",
  },
  {
    q: 'Pourquoi les assurances temporaires ferment-elles après 21h ?',
    a: "Parce que la souscription en ligne classique suit des horaires de bureau : après 21h en semaine et 20h le samedi, plus aucun contrat ne peut être émis. Le Guichet de Nuit a été créé pour couvrir ces heures creuses.",
  },
  {
    q: 'Combien coûte le Guichet de Nuit ?',
    a: 'Le tarif de nuit est un tarif tout compris, affiché sur votre devis avant tout paiement. Vous ne payez rien au moment de la demande et le devis est sans engagement.',
  },
  {
    q: 'Quels documents préparer ?',
    a: "Trois photos suffisent : votre permis de conduire recto et verso, et la carte grise du véhicule. Vous les joignez directement dans le formulaire, depuis votre téléphone. Si la carte grise n'est pas sous la main, vous l'enverrez plus tard en répondant au mail de confirmation.",
  },
  {
    q: "En combien de temps l'attestation arrive-t-elle ?",
    a: "Le devis part dans les 30 minutes qui suivent le dépôt de votre demande complète, et l'attestation officielle arrive par mail dès le paiement. Entre le dépôt de la demande et la couverture, tout peut se jouer dans l'heure.",
  },
  {
    q: 'Que se passe-t-il si je ne signe pas le devis ?',
    a: "Rien. Le devis est sans engagement : si vous ne signez pas, aucun contrat n'est émis et rien ne vous est facturé.",
  },
  {
    q: 'Le Guichet de Nuit fonctionne-t-il le dimanche et les jours fériés ?',
    a: "Oui. Le dimanche, le guichet assure la permanence toute la journée, et les jours fériés suivent le même régime. Ce sont justement les journées où la souscription en ligne classique est fermée.",
  },
  {
    q: "J'achète une voiture un samedi soir : puis-je être assuré avant le trajet retour ?",
    a: "Oui, c'est l'un des cas les plus fréquents au guichet. Déposez votre demande dès que le vendeur vous remet les clés : l'assurance doit couvrir le véhicule dès le premier mètre parcouru, y compris pour rentrer chez vous.",
  },
  {
    q: "Faut-il un relevé d'information pour passer par le guichet ?",
    a: "Non, aucun relevé d'information n'est exigé pour souscrire une assurance temporaire. Le formulaire vous demande simplement si vous avez été résilié ou si vous avez eu un retrait de permis : cette information sert à établir un devis juste, et la réponse du guichet vous parvient avant tout paiement.",
  },
];

/* ── Donnees structurees (SEO / GEO) ─────────────────────────────────────── */
const JSONLD_BREADCRUMB = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Le Guichet de Nuit', item: 'https://assutempo.fr/guichet-de-nuit' },
  ],
};

const JSONLD_SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Le Guichet de Nuit AssuTempo',
  serviceType: "Souscription d'assurance auto temporaire de nuit",
  description: "Préparation de contrats d'assurance auto temporaire pendant la nuit, de 21h à 9h du lundi au samedi et le dimanche toute la journée : devis en 30 minutes, signature électronique et attestation par mail.",
  /* Reference vers l'entite Organization/InsuranceAgency du template
     (index.html) : une seule entite etablie sur tout le site. */
  provider: { '@id': 'https://assutempo.fr/#organization' },
  areaServed: 'FR',
  hoursAvailable: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '21:00',
      closes: '09:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '00:00',
      closes: '23:59',
    },
  ],
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: 'https://assutempo.fr/guichet-de-nuit',
  },
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

/* HowTo : les 3 etapes affichees, decrites pour les moteurs de reponse. Le
   schema reprend EXACTEMENT le tableau STEPS rendu a l'ecran. */
const JSONLD_HOWTO = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: "Souscrire une assurance auto temporaire la nuit",
  description: "Obtenir une assurance auto temporaire entre 21h et 9h, ou le dimanche, avec le Guichet de Nuit AssuTempo.",
  totalTime: 'PT30M',
  step: STEPS.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title,
    text: s.body,
    url: `https://assutempo.fr/guichet-de-nuit#etape-${i + 1}`,
  })),
};

/* WebPage : rattache la page a l'entite et au site, et porte la date de
   derniere mise a jour (signal de fraicheur lu par les moteurs de reponse).
   speakable designe les blocs a lire a voix haute : le titre et la reponse
   en bref, tous deux statiques dans le HTML prerendu. */
const JSONLD_WEBPAGE = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://assutempo.fr/guichet-de-nuit#webpage',
  url: 'https://assutempo.fr/guichet-de-nuit',
  name: 'Assurance temporaire la nuit : Le Guichet de Nuit AssuTempo',
  inLanguage: 'fr-FR',
  isPartOf: { '@id': 'https://assutempo.fr/#website' },
  about: { '@id': 'https://assutempo.fr/#organization' },
  dateModified: DATE_MAJ_ISO,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '[aria-label="La réponse en bref"]'],
  },
};

const DUREES = ['1', '2', '3', '5', '7', '10', '15', '20', '30', '60', '90'];

const cardBase = {
  background: 'rgba(10, 13, 28, 0.55)',
  border: '1px solid var(--gold-border)',
  borderRadius: 18,
  padding: '26px 24px',
};

const TITLE = 'Assurance temporaire la nuit : Le Guichet de Nuit AssuTempo, 21h à 9h et dimanche';
const DESCRIPTION = "Oui, on s'assure aussi en pleine nuit : le Guichet de Nuit prépare votre contrat de 21h à 9h et le dimanche. Devis en 30 minutes, attestation par mail.";

function GuichetDeNuit() {
  const reduce = useReducedMotion();

  /* Etat du guichet : 'a' au rendu serveur (deterministe, aucun mismatch
     d'hydratation), corrige des le montage puis rafraichi chaque minute.
     Les trois textes existent en permanence dans le DOM, seul l'affichage
     commute. */
  const [etat, setEtat] = useState('a');
  useEffect(() => {
    const tick = () => setEtat(computeEtat());
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  /* Formulaire : idle -> sending -> success | error. Les messages de succes
     et d'erreur sont rendus statiquement dans le DOM et simplement reveles. */
  const [formStatus, setFormStatus] = useState('idle');
  const [heureDepot, setHeureDepot] = useState('');
  const formStartedRef = useRef(false);

  /* Noms des fichiers choisis (affiches sous chaque champ) et depassement de
     taille. Le File lui-meme reste dans l'input : c'est lui que FormData lit
     au moment de l'envoi. */
  const [fileNames, setFileNames] = useState({ permis_recto: '', permis_verso: '', carte_grise: '' });
  const [filesTooBig, setFilesTooBig] = useState(false);
  const filesEventRef = useRef(false);

  useEffect(() => {
    trackEvent('guichet_page_view');
  }, []);

  const onFormFocus = () => {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackEvent('guichet_form_start');
  };

  function handleFileChange(field, e) {
    const file = e.target.files && e.target.files[0];
    const next = { ...fileNames, [field]: file ? file.name : '' };
    setFileNames(next);
    setFilesTooBig(false);
    /* Les deux photos du permis sont la : la demande est exploitable. */
    if (!filesEventRef.current && next.permis_recto && next.permis_verso) {
      filesEventRef.current = true;
      trackEvent('guichet_form_files_added');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (formStatus === 'sending') return;
    const form = e.currentTarget;
    const data = new FormData(form);

    /* Un input file vide produit un File de 0 octet : il partirait comme une
       piece jointe fantome. On les retire et on pese ce qui reste. */
    let total = 0;
    for (const field of FILE_FIELDS) {
      const value = data.get(field);
      if (value instanceof File) {
        if (value.size === 0) data.delete(field);
        else total += value.size;
      }
    }
    if (total > MAX_FILES_BYTES) {
      setFilesTooBig(true);
      return;
    }

    trackEvent('guichet_form_submit');
    setFormStatus('sending');
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: data,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload || payload.success !== true) throw new Error('envoi refuse');
      setHeureDepot(heureParis());
      setFormStatus('success');
    } catch {
      setFormStatus('error');
    }
  }

  /* Reveal discret des sections sous le pli (transform + opacity uniquement,
     une seule fois, rien si l'utilisateur prefere reduire les animations). */
  const reveal = (delay = 0) => (reduce ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, ease: EASE, delay },
  });

  const h2Style = {
    fontSize: 'clamp(1.6rem, 3.4vw, 2.3rem)',
    fontWeight: 700,
    letterSpacing: '-0.025em',
    color: 'var(--text)',
    margin: '0 0 14px',
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://assutempo.fr/guichet-de-nuit" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content="https://assutempo.fr/guichet-de-nuit" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{jsonLd(JSONLD_WEBPAGE)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_SERVICE)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_HOWTO)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_FAQ)}</script>
      </Helmet>

      <div className="gdn-page">

        {/* ── A. Hero : ciel de nuit, lune, badge, etat du guichet ────────── */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '160px 24px 96px',
          textAlign: 'center',
        }}>
          {/* Ciel etoile decoratif */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {STARS.map((st, i) => (
              <span
                key={i}
                className={st.tw ? 'gdn-star gdn-star-tw' : 'gdn-star'}
                style={{
                  top: `${st.t}%`,
                  left: `${st.l}%`,
                  width: st.s,
                  height: st.s,
                  opacity: st.o,
                  ...(st.tw ? { '--gdn-twd': `${st.d}s`, '--gdn-twdl': `${st.dl}s` } : null),
                }}
              />
            ))}

            {/* Croissant de lune */}
            <svg
              className="gdn-moon"
              viewBox="0 0 120 120"
              style={{ position: 'absolute', top: 98, right: '6%' }}
            >
              <defs>
                <linearGradient id="gdn-moon-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#E8C97A" />
                  <stop offset="1" stopColor="#C9A84C" />
                </linearGradient>
                <radialGradient id="gdn-moon-halo" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0.4" stopColor="rgba(232,201,122,0.14)" />
                  <stop offset="1" stopColor="rgba(232,201,122,0)" />
                </radialGradient>
                <mask id="gdn-moon-m">
                  <rect width="120" height="120" fill="#fff" />
                  <circle cx="46" cy="52" r="40" fill="#000" />
                </mask>
              </defs>
              <circle cx="60" cy="60" r="58" fill="url(#gdn-moon-halo)" />
              <circle cx="60" cy="60" r="42" fill="url(#gdn-moon-g)" mask="url(#gdn-moon-m)" opacity="0.9" />
            </svg>

            {/* Lueur du guichet allume, en bas du ciel */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 55% 34% at 50% 100%, rgba(201,168,76,0.09) 0%, transparent 70%)',
            }} />
          </div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold-light)',
              background: 'var(--gold-dim)',
              border: '1px solid var(--gold-border)',
              borderRadius: 999,
              padding: '8px 18px',
              marginBottom: 26,
            }}>
              Ouvert quand tout est fermé
            </span>

            <h1 style={{
              fontSize: 'clamp(38px, 6vw, 68px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin: '0 0 20px',
            }}>
              Le Guichet de Nuit
            </h1>

            <p style={{
              fontSize: 'clamp(17px, 2.4vw, 21px)',
              fontWeight: 500,
              color: 'var(--gold-light)',
              lineHeight: 1.5,
              margin: '0 auto 18px',
              maxWidth: 620,
            }}>
              Après 21h, plus aucune assurance temporaire ne peut vous couvrir.
              Notre équipe de nuit, si.
            </p>

            <p style={{
              fontSize: 16,
              color: 'var(--text-muted)',
              lineHeight: 1.75,
              margin: '0 auto 34px',
              maxWidth: 600,
            }}>
              Sortie de fourrière à l&apos;aube, voiture achetée un dimanche soir, départ
              imprévu au petit matin : le Guichet de Nuit prépare votre contrat pendant
              que tout le monde dort, et vous roulez assuré.
            </p>

            <a href="#depot" className="btn-gold" style={{ fontSize: 16, padding: '16px 32px' }}>
              Déposer ma demande au guichet
              <ArrowRight size={17} style={{ marginLeft: 8 }} />
            </a>

            {/* Indicateur d'etat : les trois textes vivent en statique dans le
                DOM, l'affichage commute selon l'heure Europe/Paris. */}
            <div
              role="status"
              style={{
                margin: '30px auto 0',
                maxWidth: 560,
                background: 'rgba(8, 10, 22, 0.55)',
                border: '1px solid var(--glass-border)',
                borderRadius: 14,
                padding: '14px 20px',
                fontSize: 14,
                color: 'var(--text-muted)',
                lineHeight: 1.6,
              }}
            >
              <div style={{ display: etat === 'a' ? 'block' : 'none' }}>
                La souscription en ligne classique est ouverte.{' '}
                <Link to="/tarification" style={{ color: 'var(--gold-light)', textDecoration: 'underline' }}>
                  Obtenir mon devis maintenant
                </Link>
                <span style={{ display: 'block', marginTop: 4, fontSize: 13, color: 'var(--text-subtle)' }}>
                  Le Guichet de Nuit ouvre à 21h.
                </span>
              </div>
              <div style={{
                display: etat === 'b' ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                color: 'var(--text)',
              }}>
                <span className="gdn-dot" aria-hidden="true" />
                Le Guichet de Nuit est ouvert. Devis et contrat en pleine nuit.
              </div>
              <div style={{ display: etat === 'c' ? 'block' : 'none', color: 'var(--text)' }}>
                Dimanche : le Guichet de Nuit assure la permanence toute la journée.
              </div>
            </div>
          </div>
        </section>

        {/* ── A bis. La reponse en bref (AEO) : le bloc que les moteurs de
               reponse citent. Statique, juste sous le hero. ──────────────── */}
        <section style={{ padding: '0 24px 72px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <AnswerCapsule capsule={CAPSULE} />
          </div>
        </section>

        {/* ── A ter. Reponses directes aux questions de nuit. Les H2 sont de
               vraies questions, chaque reponse commence par la reponse. ──── */}
        <section style={{ padding: '0 24px 88px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <m.div {...reveal()}>
              <h2 style={{ ...h2Style, fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)' }}>
                Peut-on souscrire une assurance temporaire la nuit ?
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, margin: '0 0 36px' }}>
                Oui. Le Guichet de Nuit reçoit les demandes de 21h à 9h du lundi au samedi,
                et sans interruption le dimanche. Vous remplissez le formulaire, vous joignez
                vos trois photos, un conseiller prépare le contrat et vous renvoie un devis
                dans les 30 minutes. La signature se fait en ligne, l&apos;attestation arrive
                par mail dès le paiement : rien à imprimer, personne à rappeler le lendemain
                matin.
              </p>
            </m.div>

            <m.div {...reveal()}>
              <h2 style={{ ...h2Style, fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)' }}>
                Et le dimanche, ou un jour férié ?
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, margin: '0 0 36px' }}>
                Le guichet assure la permanence toute la journée du dimanche, et les jours
                fériés suivent le même régime. Ce sont précisément les journées où la
                souscription en ligne classique est fermée, et où une sortie de fourrière
                ou une vente entre particuliers vous laisse devant un véhicule que vous
                n&apos;avez pas le droit de conduire.
              </p>
            </m.div>

            <m.div {...reveal()}>
              <h2 style={{ ...h2Style, fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)' }}>
                Que faire en attendant votre attestation ?
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, margin: '0 0 16px' }}>
                Ne prenez pas le volant. L&apos;assurance de responsabilité civile est
                obligatoire dès le premier mètre parcouru, même pour un trajet de cinq
                minutes, et rouler sans assurance expose à une amende et à
                l&apos;immobilisation du véhicule. Tant que votre attestation n&apos;est
                pas arrivée, laissez le véhicule où il est : c&apos;est le conseil le moins
                cher que nous puissions vous donner.
              </p>
              <Link
                to="/articles/controle-sans-assurance-risques-amende"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  background: 'var(--gold-glow)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--gold)',
                  textDecoration: 'none',
                }}
              >
                Ce que risque un conducteur non assuré
                <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </Link>
            </m.div>
          </div>
        </section>

        {/* ── B. Comment ca marche ────────────────────────────────────────── */}
        <section style={{ padding: '88px 24px' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <m.div {...reveal()} style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2 style={h2Style}>Comment ça marche ?</h2>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
                Trois étapes, tout par mail et SMS, depuis votre téléphone.
              </p>
            </m.div>

            <div className="gdn-steps">
              {STEPS.map((step, i) => (
                <m.div key={step.num} id={`etape-${i + 1}`} {...reveal(i * 0.12)} style={{ ...cardBase, textAlign: 'center' }}>
                  <div style={{
                    width: 54,
                    height: 54,
                    margin: '0 auto 18px',
                    borderRadius: 15,
                    background: 'linear-gradient(180deg, rgba(232,201,122,0.16), rgba(201,168,76,0.04))',
                    border: '1px solid var(--gold-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <step.Icon size={23} color="var(--gold-light)" strokeWidth={1.5} />
                  </div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--gold-light)',
                    letterSpacing: '0.15em',
                    marginBottom: 10,
                  }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', margin: '0 0 10px' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                    {step.body}
                  </p>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── C. Garantie 30 minutes ──────────────────────────────────────── */}
        <section style={{ padding: '8px 24px 88px' }}>
          <m.div
            {...reveal()}
            style={{
              maxWidth: 860,
              margin: '0 auto',
              position: 'relative',
              textAlign: 'center',
              background: 'linear-gradient(180deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)',
              border: '1px solid var(--gold-strong)',
              borderRadius: 22,
              padding: '44px 32px',
              overflow: 'hidden',
            }}
          >
            <span aria-hidden="true" style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--gold-light), transparent)',
            }} />
            <Timer size={30} color="var(--gold-light)" strokeWidth={1.5} aria-hidden="true" />
            <h2 style={{ ...h2Style, margin: '16px 0 12px' }}>
              Devis en 30 minutes ou tarif de jour
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
              Si le guichet met plus de 30 minutes à vous répondre une fois votre demande
              complète déposée, photos comprises, la majoration de nuit est offerte.
            </p>
          </m.div>
        </section>

        {/* ── D. L'equipe de nuit ─────────────────────────────────────────── */}
        <section style={{ padding: '0 24px 88px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <m.div {...reveal()}>
              <h2 style={{ ...h2Style, textAlign: 'center' }}>L&apos;équipe de nuit</h2>
              <p style={{
                fontSize: 16,
                color: 'var(--text-muted)',
                lineHeight: 1.8,
                textAlign: 'center',
                maxWidth: 680,
                margin: '0 auto 40px',
              }}>
                Pendant que les plateformes affichent des horaires de bureau, notre guichet
                reste allumé. Chaque dossier de nuit est préparé puis validé par un
                conseiller, du devis jusqu&apos;à l&apos;attestation dans votre boîte mail.
                Les demandes sont traitées dans leur ordre d&apos;arrivée ; un dossier
                inhabituel peut demander un échange de plus, et dans ce cas le guichet
                vous prévient tout de suite par mail.
              </p>
            </m.div>

            <div className="gdn-reassurance">
              {REASSURANCE.map(({ Icon, label }, i) => (
                <m.div
                  key={label}
                  {...reveal(i * 0.1)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    background: 'rgba(10, 13, 28, 0.45)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 14,
                    padding: '18px 18px',
                  }}
                >
                  <Icon size={19} color="var(--gold-light)" strokeWidth={1.75} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                  <span style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.55 }}>{label}</span>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── E. Maillage : cas d'usage ───────────────────────────────────── */}
        <section style={{ padding: '0 24px 96px' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <m.div {...reveal()} style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={h2Style}>Ils arrivent au guichet pour</h2>
            </m.div>
            <div className="gdn-cas">
              {CAS_GUICHET.map(({ Icon, title, body, to, cta }, i) => (
                <m.div key={title} {...reveal(i * 0.12)} style={{ ...cardBase, display: 'flex', flexDirection: 'column' }}>
                  <Icon size={22} color="var(--gold-light)" strokeWidth={1.5} aria-hidden="true" />
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: '14px 0 10px' }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 18px', flex: 1 }}>
                    {body}
                  </p>
                  <Link
                    to={to}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--gold-light)',
                      textDecoration: 'none',
                    }}
                  >
                    {cta}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── F. Formulaire du guichet ────────────────────────────────────── */}
        <section id="depot" style={{ padding: '0 24px 104px', scrollMarginTop: 90 }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={h2Style}>Déposer une demande au guichet</h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
                3 minutes, photos comprises, et aucun paiement à cette étape. Le tarif de
                nuit tout compris sera indiqué sur votre devis avant toute signature.
              </p>
            </div>

            {/* Message de succes : statique dans le DOM, revele apres envoi. */}
            <div
              style={{
                display: formStatus === 'success' ? 'block' : 'none',
                background: 'linear-gradient(180deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%)',
                border: '1px solid var(--gold-strong)',
                borderRadius: 18,
                padding: '32px 28px',
                textAlign: 'center',
              }}
              role="status"
            >
              <MailCheck size={28} color="var(--gold-light)" strokeWidth={1.5} aria-hidden="true" />
              <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '14px 0 12px' }}>
                Demande complète reçue au guichet{heureDepot ? ` à ${heureDepot}` : ''}.
              </h3>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                Votre devis part dans les 30 minutes. Surveillez votre boîte mail,
                pensez aux courriers indésirables.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              onFocusCapture={onFormFocus}
              noValidate={false}
              style={{
                display: formStatus === 'success' ? 'none' : 'block',
                background: 'rgba(10, 13, 28, 0.55)',
                border: '1px solid var(--gold-border)',
                borderRadius: 20,
                padding: 'clamp(22px, 4vw, 36px)',
              }}
            >
              {/* Configuration Web3Forms */}
              <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
              <input type="hidden" name="subject" value="GUICHET DE NUIT - nouvelle demande" />
              <input type="hidden" name="from_name" value="Le Guichet de Nuit" />
              {/* Piege anti-spam Web3Forms : doit rester decoche. Un robot qui
                  remplit tout coche la case et la soumission est rejetee. */}
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="gdn-honey" />

              <div className="gdn-form-grid">
                <div>
                  <label htmlFor="gdn-prenom" className="gdn-label">Prénom</label>
                  <input id="gdn-prenom" name="prenom" type="text" required autoComplete="given-name" className="gdn-input" />
                </div>
                <div>
                  <label htmlFor="gdn-nom" className="gdn-label">Nom</label>
                  <input id="gdn-nom" name="nom" type="text" required autoComplete="family-name" className="gdn-input" />
                </div>
                <div>
                  <label htmlFor="gdn-tel" className="gdn-label">Téléphone mobile</label>
                  <input id="gdn-tel" name="telephone" type="tel" inputMode="tel" required autoComplete="tel" className="gdn-input" />
                </div>
                <div>
                  <label htmlFor="gdn-email" className="gdn-label">Email</label>
                  <input
                    id="gdn-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    pattern="[^@\s]+@[^@\s]+\.[^@\s]{2,}"
                    className="gdn-input"
                    aria-describedby="gdn-email-note"
                  />
                  <p id="gdn-email-note" className="gdn-note">
                    Vérifiez bien votre email : votre devis et votre lien de signature y seront envoyés.
                  </p>
                </div>
                <div>
                  <label htmlFor="gdn-immat" className="gdn-label">Immatriculation</label>
                  <input
                    id="gdn-immat"
                    name="immatriculation"
                    type="text"
                    required
                    placeholder="AB-123-CD"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    className="gdn-input"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                <div>
                  <label htmlFor="gdn-vehicule" className="gdn-label">Marque et modèle</label>
                  <input id="gdn-vehicule" name="vehicule" type="text" required placeholder="Renault Clio" className="gdn-input" />
                </div>
                <div>
                  <label htmlFor="gdn-motif" className="gdn-label">Motif</label>
                  <select id="gdn-motif" name="motif" required defaultValue="" className="gdn-input">
                    <option value="" disabled>Choisir un motif</option>
                    <option value="Sortie de fourrière">Sortie de fourrière</option>
                    <option value="Achat ou vente">Achat ou vente</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="gdn-duree" className="gdn-label">Durée souhaitée</label>
                  <select id="gdn-duree" name="duree" required defaultValue="" className="gdn-input">
                    <option value="" disabled>Choisir une durée</option>
                    {DUREES.map((d) => (
                      <option key={d} value={`${d} jour${d === '1' ? '' : 's'}`}>
                        {d} jour{d === '1' ? '' : 's'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="gdn-field-full">
                  <label htmlFor="gdn-debut" className="gdn-label">
                    Date et heure auxquelles vous devez être couvert
                  </label>
                  <input id="gdn-debut" name="debut_couverture" type="datetime-local" required className="gdn-input" />
                </div>

                <fieldset className="gdn-field-full gdn-fieldset">
                  <legend className="gdn-label">
                    Avez-vous eu un accident ou un sinistre dans les dernières 24 heures ?
                  </legend>
                  <div className="gdn-radios">
                    <label className="gdn-radio">
                      <input type="radio" name="sinistre_24h" value="Oui" required /> Oui
                    </label>
                    <label className="gdn-radio">
                      <input type="radio" name="sinistre_24h" value="Non" /> Non
                    </label>
                  </div>
                </fieldset>

                <fieldset className="gdn-field-full gdn-fieldset">
                  <legend className="gdn-label">
                    Avez-vous déjà été résilié par un assureur ou eu un retrait de permis ces 5 dernières années ?
                  </legend>
                  <div className="gdn-radios">
                    <label className="gdn-radio">
                      <input type="radio" name="resilie_ou_retrait" value="Oui" required /> Oui
                    </label>
                    <label className="gdn-radio">
                      <input type="radio" name="resilie_ou_retrait" value="Non" /> Non
                    </label>
                  </div>
                </fieldset>

                {/* ── Vos 3 photos : jointes a la demande, en une soumission ── */}
                <div className="gdn-field-full gdn-files">
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>
                    Vos 3 photos
                  </h3>
                  <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: '0 0 18px', lineHeight: 1.6 }}>
                    Une photo nette prise avec votre téléphone suffit.
                  </p>

                  <div>
                    <label htmlFor="gdn-permis-recto" className="gdn-label">
                      Permis de conduire, recto
                    </label>
                    <input
                      id="gdn-permis-recto"
                      name="permis_recto"
                      type="file"
                      required
                      accept="image/*,.pdf"
                      capture="environment"
                      onChange={(e) => handleFileChange('permis_recto', e)}
                      className="gdn-input gdn-file"
                    />
                    <p className="gdn-note" style={{ display: fileNames.permis_recto ? 'block' : 'none', color: 'var(--gold-light)' }}>
                      {fileNames.permis_recto}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="gdn-permis-verso" className="gdn-label">
                      Permis de conduire, verso
                    </label>
                    <input
                      id="gdn-permis-verso"
                      name="permis_verso"
                      type="file"
                      required
                      accept="image/*,.pdf"
                      capture="environment"
                      onChange={(e) => handleFileChange('permis_verso', e)}
                      className="gdn-input gdn-file"
                    />
                    <p className="gdn-note" style={{ display: fileNames.permis_verso ? 'block' : 'none', color: 'var(--gold-light)' }}>
                      {fileNames.permis_verso}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="gdn-carte-grise" className="gdn-label">
                      Carte grise du véhicule <span style={{ color: 'var(--text-subtle)' }}>(facultatif)</span>
                    </label>
                    <input
                      id="gdn-carte-grise"
                      name="carte_grise"
                      type="file"
                      accept="image/*,.pdf"
                      capture="environment"
                      onChange={(e) => handleFileChange('carte_grise', e)}
                      className="gdn-input gdn-file"
                      aria-describedby="gdn-carte-grise-note"
                    />
                    <p className="gdn-note" style={{ display: fileNames.carte_grise ? 'block' : 'none', color: 'var(--gold-light)' }}>
                      {fileNames.carte_grise}
                    </p>
                    <p id="gdn-carte-grise-note" className="gdn-note">
                      Pas sous la main, par exemple restée dans le véhicule en fourrière ?
                      Envoyez-la plus tard en répondant au mail de confirmation.
                    </p>
                  </div>

                  {/* Depassement de taille : texte statique, simplement revele. */}
                  <p
                    role="alert"
                    style={{
                      display: filesTooBig ? 'block' : 'none',
                      margin: '4px 0 0',
                      fontSize: 13.5,
                      lineHeight: 1.6,
                      color: 'var(--gold-light)',
                      background: 'var(--gold-dim)',
                      border: '1px solid var(--gold-border)',
                      borderRadius: 11,
                      padding: '12px 14px',
                    }}
                  >
                    Vos photos dépassent 10 Mo au total. Reprenez la plus lourde en photo
                    simple, sans mode haute définition, puis déposez-la de nouveau.
                  </p>
                </div>

                <label className="gdn-field-full gdn-check">
                  <input type="checkbox" name="consentement_rgpd" value="Oui" required />
                  <span>
                    J&apos;accepte que mes données soient utilisées uniquement pour établir
                    mon devis. Elles ne sont jamais revendues.
                  </span>
                </label>

                <label className="gdn-field-full gdn-check">
                  <input type="checkbox" name="acceptation_tarif_nuit" value="Oui" required />
                  <span>
                    J&apos;ai compris que le tarif de nuit tout compris sera indiqué sur
                    mon devis, avant tout paiement.
                  </span>
                </label>

                <div className="gdn-field-full">
                  <button
                    type="submit"
                    className="btn-gold"
                    disabled={formStatus === 'sending'}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: 16,
                      padding: '16px 24px',
                      opacity: formStatus === 'sending' ? 0.7 : 1,
                    }}
                  >
                    {formStatus === 'sending' ? 'Envoi en cours' : 'Déposer ma demande'}
                  </button>
                </div>
              </div>

              {/* Message d'erreur : statique dans le DOM, revele si l'envoi echoue. */}
              <p
                role="alert"
                className="gdn-note"
                style={{
                  display: formStatus === 'error' ? 'block' : 'none',
                  marginTop: 16,
                  fontSize: 14,
                  color: 'var(--gold-light)',
                  textAlign: 'center',
                }}
              >
                L&apos;envoi n&apos;a pas abouti. Écrivez directement au guichet :{' '}
                <a
                  href={`mailto:${GUICHET_EMAIL}?subject=GUICHET%20DE%20NUIT%20-%20nouvelle%20demande`}
                  style={{ color: 'var(--gold-light)', textDecoration: 'underline' }}
                >
                  {GUICHET_EMAIL}
                </a>
                . Joignez vos informations et vos photos au mail, votre demande sera
                traitée de la même façon.
              </p>
            </form>
          </div>
        </section>

        {/* ── G. FAQ visible (le schema FAQPage reprend les memes textes) ── */}
        <section style={{ padding: '0 24px 96px' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <m.div {...reveal()} style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
                QUESTIONS FRÉQUENTES
              </p>
              <h2 style={h2Style}>Vos questions sur le Guichet de Nuit</h2>
            </m.div>

            <div className="gdn-faq">
              {FAQ.map((item) => (
                <m.div key={item.q} {...reveal()} style={cardBase}>
                  <h3 style={{ fontSize: 16.5, fontWeight: 600, color: 'var(--text)', margin: '0 0 10px', lineHeight: 1.4 }}>
                    {item.q}
                  </h3>
                  <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                    {item.a}
                  </p>
                </m.div>
              ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-subtle)', margin: '40px 0 0' }}>
              Page mise à jour le {DATE_MAJ}.
            </p>
          </div>
        </section>
      </div>

      <Footer />

      <style>{`
        .gdn-page {
          background: linear-gradient(180deg, #05060F 0%, #060810 42%, #0A0A0A 100%);
        }
        .gdn-star {
          position: absolute;
          border-radius: 50%;
          background: #E8C97A;
          pointer-events: none;
        }
        @keyframes gdn-twinkle {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.75; }
        }
        .gdn-star-tw {
          animation: gdn-twinkle var(--gdn-twd, 5s) ease-in-out var(--gdn-twdl, 0s) infinite;
        }
        .gdn-moon {
          width: clamp(58px, 8vw, 96px);
          height: auto;
        }
        .gdn-dot {
          flex-shrink: 0;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--gold-light);
          box-shadow: 0 0 8px rgba(232, 201, 122, 0.8);
          animation: gdn-pulse 2.4s ease-in-out infinite;
        }
        @keyframes gdn-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gdn-star-tw { animation: none; }
          .gdn-dot { animation: none; opacity: 1; }
        }
        .gdn-steps, .gdn-cas {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .gdn-reassurance {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .gdn-faq {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .gdn-steps, .gdn-cas, .gdn-reassurance { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
          .gdn-faq { grid-template-columns: 1fr; }
        }
        .gdn-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
          margin-bottom: 7px;
        }
        .gdn-input {
          width: 100%;
          font-family: inherit;
          font-size: 16px;
          color: var(--text);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 11px;
          padding: 12px 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .gdn-input:focus {
          border-color: var(--gold-strong);
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.14);
        }
        .gdn-input::placeholder { color: var(--text-subtle); }
        select.gdn-input { appearance: auto; background-color: rgba(255,255,255,0.04); }
        select.gdn-input option { background: #0A0C1A; color: var(--text); }
        input.gdn-input[type="datetime-local"] { color-scheme: dark; }
        .gdn-note {
          font-size: 12.5px;
          color: var(--text-subtle);
          line-height: 1.5;
          margin: 7px 0 0;
        }
        .gdn-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 16px;
        }
        .gdn-field-full { grid-column: 1 / -1; }
        @media (max-width: 640px) {
          .gdn-form-grid { grid-template-columns: 1fr; }
        }
        .gdn-fieldset {
          border: none;
          margin: 0;
          padding: 0;
        }
        .gdn-fieldset legend { padding: 0; }
        .gdn-radios { display: flex; gap: 26px; margin-top: 4px; }
        .gdn-radio {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          color: var(--text);
          cursor: pointer;
        }
        .gdn-radio input, .gdn-check input { accent-color: var(--gold); width: 17px; height: 17px; }
        .gdn-check {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.55;
          cursor: pointer;
        }
        .gdn-check input { flex-shrink: 0; margin-top: 2px; }
        .gdn-files {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 20px 18px;
        }
        .gdn-file {
          padding: 10px 12px;
          font-size: 14px;
          color: var(--text-muted);
          cursor: pointer;
        }
        .gdn-file::file-selector-button {
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--gold-light);
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          border-radius: 9px;
          padding: 8px 14px;
          margin-right: 12px;
          cursor: pointer;
        }
        .gdn-honey {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}

export default GuichetDeNuit;
