import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  animate, m, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll,
} from 'framer-motion';
import {
  AlertCircle, ArrowLeft, ArrowRight, Camera, Car, CalendarClock, ClipboardList,
  ExternalLink, FileSignature, KeyRound, Landmark, MailCheck, Moon, ShieldAlert,
  ShieldCheck, Timer, User,
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

/* ── Signal d'arret du compteur de veille ────────────────────────────────────
   Endpoint de statut du dossier. Vide tant qu'il n'existe pas : le compteur
   decompte alors les 30 minutes en pure reassurance, puis se fige. Des que
   cette constante est renseignee, la scene finale sonde
   `${GUICHET_STATUS_ENDPOINT}?ref=<reference>` toutes les 20 secondes et
   attend un JSON { ref, status, ts, signature_url } dont le statut vaut
   "pending", "quote_created", "signature_sent" ou "paid". */
const GUICHET_STATUS_ENDPOINT = '';
const POLL_INTERVAL_MS = 20000;
const VEILLE_MS = 30 * 60 * 1000;
const VEILLE_MINUTES = 30;

/* Web3Forms plafonne la taille totale d'une soumission : au-dela, la requete
   est rejetee cote serveur. On controle avant l'envoi pour rendre la main a
   l'utilisateur avec un message utile plutot qu'une erreur reseau opaque. */
const MAX_FILES_BYTES = 10 * 1024 * 1024;
const FILE_FIELDS = ['permis_recto', 'permis_verso', 'carte_grise'];

/* ── Ciel etoile ──────────────────────────────────────────────────────────────
   Positions FIXES (jamais de Math.random au rendu : le rendu serveur et
   l'hydratation doivent produire exactement le meme arbre). 32 etoiles, 8
   scintillent par animation d'opacity (coupee par prefers-reduced-motion). */
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
   b : guichet actif (21h-9h en semaine, samedi des 20h)
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

/* ── Reference de dossier ─────────────────────────────────────────────────────
   Format : GN-AAAAMMJJ-HHMM-XXXX (heure Europe/Paris, suffixe aleatoire).
   C'est la cle qui relie le client depose au guichet a son compteur de veille :
   elle part avec la demande (champ "reference" du mail Web3Forms) et sert de
   parametre au sondage de statut. Genere UNIQUEMENT cote client (Math.random
   et l'horloge au rendu casseraient l'hydratation), memorise en localStorage
   pour survivre a un rechargement tant que la demande n'est pas soumise. */
const REF_STORAGE_KEY = 'guichet_ref';
/* Alphabet sans I, O, 0, 1 : une reference se dicte au telephone. */
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function makeReference() {
  let stamp;
  try {
    const parts = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type)?.value || '';
    stamp = `${get('year')}${get('month')}${get('day')}-${get('hour')}${get('minute')}`;
  } catch {
    const d = new Date();
    const p2 = (n) => String(n).padStart(2, '0');
    stamp = `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}`;
  }
  let suffix = '';
  for (let i = 0; i < 4; i += 1) {
    suffix += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)];
  }
  return `GN-${stamp}-${suffix}`;
}

