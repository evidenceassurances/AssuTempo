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
import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { ASSISTANT_CSS } from './styles';
import { TOUR_FLOWS } from './tourSteps';

const STYLE_ID = 'atp-styles';

const WELCOME =
  'Bonjour, je suis Tempo, votre concierge Assutempo. Je reponds a vos questions sur l\'assurance (temporaire, voyage) et la carte grise, et je peux vous guider pas a pas jusqu\'a la souscription. Comment puis-je vous aider ?';

const ERROR_MSG =
  'Je rencontre un souci technique a l\'instant. Je peux toutefois vous accompagner pas a pas jusqu\'au formulaire, ou vous pouvez joindre un conseiller au 09 74 19 78 20 (Lun-Ven 9h-21h, Sam 9h-20h).';

const STARTERS = [
  'Qu\'est-ce que l\'assurance temporaire ?',
  'Quels documents pour rouler ?',
  'Assurer un vehicule etranger ?',
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
const PANEL_STARS = makeStarField(12);
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

export default function AssistantAssutempo() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showFlows, setShowFlows] = useState(false);
  const [offerGuide, setOfferGuide] = useState(false);

  // tour : { active, flowKey, step }
  const [tour, setTour] = useState({ active: false, flowKey: null, step: 0 });
  const [tourRect, setTourRect] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const reducedRef = useRef(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const tourElRef = useRef(null);

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

  /* auto-scroll du fil */
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending, showFlows]);

  /* focus de la saisie a l'ouverture */
  useEffect(() => {
    if (open && !tour.active && inputRef.current) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open, tour.active]);

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
      setSending(true);
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

  function openPanel() {
    setClosing(false);
    setOpen(true);
  }
  function closePanel() {
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

  function startTour(flowKey) {
    setShowFlows(false);
    closePanel();
    tourElRef.current = null;
    setTourRect(null);
    setTour({ active: true, flowKey, step: 0 });
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
            'Et voila, vous etes au bon endroit. Je reste disponible si vous avez la moindre question pendant votre demarche.',
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
    if (!tour.active) return undefined;
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
        tourElRef.current = null;
        setTourRect(null);
        return;
      }
      el.scrollIntoView({
        behavior: reducedRef.current ? 'auto' : 'smooth',
        block: 'center',
        inline: 'center',
      });
      await delay(reducedRef.current ? 60 : 420);
      if (cancelled) return;
      tourElRef.current = el;
      measure(el);
    })();

    return () => {
      cancelled = true;
    };
  }, [tour.active, tour.flowKey, tour.step, navigate, measure]);

  /* recalcule le surlignage au scroll / resize, throttle via requestAnimationFrame,
     listeners passifs et bien nettoyes a la fermeture du tour */
  useEffect(() => {
    if (!tour.active) return undefined;
    let raf = 0;
    const onMove = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (tourElRef.current) measure(tourElRef.current);
      });
    };
    const scrollOpts = { capture: true, passive: true };
    window.addEventListener('scroll', onMove, scrollOpts);
    window.addEventListener('resize', onMove, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onMove, scrollOpts);
      window.removeEventListener('resize', onMove);
    };
  }, [tour.active, tour.step, measure]);

  if (!mounted) return null;

  const flow = tour.active ? TOUR_FLOWS[tour.flowKey] : null;
  const step = flow ? flow.steps[tour.step] : null;

  /* ------------------------------ rendu : tour ----------------------------- */
  function renderTour() {
    if (!tour.active || !step) return null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw <= 520;

    // position du tooltip : sur mobile, carte ancree en bas pleine largeur
    // (bottom-sheet) pour ne jamais deborder ; sur desktop, pres de la cible.
    let tipStyle;
    if (isMobile) {
      tipStyle = null; // gere par la classe .atp-tooltip--sheet
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
        <div className={'atp-tour-veil' + (tourRect ? '' : ' atp-tour-veil--nospot')} />
        {tourRect && (
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
        {tourRect && (
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
          className={'atp-tooltip' + (isMobile ? ' atp-tooltip--sheet' : '')}
          style={tipStyle || undefined}
          role="dialog"
          aria-label="Etape du guide"
        >
          <Stars field={TOOLTIP_STARS} />
          <div className="atp-tooltip-step">
            {flow.label} · Etape {tour.step + 1} / {flow.steps.length}
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
                Precedent
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
    if (showFlows) {
      return (
        <div className="atp-actions" style={{ flexDirection: 'column' }}>
          {Object.entries(TOUR_FLOWS).map(([key, f]) => (
            <button key={key} type="button" className="atp-flow" onClick={() => startTour(key)}>
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
          M'aider a souscrire
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
    <div className="atp-root">
      {!open && !tour.active && (
        <button
          type="button"
          className="atp-launcher"
          aria-label="Ouvrir l'assistant Assutempo"
          onClick={openPanel}
        >
          <Sigil />
          <span className="atp-launcher-badge" aria-hidden />
        </button>
      )}

      {open && (
        <section
          className={'atp-panel' + (closing ? ' atp-panel--closing' : '')}
          role="dialog"
          aria-label="Assistant Assutempo"
        >
          <Stars field={PANEL_STARS} />
          <div className="atp-aura" aria-hidden />
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
                aria-label="Reduire l'assistant"
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
                <div className="atp-bubble atp-bubble--bot atp-typing" aria-label="Tempo ecrit">
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
              className="atp-send"
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
