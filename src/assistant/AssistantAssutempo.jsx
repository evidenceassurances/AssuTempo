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
  // Accompagnement mobile : { ctaLabel, path, scrollTarget } ou null.
  const [mobileCta, setMobileCta] = useState(null);
  // Bandeau cookies affiche ? Si oui, on masque le launcher pour ne pas recouvrir
  // ses boutons (bug mobile : le FAB volait le tap du bouton "Refuser").
  const [cookieBannerUp, setCookieBannerUp] = useState(() => !consentChosen());

  // tour : { active, flowKey, step }
  const [tour, setTour] = useState({ active: false, flowKey: null, step: 0 });
  const [tourRect, setTourRect] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const reducedRef = useRef(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const tourElRef = useRef(null);

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
  const send = useCallback(
    async (raw) => {
      const content = (raw || '').trim();
      if (!content || sending) return;
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
        setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      } catch {
        setMessages((m) => [...m, { role: 'assistant', content: ERROR_MSG }]);
      } finally {
        setSending(false);
        setOfferGuide(true);
      }
    },
    [messages, sending],
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

  /* ----------------------------- rendu : actions --------------------------- */
  function renderActions() {
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
      {!open && !tour.active && !cookieBannerUp && (
        <button
          type="button"
          className="atp-launcher"
          aria-label="Ouvrir l'assistant Assutempo"
          onPointerDown={openPanel}
          onClick={openPanel}
        >
          <Sigil />
          <span className="atp-launcher-badge" aria-hidden />
          {/* Indice "?" : trait SVG qui se trace en sortant du point dore (le
              point dore sert de point du "?"), facon serpent, puis se retracte
              dans le point, en boucle. Additif, pointer-events:none (clic
              launcher intact), hors flux et invisible au repos : aucun element
              existant modifie. Le "?" est un vrai PATH en stroke (pas un glyphe).
              L'origine SVG (0,0) coincide pile avec le centre du badge dore en
              haut a droite du launcher 64px. */}
          <svg
            className="atp-hint"
            viewBox="-15 -55 30 64"
            width="24"
            height="51"
            aria-hidden
            focusable="false"
          >
            {/* onde qui se libere du point au moment ou le trait sort */}
            <circle
              className="at-emit"
              cx="0" cy="0" r="6"
              fill="none" stroke="#E8C97A" strokeWidth="1.5"
              pointerEvents="none"
            />
            {/* groupe externe = placement / echelle sur le point (transform attr).
                groupe interne = flottement (bob) : separe pour ne jamais ecraser
                le placement. 2 paths superposes (meme d) : halo doux derriere,
                trait net devant. */}
            <g transform="translate(0 0) scale(0.92)">
              <g className="at-bob">
                <path
                  className="at-draw"
                  d="M 0 -7 C 0 -13, 1 -19, 1 -26 C 3 -30, 12 -33, 12 -39 C 12 -45, 9 -50, 2 -50 C -3 -50, -9 -48, -10 -43"
                  fill="none" stroke="#E8C97A" strokeOpacity="0.14" strokeWidth="7"
                  strokeLinecap="round" strokeLinejoin="round"
                  pathLength="100" strokeDasharray="100" strokeDashoffset="100"
                  pointerEvents="none"
                />
                <path
                  className="at-draw"
                  d="M 0 -7 C 0 -13, 1 -19, 1 -26 C 3 -30, 12 -33, 12 -39 C 12 -45, 9 -50, 2 -50 C -3 -50, -9 -48, -10 -43"
                  fill="none" stroke="#F2D98E" strokeWidth="3.2"
                  strokeLinecap="round" strokeLinejoin="round"
                  pathLength="100" strokeDasharray="100" strokeDashoffset="100"
                  pointerEvents="none"
                />
              </g>
            </g>
          </svg>
        </button>
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
              <button
                type="button"
                className="atp-icon-btn"
                aria-label="Réduire l'assistant"
                onClick={closePanel}
              >
                <Icon name="chevron-down" size={18} />
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
              placeholder="Posez votre question..."
              value={input}
              onChange={onInputChange}
              onKeyDown={onInputKey}
              aria-label="Votre message"
            />
            <button
              type="button"
              className={'atp-send' + (spark ? ' atp-send--spark' : '')}
              aria-label="Envoyer"
              disabled={!input.trim() || sending}
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