function readStoredRef() {
  try {
    return window.localStorage.getItem(REF_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function writeStoredRef(value) {
  try {
    if (value) window.localStorage.setItem(REF_STORAGE_KEY, value);
    else window.localStorage.removeItem(REF_STORAGE_KEY);
  } catch {
    /* navigation privee : la reference vit alors en memoire pour la session */
  }
}

const DATE_MAJ = '13 juillet 2026';
const DATE_MAJ_ISO = '2026-07-13';

/* ── Les scenes ───────────────────────────────────────────────────────────────
   On groupe : une scene par intention, jamais une scene par champ. `fields`
   sert au fil de progression et a la lecture d'ecran ; la validation, elle,
   interroge le DOM reel de la scene (checkValidity), ce qui couvre aussi les
   radios et les fichiers sans dupliquer les regles. */
const SCENES = [
  { key: 'ouverture', label: 'Le guichet' },
  { key: 'identite', label: 'Qui etes-vous' },
  { key: 'vehicule', label: 'Votre vehicule' },
  { key: 'besoin', label: 'Votre besoin' },
  { key: 'questions', label: 'Deux questions rapides' },
  { key: 'photos', label: 'Vos 3 photos' },
  { key: 'depot', label: 'Derniere etape' },
];
const N_SCENES = SCENES.length;
const LAST = N_SCENES - 1;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const DUREES = ['1', '2', '3', '5', '7', '10', '15', '20', '30', '60', '90'];

/* ── Reponse en bref (AEO) ────────────────────────────────────────────────
   Bloc que les moteurs de reponse (ChatGPT, Perplexity, AI Overviews) citent
   le plus volontiers : 100 % statique dans le HTML prerendu. */
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

const cardBase = {
  background: 'rgba(10, 13, 28, 0.55)',
  border: '1px solid var(--gold-border)',
  borderRadius: 18,
  padding: '26px 24px',
};

const h2Style = {
  fontSize: 'clamp(1.6rem, 3.4vw, 2.3rem)',
  fontWeight: 700,
  letterSpacing: '-0.025em',
  color: 'var(--text)',
  margin: '0 0 14px',
};

const TITLE = 'Assurance temporaire la nuit : Le Guichet de Nuit AssuTempo, 21h à 9h et dimanche';
const DESCRIPTION = "Oui, on s'assure aussi en pleine nuit : le Guichet de Nuit prépare votre contrat de 21h à 9h et le dimanche. Devis en 30 minutes, attestation par mail.";

/* ═══════════════════════════════════════════════════════════════════════════
   Compteur de veille : la scene finale, apres le depot de la demande.
   Le temps MM:SS est du texte mis a jour en JS. Le mouvement est en transform
   pur (un point dore qui tourne) et en opacity (les minutes qui s'eteignent) :
   aucune animation de stroke-dashoffset, aucune propriete de layout.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Une etoile par minute de veille, posee sur le cercle. Positions calculees
   une fois pour toutes : rien d'aleatoire, rien de recalcule par frame. */
const RING_RADIUS = 104;
const RING_STARS = Array.from({ length: VEILLE_MINUTES }, (_, i) => ({
  i,
  transform: `rotate(${i * (360 / VEILLE_MINUTES)}deg) translateY(-${RING_RADIUS}px)`,
}));

function formatMMSS(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function CompteurDeVeille({ reference }) {
  /* 'veille'      : le compteur tourne
     'finalisation': 00:00 atteint sans signal, le compteur se fige
     'pret'        : signal reel recu, le lien de signature est parti */
  const [phase, setPhase] = useState('veille');
  const [restant, setRestant] = useState(VEILLE_MS);
  const [signatureUrl, setSignatureUrl] = useState('');
  const phaseRef = useRef('veille');
  const rootRef = useRef(null);

  /* Le decompte : une echeance absolue plutot qu'une soustraction cumulee.
     Un onglet endormi, un ecran verrouille, et le compteur reste juste. */
  useEffect(() => {
    trackEvent('guichet_countdown_start');
    const deadline = Date.now() + VEILLE_MS;
    let id = 0;
    const tick = () => {
      if (phaseRef.current === 'pret') return;
      const reste = deadline - Date.now();
      if (reste <= 0) {
        setRestant(0);
        phaseRef.current = 'finalisation';
        setPhase('finalisation');
        clearInterval(id);
        return;
      }
      setRestant(reste);
    };
    tick();
    id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* Le vrai signal. Sans endpoint, aucune requete n'est emise : le compteur
     reste une promesse de patience, jamais une fausse information. Avec
     endpoint, une erreur reseau est avalee en silence et retentee au tick
     suivant : le client ne doit jamais voir une panne de sondage. */
  useEffect(() => {
    if (!GUICHET_STATUS_ENDPOINT || !reference) return undefined;
    let alive = true;
    let id = 0;

    const sonde = async () => {
      try {
        const url = `${GUICHET_STATUS_ENDPOINT}?ref=${encodeURIComponent(reference)}`;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) return;
        const data = await res.json();
        if (!alive || !data) return;
        if (data.status === 'signature_sent' || data.status === 'paid') {
          clearInterval(id);
          phaseRef.current = 'pret';
          setSignatureUrl(typeof data.signature_url === 'string' ? data.signature_url : '');
          setPhase('pret');
          trackEvent('guichet_signature_ready', { statut: data.status });
        }
      } catch {
        /* hors ligne, endpoint muet, JSON casse : on retente dans 20 s */
      }
    };

    sonde();
    id = setInterval(sonde, POLL_INTERVAL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [reference]);

  /* La scene finale remplace l'experience : on remonte en haut de page pour
     que le client la trouve sous ses yeux, sans defilement anime (le
     scroll-behavior smooth global s'appliquerait sinon a ce saut). */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    rootRef.current?.focus?.();
  }, []);

  const enVeille = phase === 'veille';
  const minutesAllumees = enVeille ? Math.ceil(restant / 60000) : 0;

  return (
    <section
      ref={rootRef}
      tabIndex={-1}
      className="gdn-final"
      aria-label="Suivi de votre demande au guichet"
    >
      <div className="gdn-final-inner">
        <p className="gdn-eyebrow">
          <Moon size={13} strokeWidth={2} aria-hidden="true" />
          Demande déposée
        </p>

        {/* Le cadran de veille */}
        <div className="gdn-ring" role="timer" aria-live="off">
          <div className="gdn-ring-face" aria-hidden="true" />
          {RING_STARS.map((star) => (
            <span
              key={star.i}
              aria-hidden="true"
              className="gdn-ring-star"
              style={{
                transform: star.transform,
                opacity: star.i < minutesAllumees ? 0.85 : 0.12,
              }}
            />
          ))}
          <div className={enVeille ? 'gdn-orbit' : 'gdn-orbit gdn-orbit-off'} aria-hidden="true">
            <span className="gdn-orbit-dot" />
          </div>
          <div className="gdn-ring-center">
            <span className="gdn-ring-time">{phase === 'pret' ? 'Prêt' : formatMMSS(restant)}</span>
            <span className="gdn-ring-label">
              {phase === 'pret' ? 'contrat disponible' : 'veille du guichet'}
            </span>
          </div>
        </div>

        {/* Les trois messages vivent dans le DOM, seul l'affichage commute. */}
        <div style={{ display: enVeille ? 'block' : 'none' }}>
          <h2 className="gdn-final-title">Votre demande est au guichet.</h2>
          <p className="gdn-final-text">
            Notre équipe de nuit prépare votre contrat. Dès qu&apos;il est prêt, vous
            recevez le lien de signature par mail et par SMS.
          </p>
        </div>

        <div style={{ display: phase === 'finalisation' ? 'block' : 'none' }}>
          <h2 className="gdn-final-title">Votre conseiller met la dernière main à votre contrat.</h2>
          <p className="gdn-final-text">
            Le lien arrive d&apos;un instant à l&apos;autre. Gardez un oeil sur vos mails,
            pensez aux indésirables.
          </p>
        </div>

        <div style={{ display: phase === 'pret' ? 'block' : 'none' }}>
          <h2 className="gdn-final-title">Votre contrat est prêt.</h2>
          <p className="gdn-final-text">
            Le lien de signature vient de partir par mail et par SMS.
          </p>
          {signatureUrl ? (
            <a
              href={signatureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ marginTop: 22, fontSize: 16, padding: '15px 30px' }}
            >
              Signer maintenant
              <ExternalLink size={16} style={{ marginLeft: 8 }} aria-hidden="true" />
            </a>
          ) : null}
        </div>

        {reference ? (
          <p className="gdn-final-ref">
            Référence de dossier <strong>{reference}</strong>
          </p>
        ) : null}

        {/* Pendant que le guichet travaille : de quoi rester, et de quoi lire. */}
        <div className="gdn-final-band">
          <p className="gdn-band-title">Pendant que le guichet travaille</p>
          <ul className="gdn-band-list">
            {REASSURANCE.map(({ Icon, label }) => (
              <li key={label}>
                <Icon size={17} color="var(--gold-light)" strokeWidth={1.75} aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <div className="gdn-band-links">
            {CAS_GUICHET.map(({ title, to }) => (
              <Link key={to} to={to} className="gdn-band-link">
                {title}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   La page
   ═══════════════════════════════════════════════════════════════════════════ */

function GuichetDeNuit() {
  const reduce = useReducedMotion();

  /* ── Modes ────────────────────────────────────────────────────────────────
     'simple' : formulaire vertical empile. C'est le rendu du serveur, donc
                aussi celui qu'obtient un visiteur sans JS, et celui que
                garde prefers-reduced-motion. Aucun mismatch d'hydratation :
                le premier rendu client est identique au HTML prerendu.
     'rail'   : scrollytelling horizontal (pointeur fin, >= 1024px). La
                progression du scroll vertical pilote un translateX.
     'step'   : stepper plein ecran (tactile). Aucun detournement du scroll :
                bouton "Continuer" et swipe horizontal. */
  const [enhanced, setEnhanced] = useState(false);
  const [device, setDevice] = useState('step');
  const [simpleForce, setSimpleForce] = useState(false);
  const mode = (!enhanced || simpleForce || reduce) ? 'simple' : device;

  /* Miroirs du mode et de la scene courante, lus par les callbacks qui vivent
     hors du rendu : boucle de scroll, ResizeObserver, gestes, rAF. Ecrits en
     effet (jamais pendant le rendu) et toujours a jour au moment ou ces
     callbacks tournent, tous posterieurs au commit. */
  const modeRef = useRef(mode);
  const sceneRef = useRef(0);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    if (reduce) return undefined;
    const mq = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    const apply = () => setDevice(mq.matches ? 'rail' : 'step');
    apply();
    setEnhanced(true);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [reduce]);

  /* ── Progression ──────────────────────────────────────────────────────── */
  const [scene, setScene] = useState(0);
  useEffect(() => { sceneRef.current = scene; }, [scene]);
  const [validees, setValidees] = useState(() => new Set());
  const [erreur, setErreur] = useState(null);
  const vuesRef = useRef(new Set());

  const railRef = useRef(null);
  const stageRef = useRef(null);
  const formRef = useRef(null);
  const sceneEls = useRef([]);
  const largeurRef = useRef(0);
  const progressRef = useRef(0);

  /* Une seule MotionValue pour le translateX de la piste : le scroll l'ecrit
     en mode rail, le doigt et le bouton l'ecrivent en mode step. Jamais deux
     sources en meme temps (le mode tranche), donc jamais de conflit. */
  const x = useMotionValue(0);

  /* Mesure de la largeur d'une scene (la piste fait N fois cette largeur).
     ResizeObserver plutot qu'un listener resize : capte aussi la barre
     d'URL mobile qui se retracte et les changements d'orientation. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      largeurRef.current = el.clientWidth;
      const m = modeRef.current;
      if (m === 'rail') x.set(-progressRef.current * LAST * largeurRef.current);
      else if (m === 'step') x.set(-sceneRef.current * largeurRef.current);
      else x.set(0);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [x]);

  /* Mode rail : la progression du scroll vertical sur la hauteur virtuelle
     (N x 100vh) devient la position horizontale de la piste. */
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    progressRef.current = p;
    if (modeRef.current !== 'rail') return;
    x.set(-p * LAST * largeurRef.current);
    const i = clamp(Math.round(p * LAST), 0, LAST);
    if (i !== sceneRef.current) setScene(i);
  });

  /* Changement de mode : on repositionne la piste sans transition (le passage
     rail <-> step <-> simple est un changement de mise en page, pas une
     animation) et on repart de la scene courante. */
  useEffect(() => {
    largeurRef.current = stageRef.current?.clientWidth || 0;
    if (mode === 'simple') x.set(0);
    else if (mode === 'step') x.set(-sceneRef.current * largeurRef.current);
    else x.set(-progressRef.current * LAST * largeurRef.current);
  }, [mode, x]);

  useEffect(() => {
    trackEvent('guichet_page_view');
  }, []);

  /* Une scene vue est signalee une fois par session. */
  useEffect(() => {
    if (vuesRef.current.has(scene)) return;
    vuesRef.current.add(scene);
    trackEvent('guichet_scene_view', { scene_index: scene, scene: SCENES[scene].key });
  }, [scene]);

  /* ── Etat du guichet (heure Europe/Paris) ─────────────────────────────── */
  const [etat, setEtat] = useState('a');
  useEffect(() => {
    const tick = () => setEtat(computeEtat());
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  /* ── Reference de dossier ─────────────────────────────────────────────── */
  const [reference, setReference] = useState('');
  const referenceRef = useRef('');
  useEffect(() => {
    const existante = readStoredRef();
    const ref = existante || makeReference();
    if (!existante) writeStoredRef(ref);
    referenceRef.current = ref;
    setReference(ref);
  }, []);

  /* ── Formulaire ───────────────────────────────────────────────────────── */
  const [formStatus, setFormStatus] = useState('idle');
  const formStartedRef = useRef(false);
  const [fileNames, setFileNames] = useState({ permis_recto: '', permis_verso: '', carte_grise: '' });
  const [filesTooBig, setFilesTooBig] = useState(false);
  const filesEventRef = useRef(false);

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
    if (!filesEventRef.current && next.permis_recto && next.permis_verso) {
      filesEventRef.current = true;
      trackEvent('guichet_form_files_added');
    }
  }

  /* ── Navigation entre scenes ──────────────────────────────────────────── */

  /* En mode rail, "aller a la scene i" veut dire "amener le scroll a la
     position ou la piste montre la scene i" : le scroll reste le seul
     maitre du mouvement, on ne detourne rien. */
  const goToScene = useCallback((cible) => {
    const i = clamp(cible, 0, LAST);
    const m = modeRef.current;

    if (m === 'rail') {
      const rail = railRef.current;
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      const haut = rect.top + window.scrollY;
      const course = rail.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: haut + (course * i) / LAST,
        behavior: reduce ? 'instant' : 'smooth',
      });
      return;
    }

    if (m === 'step') {
      setScene(i);
      const cibleX = -i * largeurRef.current;
      if (reduce) x.set(cibleX);
      else animate(x, cibleX, { type: 'spring', stiffness: 260, damping: 34, restDelta: 0.5 });
      return;
    }

    /* simple : la scene suivante est simplement plus bas dans la page */
    setScene(i);
    sceneEls.current[i]?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
  }, [reduce, x]);

  /* Premier champ invalide d'une scene, ou null. On interroge le DOM reel :
     checkValidity couvre les champs requis, le format email, les radios non
     cochees et les cases a cocher obligatoires, sans dupliquer une regle. */
  const premierInvalide = useCallback((i) => {
    const el = sceneEls.current[i];
    if (!el) return null;
    const champs = el.querySelectorAll('input, select, textarea');
    for (const champ of champs) {
      if (champ.name === 'botcheck') continue;
      if (!champ.checkValidity()) return champ;
    }
    return null;
  }, []);

  /* Le champ fautif peut appartenir a une scene encore hors champ (garde-fou
     de la soumission) : elle est alors `inert`, donc NON focalisable. On
     attend qu'elle devienne la scene courante avant de donner le focus, et on
     leve son inertie dans la foulee pour ne dependre d'aucun ordre de commit
     React. Plafond de tentatives : un scroll anime qui n'aboutit pas ne doit
     pas laisser une boucle vivante. */
  const signalerErreur = useCallback((i, champ, message) => {
    setErreur({ scene: i, message: message || champ?.validationMessage || 'Complétez ce champ pour continuer.' });
    if (!champ) return;
    let essais = 0;
    const tenter = () => {
      essais += 1;
      if (sceneRef.current !== i && essais < 90) {
        window.requestAnimationFrame(tenter);
        return;
      }
      sceneEls.current[i]?.removeAttribute('inert');
      champ.focus({ preventScroll: true });
      champ.reportValidity?.();
    };
    window.requestAnimationFrame(tenter);
  }, []);

  /* La scene ne laisse avancer qu'une fois ses champs valides. */
  const validerScene = useCallback((i) => {
    const champ = premierInvalide(i);
    if (champ) {
      signalerErreur(i, champ);
      return false;
    }
    if (i === 5 && filesTooBig) {
      signalerErreur(i, null, 'Vos photos dépassent 10 Mo au total.');
      return false;
    }
    setErreur(null);
    setValidees((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    return true;
  }, [filesTooBig, premierInvalide, signalerErreur]);

  const avancer = useCallback((i) => {
    if (!validerScene(i)) return false;
    goToScene(i + 1);
    return true;
  }, [goToScene, validerScene]);

  /* ── Swipe (mode step) ────────────────────────────────────────────────────
     Le drag de Framer Motion demande les features domMax ; le site est en
     LazyMotion domAnimation (bundle allege, regle de juin). Le geste est donc
     capte en pointer events natifs et ecrit dans la MEME MotionValue : le
     mouvement reste du transform pilote par Framer, sans nouvelle dependance
     ni alourdissement du bundle global.
     Un geste qui part d'un champ n'est jamais capte : le clavier reste ouvert,
     la selection de texte et les pickers natifs fonctionnent normalement. */
  const dragRef = useRef(null);

  const onPointerDown = (e) => {
    if (modeRef.current !== 'step' || formStatus === 'sending') return;
    if (e.target.closest('input, select, textarea, button, a, label')) return;
    dragRef.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      base: x.get(),
      actif: false,
    };
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.actif) {
      if (Math.abs(dx) < 12) return;
      /* geste plus vertical qu'horizontal : c'est un scroll, on lache */
      if (Math.abs(dx) <= Math.abs(dy)) {
        dragRef.current = null;
        return;
      }
      d.actif = true;
      stageRef.current?.setPointerCapture?.(e.pointerId);
    }
    const w = largeurRef.current || 1;
    const min = -LAST * w;
    let next = d.base + dx;
    /* resistance aux deux bouts : le rail se tend, il ne casse pas */
    if (next > 0) next *= 0.25;
    else if (next < min) next = min + (next - min) * 0.25;
    x.set(next);
  };

  const onPointerUp = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    if (stageRef.current?.hasPointerCapture?.(e.pointerId)) {
      stageRef.current.releasePointerCapture(e.pointerId);
    }
    if (!d.actif) return;
    const dx = e.clientX - d.x0;
    const seuil = Math.min(90, (largeurRef.current || 320) * 0.18);
    const i = sceneRef.current;
    if (dx < -seuil && i < LAST) {
      if (!avancer(i)) goToScene(i);
      return;
    }
    if (dx > seuil && i > 0) {
      setErreur(null);
      goToScene(i - 1);
      return;
    }
    goToScene(i);
  };

  /* ── Soumission ───────────────────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (formStatus === 'sending') return;

    /* Garde-fou final : une scene incomplete ramene le client dessus, sur le
       champ fautif. Le scroll libre du mode rail ne peut donc pas produire
       une demande a trous. */
    for (let i = 1; i <= LAST; i += 1) {
      const champ = premierInvalide(i);
      if (champ) {
        goToScene(i);
        signalerErreur(i, champ);
        return;
      }
    }

    const form = formRef.current;
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
      goToScene(5);
      signalerErreur(5, null, 'Vos photos dépassent 10 Mo au total.');
      return;
    }

    /* La reference du dossier part avec la demande : c'est elle qui relie le
       mail recu au guichet et le compteur affiche au client. */
    if (referenceRef.current) data.set('reference', referenceRef.current);

    trackEvent('guichet_form_submit');
    setFormStatus('sending');
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body: data });
      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload || payload.success !== true) throw new Error('envoi refuse');
      /* Demande partie : la reference a joue son role de brouillon, la
         prochaine visite repartira sur un dossier neuf. */
      writeStoredRef('');
      setFormStatus('success');
    } catch {
      setFormStatus('error');
      goToScene(LAST);
    }
  }

  /* Reveal discret des sections sous le pli (transform + opacity uniquement,
     une seule fois, rien si l'utilisateur prefere reduire les animations). */
  const reveal = (delay = 0) => (reduce ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  });

  const enExperience = mode !== 'simple';
  const succes = formStatus === 'success';

  /* Les scenes hors champ ne doivent etre ni tabulables ni lues : `inert` les
     neutralise sans les retirer du DOM (le texte reste dans le HTML prerendu,
     donc lisible par les moteurs). En mode simple, tout est actif. */
  const sceneInerte = (i) => enExperience && i !== scene;

  const nav = (i, libelle) => (
    <div className="gdn-nav">
      {i > 0 ? (
        <button
          type="button"
          className="gdn-back"
          onClick={() => { setErreur(null); goToScene(i - 1); }}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Retour
        </button>
      ) : <span />}
      <button type="button" className="btn-gold gdn-next" onClick={() => avancer(i)}>
        {libelle}
        <ArrowRight size={16} style={{ marginLeft: 8 }} aria-hidden="true" />
      </button>
    </div>
  );

  const erreurScene = (i) => (
    <p
      role="alert"
      className="gdn-scene-error"
      style={{ display: erreur && erreur.scene === i ? 'flex' : 'none' }}
    >
      <AlertCircle size={15} strokeWidth={2} aria-hidden="true" />
      {erreur && erreur.scene === i ? erreur.message : ''}
    </p>
  );

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

        {succes ? <CompteurDeVeille reference={reference} /> : null}

        {/* ══ L'experience : une seule piste, sept scenes, trois mises en page.
               Le contenu est identique dans les trois modes : les scenes sont
               transformees, jamais montees ou demontees. ══════════════════ */}
        <div
          id="depot"
          className={`gdn-exp gdn-mode-${mode}`}
          style={{ '--gdn-n': N_SCENES, display: succes ? 'none' : 'block' }}
        >
          <div className="gdn-rail" ref={railRef}>
            <div
              className="gdn-stage"
              ref={stageRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {/* Ciel de nuit : decor de toutes les scenes, il ne bouge pas
                  avec la piste (les scenes glissent devant lui). */}
              <div className="gdn-sky" aria-hidden="true">
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
                <svg className="gdn-moon" viewBox="0 0 120 120">
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
                <div className="gdn-glow" />
              </div>

              {/* Fil de progression : une etoile par scene, elles s'allument
                  au fur et a mesure. Decoratif, double d'une annonce vocale. */}
              <div className="gdn-thread">
                <div className="gdn-constellation" aria-hidden="true">
                  {SCENES.map((s, i) => (
                    <span
                      key={s.key}
                      className="gdn-cs"
                      style={{
                        opacity: i === scene ? 1 : (i < scene || validees.has(i)) ? 0.55 : 0.16,
                        transform: i === scene ? 'scale(1.6)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
                <p className="gdn-announce" aria-live="polite">
                  {enExperience ? `Scène ${scene + 1} sur ${N_SCENES} : ${SCENES[scene].label}` : ''}
                </p>
                <button
                  type="button"
                  className="gdn-switch"
                  onClick={() => { setSimpleForce(true); setErreur(null); }}
                >
                  Passer à la version simple
                </button>
              </div>

              <form
                ref={formRef}
                className="gdn-form"
                onSubmit={handleSubmit}
                onFocusCapture={onFormFocus}
                noValidate
              >
                {/* Configuration Web3Forms */}
                <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
                <input type="hidden" name="subject" value="GUICHET DE NUIT - nouvelle demande" />
                <input type="hidden" name="from_name" value="Le Guichet de Nuit" />
                {/* Piege anti-spam Web3Forms : doit rester decoche. Un robot qui
                    remplit tout coche la case et la soumission est rejetee. */}
                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="gdn-honey" />

                <m.div className="gdn-track" style={{ x }}>

                  {/* ── Scene 0 : ouverture ─────────────────────────────── */}
                  <section
                    className="gdn-scene gdn-scene-hero"
                    ref={(el) => { sceneEls.current[0] = el; }}
                    aria-label="Le Guichet de Nuit"
                    inert={sceneInerte(0) || undefined}
                  >
                    <div className="gdn-scene-inner gdn-hero-inner">
                      <span className="gdn-badge">Ouvert quand tout est fermé</span>

                      <h1 className="gdn-h1">Le Guichet de Nuit</h1>

                      <p className="gdn-lead">
                        Après 21h, plus aucune assurance temporaire ne peut vous couvrir.
                        Notre équipe de nuit, si.
                      </p>

                      <p className="gdn-sub">
                        Sortie de fourrière à l&apos;aube, voiture achetée un dimanche soir,
                        départ imprévu au petit matin : le Guichet de Nuit prépare votre
                        contrat pendant que tout le monde dort, et vous roulez assuré.
                      </p>

                      <button
                        type="button"
                        className="btn-gold gdn-open"
                        onClick={() => goToScene(1)}
                      >
                        Ouvrir le guichet
                        <ArrowRight size={17} style={{ marginLeft: 8 }} aria-hidden="true" />
                      </button>

                      {/* Etat du guichet : les trois textes vivent en statique
                          dans le DOM, l'affichage commute selon l'heure. */}
                      <div role="status" className="gdn-etat">
                        <div style={{ display: etat === 'a' ? 'block' : 'none' }}>
                          La souscription en ligne classique est ouverte.{' '}
                          <Link to="/tarification" className="gdn-etat-link">
                            Obtenir mon devis maintenant
                          </Link>
                          <span className="gdn-etat-note">Le Guichet de Nuit ouvre à 21h.</span>
                        </div>
                        <div className="gdn-etat-live" style={{ display: etat === 'b' ? 'flex' : 'none' }}>
                          <span className="gdn-dot" aria-hidden="true" />
                          Le Guichet de Nuit est ouvert. Devis et contrat en pleine nuit.
                        </div>
                        <div style={{ display: etat === 'c' ? 'block' : 'none', color: 'var(--text)' }}>
                          Dimanche : le Guichet de Nuit assure la permanence toute la journée.
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ── Scene 1 : qui etes-vous ─────────────────────────── */}
                  <section className="gdn-scene" ref={(el) => { sceneEls.current[1] = el; }} inert={sceneInerte(1) || undefined}>
                    <div className="gdn-scene-inner">
                      <p className="gdn-eyebrow">
                        <User size={13} strokeWidth={2} aria-hidden="true" />
                        Étape 1 sur 6
                      </p>
                      <h2 className="gdn-h2">Qui êtes-vous ?</h2>
                      <p className="gdn-scene-sub">
                        Le guichet vous rappelle uniquement si votre dossier demande une précision.
                      </p>

                      <div className="gdn-grid">
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
                      </div>

                      {erreurScene(1)}
                      {nav(1, 'Continuer')}
                    </div>
                  </section>

                  {/* ── Scene 2 : le vehicule ───────────────────────────── */}
                  <section className="gdn-scene" ref={(el) => { sceneEls.current[2] = el; }} inert={sceneInerte(2) || undefined}>
                    <div className="gdn-scene-inner">
                      <p className="gdn-eyebrow">
                        <Car size={13} strokeWidth={2} aria-hidden="true" />
                        Étape 2 sur 6
                      </p>
                      <h2 className="gdn-h2">Votre véhicule</h2>
                      <p className="gdn-scene-sub">
                        La plaque suffit : le guichet retrouve le reste sur la carte grise.
                      </p>

                      <div className="gdn-grid">
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
                            className="gdn-input gdn-immat"
                          />
                        </div>
                        <div>
                          <label htmlFor="gdn-vehicule" className="gdn-label">Marque et modèle</label>
                          <input id="gdn-vehicule" name="vehicule" type="text" required placeholder="Renault Clio" className="gdn-input" />
                        </div>
                      </div>

                      {erreurScene(2)}
                      {nav(2, 'Continuer')}
                    </div>
                  </section>

                  {/* ── Scene 3 : le besoin ─────────────────────────────── */}
                  <section className="gdn-scene" ref={(el) => { sceneEls.current[3] = el; }} inert={sceneInerte(3) || undefined}>
                    <div className="gdn-scene-inner">
                      <p className="gdn-eyebrow">
                        <CalendarClock size={13} strokeWidth={2} aria-hidden="true" />
                        Étape 3 sur 6
                      </p>
                      <h2 className="gdn-h2">Votre besoin</h2>
                      <p className="gdn-scene-sub">
                        Indiquez le moment exact où le véhicule doit être couvert, même en pleine nuit.
                      </p>

                      <div className="gdn-grid">
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
                        <div className="gdn-full">
                          <label htmlFor="gdn-debut" className="gdn-label">
                            Date et heure auxquelles vous devez être couvert
                          </label>
                          <input id="gdn-debut" name="debut_couverture" type="datetime-local" required className="gdn-input" />
                        </div>
                      </div>

                      {erreurScene(3)}
                      {nav(3, 'Continuer')}
                    </div>
                  </section>

                  {/* ── Scene 4 : deux questions rapides ────────────────── */}
                  <section className="gdn-scene" ref={(el) => { sceneEls.current[4] = el; }} inert={sceneInerte(4) || undefined}>
                    <div className="gdn-scene-inner">
                      <p className="gdn-eyebrow">
                        <ShieldAlert size={13} strokeWidth={2} aria-hidden="true" />
                        Étape 4 sur 6
                      </p>
                      <h2 className="gdn-h2">Deux questions rapides</h2>
                      <p className="gdn-scene-sub">
                        Elles servent à établir un devis juste. Une réponse honnête évite un refus après paiement.
                      </p>

                      <fieldset className="gdn-fieldset">
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

                      <fieldset className="gdn-fieldset">
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

                      {erreurScene(4)}
                      {nav(4, 'Continuer')}
                    </div>
                  </section>

                  {/* ── Scene 5 : les 3 photos ──────────────────────────── */}
                  <section className="gdn-scene" ref={(el) => { sceneEls.current[5] = el; }} inert={sceneInerte(5) || undefined}>
                    <div className="gdn-scene-inner">
                      <p className="gdn-eyebrow">
                        <Camera size={13} strokeWidth={2} aria-hidden="true" />
                        Étape 5 sur 6
                      </p>
                      <h2 className="gdn-h2">Vos 3 photos</h2>
                      <p className="gdn-scene-sub">
                        Une photo nette prise avec votre téléphone suffit. Elles partent avec la demande.
                      </p>

                      <div className="gdn-files">
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
                          <p className="gdn-note gdn-filename" style={{ display: fileNames.permis_recto ? 'block' : 'none' }}>
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
                          <p className="gdn-note gdn-filename" style={{ display: fileNames.permis_verso ? 'block' : 'none' }}>
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
                          <p className="gdn-note gdn-filename" style={{ display: fileNames.carte_grise ? 'block' : 'none' }}>
                            {fileNames.carte_grise}
                          </p>
                          <p id="gdn-carte-grise-note" className="gdn-note">
                            Pas sous la main, par exemple restée dans le véhicule en fourrière ?
                            Envoyez-la plus tard en répondant au mail de confirmation.
                          </p>
                        </div>

                        <p role="alert" className="gdn-toobig" style={{ display: filesTooBig ? 'block' : 'none' }}>
                          Vos photos dépassent 10 Mo au total. Reprenez la plus lourde en photo
                          simple, sans mode haute définition, puis déposez-la de nouveau.
                        </p>
                      </div>

                      {erreurScene(5)}
                      {nav(5, 'Continuer')}
                    </div>
                  </section>

                  {/* ── Scene 6 : derniere etape ────────────────────────── */}
                  <section className="gdn-scene" ref={(el) => { sceneEls.current[6] = el; }} inert={sceneInerte(6) || undefined}>
                    <div className="gdn-scene-inner">
                      <p className="gdn-eyebrow">
                        <FileSignature size={13} strokeWidth={2} aria-hidden="true" />
                        Étape 6 sur 6
                      </p>
                      <h2 className="gdn-h2">Dernière étape</h2>
                      <p className="gdn-scene-sub">
                        Aucun paiement ici. Le tarif de nuit tout compris sera indiqué sur votre
                        devis, avant toute signature.
                      </p>

                      <label className="gdn-check">
                        <input type="checkbox" name="consentement_rgpd" value="Oui" required />
                        <span>
                          J&apos;accepte que mes données soient utilisées uniquement pour établir
                          mon devis. Elles ne sont jamais revendues.
                        </span>
                      </label>

                      <label className="gdn-check">
                        <input type="checkbox" name="acceptation_tarif_nuit" value="Oui" required />
                        <span>
                          J&apos;ai compris que le tarif de nuit tout compris sera indiqué sur
                          mon devis, avant tout paiement.
                        </span>
                      </label>

                      {erreurScene(6)}

                      <button
                        type="submit"
                        className="btn-gold gdn-submit"
                        disabled={formStatus === 'sending'}
                        style={{ opacity: formStatus === 'sending' ? 0.7 : 1 }}
                      >
                        {formStatus === 'sending' ? 'Dépôt en cours' : 'Déposer ma demande au guichet'}
                      </button>

                      <p role="alert" className="gdn-send-error" style={{ display: formStatus === 'error' ? 'block' : 'none' }}>
                        L&apos;envoi n&apos;a pas abouti. Écrivez directement au guichet :{' '}
                        <a href={`mailto:${GUICHET_EMAIL}?subject=GUICHET%20DE%20NUIT%20-%20nouvelle%20demande`}>
                          {GUICHET_EMAIL}
                        </a>
                        . Joignez vos informations et vos photos au mail, votre demande sera
                        traitée de la même façon.
                      </p>

                      <div className="gdn-back-wrap">
                        <button
                          type="button"
                          className="gdn-back"
                          onClick={() => { setErreur(null); goToScene(5); }}
                        >
                          <ArrowLeft size={15} aria-hidden="true" />
                          Retour
                        </button>
                      </div>
                    </div>
                  </section>

                </m.div>
              </form>

              {/* Retour a l'experience : offert seulement si le mode simple est
                  un choix (jamais quand il est impose par prefers-reduced-motion
                  ou par l'absence de JS). */}
              {simpleForce && enhanced && !reduce ? (
                <div className="gdn-switch-back">
                  <button
                    type="button"
                    className="gdn-switch"
                    onClick={() => { setSimpleForce(false); setErreur(null); }}
                  >
                    Revenir à l&apos;expérience guidée
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* ══ La reponse en bref (AEO) : le bloc que les moteurs citent ══ */}
        <section style={{ padding: '88px 24px 72px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <AnswerCapsule capsule={CAPSULE} />
          </div>
        </section>

        {/* ══ Reponses directes : les H2 sont de vraies questions ══════════ */}
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
              <Link to="/articles/controle-sans-assurance-risques-amende" className="gdn-inline-link">
                Ce que risque un conducteur non assuré
                <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </Link>
            </m.div>
          </div>
        </section>

        {/* ══ Comment ca marche ═══════════════════════════════════════════ */}
        <section style={{ padding: '88px 24px' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <m.div {...reveal()} style={{ textAlign: 'center', marginBottom: 56 }}>
              <h2 style={h2Style}>Comment ça marche ?</h2>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
                Trois étapes, tout par mail et SMS, depuis votre téléphone.
              </p>
            </m.div>

            <div className="gdn-cards-3">
              {STEPS.map((step, i) => (
                <m.div key={step.num} id={`etape-${i + 1}`} {...reveal(i * 0.12)} style={{ ...cardBase, textAlign: 'center' }}>
                  <div className="gdn-step-icon">
                    <step.Icon size={23} color="var(--gold-light)" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-light)', letterSpacing: '0.15em', marginBottom: 10 }}>
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

        {/* ══ Garantie 30 minutes ═════════════════════════════════════════ */}
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

        {/* ══ L'equipe de nuit ════════════════════════════════════════════ */}
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

            <div className="gdn-cards-3">
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

        {/* ══ Maillage : cas d'usage ══════════════════════════════════════ */}
        <section style={{ padding: '0 24px 96px' }}>
          <div style={{ maxWidth: 1060, margin: '0 auto' }}>
            <m.div {...reveal()} style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={h2Style}>Ils arrivent au guichet pour</h2>
            </m.div>
            <div className="gdn-cards-3">
              {CAS_GUICHET.map(({ Icon, title, body, to, cta }, i) => (
                <m.div key={title} {...reveal(i * 0.12)} style={{ ...cardBase, display: 'flex', flexDirection: 'column' }}>
                  <Icon size={22} color="var(--gold-light)" strokeWidth={1.5} aria-hidden="true" />
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: '14px 0 10px' }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.65, margin: '0 0 18px', flex: 1 }}>
                    {body}
                  </p>
                  <Link to={to} className="gdn-card-link">
                    {cta}
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ visible (le schema FAQPage reprend les memes textes) ════ */}
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

        /* ── Ciel ─────────────────────────────────────────────────────── */
        .gdn-sky {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
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
          position: absolute;
          top: 96px;
          right: 6%;
          width: clamp(58px, 8vw, 96px);
          height: auto;
        }
        .gdn-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 55% 34% at 50% 100%, rgba(201,168,76,0.09) 0%, transparent 70%);
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

        /* ── L'experience : ossature commune ──────────────────────────── */
        .gdn-exp { position: relative; }
        .gdn-rail { position: relative; }
        .gdn-stage { position: relative; }
        .gdn-form { position: relative; z-index: 1; width: 100%; }
        .gdn-track { position: relative; z-index: 1; }
        .gdn-scene { position: relative; scroll-margin-top: 90px; }
        .gdn-scene-inner {
          position: relative;
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
        }

        /* ── Mode simple : le rendu du serveur, le sans-JS, le reduced-motion.
              Formulaire vertical empile, aucune transformation. ─────────── */
        .gdn-mode-simple .gdn-track {
          transform: none !important;
          display: block;
          width: 100%;
        }
        .gdn-mode-simple .gdn-stage { padding: 0 0 40px; }
        .gdn-mode-simple .gdn-scene { padding: 0 24px 64px; }
        .gdn-mode-simple .gdn-scene-hero {
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 120px;
          padding-bottom: 80px;
          text-align: center;
        }
        .gdn-mode-simple .gdn-thread { display: none; }
        .gdn-mode-simple .gdn-nav { display: none; }
        .gdn-mode-simple .gdn-back-wrap { display: none; }
        .gdn-mode-simple .gdn-scene-inner { max-width: 640px; }
        .gdn-mode-simple .gdn-hero-inner { max-width: 720px; }

        /* ── Mode rail : scrollytelling horizontal (desktop) ───────────── */
        .gdn-mode-rail .gdn-rail { height: calc(var(--gdn-n) * 100svh); }
        .gdn-mode-rail .gdn-stage {
          position: sticky;
          top: 0;
          height: 100svh;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .gdn-mode-rail .gdn-track {
          display: flex;
          width: calc(var(--gdn-n) * 100%);
        }
        .gdn-mode-rail .gdn-scene {
          flex: 0 0 calc(100% / var(--gdn-n));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 96px 32px 92px;
          min-height: 100svh;
        }
        .gdn-mode-rail .gdn-scene-inner {
          max-height: calc(100svh - 200px);
          overflow-y: auto;
        }
        .gdn-mode-rail .gdn-scene-hero { text-align: center; }
        .gdn-mode-rail .gdn-thread {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 26px;
          z-index: 2;
        }

        /* ── Mode step : stepper plein ecran (tactile) ─────────────────────
              Aucun detournement du scroll : la page defile normalement, le
              clavier n'est jamais masque (pas de conteneur a hauteur figee,
              pas de position fixed). overflow-x: clip ne cree PAS de conteneur
              de defilement : le navigateur reste libre d'amener un champ
              focalise a l'ecran. ────────────────────────────────────────── */
        .gdn-mode-step .gdn-stage {
          padding: 92px 0 40px;
          overflow-x: clip;
          overflow-y: visible;
          touch-action: pan-y;
        }
        .gdn-mode-step .gdn-thread {
          position: relative;
          z-index: 2;
          margin: 0 auto 20px;
        }
        .gdn-mode-step .gdn-track {
          display: flex;
          width: calc(var(--gdn-n) * 100%);
        }
        .gdn-mode-step .gdn-scene {
          flex: 0 0 calc(100% / var(--gdn-n));
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 8px 20px 24px;
          min-height: calc(100svh - 220px);
        }
        .gdn-mode-step .gdn-scene-hero { text-align: center; }

        /* ── Fil de progression ───────────────────────────────────────── */
        .gdn-thread { text-align: center; }
        .gdn-constellation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          height: 14px;
        }
        .gdn-cs {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--gold-light);
          box-shadow: 0 0 6px rgba(232, 201, 122, 0.6);
          transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
        }
        .gdn-announce {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        .gdn-switch {
          margin-top: 10px;
          background: none;
          border: none;
          font-family: inherit;
          font-size: 12px;
          color: var(--text-subtle);
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
          padding: 4px 8px;
        }
        .gdn-switch:hover { color: var(--gold-light); }
        .gdn-switch-back { text-align: center; padding: 8px 24px 0; }

        /* ── Scenes : typographie ─────────────────────────────────────── */
        .gdn-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-light);
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          border-radius: 999px;
          padding: 8px 18px;
          margin-bottom: 24px;
        }
        .gdn-h1 {
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin: 0 0 20px;
        }
        .gdn-lead {
          font-size: clamp(17px, 2.4vw, 21px);
          font-weight: 500;
          color: var(--gold-light);
          line-height: 1.5;
          margin: 0 auto 18px;
          max-width: 620px;
        }
        .gdn-sub {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.75;
          margin: 0 auto 32px;
          max-width: 600px;
        }
        .gdn-open { font-size: 16px; padding: 16px 32px; }
        .gdn-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
          margin: 0 0 12px;
        }
        .gdn-h2 {
          font-size: clamp(1.7rem, 3.6vw, 2.4rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          margin: 0 0 10px;
        }
        .gdn-scene-sub {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.7;
          margin: 0 0 28px;
          max-width: 560px;
        }
        .gdn-mode-simple .gdn-scene-hero .gdn-scene-sub,
        .gdn-mode-rail .gdn-scene-hero .gdn-scene-sub { margin-left: auto; margin-right: auto; }

        /* ── Etat du guichet ──────────────────────────────────────────── */
        .gdn-etat {
          margin: 30px auto 0;
          max-width: 560px;
          background: rgba(8, 10, 22, 0.55);
          border: 1px solid var(--glass-border);
          border-radius: 14px;
          padding: 14px 20px;
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .gdn-etat-link { color: var(--gold-light); text-decoration: underline; }
        .gdn-etat-note {
          display: block;
          margin-top: 4px;
          font-size: 13px;
          color: var(--text-subtle);
        }
        .gdn-etat-live {
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: var(--text);
        }

        /* ── Champs ───────────────────────────────────────────────────── */
        .gdn-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px 16px;
        }
        .gdn-full { grid-column: 1 / -1; }
        @media (max-width: 640px) {
          .gdn-grid { grid-template-columns: 1fr; }
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
        .gdn-immat { text-transform: uppercase; letter-spacing: 0.06em; }
        select.gdn-input { appearance: auto; background-color: rgba(255,255,255,0.04); }
        select.gdn-input option { background: #0A0C1A; color: var(--text); }
        input.gdn-input[type="datetime-local"] { color-scheme: dark; }
        .gdn-note {
          font-size: 12.5px;
          color: var(--text-subtle);
          line-height: 1.5;
          margin: 7px 0 0;
        }
        .gdn-filename { color: var(--gold-light); }
        .gdn-fieldset {
          border: none;
          margin: 0 0 22px;
          padding: 0;
        }
        .gdn-fieldset legend { padding: 0; }
        .gdn-radios { display: flex; gap: 26px; margin-top: 6px; }
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
          margin-bottom: 16px;
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
        .gdn-toobig {
          margin: 4px 0 0;
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--gold-light);
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          border-radius: 11px;
          padding: 12px 14px;
        }
        .gdn-honey {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        /* ── Navigation de scene ──────────────────────────────────────── */
        .gdn-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 28px;
        }
        .gdn-next { font-size: 15px; padding: 14px 26px; }
        .gdn-submit {
          width: 100%;
          justify-content: center;
          font-size: 16px;
          padding: 16px 24px;
          margin-top: 6px;
        }
        .gdn-back-wrap { margin-top: 18px; text-align: center; }
        .gdn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          font-family: inherit;
          font-size: 14px;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px 4px;
        }
        .gdn-back:hover { color: var(--gold-light); }
        .gdn-scene-error {
          align-items: center;
          gap: 8px;
          margin: 18px 0 0;
          font-size: 13.5px;
          line-height: 1.55;
          color: var(--gold-light);
          background: var(--gold-dim);
          border: 1px solid var(--gold-border);
          border-radius: 11px;
          padding: 11px 14px;
        }
        .gdn-send-error {
          margin: 16px 0 0;
          font-size: 14px;
          line-height: 1.7;
          color: var(--gold-light);
          text-align: center;
        }
        .gdn-send-error a { color: var(--gold-light); text-decoration: underline; }

        /* ── Scene finale : le compteur de veille ─────────────────────── */
        .gdn-final {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 130px 24px 90px;
          outline: none;
        }
        .gdn-final-inner {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }
        .gdn-ring {
          position: relative;
          width: 248px;
          height: 248px;
          margin: 14px auto 34px;
        }
        .gdn-ring-face {
          position: absolute;
          inset: 12px;
          border-radius: 50%;
          border: 1px solid var(--gold-border);
          background: radial-gradient(circle at 50% 50%, rgba(201,168,76,0.09) 0%, transparent 68%);
        }
        .gdn-ring-star {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          margin: -2px 0 0 -2px;
          border-radius: 50%;
          background: var(--gold-light);
          transition: opacity 0.8s var(--ease-out);
        }
        .gdn-orbit {
          position: absolute;
          inset: 0;
          animation: gdn-orbit 60s linear infinite;
        }
        .gdn-orbit-off { animation: none; }
        @keyframes gdn-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .gdn-orbit-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 9px;
          height: 9px;
          margin: -4.5px 0 0 -4.5px;
          border-radius: 50%;
          background: var(--gold-light);
          box-shadow: 0 0 14px rgba(232, 201, 122, 0.9);
          transform: translateY(-${RING_RADIUS}px);
        }
        .gdn-ring-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .gdn-ring-time {
          font-size: 44px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text);
          font-variant-numeric: tabular-nums;
        }
        .gdn-ring-label {
          margin-top: 6px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-subtle);
        }
        .gdn-final-title {
          font-size: clamp(24px, 4vw, 34px);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          margin: 0 0 14px;
        }
        .gdn-final-text {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.75;
          margin: 0 auto;
          max-width: 520px;
        }
        .gdn-final-ref {
          margin: 26px 0 0;
          font-size: 13px;
          color: var(--text-subtle);
          letter-spacing: 0.04em;
        }
        .gdn-final-ref strong { color: var(--gold-light); font-weight: 600; }
        .gdn-final-band {
          margin-top: 44px;
          padding: 26px 24px;
          background: rgba(10, 13, 28, 0.5);
          border: 1px solid var(--glass-border);
          border-radius: 18px;
          text-align: left;
        }
        .gdn-band-title {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
          margin: 0 0 16px;
        }
        .gdn-band-list { list-style: none; margin: 0 0 20px; padding: 0; }
        .gdn-band-list li {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin-bottom: 11px;
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .gdn-band-list li svg { flex-shrink: 0; margin-top: 2px; }
        .gdn-band-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid rgba(201, 168, 76, 0.14);
        }
        .gdn-band-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 14px;
          background: var(--gold-glow);
          border: 1px solid var(--gold-border);
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--gold-light);
          text-decoration: none;
        }

        /* ── Sections editoriales ─────────────────────────────────────── */
        .gdn-cards-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .gdn-faq {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .gdn-cards-3 { grid-template-columns: 1fr; max-width: 460px; margin: 0 auto; }
          .gdn-faq { grid-template-columns: 1fr; }
        }
        .gdn-step-icon {
          width: 54px;
          height: 54px;
          margin: 0 auto 18px;
          border-radius: 15px;
          background: linear-gradient(180deg, rgba(232,201,122,0.16), rgba(201,168,76,0.04));
          border: 1px solid var(--gold-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gdn-inline-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--gold-glow);
          border: 1px solid var(--gold-border);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: var(--gold);
          text-decoration: none;
        }
        .gdn-card-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: var(--gold-light);
          text-decoration: none;
        }

        /* ── Mouvement reduit : rien ne bouge, tout reste lisible ─────── */
        @media (prefers-reduced-motion: reduce) {
          .gdn-star-tw { animation: none; }
          .gdn-dot { animation: none; opacity: 1; }
          .gdn-orbit { animation: none; }
          .gdn-cs { transition: none; }
          .gdn-ring-star { transition: none; }
        }
      `}</style>
    </>
  );
}

export default GuichetDeNuit;
