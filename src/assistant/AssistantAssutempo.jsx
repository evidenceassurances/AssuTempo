/**
 * AssistantAssutempo : assistant conversationnel premium + tour guide.
 *
 * Ajout isole et reversible : tout vit dans src/assistant/. Le composant se
 * monte une seule fois (depuis AppShell). Pour le retirer : supprimer la ligne
 * de montage dans src/AppShell.jsx et ce dossier. Voir README.md.
 *
 * Contraintes respectees :
 *  - Rendu identique client/SSR : retourne null tant que `mounted` est faux
 *    (le prerendu et le 1er rendu client produisent donc le meme arbre vide,
 *    pas d'erreur d'hydratation #418), puis portail dans document.body.
 *  - Styles 100 % encapsules (prefixe .atp-, voir styles.js).
 *  - Animations transform/opacity uniquement, prefers-reduced-motion respecte.
 *  - Aucune cle ni prompt systeme cote client : on poste sur /api/chat.
 */
import { useEffect, useLayoutEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { ASSISTANT_CSS } from './styles';
import { TOUR_FLOWS } from './tourSteps';
import { trackEvent } from '../lib/analytics';

// Ambiance cosmos (canvas + boucle requestAnimationFrame) : DESKTOP UNIQUEMENT.
// Import dynamique => le code cosmos n'est jamais charge ni execute sur mobile
// (cause racine du gel a l'ouverture sur telephone). Voir rendu conditionnel.
const CosmosCanvas = lazy(() => import('./CosmosCanvas'));

const STYLE_ID = 'atp-styles';

const WELCOME =
  `Bonjour, je suis Tempo, votre concierge Assutempo. Je réponds à vos questions sur l'assurance auto temporaire et la carte grise, et je peux vous guider pas à pas jusqu'à la souscription. Comment puis-je vous aider ?`;

const ERROR_MSG =
  `Je rencontre un souci technique à l'instant. Je peux toutefois vous accompagner pas à pas jusqu'au formulaire, ou vous pouvez joindre un conseiller au 09 74 19 78 20 (Lun-Ven 9h-21h, Sam 9h-20h).`;

const STARTERS = [
  `Qu'est-ce que l'assurance temporaire ?`,
  `Quels documents pour rouler ?`,
  `Assurer un véhicule étranger ?`,
];

/* ---------------------- garde-fous anti-abus / anti-cout ------------------- */
// Plafond de messages VISITEUR par session : au-dela, on n'appelle plus l'API
// (protege contre les boucles couteuses). Facile a ajuster.
const MAX_MESSAGES_UTILISATEUR = 12;

// Reponse fixe (sans appel API) quand le visiteur repose une question identique.
const DOUBLON_MSG =
  `Vous m'avez déjà posé cette question. Pour un cas précis ou personnalisé, le mieux est d'appeler l'équipe au 09 74 19 78 20 ou d'obtenir un devis en ligne.`;

// Message de cloture (plafond atteint ou marqueur [FIN] detecte).
const CLOTURE_MSG =
  `Pour aller plus loin sur votre situation, contactez l'équipe au 09 74 19 78 20 (Lun-Ven 9h à 21h, Sam 9h à 20h) ou obtenez votre devis en ligne.`;

// Normalisation pour l'anti-doublon : minuscules, ponctuation retiree, espaces
// reduits. \p{L}\p{N} (avec /u) garde lettres accentuees et chiffres.
function normaliser(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Nettoyage Markdown -> texte simple, sans aucune etoile. Retire gras/italique
// en gardant le texte, titres et puces en debut de ligne, backticks, puis les
// espaces superflus. Sans dependance (regex seules).
function nettoyerMarkdown(s) {
  let t = String(s || '');
  t = t.replace(/^\s{0,3}#{1,6}\s+/gm, '');     // titres (#, ##, ...)
  t = t.replace(/^\s{0,3}[-*+]\s+/gm, '');       // puces (-, *, + suivis d'un espace)
  t = t.replace(/\*\*([^*]+)\*\*/g, '$1');       // **gras** -> gras
  t = t.replace(/__([^_]+)__/g, '$1');           // __gras__ -> gras
  t = t.replace(/\*([^*]+)\*/g, '$1');           // *italique* -> italique
  t = t.replace(/_([^_]+)_/g, '$1');             // _italique_ -> italique
  t = t.replace(/`+/g, '');                      // backticks
  t = t.replace(/\*+/g, '');                     // residus d'etoiles isolees -> aucune etoile
  t = t.replace(/[ \t]{2,}/g, ' ');              // espaces multiples
  t = t.replace(/\n{3,}/g, '\n\n');              // sauts de ligne multiples
  return t.trim();
}

// Detecte le marqueur de cloture (insensible a la casse).
function contientFin(s) {
  return /\[fin\]/i.test(String(s || ''));
}

// Reponse assistant prete a afficher : retrait du marqueur [FIN] puis nettoyage.
function nettoyerReponse(s) {
  return nettoyerMarkdown(String(s || '').replace(/\[fin\]/gi, ''));
}

/* ----------------------------- petites icones ----------------------------- */
function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  switch (name) {
    case 'close':
      return (<svg {...common}><path d="M18 6 6 18M6 6l12 12" /></svg>);
    case 'send':
      return (<svg {...common}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>);
    case 'restart':
      return (<svg {...common}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>);
    case 'shield':
      return (<svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
    case 'file':
      return (<svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>);
    case 'globe':
      return (<svg {...common}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" /></svg>);
    case 'chevron-down':
      return (<svg {...common}><path d="m6 9 6 6 6-6" /></svg>);
    case 'bubble':
      return (<svg {...common}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>);
    default:
      return null;
  }
}

/* champ d'etoiles dorees, discret et leger (<= 12 etoiles, CSS pur).
   Les positions sont calculees une seule fois au chargement du module (jamais
   regenerees au re-render) : rendu pur, cout nul par render. */
function makeStarField(count) {
  return Array.from({ length: count }, () => ({
    top: (Math.random() * 100).toFixed(2),
    left: (Math.random() * 100).toFixed(2),
    size: (1.4 + Math.random() * 1.8).toFixed(2),
    delay: (Math.random() * 4).toFixed(2),
    dur: (2.6 + Math.random() * 2.6).toFixed(2),
  }));
}
// Le fil de chat utilise l'ambiance cosmos en canvas (CosmosCanvas).
// La tooltip du tour garde un champ d'etoiles CSS leger (peu d'elements).
const TOOLTIP_STARS = makeStarField(10);

function Stars({ field }) {
  return (
    <div className="atp-stars" aria-hidden>
      {field.map((s, i) => (
        <span
          key={i}
          className="atp-star"
          style={{
            top: s.top + '%',
            left: s.left + '%',
            width: s.size + 'px',
            height: s.size + 'px',
            animationDelay: s.delay + 's',
            animationDuration: s.dur + 's',
          }}
        />
      ))}
    </div>
  );
}

/* element signature : anneau + particule en orbite */
function Sigil() {
  return (
    <span className="atp-sigil" aria-hidden>
      <span className="atp-sigil-ring" />
      <span className="atp-sigil-orbit"><span className="atp-sigil-particle" /></span>
      <span className="atp-sigil-core" />
    </span>
  );
}

/* --------------------------------- helpers -------------------------------- */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Hauteur reservee au header fixe : on ne place jamais une cible dessous.
const HEADER_OFFSET = 88;
// Position du HAUT d'une grande cible (formulaire/iframe) sous le header.
const FORM_TOP_OFFSET = 124; // ~110-130 px du haut de la fenetre

// Amene la cible bien en vue en tenant compte du header fixe.
//  - large (formulaire/iframe, plus haut que la fenetre) : on aligne son HAUT
//    juste sous le header (jamais block:'center' qui montrerait son milieu blanc).
//  - petite cible : centree verticalement, jamais cachee sous le header.
function scrollToTarget(el, { large, reduced }) {
  if (!el || typeof window === 'undefined') return;
  const rect = el.getBoundingClientRect();
  const absTop = window.scrollY + rect.top;
  const vh = window.innerHeight;
  let desiredTop;
  if (large) {
    desiredTop = FORM_TOP_OFFSET;
  } else {
    desiredTop = Math.max(HEADER_OFFSET + 16, (vh - rect.height) / 2);
  }
  const y = Math.max(0, absTop - desiredTop);
  window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
}

// Cle de consentement cookies (cf. CookieConsent.jsx). Sert UNIQUEMENT a savoir
// si le bandeau est affiche, pour ne pas recouvrir ses boutons avec le launcher.
const COOKIE_CONSENT_KEY = 'assutempo_consent_v1';
function consentChosen() {
  try {
    return typeof window !== 'undefined' && !!localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    return true; // en cas d'erreur, on n'empeche pas l'affichage du launcher
  }
}

// "Mobile" = viewport etroit OU pointeur grossier (tactile). Sur ces ecrans le
// tour a projecteur est trop fragile (iframe tierce lourde + barre Safari
// mouvante) : on bascule sur un flux simple (message + CTA direct).
function detectMobile() {
  if (typeof window === 'undefined') return false;
  const narrow = window.innerWidth <= 820;
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  return narrow || coarse;
}
function waitForTarget(selector, timeout = 3500) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    (function poll() {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      if (Date.now() - t0 > timeout) return resolve(null);
      setTimeout(poll, 80);
    })();
  });
}

/* ----------------------- envoi du transcript par email -------------------- */
// Cle Web3Forms publique (concue pour le client, deja utilisee par le site).
const WEB3FORMS_KEY = '7a4b9f4a-f77e-4f9b-8a16-7635bff791ed';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

function buildTranscript(msgs) {
  return msgs
    .map((m) => (m.role === 'user' ? 'Visiteur' : 'Tempo') + ' : ' + m.content)
    .join('\n\n');
}

// Envoie le fil complet par email. `beacon` = true pour les fermetures de page
// (sendBeacon survit au dechargement) ; sinon fetch keepalive. Best-effort :
// ne casse jamais l'interface, quelle que soit l'issue reseau.
function postTranscript(msgs) {
  if (typeof window === 'undefined') return;
  const fd = new FormData();
  fd.append('access_key', WEB3FORMS_KEY);
  fd.append('subject', 'Conversation assistant Tempo (assutempo.fr)');
  fd.append('from_name', 'Assistant Tempo');
  fd.append('page', window.location.pathname || '/');
  fd.append('date', new Date().toLocaleString('fr-FR'));
  fd.append('message', buildTranscript(msgs));
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(WEB3FORMS_URL, fd);
    } else {
      fetch(WEB3FORMS_URL, { method: 'POST', body: fd, keepalive: true }).catch(() => {});
    }
  } catch {
    // best-effort : on n'interrompt jamais le parcours utilisateur
  }
}

export default function AssistantAssutempo() {
  const [mounted, setMounted] = useState(false);
  // isMobile : viewport etroit OU pointeur grossier. Sur mobile, AUCUNE ambiance
  // cosmos n'est montee (ni chargee), et les animations sont reduites au minimum.
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showFlows, setShowFlows] = useState(false);
  const [offerGuide, setOfferGuide] = useState(false);
  const [spark, setSpark] = useState(false);
  // Conversation cloturee (plafond atteint ou marqueur [FIN]) : la saisie et le
  // bouton d'envoi sont desactives, le fil reste lisible. Un rechargement repart a zero.
  const [closed, setClosed] = useState(false);
  // Accompagnement mobile : { ctaLabel, path, scrollTarget } ou null.
  const [mobileCta, setMobileCta] = useState(null);
  // Bandeau cookies affiche ? Si oui, on masque le launcher pour ne pas recouvrir
  // ses boutons (bug mobile : le FAB volait le tap du bouton "Refuser").
  const [cookieBannerUp, setCookieBannerUp] = useState(() => !consentChosen());
  // Etiquette "Besoin d'aide ?" : visibilite pilotee par timers (effet dedie).
  const [labelShown, setLabelShown] = useState(false);
  // Cohabitation : le launcher chevauche un CTA de la page -> dock a 40 %.
  const [ctaOverlap, setCtaOverlap] = useState(false);
  // Drag du curseur du Devis express en cours -> dock escamote completement.
  const [instrumentDrag, setInstrumentDrag] = useState(false);

  // tour : { active, flowKey, step }
  const [tour, setTour] = useState({ active: false, flowKey: null, step: 0 });
  const [tourRect, setTourRect] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const reducedRef = useRef(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const tourElRef = useRef(null);
  // Dock du launcher : bouton + etiquette (mesures pour la sonde CTA).
  const launcherRef = useRef(null);
  const hintRef = useRef(null);
  // La premiere apparition de l'etiquette (1,5 s apres chargement) ne joue qu'une
  // fois par session, pas a chaque fermeture du panneau ni a chaque navigation.
  const introDoneRef = useRef(false);
  // Anti-doublon : ensemble des messages visiteur normalises deja envoyes (session).
  const sentNormalizedRef = useRef(null);
  if (sentNormalizedRef.current === null) sentNormalizedRef.current = new Set();
  // Garde anti-double-cloture : le message de cloture n'est ajoute qu'une fois.
  const closedRef = useRef(false);

  // Mesure de latence d'ouverture, decomposee : rendu JS (tap -> commit React) vs
  // paint/composite (commit -> premiere frame peinte). Visible uniquement avec
  // ?perfdebug dans l'URL : aucun impact pour les vrais visiteurs.
  const tapAtRef = useRef(0);
  const renderAtRef = useRef(0);
  const [perf, setPerf] = useState(null);
  const perfDebug =
    typeof window !== 'undefined' && /[?&]perfdebug/.test(window.location.search);

  // Envoi du transcript par email a la fin d'une conversation.
  // messagesRef : fil a jour lisible depuis les listeners (pas d'etat perime).
  // sentUserCountRef : nb de messages visiteur deja envoyes (anti-doublon).
  const messagesRef = useRef(messages);
  const sentUserCountRef = useRef(0);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Envoie le fil complet seulement s'il contient de nouveaux messages du
  // visiteur depuis le dernier envoi (chaque email contient tout le fil).
  const flushTranscript = useCallback(() => {
    const msgs = messagesRef.current || [];
    const userCount = msgs.filter((m) => m.role === 'user').length;
    if (userCount === 0 || userCount <= sentUserCountRef.current) return;
    postTranscript(msgs);
    sentUserCountRef.current = userCount;
  }, []);

  // Fin de conversation = depart de page (pagehide) ou onglet masque
  // (visibilitychange). Couvre desktop et mobile. La fermeture du panneau
  // declenche aussi un envoi (voir closePanel).
  useEffect(() => {
    const onHide = () => flushTranscript();
    const onVis = () => {
      if (document.visibilityState === 'hidden') flushTranscript();
    };
    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [flushTranscript]);

  /* montage : injecte le style une fois, lit prefers-reduced-motion */
  useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
      const tag = document.createElement('style');
      tag.id = STYLE_ID;
      tag.textContent = ASSISTANT_CSS;
      document.head.appendChild(tag);
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }, []);

  /* Desktop : precharge le chunk cosmos quand la page est inactive, pour que le
     panneau s'ouvre instantanement (aucun fetch au moment du tap). Mobile : jamais
     (le cosmos n'y est ni charge ni monte). Le reste du widget est dans le bundle
     initial, donc l'ouverture mobile est immediate sans reseau. */
  useEffect(() => {
    if (detectMobile()) return undefined;
    let id;
    const preload = () => { import('./CosmosCanvas'); };
    if (typeof window !== 'undefined' && window.requestIdleCallback) {
      id = window.requestIdleCallback(preload);
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }
    id = setTimeout(preload, 1200);
    return () => clearTimeout(id);
  }, []);

  /* Mesure : instant du commit React (DOM en place, avant peinture). */
  useLayoutEffect(() => {
    if (open && tapAtRef.current) renderAtRef.current = performance.now();
  }, [open]);

  /* Mesure : premiere frame peinte (deux rAF apres le commit). On en deduit le
     temps de rendu JS et le temps de paint/composite. */
  useEffect(() => {
    if (!open || !tapAtRef.current) return undefined;
    const tap = tapAtRef.current;
    const rendered = renderAtRef.current || tap;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const paint = performance.now();
        setPerf({
          render: Math.round(rendered - tap),
          paint: Math.round(paint - rendered),
          total: Math.round(paint - tap),
        });
        tapAtRef.current = 0;
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [open]);

  /* Ouverture pilotee de l'exterieur : n'importe quelle page peut demander
     l'ouverture du panneau via window.dispatchEvent(new CustomEvent('assutempo:open-assistant')).
     Utilise par la page Tarification ("Discuter avec Tempo"). Idempotent. */
  useEffect(() => {
    const onOpenRequest = () => {
      setClosing(false);
      setOpen(true);
    };
    window.addEventListener('assutempo:open-assistant', onOpenRequest);
    return () => window.removeEventListener('assutempo:open-assistant', onOpenRequest);
  }, []);

  /* Suit l'etat du bandeau cookies via les evenements de CookieConsent (couplage
     leger, pas d'import) pour masquer/reafficher le launcher au bon moment. */
  useEffect(() => {
    setCookieBannerUp(!consentChosen());
    const onChosen = () => setCookieBannerUp(false);
    const onReopen = () => setCookieBannerUp(true);
    window.addEventListener('cookie-consent', onChosen);
    window.addEventListener('open-cookie-settings', onReopen);
    return () => {
      window.removeEventListener('cookie-consent', onChosen);
      window.removeEventListener('open-cookie-settings', onReopen);
    };
  }, []);

  /* Le launcher est-il a l'ecran ? (sert aux effets etiquette + sonde CTA) */
  const launcherShown = !open && !tour.active && !cookieBannerUp;

  /* Etiquette "Besoin d'aide ?" : apparait 1,5 s apres le chargement, reste 5 s,
     se replie. Elle ne REVIENT ensuite qu'apres 30 s sans aucune activite
     (scroll, tap, touche, molette) sur la meme page. Navigation ou fermeture du
     panneau = repli + compteur d'inactivite remis a zero. Timers uniquement :
     aucun cout par frame. */
  useEffect(() => {
    if (!launcherShown) {
      setLabelShown(false);
      return undefined;
    }
    let shown = false;
    let showT = 0;
    let hideT = 0;
    let idleT = 0;
    const arm = () => {
      clearTimeout(idleT);
      idleT = setTimeout(show, 30000);
    };
    const hide = () => {
      shown = false;
      setLabelShown(false);
      arm();
    };
    function show() {
      shown = true;
      setLabelShown(true);
      clearTimeout(hideT);
      hideT = setTimeout(hide, 5000);
    }
    // Toute activite repousse le retour ; une etiquette visible finit ses 5 s.
    const onActivity = () => {
      if (!shown) arm();
    };
    if (introDoneRef.current) {
      setLabelShown(false); // navigation pendant l'affichage : jamais d'etiquette figee
      arm();
    } else {
      showT = setTimeout(() => {
        introDoneRef.current = true;
        show();
      }, 1500);
    }
    const evs = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    evs.forEach((t) => window.addEventListener(t, onActivity, { passive: true }));
    window.addEventListener('scroll', onActivity, { passive: true });
    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
      clearTimeout(idleT);
      evs.forEach((t) => window.removeEventListener(t, onActivity));
      window.removeEventListener('scroll', onActivity);
    };
  }, [launcherShown, location.pathname]);

  /* Le curseur du Devis express (HeroScrollytelling) signale son drag : le dock
     s'efface completement pendant la manipulation et revient a l'arret. */
  useEffect(() => {
    const onDrag = (e) => setInstrumentDrag(!!(e.detail && e.detail.dragging));
    window.addEventListener('assutempo:instrument-drag', onDrag);
    return () => window.removeEventListener('assutempo:instrument-drag', onDrag);
  }, []);

  /* Cohabitation : le launcher ne recouvre jamais un CTA. A chaque scroll/resize
     (throttle rAF), on sonde quelques points du bouton (et de l'etiquette si
     visible) via elementsFromPoint : un CTA du site (.btn-gold / .btn-glass)
     sous l'un d'eux -> dock escamote a 40 % tant que le chevauchement existe.
     elementsFromPoint respecte visibility -> le CTA du module Devis express
     masque (acte 2 replie) ne declenche rien. */
  useEffect(() => {
    if (!launcherShown) {
      setCtaOverlap(false);
      return undefined;
    }
    let raf = 0;
    const hitsCta = (x, y) => {
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return false;
      return document.elementsFromPoint(x, y).some(
        (el) => el.closest && el.closest('.btn-gold, .btn-glass'),
      );
    };
    const check = () => {
      const b = launcherRef.current;
      if (!b) return;
      const r = b.getBoundingClientRect();
      const pts = [
        [r.left + r.width / 2, r.top + r.height / 2],
        [r.left + 6, r.top + 6],
        [r.right - 6, r.top + 6],
        [r.left + 6, r.bottom - 6],
        [r.right - 6, r.bottom - 6],
      ];
      const h = hintRef.current;
      if (h && labelShown) {
        const l = h.getBoundingClientRect();
        pts.push(
          [l.left + 4, l.top + l.height / 2],
          [l.left + l.width / 2, l.top + l.height / 2],
        );
      }
      setCtaOverlap(pts.some(([x, y]) => hitsCta(x, y)));
    };
    /* Cadence 200 ms maxi (le dim a 40 % n'a pas besoin de la precision
       frame) : pendant un scroll continu, ~5 sondes/s au lieu de 60, et un
       rattrapage en fin de geste via le timeout trainant. Une sonde par
       frame pesait sur le budget JS du scroll mobile (5 elementsFromPoint
       par frame, profil du 3 juillet). */
    let last = 0;
    let trailing = 0;
    const run = () => {
      raf = 0;
      last = performance.now();
      check();
    };
    const schedule = () => {
      const wait = 200 - (performance.now() - last);
      if (wait <= 0) {
        if (!raf) raf = requestAnimationFrame(run);
      } else if (!trailing) {
        trailing = setTimeout(() => {
          trailing = 0;
          schedule();
        }, wait);
      }
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(trailing);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [launcherShown, labelShown]);

  /* mobile vs desktop : reevalue au resize / rotation / changement de pointeur */
  useEffect(() => {
    const compute = () => setIsMobile(detectMobile());
    compute();
    const mq = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(pointer: coarse)')
      : null;
    window.addEventListener('resize', compute, { passive: true });
    if (mq && mq.addEventListener) mq.addEventListener('change', compute);
    return () => {
      window.removeEventListener('resize', compute);
      if (mq && mq.removeEventListener) mq.removeEventListener('change', compute);
    };
  }, []);

  /* auto-scroll du fil */
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending, showFlows]);

  /* focus de la saisie a l'ouverture : DESKTOP UNIQUEMENT. Sur mobile, auto-focus
     = ouverture forcee du clavier iOS (resize viewport, reflow, scroll) qui fige
     le panneau quelques secondes apres l'ouverture. On laisse l'utilisateur taper
     dans le champ quand il le souhaite. */
  useEffect(() => {
    if (open && !tour.active && !isMobile && inputRef.current) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open, tour.active, isMobile]);

  /* Echap : ferme le tour, sinon le panneau */
  useEffect(() => {
    if (!open && !tour.active) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (tour.active) endTour(false);
      else closePanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tour.active]);

  /* ------------------------------ conversation ----------------------------- */
  // Cloture la conversation : ajoute (une seule fois) le message de cloture et
  // desactive la saisie. Appelee quand le plafond est atteint ou sur [FIN].
  const cloreConversation = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    setClosed(true);
    setMessages((m) => [...m, { role: 'assistant', content: CLOTURE_MSG }]);
  }, []);

  const send = useCallback(
    async (raw) => {
      const content = (raw || '').trim();
      if (!content || sending || closed) return;

      // (a) Plafond de messages visiteur : au-dela, aucun appel API -> cloture.
      const userCount = messages.filter((m) => m.role === 'user').length;
      if (userCount >= MAX_MESSAGES_UTILISATEUR) {
        cloreConversation();
        return;
      }

      // (b) Anti-doublon : meme question deja posee -> reponse fixe, aucun appel API.
      const norm = normaliser(content);
      if (norm && sentNormalizedRef.current.has(norm)) {
        setMessages((m) => [
          ...m,
          { role: 'user', content },
          { role: 'assistant', content: DOUBLON_MSG },
        ]);
        setInput('');
        setShowFlows(false);
        setMobileCta(null);
        return;
      }
      if (norm) sentNormalizedRef.current.add(norm);

      const next = [...messages, { role: 'user', content }];
      setMessages(next);
      setInput('');
      setShowFlows(false);
      setMobileCta(null);
      setSending(true);
      setSpark(true);
      setTimeout(() => setSpark(false), 600);
      try {
        const apiMessages = next
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({ role: m.role, content: m.content }));
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages }),
        });
        if (!res.ok) throw new Error('http');
        const data = await res.json();
        const reply = data && typeof data.text === 'string' ? data.text.trim() : '';
        if (!reply) throw new Error('empty');
        // Nettoyage Markdown + retrait du marqueur [FIN] avant affichage.
        const fin = contientFin(reply);
        setMessages((m) => [...m, { role: 'assistant', content: nettoyerReponse(reply) }]);
        // Cloture si [FIN] detecte, ou si ce message atteint le plafond.
        if (fin || userCount + 1 >= MAX_MESSAGES_UTILISATEUR) {
          cloreConversation();
        }
      } catch {
        setMessages((m) => [...m, { role: 'assistant', content: ERROR_MSG }]);
      } finally {
        setSending(false);
        setOfferGuide(true);
      }
    },
    [messages, sending, closed, cloreConversation],
  );

  // Ouverture immediate. Declenchee sur pointerdown (au contact) pour court-circuiter
  // le delai de `click` d'iOS (desambiguisation tap/zoom/scroll), + onClick pour le
  // clavier. Idempotente : un double declenchement (pointerdown puis click) ne fait rien.
  function openPanel() {
    if (open) return;
    if (!tapAtRef.current) tapAtRef.current = performance.now();
    setClosing(false);
    setOpen(true);
  }
  function closePanel(flush = true) {
    // Fermeture par l'utilisateur = fin de conversation -> envoi du fil.
    // (flush=false quand on masque le panneau pour lancer le tour guide.)
    if (flush) flushTranscript();
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, reducedRef.current ? 0 : 280);
  }

  function onInputChange(e) {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 96) + 'px';
  }
  function onInputKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
      if (inputRef.current) inputRef.current.style.height = 'auto';
    }
  }

  /* --------------------------------- tour ---------------------------------- */
  const measure = useCallback((el) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 8;
    setTourRect({
      top: r.top - pad,
      left: r.left - pad,
      width: r.width + pad * 2,
      height: r.height + pad * 2,
    });
  }, []);

  // Mobile / tactile : JAMAIS de tour a projecteur. On rassure dans le chat puis
  // on propose un bouton CTA qui navigue directement vers la bonne destination.
  function showMobileCta(flowKey) {
    const f = TOUR_FLOWS[flowKey];
    if (!f || !f.mobile) return;
    setShowFlows(false);
    setMessages((m) => [...m, { role: 'assistant', content: f.mobile.message }]);
    setMobileCta({
      ctaLabel: f.mobile.ctaLabel,
      path: f.mobile.path,
      scrollTarget: f.mobile.scrollTarget,
    });
  }

  // Tour pas-a-pas : DESKTOP UNIQUEMENT. Garde infaillible -> sur mobile on bascule
  // sur le CTA et on ne touche jamais a l'etat du tour (aucun overlay rendu).
  function startTour(flowKey) {
    setShowFlows(false);
    if (detectMobile()) {
      showMobileCta(flowKey);
      return;
    }
    const f = TOUR_FLOWS[flowKey];
    if (!f) return;
    closePanel(false); // simple bascule vers le tour, pas une fin de conversation
    tourElRef.current = null;
    setTourRect(null);
    setTour({ active: true, flowKey, step: 0 });
  }

  // CTA mobile : ouvre la bonne route (si differente) puis smooth-scroll vers la
  // section. Si la cible est sur la page courante, scroll direct. Best-effort :
  // si la cible n'apparait pas, on reste sur la page (jamais de blocage).
  function runCta(cta) {
    setMobileCta(null);
    closePanel(false);
    const behavior = reducedRef.current ? 'auto' : 'smooth';
    const scrollTo = (sel) => {
      if (!sel) return;
      waitForTarget(sel, 3500).then((el) => {
        if (el) el.scrollIntoView({ behavior, block: 'start' });
      });
    };
    if (cta.path && window.location.pathname !== cta.path) {
      navigate(cta.path);
      setTimeout(() => scrollTo(cta.scrollTarget), reducedRef.current ? 60 : 360);
    } else {
      scrollTo(cta.scrollTarget);
    }
  }

  function endTour(completed) {
    setTour({ active: false, flowKey: null, step: 0 });
    setTourRect(null);
    tourElRef.current = null;
    openPanel();
    if (completed) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            `Et voilà, vous êtes au bon endroit. Je reste disponible si vous avez la moindre question pendant votre démarche.`,
        },
      ]);
    }
  }

  function tourNext() {
    const flow = TOUR_FLOWS[tour.flowKey];
    if (!flow) return endTour(false);
    if (tour.step >= flow.steps.length - 1) return endTour(true);
    tourElRef.current = null;
    setTourRect(null);
    setTour((t) => ({ ...t, step: t.step + 1 }));
  }
  function tourPrev() {
    if (tour.step <= 0) return;
    tourElRef.current = null;
    setTourRect(null);
    setTour((t) => ({ ...t, step: t.step - 1 }));
  }

  /* resolution de l'etape courante (navigation + localisation de la cible) */
  useEffect(() => {
    if (!tour.active || detectMobile()) return undefined; // jamais de tour sur mobile
    const flow = TOUR_FLOWS[tour.flowKey];
    const step = flow && flow.steps[tour.step];
    if (!step) return undefined;
    let cancelled = false;

    (async () => {
      if (step.path && window.location.pathname !== step.path) {
        navigate(step.path);
        await delay(reducedRef.current ? 60 : 360);
      }
      if (cancelled) return;
      if (!step.target) {
        tourElRef.current = null;
        setTourRect(null); // tooltip centre, degradation gracieuse
        return;
      }
      const el = await waitForTarget(step.target, 3500);
      if (cancelled) return;
      if (!el) {
        // Cible introuvable : on degrade proprement (tooltip centre), jamais de
        // cadre vide ni de blocage.
        tourElRef.current = null;
        setTourRect(null);
        return;
      }
      if (cancelled) return;
      tourElRef.current = el;
      measure(el); // premiere pose immediate; la boucle rAF prend le relais

      // Cadrage : on epingle le HAUT de la cible sous le header (formulaire) ou on
      // la centre (petite cible). Le suivi temps reel est assure par la boucle rAF.
      const pin = () =>
        scrollToTarget(el, { large: !!step.frame, reduced: reducedRef.current });
      pin();

      // Robustesse : AppShell fait window.scrollTo(0,0) a chaque transition de page
      // (AnimatePresence onExitComplete) et /tarification est en lazy-load + anim
      // d'entree. Ce reset, ou la pose tardive de l'iframe, peut ecraser notre
      // cadrage. On RE-CALE donc tant que le haut du formulaire n'est pas a sa place,
      // sans secousse si c'est deja bon (guard sur la position courante). Le
      // surlignage reste colle via la boucle rAF.
      if (step.frame) {
        [120, 360, 760, 1300].forEach((ms) =>
          setTimeout(() => {
            if (cancelled || tourElRef.current !== el) return;
            const top = el.getBoundingClientRect().top;
            if (Math.abs(top - FORM_TOP_OFFSET) > 24) pin();
          }, ms),
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tour.active, tour.flowKey, tour.step, navigate, measure]);

  /* Suivi en TEMPS REEL : tant qu'une etape est active, on mesure la cible a
     chaque frame (requestAnimationFrame) et on ne met a jour l'etat que si la
     position/taille a change (>0.5px) -> surlignage parfaitement colle pendant
     tout scroll (programmatique d'arrivee ou utilisateur), zero saut, zero
     re-rendu inutile a l'arret. Aucune transition de position : c'est cette
     boucle qui assure la fluidite, pas une animation CSS (qui derive au scroll). */
  useEffect(() => {
    if (!tour.active || detectMobile()) return undefined;
    let raf = 0;
    let last = null;
    const pad = 8;
    const tick = () => {
      const el = tourElRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const next = {
          top: r.top - pad,
          left: r.left - pad,
          width: r.width + pad * 2,
          height: r.height + pad * 2,
        };
        if (
          !last ||
          Math.abs(next.top - last.top) > 0.5 ||
          Math.abs(next.left - last.left) > 0.5 ||
          Math.abs(next.width - last.width) > 0.5 ||
          Math.abs(next.height - last.height) > 0.5
        ) {
          last = next;
          setTourRect(next);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tour.active, tour.step]);

  if (!mounted) return null;

  const flow = tour.active ? TOUR_FLOWS[tour.flowKey] : null;
  const step = flow ? flow.steps[tour.step] : null;

  /* ------------------------------ rendu : tour ----------------------------- */
  function renderTour() {
    // Garde infaillible : aucun overlay/projecteur de tour n'est JAMAIS rendu sur
    // mobile, quel que soit l'etat (le tour ne s'y declenche pas, ceci est une
    // double securite).
    if (isMobile || detectMobile()) return null;
    if (!tour.active || !step) return null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isFrame = !!step.frame;

    // Tour desktop uniquement. Position du tooltip : en mode encadre (grand
    // formulaire), dans une marge libre (cote avec le plus de place) sans recouvrir
    // la zone surlignee ; sinon pres de la cible (au-dessus/en dessous).
    let tipStyle;
    if (isFrame && tourRect) {
      // top-alignee avec le HAUT de la zone surlignee (on lit l'explication ET on
      // voit le haut du formulaire au meme niveau), du cote avec le plus de marge.
      const top = Math.min(Math.max(tourRect.top, 16), vh - 240);
      const roomRight = vw - (tourRect.left + tourRect.width);
      const roomLeft = tourRect.left;
      tipStyle = roomRight >= roomLeft ? { right: 16, top } : { left: 16, top };
    } else if (!tourRect) {
      tipStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    } else {
      const placeTop =
        step.placement === 'top' ||
        (step.placement !== 'bottom' && tourRect.top > vh * 0.55);
      const left = Math.min(Math.max(tourRect.left, 16), vw - Math.min(330, vw - 32) - 16);
      if (placeTop) {
        tipStyle = { bottom: vh - tourRect.top + 16, left };
      } else {
        tipStyle = { top: tourRect.top + tourRect.height + 16, left };
      }
    }

    return (
      <>
        <div
          className={
            'atp-tour-veil' +
            (isFrame ? ' atp-tour-veil--frame' : tourRect ? '' : ' atp-tour-veil--nospot')
          }
        />
        {/* petite cible : projecteur sombre decoupe (joli sur petit element) */}
        {tourRect && !isFrame && (
          <div
            className="atp-tour-spot"
            style={{
              top: tourRect.top,
              left: tourRect.left,
              width: tourRect.width,
              height: tourRect.height,
            }}
          />
        )}
        {/* grand formulaire/iframe : encadre dore lumineux, sans trou sombre.
            Position via transform (GPU) -> suivi fluide au scroll, pas de reflow. */}
        {tourRect && isFrame && (
          <div
            className="atp-tour-frame"
            style={{
              transform: `translate(${tourRect.left}px, ${tourRect.top}px)`,
              width: tourRect.width,
              height: tourRect.height,
            }}
          />
        )}
        {tourRect && !isFrame && (
          <div
            className="atp-tour-pointer"
            style={{ top: Math.max(tourRect.top - 30, 6), left: tourRect.left + tourRect.width / 2 - 11 }}
          >
            <Icon name="chevron-down" size={22} />
          </div>
        )}
        <button
          type="button"
          className="atp-tour-close"
          aria-label="Quitter le guide"
          onClick={() => endTour(false)}
        >
          <Icon name="close" size={18} />
        </button>
        <div
          className="atp-tooltip"
          style={tipStyle || undefined}
          role="dialog"
          aria-label="Étape du guide"
        >
          <Stars field={TOOLTIP_STARS} />
          <div className="atp-tooltip-step">
            {flow.label} · Étape {tour.step + 1} / {flow.steps.length}
          </div>
          <h3 className="atp-tooltip-title atp-serif">{step.title}</h3>
          <p className="atp-tooltip-text">{step.text}</p>
          <div className="atp-tooltip-foot">
            <div className="atp-progress" aria-hidden>
              {flow.steps.map((_, i) => (
                <span
                  key={i}
                  className={'atp-progress-dot' + (i <= tour.step ? ' atp-progress-dot--on' : '')}
                />
              ))}
            </div>
            {tour.step > 0 && (
              <button type="button" className="atp-tour-btn atp-tour-btn--ghost" onClick={tourPrev}>
                Précédent
              </button>
            )}
            <button type="button" className="atp-tour-btn atp-tour-btn--solid" onClick={tourNext}>
              {tour.step >= flow.steps.length - 1 ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </>
    );
  }

  // Ouvre la page de devis (cloture) et referme le panneau.
  function goToDevis() {
    trackEvent('cta_devis_click', { "cta_label": 'Obtenir mon devis', "page_path": window.location.pathname });
    if (window.location.pathname !== '/tarification') navigate('/tarification');
    closePanel();
  }

  /* ----------------------------- rendu : actions --------------------------- */
  function renderActions() {
    // Conversation cloturee : on ne propose plus que le devis (envoi desactive).
    if (closed) {
      return (
        <div className="atp-actions" style={{ flexDirection: 'column' }}>
          <button type="button" className="atp-cta" onClick={goToDevis}>
            Obtenir mon devis
          </button>
        </div>
      );
    }
    if (mobileCta) {
      return (
        <div className="atp-actions" style={{ flexDirection: 'column' }}>
          <button type="button" className="atp-cta" onClick={() => runCta(mobileCta)}>
            {mobileCta.ctaLabel}
          </button>
        </div>
      );
    }
    if (showFlows) {
      // Desktop : chaque flux lance le tour pas-a-pas. Mobile : chaque flux
      // ouvre directement le CTA (message + bouton de navigation), jamais le tour.
      const onPick = isMobile ? showMobileCta : startTour;
      return (
        <div className="atp-actions" style={{ flexDirection: 'column' }}>
          {Object.entries(TOUR_FLOWS).map(([key, f]) => (
            <button key={key} type="button" className="atp-flow" onClick={() => onPick(key)}>
              <span className="atp-flow-icon"><Icon name={f.icon} size={20} /></span>
              <span className="atp-flow-text">
                <span className="atp-flow-title">{f.label}</span>
                <span className="atp-flow-sub">{f.sub}</span>
              </span>
            </button>
          ))}
        </div>
      );
    }
    if (sending) return null;
    const showStarters = messages.length <= 2;
    return (
      <div className="atp-actions">
        <button
          type="button"
          className="atp-chip atp-chip--primary"
          onClick={() => setShowFlows(true)}
        >
          M'aider à souscrire
        </button>
        {offerGuide && (
          <button type="button" className="atp-chip" onClick={() => setShowFlows(true)}>
            Oui, guidez-moi
          </button>
        )}
        {showStarters &&
          STARTERS.map((q) => (
            <button key={q} type="button" className="atp-chip" onClick={() => send(q)}>
              {q}
            </button>
          ))}
      </div>
    );
  }

  /* ------------------------------ rendu : panneau -------------------------- */
  const node = (
    <div className={'atp-root' + (isMobile ? ' atp-root--lite' : '')}>
      {launcherShown && (
        /* Dock = etiquette + bouton dans un meme conteneur flex ancre bas-droite.
           L'etiquette est SOLIDAIRE du bouton (jamais orpheline) et s'etend vers
           la gauche : le bouton, cale a droite, ne bouge jamais. Le dock entier
           s'estompe a 40 % sur chevauchement d'un CTA et disparait pendant le
           drag du curseur du cadran. */
        <div
          className={
            'atp-dock' +
            (instrumentDrag ? ' atp-dock--away' : ctaOverlap ? ' atp-dock--dim' : '')
          }
        >
          <button
            type="button"
            ref={hintRef}
            className="atp-hint"
            data-show={labelShown ? '' : undefined}
            aria-hidden="true"
            tabIndex={-1}
            onPointerDown={openPanel}
            onClick={openPanel}
          >
            Besoin d&apos;aide ?
          </button>
          <button
            type="button"
            ref={launcherRef}
            className="atp-launcher"
            aria-label="Ouvrir l'assistant Assutempo"
            onPointerDown={openPanel}
            onClick={openPanel}
          >
            <Icon name="bubble" size={24} />
          </button>
        </div>
      )}

      {open && (
        <section
          className={'atp-panel' + (closing ? ' atp-panel--closing' : '')}
          role="dialog"
          aria-label="Assistant Assutempo"
        >
          {perfDebug && perf && (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 6,
                left: 8,
                right: 8,
                zIndex: 50,
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.4,
                color: perf.total > 1000 ? '#ff6b6b' : '#6fcf97',
                background: 'rgba(0,0,0,0.78)',
                padding: '6px 8px',
                borderRadius: 8,
                pointerEvents: 'none',
              }}
            >
              TOTAL {perf.total} ms
              <br />rendu JS {perf.render} ms
              <br />paint/compo {perf.paint} ms
            </div>
          )}
          {/* Ambiance cosmos : DESKTOP UNIQUEMENT. Sur mobile rien n'est monte
              (pas de canvas, pas de boucle rAF, pas de blobs lourds) -> ouverture
              instantanee, plus de gel. */}
          {!isMobile && (
            <>
              <div className="atp-nebula" aria-hidden>
                <span className="atp-nebula-blob atp-nebula-blob--gold" />
                <span className="atp-nebula-blob atp-nebula-blob--violet" />
                <span className="atp-nebula-blob atp-nebula-blob--deep" />
              </div>
              <Suspense fallback={null}>
                <CosmosCanvas reduced={reducedRef.current} burst={messages.length} />
              </Suspense>
              <div className="atp-aura" aria-hidden />
            </>
          )}
          <header className="atp-header">
            <span className="atp-header-avatar"><Sigil /></span>
            <span className="atp-header-id">
              <span className="atp-header-name atp-serif">Tempo</span>
              <span className="atp-header-status">
                <span className="atp-status-dot" /> Concierge Assutempo
              </span>
            </span>
            <span className="atp-header-actions">
              {/* Mobile (feuille plein ecran) : fermeture explicite en X.
                  Desktop (panneau flottant) : chevron de reduction. */}
              <button
                type="button"
                className="atp-icon-btn"
                aria-label={isMobile ? "Fermer l'assistant" : "Réduire l'assistant"}
                onClick={closePanel}
              >
                <Icon name={isMobile ? 'close' : 'chevron-down'} size={18} />
              </button>
            </span>
          </header>

          <div className="atp-messages" ref={listRef} aria-live="polite">
            {messages.map((m, i) => (
              <div
                key={i}
                className={'atp-row ' + (m.role === 'user' ? 'atp-row--user' : 'atp-row--bot')}
              >
                <div className={'atp-bubble ' + (m.role === 'user' ? 'atp-bubble--user' : 'atp-bubble--bot')}>
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="atp-row atp-row--bot">
                <div className="atp-bubble atp-bubble--bot atp-typing" aria-label="Tempo écrit">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          {renderActions()}

          <div className="atp-input-bar">
            <textarea
              ref={inputRef}
              className="atp-input"
              rows={1}
              placeholder={closed ? 'Conversation terminée' : 'Posez votre question...'}
              value={input}
              onChange={onInputChange}
              onKeyDown={onInputKey}
              disabled={closed}
              aria-label="Votre message"
            />
            <button
              type="button"
              className={'atp-send' + (spark ? ' atp-send--spark' : '')}
              aria-label="Envoyer"
              disabled={!input.trim() || sending || closed}
              onClick={() => {
                send(input);
                if (inputRef.current) inputRef.current.style.height = 'auto';
              }}
            >
              <Icon name="send" size={18} />
            </button>
          </div>
          <p className="atp-legal">
            Assistant indicatif, ne constitue pas un conseil contractuel.
          </p>
        </section>
      )}

      {renderTour()}
    </div>
  );

  return createPortal(node, document.body);
}
