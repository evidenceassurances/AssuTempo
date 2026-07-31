import {
  useState, useRef, useEffect, useLayoutEffect, useCallback, cloneElement, isValidElement,
} from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { m, useMotionValue, useReducedMotion, animate } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, ArrowLeft, ShieldCheck, MapPin, Car, User, Mail,
  Check, Globe2, Clock,
} from 'lucide-react';
import Footer from '../components/Footer';
import GlobeInternational from '../components/GlobeInternational';
import { fadeUp } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { pagePath, trackEvent } from '../lib/analytics';

/* useLayoutEffect cote client (mesure de hauteur avant peinture), useEffect au
   prerendu pour eviter l'avertissement React "useLayoutEffect does nothing on
   the server". */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const PAYS = [
  { slug: 'albanie',           nom: 'Albanie',            flag: '🇦🇱' },
  { slug: 'azerbaidjan',       nom: 'Azerbaïdjan',        flag: '🇦🇿' },
  { slug: 'macedoine-du-nord', nom: 'Macédoine du Nord',  flag: '🇲🇰' },
  { slug: 'maroc',             nom: 'Maroc',              flag: '🇲🇦' },
  { slug: 'moldavie',          nom: 'Moldavie',           flag: '🇲🇩' },
  { slug: 'tunisie',           nom: 'Tunisie',            flag: '🇹🇳' },
  { slug: 'turquie',           nom: 'Turquie',            flag: '🇹🇷' },
];

/* Les 3 etapes du bloc "Comment ca marche" (pedagogie, distinct du formulaire). */
const STEPS = [
  {
    num: '01',
    title: 'Vous remplissez le formulaire',
    body: 'Votre véhicule, votre trajet, vos dates.',
  },
  {
    num: '02',
    title: 'Notre équipe établit votre devis',
    body: 'Un tarif sur mesure, calculé selon votre profil.',
  },
  {
    num: '03',
    title: 'Vous recevez votre proposition',
    body: 'En 4h en journée, 8h la nuit, prête à souscrire, directement par email.',
  },
];

/* Les 4 scenes du formulaire : une seule intention par ecran. Le parcours
   horizontal donne le sentiment d'avancer vite, une carte apres l'autre. */
const SCENES = [
  { num: '01', key: 'trajet',      title: 'Votre trajet',    Icon: MapPin },
  { num: '02', key: 'vehicule',    title: 'Votre véhicule',  Icon: Car },
  { num: '03', key: 'conducteur',  title: 'Le conducteur',   Icon: User },
  { num: '04', key: 'coordonnees', title: 'Vos coordonnées', Icon: Mail },
];
const N_SCENES = SCENES.length;
const LAST = N_SCENES - 1;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* Cle des erreurs rattachees a chaque scene : sert a la validation par etape
   (le bouton "Continuer" ne verifie que les champs de sa scene). */
const STEP_KEYS = [
  ['pays', 'dateEffet', 'duree'],
  ['genre', 'usage', 'marque', 'modele', 'immat', 'puissance', 'paysImmat'],
  ['nom', 'prenom', 'dateNaissance', 'datePermis', 'numPermis', 'paysResidence', 'adresse', 'codePostal', 'ville', 'condamnation'],
  ['email', 'telephone', 'consentement'],
];

/* Etoiles fixes du fond (jamais de Math.random au rendu : le prerendu et
   l'hydratation doivent produire le meme arbre). Quelques points seulement,
   pour la profondeur autour du globe. */
const AMBIENT = [
  { t: 14, l: 8,  s: 2,   o: 0.35 },
  { t: 28, l: 17, s: 1.5, o: 0.28 },
  { t: 62, l: 11, s: 1.5, o: 0.3 },
  { t: 78, l: 22, s: 2,   o: 0.24 },
  { t: 20, l: 84, s: 2,   o: 0.32 },
  { t: 44, l: 92, s: 1.5, o: 0.26 },
  { t: 70, l: 88, s: 2,   o: 0.3 },
  { t: 86, l: 74, s: 1.5, o: 0.22 },
  { t: 10, l: 54, s: 1.5, o: 0.2 },
  { t: 90, l: 46, s: 1.5, o: 0.24 },
];

const inputBase = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 11,
  padding: '12px 16px',
  fontSize: 16,
  color: 'var(--text)',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const onFocus = (e) => {
  e.target.style.borderColor = 'var(--gold-strong)';
  e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.14)';
};
const onBlur = (e) => {
  e.target.style.borderColor = 'rgba(255,255,255,0.12)';
  e.target.style.boxShadow = 'none';
};

function Field({ label, hint, error, children }) {
  const child = error && isValidElement(children)
    ? cloneElement(children, { 'aria-invalid': true })
    : children;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</label>
      )}
      {child}
      {hint && (
        <span style={{ fontSize: 12, color: 'var(--text-subtle)', lineHeight: 1.5 }}>{hint}</span>
      )}
      {error && <span className="field-error-msg" role="alert" style={{ fontSize: 12, color: '#e0a05c' }}>{error}</span>}
    </div>
  );
}

/* Fait defiler la page jusqu'au premier message d'erreur affiche */
function scrollToFirstError() {
  requestAnimationFrame(() => {
    const el = document.querySelector('.field-error-msg');
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });
}

const pad2 = (n) => String(n).padStart(2, '0');

/* Format court de la date d'effet pour le recapitulatif (client uniquement :
   n'est calcule que sur une valeur saisie, jamais au prerendu). */
function formatEffet(v) {
  if (!v) return '';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)} à ${pad2(d.getHours())}h${pad2(d.getMinutes())}`;
}

/* Jour ou nuit a l'heure de Paris. Sert au seul ecran de remerciement (rendu
   uniquement cote client, apres envoi) : le delai annonce s'adapte au moment. */
function periodeParis() {
  try {
    const parts = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris',
      hour: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(new Date());
    const h = parseInt(parts.find((p) => p.type === 'hour')?.value || '12', 10);
    return h >= 8 && h < 20 ? 'jour' : 'nuit';
  } catch {
    return 'jour';
  }
}

/* ── Le globe ─────────────────────────────────────────────────────────────────
   Wireframe dore sur fond sombre : sphere, paralleles (cordes horizontales),
   meridiens (ellipses verticales), halo. Deux usages : un exemplaire tres
   discret dans le fond de l'experience, un exemplaire vif au centre de l'ecran
   de remerciement. La seule chose qui bouge est un point en orbite (transform
   rotate, coupe par prefers-reduced-motion). */
function Globe({ orbit = false }) {
  return (
    <svg className="ix-globe-svg" viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <linearGradient id="ix-globe-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8C97A" />
          <stop offset="1" stopColor="#C9A84C" />
        </linearGradient>
        <radialGradient id="ix-globe-sphere" cx="0.4" cy="0.34" r="0.8">
          <stop offset="0" stopColor="rgba(232,201,122,0.16)" />
          <stop offset="0.55" stopColor="rgba(201,168,76,0.05)" />
          <stop offset="1" stopColor="rgba(201,168,76,0)" />
        </radialGradient>
        <radialGradient id="ix-globe-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.42" stopColor="rgba(201,168,76,0.12)" />
          <stop offset="1" stopColor="rgba(201,168,76,0)" />
        </radialGradient>
      </defs>

      <circle cx="120" cy="120" r="118" fill="url(#ix-globe-halo)" />
      <circle cx="120" cy="120" r="92" fill="url(#ix-globe-sphere)" />

      {/* Sphere + paralleles (cordes horizontales) */}
      <g stroke="url(#ix-globe-stroke)" fill="none">
        <circle cx="120" cy="120" r="92" strokeWidth="1.4" opacity="0.75" />
        <line x1="28"   y1="120" x2="212"  y2="120" strokeWidth="1" opacity="0.55" />
        <line x1="33"   y1="90"  x2="207"  y2="90"  strokeWidth="0.9" opacity="0.4" />
        <line x1="33"   y1="150" x2="207"  y2="150" strokeWidth="0.9" opacity="0.4" />
        <line x1="48.6" y1="62"  x2="191.4" y2="62"  strokeWidth="0.8" opacity="0.3" />
        <line x1="48.6" y1="178" x2="191.4" y2="178" strokeWidth="0.8" opacity="0.3" />
      </g>

      {/* Meridiens (ellipses verticales) */}
      <g stroke="url(#ix-globe-stroke)" fill="none" opacity="0.5">
        <line x1="120" y1="28" x2="120" y2="212" strokeWidth="1" />
        <ellipse cx="120" cy="120" rx="32" ry="92" strokeWidth="0.9" />
        <ellipse cx="120" cy="120" rx="63" ry="92" strokeWidth="0.8" />
      </g>

      {orbit ? (
        <>
          <circle cx="120" cy="120" r="110" fill="none" stroke="url(#ix-globe-stroke)" strokeWidth="0.8" opacity="0.28" />
          <g className="ix-globe-orbit">
            <circle cx="120" cy="10" r="4.5" fill="#E8C97A" />
          </g>
        </>
      ) : null}
    </svg>
  );
}

const EMPTY = {
  dateEffet: '',
  duree: '',
  genre: '',
  marque: '',
  modele: '',
  immat: '',
  puissance: '',
  paysImmat: 'France',
  usage: '',
  nom: '',
  prenom: '',
  dateNaissance: '',
  datePermis: '',
  numPermis: '',
  paysResidence: 'France',
  adresse: '',
  codePostal: '',
  ville: '',
  condamnation: '',
  email: '',
  telephone: '',
  message: '',
  consentement: false,
};

/* ═══════════════════════════════════════════════════════════════════════════
   L'ecran de remerciement : la recompense, apres l'envoi.
   Rendu uniquement cote client (jamais au prerendu). Le globe reapparait au
   centre, vif, avec sa coche ; deux ondes de lumiere se propagent une fois.
   Tout est en transform + opacity.
   ═══════════════════════════════════════════════════════════════════════════ */
function Remerciement({ pays }) {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const [periode, setPeriode] = useState('jour');

  useEffect(() => {
    setPeriode(periodeParis());
    /* On amene la recompense sous les yeux du client, sans saut brutal. */
    const t = setTimeout(() => {
      rootRef.current?.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'center',
      });
    }, 60);
    return () => clearTimeout(t);
  }, [reduce]);

  const delai = periode === 'nuit' ? '8 heures' : '4 heures';

  const pop = reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 0.82 },
        animate: { opacity: 1, scale: 1 },
        transition: { type: 'spring', stiffness: 220, damping: 20, delay: 0.15 },
      };
  const rise = (delay) => (reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
      });

  return (
    <div className="ix-exp ix-reward" ref={rootRef}>
      <div className="ix-sky" aria-hidden="true">
        {AMBIENT.map((st, i) => (
          <span key={i} className="ix-dot" style={{ top: `${st.t}%`, left: `${st.l}%`, width: st.s, height: st.s, opacity: st.o }} />
        ))}
      </div>

      <div className="ix-reward-inner" role="status" aria-live="polite">
        <div className="ix-reward-globe">
          <span className={reduce ? 'ix-pulse' : 'ix-pulse ix-pulse-run'} aria-hidden="true" />
          <span className={reduce ? 'ix-pulse ix-pulse-2' : 'ix-pulse ix-pulse-2 ix-pulse-run'} aria-hidden="true" />
          <Globe orbit />
          <m.span className="ix-reward-check" {...pop} aria-hidden="true">
            <Check size={30} strokeWidth={2.6} />
          </m.span>
        </div>

        <m.p className="ix-reward-eyebrow" {...rise(0.28)}>
          <Globe2 size={13} strokeWidth={2} aria-hidden="true" />
          Demande envoyée
        </m.p>

        <m.h2 className="ix-reward-title" {...rise(0.34)}>
          Merci, votre demande est bien partie.
        </m.h2>

        <m.p className="ix-reward-text" {...rise(0.42)}>
          {pays && pays.length
            ? `Un conseiller AssuTempo prépare votre devis sur mesure pour ${pays.join(', ')}.`
            : 'Un conseiller AssuTempo prépare votre devis sur mesure.'}
        </m.p>

        <m.div className="ix-delai" {...rise(0.5)}>
          <Clock size={20} strokeWidth={1.75} aria-hidden="true" />
          <div>
            <p className="ix-delai-big">
              Votre devis vous parvient sous <strong>{delai}</strong>.
            </p>
            <p className="ix-delai-sub">
              Nos conseillers répondent en 4 heures maximum en journée, et 8 heures
              maximum en pleine nuit. Pensez à vérifier vos courriers indésirables.
            </p>
          </div>
        </m.div>

        <m.ul className="ix-reward-band" {...rise(0.58)}>
          <li>
            <ShieldCheck size={17} color="var(--gold-light)" strokeWidth={1.75} aria-hidden="true" />
            <span>Evidence Assurances, courtier immatriculé à l&apos;ORIAS sous le n&deg; 20005719.</span>
          </li>
          <li>
            <Mail size={17} color="var(--gold-light)" strokeWidth={1.75} aria-hidden="true" />
            <span>Devis sans engagement, aucun paiement demandé à cette étape.</span>
          </li>
        </m.ul>

        <m.div className="ix-reward-links" {...rise(0.66)}>
          <Link to="/tarification" className="ix-reward-link">
            Assurance Europe immédiate
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link to="/carte" className="ix-reward-link">
            Voir la carte des pays
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link to="/guichet-de-nuit" className="ix-reward-link">
            Le Guichet de Nuit
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </m.div>
      </div>
      <style>{IX_CSS}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   L'experience de devis : une piste horizontale, quatre scenes.
   Deux mises en page, le meme contenu :
     'simple'  : formulaire vertical empile. C'est le rendu du serveur, donc
                 aussi le rendu sans JS et celui de prefers-reduced-motion.
                 Le premier rendu client est identique au HTML prerendu : aucun
                 mismatch d'hydratation.
     'slider'  : cartes horizontales. Le bouton "Continuer" et le glissement du
                 doigt font coulisser la piste (translateX pilote par un ressort
                 Framer). Le globe reste dans le fond, les scenes glissent devant.
   ═══════════════════════════════════════════════════════════════════════════ */
function DevisForm({ initialPays }) {
  const reduce = useReducedMotion();
  const [form, setForm] = useState(EMPTY);
  const [pays, setPays] = useState(() => (initialPays ? [initialPays] : []));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [scene, setScene] = useState(0);

  /* Amelioration progressive : le serveur rend 'simple', le client bascule en
     'slider' apres le montage. reduce (ou l'absence de JS) reste en 'simple'. */
  const [enhanced, setEnhanced] = useState(false);
  const [simpleForce, setSimpleForce] = useState(false);
  const mode = (!enhanced || simpleForce || reduce) ? 'simple' : 'slider';

  const modeRef = useRef(mode);
  const sceneRef = useRef(0);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { sceneRef.current = scene; }, [scene]);
  useEffect(() => { setEnhanced(true); }, []);

  const paysRef = useRef(null);
  const stageRef = useRef(null);
  const sceneEls = useRef([]);
  const widthRef = useRef(0);

  /* Une seule MotionValue pour le translateX de la piste : le bouton et le doigt
     l'ecrivent, jamais en meme temps. */
  const x = useMotionValue(0);

  /* La hauteur de la carte est aussi une MotionValue (meme chemin fiable que x
     sous LazyMotion domAnimation ; le prop declaratif animate={{height}} n'est
     pas applique ici). 'auto' en mode simple, la hauteur de la scene active en
     mode slider. */
  const stageHmv = useMotionValue('auto');

  /* Largeur d'une scene (la piste fait N fois cette largeur). ResizeObserver
     capte aussi la barre d'URL mobile et les changements d'orientation. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      widthRef.current = el.clientWidth;
      if (modeRef.current === 'slider') x.set(-sceneRef.current * widthRef.current);
      else x.set(0);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [x]);

  /* Changement de mode : on repositionne la piste sans animation (c'est un
     changement de mise en page, pas un mouvement). */
  useEffect(() => {
    widthRef.current = stageRef.current?.clientWidth || 0;
    if (mode === 'slider') x.set(-sceneRef.current * widthRef.current);
    else x.set(0);
  }, [mode, x]);

  /* ── Hauteur de la carte, calee sur le contenu de la scene affichee ────────
     La piste est un flex-row : sans intervention, sa hauteur serait celle de la
     scene la plus haute, et les scenes courtes flotteraient dans le vide. On
     mesure donc la hauteur reelle de la scene active et on l'anime (Framer,
     height) vers cette valeur. Chaque scene ne s'etire pas (align-self:
     flex-start en CSS), son offsetHeight est donc sa hauteur de contenu. Un
     ResizeObserver suit les variations (apparition d'un message d'erreur). */
  const [hidingOverflow, setHidingOverflow] = useState(false);
  const hideTimerRef = useRef(null);

  useIsoLayoutEffect(() => {
    if (mode !== 'slider') { stageHmv.set('auto'); return undefined; }
    const el = sceneEls.current[scene];
    if (!el) return undefined;
    const measure = () => {
      const target = el.offsetHeight;
      /* Premiere pose (hauteur encore 'auto') ou mouvement reduit : instantane.
         Sinon on anime la hauteur vers celle de la scene active. */
      if (typeof stageHmv.get() !== 'number' || reduce) stageHmv.set(target);
      else animate(stageHmv, target, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    return () => { if (ro) ro.disconnect(); };
  }, [mode, scene, reduce, stageHmv]);

  useEffect(() => () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }, []);

  /* Bornes des champs date, posees apres montage (le prerendu statique ne doit
     pas contenir de valeur dependante de l'horloge : mismatch d'hydratation). */
  const [dateBounds, setDateBounds] = useState({ minEffet: '', maxNaissance: '', maxPermis: '' });
  useEffect(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
    const adult = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    setDateBounds({
      minEffet: `${today}T${pad2(now.getHours())}:${pad2(now.getMinutes())}`,
      maxNaissance: `${adult.getFullYear()}-${pad2(adult.getMonth() + 1)}-${pad2(adult.getDate())}`,
      maxPermis: today,
    });
  }, []);

  const set = (key) => (e) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((errs) => (errs[key] ? { ...errs, [key]: undefined } : errs));
  };

  /* Telephone : chiffres uniquement, 10 maximum */
  const setTelephone = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm((f) => ({ ...f, telephone: digits }));
    setErrors((errs) => (errs.telephone ? { ...errs, telephone: undefined } : errs));
  };

  /* Code postal : chiffres uniquement, 5 maximum */
  const setCodePostal = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 5);
    setForm((f) => ({ ...f, codePostal: digits }));
    setErrors((errs) => (errs.codePostal ? { ...errs, codePostal: undefined } : errs));
  };

  /* Immatriculation : forcee en majuscules dans la valeur envoyee */
  const setImmat = (e) => {
    const value = e.target.value.toUpperCase();
    setForm((f) => ({ ...f, immat: value }));
    setErrors((errs) => (errs.immat ? { ...errs, immat: undefined } : errs));
  };

  function togglePays(nom) {
    setPays((prev) => (prev.includes(nom) ? prev.filter((p) => p !== nom) : [...prev, nom]));
    setErrors((errs) => (errs.pays ? { ...errs, pays: undefined } : errs));
  }

  function validate() {
    const errs = {};
    if (pays.length === 0) errs.pays = 'Sélectionnez au moins un pays de destination.';

    if (!form.dateEffet) {
      errs.dateEffet = 'Champ requis.';
    } else {
      const effet = new Date(form.dateEffet);
      /* Tolerance d'une heure pour un depart imminent */
      if (Number.isNaN(effet.getTime()) || effet.getTime() < Date.now() - 60 * 60 * 1000) {
        errs.dateEffet = "La date d'effet doit être à venir.";
      }
    }

    if (!form.duree) {
      errs.duree = 'Champ requis.';
    } else {
      const duree = Number(form.duree);
      if (!Number.isInteger(duree) || duree < 1 || duree > 90) {
        errs.duree = 'Indiquez une durée entière entre 1 et 90 jours.';
      }
    }

    if (!form.genre) errs.genre = 'Champ requis.';
    if (!form.marque.trim()) errs.marque = 'Champ requis.';
    if (!form.modele.trim()) errs.modele = 'Champ requis.';
    if (!form.immat.trim()) errs.immat = 'Champ requis.';

    if (!form.puissance) {
      errs.puissance = 'Champ requis.';
    } else {
      const cv = Number(form.puissance);
      if (!Number.isInteger(cv) || cv < 1 || cv > 999) {
        errs.puissance = 'Indiquez un nombre entier de chevaux fiscaux.';
      }
    }

    if (!form.paysImmat.trim()) errs.paysImmat = 'Champ requis.';
    if (!form.usage) errs.usage = 'Champ requis.';
    if (!form.nom.trim()) errs.nom = 'Champ requis.';
    if (!form.prenom.trim()) errs.prenom = 'Champ requis.';

    if (!form.dateNaissance) {
      errs.dateNaissance = 'Champ requis.';
    } else {
      const naissance = new Date(form.dateNaissance);
      const majorite = new Date(naissance.getFullYear() + 18, naissance.getMonth(), naissance.getDate());
      if (Number.isNaN(naissance.getTime()) || majorite.getTime() > Date.now()) {
        errs.dateNaissance = 'Le conducteur doit être majeur.';
      }
    }

    if (!form.datePermis) {
      errs.datePermis = 'Champ requis.';
    } else {
      const permis = new Date(form.datePermis);
      if (Number.isNaN(permis.getTime()) || permis.getTime() > Date.now()) {
        errs.datePermis = 'Cette date ne peut pas être dans le futur.';
      } else if (form.dateNaissance && permis.getTime() <= new Date(form.dateNaissance).getTime()) {
        errs.datePermis = 'Date incohérente avec la date de naissance.';
      }
    }

    if (!form.numPermis.trim()) errs.numPermis = 'Champ requis.';
    if (!form.paysResidence.trim()) errs.paysResidence = 'Champ requis.';
    if (!form.adresse.trim()) errs.adresse = 'Champ requis.';
    if (!form.codePostal.trim()) {
      errs.codePostal = 'Champ requis.';
    } else if (!/^\d{5}$/.test(form.codePostal)) {
      errs.codePostal = 'Code postal invalide : 5 chiffres.';
    }
    if (!form.ville.trim()) errs.ville = 'Champ requis.';
    if (!form.condamnation) errs.condamnation = 'Répondez à cette question.';
    if (!form.email.trim()) {
      errs.email = 'Champ requis.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Adresse email invalide.';
    }
    if (!form.telephone) {
      errs.telephone = 'Champ requis.';
    } else if (!/^0[1-9]\d{8}$/.test(form.telephone)) {
      errs.telephone = 'Numéro invalide : 10 chiffres commençant par 0, ex. 0612345678.';
    }
    if (!form.consentement) errs.consentement = 'Votre accord est requis.';
    return errs;
  }

  /* Deplace la piste vers la scene i (ou fait defiler en mode simple). */
  const goToScene = useCallback((cible) => {
    const i = clamp(cible, 0, LAST);
    setScene(i);
    if (modeRef.current === 'slider') {
      const target = -i * widthRef.current;
      if (reduce) {
        x.set(target);
      } else {
        /* Pendant le glissement + l'animation de hauteur, on masque le
           debordement (une scene plus haute qui entre ne doit pas depasser).
           Rendu au repos ensuite (onAnimationComplete + filet de securite). */
        setHidingOverflow(true);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => setHidingOverflow(false), 480);
        animate(x, target, { type: 'spring', stiffness: 260, damping: 34, restDelta: 0.5 });
      }
      return;
    }
    sceneEls.current[i]?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
  }, [reduce, x]);

  /* Bouton "Continuer" : ne valide que les champs de la scene courante, affiche
     les erreurs sous les champs, n'avance que si la scene est complete.
     Volontairement PAS memoise : la fonction doit relire a chaque rendu l'etat
     courant du formulaire (pays, form) via validate(). Une version useCallback
     figerait la cloture sur l'etat initial vide et rejetterait des champs
     pourtant remplis. */
  const handleContinue = (i) => {
    const allErrs = validate();
    const keys = STEP_KEYS[i];
    const stepErrs = {};
    keys.forEach((k) => { if (allErrs[k]) stepErrs[k] = allErrs[k]; });
    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((k) => { delete next[k]; });
      return { ...next, ...stepErrs };
    });
    if (Object.keys(stepErrs).length > 0) {
      scrollToFirstError();
      return false;
    }
    goToScene(i + 1);
    return true;
  };

  /* ── Glissement au doigt (mode slider) ────────────────────────────────────
     Le drag de Framer demande domMax ; le site est en LazyMotion domAnimation
     (bundle allege). Le geste est donc capte en pointer events natifs et ecrit
     dans la MEME MotionValue. Un geste parti d'un champ n'est jamais capte :
     le clavier, la selection de texte et les pickers restent normaux. */
  const dragRef = useRef(null);

  const onPointerDown = (e) => {
    if (modeRef.current !== 'slider' || status === 'envoi') return;
    if (e.target.closest('input, select, textarea, button, a, label')) return;
    dragRef.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, base: x.get(), actif: false };
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.actif) {
      if (Math.abs(dx) < 12) return;
      if (Math.abs(dx) <= Math.abs(dy)) { dragRef.current = null; return; }
      d.actif = true;
      stageRef.current?.setPointerCapture?.(e.pointerId);
    }
    const w = widthRef.current || 1;
    const min = -LAST * w;
    let next = d.base + dx;
    /* resistance aux deux bouts : la piste se tend, elle ne casse pas */
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
    const seuil = Math.min(90, (widthRef.current || 320) * 0.18);
    const i = sceneRef.current;
    if (dx < -seuil && i < LAST) {
      if (!handleContinue(i)) goToScene(i);
      return;
    }
    if (dx > seuil && i > 0) {
      setErrors((errs) => errs);
      goToScene(i - 1);
      return;
    }
    goToScene(i);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'envoi') return;
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      /* Ramene vers la premiere scene contenant une erreur, puis vers le champ */
      const firstBad = STEP_KEYS.findIndex((keys) => keys.some((k) => errs[k]));
      if (firstBad >= 0) goToScene(firstBad);
      scrollToFirstError();
      return;
    }
    setErrors({});
    if (paysRef.current) paysRef.current.value = pays.join(', ');
    setStatus('envoi');
    try {
      const formData = new FormData(e.target);
      /* Nettoie les espaces parasites avant envoi */
      for (const [key, value] of [...formData.entries()]) {
        if (typeof value === 'string') formData.set(key, value.trim());
      }
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setStatus('succes');
        trackEvent('generate_lead', { form_type: 'international' });
        /* Envoi reussi seulement : data.success vaut true. Aucun champ du
           formulaire ne part avec l'evenement (ni pays, ni identite). */
        trackEvent('contact_envoi', { "formulaire": 'international', "page": pagePath() });
      } else setStatus('erreur');
    } catch {
      setStatus('erreur');
    }
  }

  if (status === 'succes') {
    return <Remerciement pays={pays} />;
  }

  const recapDestination = pays.length ? pays.join(', ') : 'À compléter';
  const recapDates = form.dateEffet
    ? `${formatEffet(form.dateEffet)}${form.duree ? ` · ${form.duree} j` : ''}`
    : 'À compléter';
  const recapVehicule = [form.marque.trim(), form.modele.trim()].filter(Boolean).join(' ')
    || (form.genre || 'À compléter');

  const enExperience = mode !== 'simple';
  /* Les scenes hors champ ne doivent etre ni tabulables ni lues : inert les
     neutralise sans les retirer du DOM (le texte reste dans le prerendu). */
  const sceneInerte = (i) => enExperience && i !== scene;

  /* Navigation d'une scene (mode slider uniquement). */
  const nav = (i) => (
    <div className="ix-nav">
      {i > 0 ? (
        <button type="button" className="ix-back" onClick={() => { setErrors((errs) => errs); goToScene(i - 1); }}>
          <ArrowLeft size={15} aria-hidden="true" />
          Retour
        </button>
      ) : <span />}
      <button type="button" className="btn-gold ix-next" onClick={() => handleContinue(i)}>
        Continuer
        <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div
      className={`ix-exp ix-mode-${mode}`}
      style={{ '--ix-n': N_SCENES }}
    >
      {/* Fond uni du theme : aucun decor ne passe derriere les champs. Le globe
          signature vit desormais uniquement dans le hero. */}
      <div className="ix-inner">
        {/* En tete du devis */}
        <header className="ix-head">
          <p className="ix-eyebrow">
            <Globe2 size={14} strokeWidth={2} aria-hidden="true" />
            DEVIS PERSONNALISÉ
          </p>
          <h2 className="ix-title">Demandez votre devis en 4 étapes</h2>
          <p className="ix-sub">
            Un parcours court et guidé, une carte après l&apos;autre. Notre équipe
            vous répond en 4h en journée, 8h la nuit.
          </p>
          <p className="ix-orias">
            <ShieldCheck size={15} strokeWidth={1.75} aria-hidden="true" />
            Evidence Assurances, courtier immatriculé à l&apos;ORIAS sous le n&deg; 20005719.
          </p>
        </header>

        {/* Fil de progression : une etoile par scene, elles s'allument au fur
            et a mesure. Masque en mode simple (tout est visible). */}
        <div className="ix-thread">
          <div className="ix-constellation" aria-hidden="true">
            {SCENES.map((s, i) => (
              <span
                key={s.key}
                className="ix-cs"
                style={{
                  opacity: i === scene ? 1 : i < scene ? 0.55 : 0.18,
                  transform: i === scene ? 'scale(1.7)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <p className="ix-step-label" aria-hidden="true">
            Étape {scene + 1} sur {N_SCENES} : {SCENES[scene].title}
          </p>
          <button
            type="button"
            className="ix-switch"
            onClick={() => setSimpleForce((v) => !v)}
          >
            {mode === 'simple' && !reduce && enhanced ? 'Revenir au parcours guidé' : 'Passer à la version simple'}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          Étape {scene + 1} sur {N_SCENES} : {SCENES[scene].title}
        </p>

        <m.form
          ref={stageRef}
          className="ix-stage"
          onSubmit={handleSubmit}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          noValidate
          style={{
            height: stageHmv,
            overflowY: (mode === 'slider' && hidingOverflow) ? 'hidden' : undefined,
          }}
        >
          <input type="hidden" name="access_key" value="7a4b9f4a-f77e-4f9b-8a16-7635bff791ed" />
          <input type="hidden" name="subject" value="Demande de devis international AssuTempo" />
          <input type="hidden" name="from_name" value="Formulaire international AssuTempo" />
          <input type="hidden" name="Pays de destination" ref={paysRef} />
          <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

          <m.div className="ix-track" style={{ x }}>

            {/* ── 01 Votre trajet ─────────────────────────────────────── */}
            <section
              className="ix-scene"
              data-step="0"
              ref={(el) => { sceneEls.current[0] = el; }}
              inert={sceneInerte(0) || undefined}
            >
              <div className="ix-scene-inner">
                <SceneHead num="01" Icon={MapPin} title="Votre trajet" />

                <Field label="Pays de destination *" error={errors.pays}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    {PAYS.map(({ nom, flag }) => {
                      const checked = pays.includes(nom);
                      return (
                        <button
                          key={nom}
                          type="button"
                          onClick={() => togglePays(nom)}
                          aria-pressed={checked}
                          className="ix-chip"
                          style={{
                            borderColor: checked ? 'var(--gold)' : 'rgba(255,255,255,0.14)',
                            background: checked ? 'var(--gold-glow)' : 'rgba(255,255,255,0.03)',
                            color: checked ? 'var(--text)' : 'var(--text-muted)',
                            fontWeight: checked ? 600 : 400,
                          }}
                        >
                          {flag} {nom}
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <div className="ix-row">
                  <Field
                    label="Date et heure d'effet souhaitées *"
                    error={errors.dateEffet}
                    hint="Votre couverture démarre à cette date, utile pour un passage de douane."
                  >
                    <input
                      type="datetime-local"
                      name="Date et heure d'effet"
                      value={form.dateEffet}
                      min={dateBounds.minEffet || undefined}
                      onChange={set('dateEffet')}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      required
                      style={{ ...inputBase, colorScheme: 'dark' }}
                    />
                  </Field>
                  <Field label="Durée souhaitée (jours) *" error={errors.duree}>
                    <input
                      type="number"
                      name="Durée (jours)"
                      min="1"
                      max="90"
                      step="1"
                      inputMode="numeric"
                      placeholder="Ex. : 7"
                      value={form.duree}
                      onChange={set('duree')}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      required
                      style={inputBase}
                    />
                  </Field>
                </div>

                {mode === 'slider' ? nav(0) : null}
              </div>
            </section>

            {/* ── 02 Votre véhicule ───────────────────────────────────── */}
            <section
              className="ix-scene"
              data-step="1"
              ref={(el) => { sceneEls.current[1] = el; }}
              inert={sceneInerte(1) || undefined}
            >
              <div className="ix-scene-inner">
                <SceneHead num="02" Icon={Car} title="Votre véhicule" />

                <div className="ix-row">
                  <Field label="Genre du véhicule *" error={errors.genre}>
                    <select
                      name="Genre du véhicule"
                      value={form.genre}
                      onChange={set('genre')}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      style={{ ...inputBase, appearance: 'none', cursor: 'pointer', color: form.genre ? 'var(--text)' : 'var(--text-muted)' }}
                    >
                      <option value="" disabled>Sélectionnez...</option>
                      <option value="Véhicule particulier" style={{ background: '#0C0A08' }}>Véhicule particulier</option>
                      <option value="Poids lourd" style={{ background: '#0C0A08' }}>Poids lourd</option>
                    </select>
                  </Field>
                  <Field label="Usage du véhicule *" error={errors.usage}>
                    <select
                      name="Usage du véhicule"
                      value={form.usage}
                      onChange={set('usage')}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      style={{ ...inputBase, appearance: 'none', cursor: 'pointer', color: form.usage ? 'var(--text)' : 'var(--text-muted)' }}
                    >
                      <option value="" disabled>Sélectionnez...</option>
                      <option value="Privé et professionnel occasionnel" style={{ background: '#0C0A08' }}>Privé et professionnel occasionnel</option>
                      <option value="Import-export" style={{ background: '#0C0A08' }}>Import-export</option>
                    </select>
                  </Field>
                </div>

                <div className="ix-row">
                  <Field label="Marque *" error={errors.marque}>
                    <input type="text" name="Marque" placeholder="Ex. : Renault" value={form.marque} onChange={set('marque')} onFocus={onFocus} onBlur={onBlur} maxLength={60} required style={inputBase} />
                  </Field>
                  <Field label="Modèle *" error={errors.modele}>
                    <input type="text" name="Modèle" placeholder="Ex. : Clio" value={form.modele} onChange={set('modele')} onFocus={onFocus} onBlur={onBlur} maxLength={60} required style={inputBase} />
                  </Field>
                </div>

                <div className="ix-row">
                  <Field label="Immatriculation *" error={errors.immat}>
                    <input type="text" name="Immatriculation" placeholder="AB-123-CD" value={form.immat} onChange={setImmat} onFocus={onFocus} onBlur={onBlur} maxLength={15} required style={{ ...inputBase, textTransform: 'uppercase' }} />
                  </Field>
                  <Field label="Puissance fiscale (CV) *" error={errors.puissance}>
                    <input type="number" name="Puissance fiscale (CV)" placeholder="Ex. : 6" min="1" max="999" step="1" inputMode="numeric" value={form.puissance} onChange={set('puissance')} onFocus={onFocus} onBlur={onBlur} required style={inputBase} />
                  </Field>
                </div>

                <Field label="Pays d'immatriculation *" error={errors.paysImmat}>
                  <input type="text" name="Pays d'immatriculation" value={form.paysImmat} onChange={set('paysImmat')} onFocus={onFocus} onBlur={onBlur} maxLength={60} required style={inputBase} />
                </Field>

                {mode === 'slider' ? nav(1) : null}
              </div>
            </section>

            {/* ── 03 Le conducteur ────────────────────────────────────── */}
            <section
              className="ix-scene"
              data-step="2"
              ref={(el) => { sceneEls.current[2] = el; }}
              inert={sceneInerte(2) || undefined}
            >
              <div className="ix-scene-inner">
                <SceneHead num="03" Icon={User} title="Le conducteur" />

                <div className="ix-row">
                  <Field label="Nom *" error={errors.nom}>
                    <input type="text" name="Nom" value={form.nom} onChange={set('nom')} onFocus={onFocus} onBlur={onBlur} autoComplete="family-name" maxLength={80} required style={inputBase} />
                  </Field>
                  <Field label="Prénom *" error={errors.prenom}>
                    <input type="text" name="Prénom" value={form.prenom} onChange={set('prenom')} onFocus={onFocus} onBlur={onBlur} autoComplete="given-name" maxLength={80} required style={inputBase} />
                  </Field>
                </div>

                <div className="ix-row">
                  <Field label="Date de naissance *" error={errors.dateNaissance}>
                    <input type="date" name="Date de naissance" value={form.dateNaissance} max={dateBounds.maxNaissance || undefined} onChange={set('dateNaissance')} onFocus={onFocus} onBlur={onBlur} autoComplete="bday" required style={{ ...inputBase, colorScheme: 'dark' }} />
                  </Field>
                  <Field label="Date d'obtention du permis *" error={errors.datePermis}>
                    <input type="date" name="Date d'obtention du permis" value={form.datePermis} max={dateBounds.maxPermis || undefined} onChange={set('datePermis')} onFocus={onFocus} onBlur={onBlur} required style={{ ...inputBase, colorScheme: 'dark' }} />
                  </Field>
                </div>

                <div className="ix-row">
                  <Field label="Numéro du permis *" error={errors.numPermis}>
                    <input type="text" name="Numéro du permis" value={form.numPermis} onChange={set('numPermis')} onFocus={onFocus} onBlur={onBlur} maxLength={30} required style={inputBase} />
                  </Field>
                  <Field label="Pays de résidence *" error={errors.paysResidence}>
                    <input type="text" name="Pays de résidence" value={form.paysResidence} onChange={set('paysResidence')} onFocus={onFocus} onBlur={onBlur} maxLength={60} required style={inputBase} />
                  </Field>
                </div>

                <Field
                  label="Adresse de résidence (rue et numéro) *"
                  error={errors.adresse}
                  hint="Nécessaire à l'assureur pour établir le contrat, jamais utilisée à des fins commerciales."
                >
                  <input type="text" name="Adresse (rue et numéro)" placeholder="12 rue des Lilas" value={form.adresse} onChange={set('adresse')} onFocus={onFocus} onBlur={onBlur} autoComplete="street-address" maxLength={120} required style={inputBase} />
                </Field>

                <div className="ix-row ix-row-13">
                  <Field label="Code postal *" error={errors.codePostal}>
                    <input type="text" name="Code postal" placeholder="75011" value={form.codePostal} onChange={setCodePostal} onFocus={onFocus} onBlur={onBlur} autoComplete="postal-code" inputMode="numeric" maxLength={5} required style={inputBase} />
                  </Field>
                  <Field
                    label="Ville de résidence *"
                    error={errors.ville}
                    hint="La souscription n'est pas possible si le conducteur réside en Corse, à Monaco ou en France d'Outre-mer."
                  >
                    <input type="text" name="Ville de résidence" value={form.ville} onChange={set('ville')} onFocus={onFocus} onBlur={onBlur} autoComplete="address-level2" maxLength={80} required style={inputBase} />
                  </Field>
                </div>

                <Field
                  label="Avez-vous fait l'objet d'une condamnation pour délit de fuite, d'une suspension ou d'une annulation de permis au cours des 24 derniers mois ? *"
                  error={errors.condamnation}
                  hint="Question exigée par l'assureur : une réponse Oui n'entraîne pas de refus automatique, un conseiller étudie chaque dossier."
                >
                  <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
                    {['Oui', 'Non'].map((opt) => (
                      <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="Condamnation ou suspension de permis (24 mois)"
                          value={opt}
                          checked={form.condamnation === opt}
                          onChange={() => {
                            setForm((f) => ({ ...f, condamnation: opt }));
                            setErrors((errs) => (errs.condamnation ? { ...errs, condamnation: undefined } : errs));
                          }}
                          style={{ accentColor: 'var(--gold)', width: 16, height: 16, cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: 15, color: 'var(--text-muted)' }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </Field>

                {mode === 'slider' ? nav(2) : null}
              </div>
            </section>

            {/* ── 04 Vos coordonnées ──────────────────────────────────── */}
            <section
              className="ix-scene"
              data-step="3"
              ref={(el) => { sceneEls.current[3] = el; }}
              inert={sceneInerte(3) || undefined}
            >
              <div className="ix-scene-inner">
                <SceneHead num="04" Icon={Mail} title="Vos coordonnées" />

                {/* Recapitulatif compact, modifiable par ancre vers l'etape concernee */}
                <div className="ix-recap">
                  <p className="ix-recap-title">Récapitulatif</p>
                  {[
                    { label: 'Destination', value: recapDestination, step: 0 },
                    { label: 'Dates', value: recapDates, step: 0 },
                    { label: 'Véhicule', value: recapVehicule, step: 1 },
                  ].map((r) => (
                    <div key={r.label} className="ix-recap-row">
                      <span className="ix-recap-label">{r.label}</span>
                      <span className="ix-recap-value">{r.value}</span>
                      <button type="button" onClick={() => goToScene(r.step)} className="ix-recap-edit">Modifier</button>
                    </div>
                  ))}
                </div>

                <div className="ix-row">
                  <Field label="Email *" error={errors.email}>
                    <input type="email" name="Email" placeholder="vous@exemple.fr" value={form.email} onChange={set('email')} onFocus={onFocus} onBlur={onBlur} autoComplete="email" maxLength={120} required style={inputBase} />
                  </Field>
                  <Field label="Téléphone *" error={errors.telephone}>
                    <input type="tel" name="Téléphone" placeholder="0612345678" value={form.telephone} onChange={setTelephone} onFocus={onFocus} onBlur={onBlur} autoComplete="tel-national" inputMode="numeric" maxLength={10} required style={inputBase} />
                  </Field>
                </div>

                <Field label="Message (facultatif)">
                  <textarea
                    name="Message"
                    placeholder="Une précision sur votre situation ? (facultatif)"
                    value={form.message}
                    onChange={set('message')}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    maxLength={2000}
                    rows={3}
                    style={{ ...inputBase, resize: 'vertical', minHeight: 84 }}
                  />
                </Field>

                {/* Consentement */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'flex-start' }}>
                    <input
                      type="checkbox"
                      name="Consentement"
                      checked={form.consentement}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setForm((f) => ({ ...f, consentement: checked }));
                        setErrors((errs) => (errs.consentement ? { ...errs, consentement: undefined } : errs));
                      }}
                      style={{ accentColor: 'var(--gold)', width: 16, height: 16, marginTop: 3, flexShrink: 0, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      J&apos;accepte que mes informations soient utilisées pour établir mon devis et être recontacté par AssuTempo.
                    </span>
                  </label>
                  {errors.consentement && (
                    <span className="field-error-msg" role="alert" style={{ fontSize: 12, color: '#e0a05c' }}>{errors.consentement}</span>
                  )}
                </div>

                {/* Erreur globale d'envoi */}
                <div aria-live="polite">
                  {status === 'erreur' && (
                    <p className="ix-send-error">
                      Une erreur est survenue. Réessayez ou appelez-nous au 09 74 19 78 20.
                    </p>
                  )}
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-subtle)', margin: 0, lineHeight: 1.5 }}>
                  Réponse en 4h en journée, 8h la nuit, sans engagement, aucun paiement demandé à cette étape.
                </p>

                <div className="ix-submit-row">
                  {mode === 'slider' ? (
                    <button type="button" className="ix-back" onClick={() => { setErrors((errs) => errs); goToScene(2); }}>
                      <ArrowLeft size={15} aria-hidden="true" />
                      Retour
                    </button>
                  ) : <span />}
                  <button
                    type="submit"
                    className="btn-gold ix-submit"
                    disabled={status === 'envoi'}
                    style={{ opacity: status === 'envoi' ? 0.7 : 1, cursor: status === 'envoi' ? 'not-allowed' : 'pointer' }}
                  >
                    {status === 'envoi' ? 'Envoi en cours...' : 'Recevoir mon devis'}
                    {status !== 'envoi' && <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />}
                  </button>
                </div>
              </div>
            </section>

          </m.div>
        </m.form>
      </div>

      <style>{IX_CSS}</style>
    </div>
  );
}

/* En tete numerote d'une scene (01 .. 04) avec pastille icone. */
function SceneHead({ num, title, Icon }) {
  return (
    <div className="ix-scene-head">
      <span className="ix-scene-icon">
        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div>
        <span className="ix-scene-num">{num} / 04</span>
        <h3 className="ix-scene-title">{title}</h3>
      </div>
    </div>
  );
}

const IX_CSS = `
  .ix-exp {
    position: relative;
    overflow: hidden;
    background: #0A0A0A;
    border-top: 1px solid var(--gold-border);
    border-bottom: 1px solid var(--gold-border);
    padding: 84px 0 96px;
  }

  /* ── Fond de l'ecran de remerciement (points d'ambiance uniquement) ── */
  .ix-sky { position: absolute; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .ix-globe-svg { width: 100%; height: auto; display: block; }
  .ix-globe-orbit {
    transform-box: fill-box;
    transform-origin: 120px 120px;
    animation: ix-orbit 34s linear infinite;
  }
  @keyframes ix-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .ix-dot { position: absolute; border-radius: 50%; background: #E8C97A; }

  .ix-inner { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; padding: 0 24px; }

  /* ── En tete ───────────────────────────────────────────────────────── */
  .ix-head { margin-bottom: 26px; }
  .ix-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--gold); margin: 0 0 14px;
  }
  .ix-title {
    font-size: clamp(1.75rem, 3.6vw, 2.4rem);
    font-weight: 700; letter-spacing: -0.025em; color: var(--text);
    margin: 0 0 14px; line-height: 1.12;
  }
  .ix-sub { font-size: 16px; color: var(--text-muted); line-height: 1.7; margin: 0 0 16px; max-width: 600px; }
  .ix-orias {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 13px; color: var(--text-subtle); line-height: 1.5; margin: 0;
  }
  .ix-orias svg { color: var(--gold); flex-shrink: 0; }

  /* ── Fil de progression ────────────────────────────────────────────── */
  .ix-thread { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
  .ix-constellation { display: flex; align-items: center; gap: 12px; height: 14px; }
  .ix-cs {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--gold-light); box-shadow: 0 0 7px rgba(232,201,122,0.6);
    transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
  }
  .ix-step-label {
    font-size: 12.5px; font-weight: 600; letter-spacing: 0.02em;
    color: var(--gold-light); margin: 0; font-variant-numeric: tabular-nums;
  }
  .ix-switch {
    margin-left: auto; background: none; border: none; font-family: inherit;
    font-size: 12px; color: var(--text-subtle); text-decoration: underline;
    text-underline-offset: 3px; cursor: pointer; padding: 4px 2px;
  }
  .ix-switch:hover { color: var(--gold-light); }

  /* ── La piste ──────────────────────────────────────────────────────── */
  .ix-stage { position: relative; }
  .ix-track { position: relative; }
  .ix-scene { position: relative; scroll-margin-top: 96px; }
  .ix-scene-inner { display: flex; flex-direction: column; gap: 18px; width: 100%; }

  /* En tete de scene */
  .ix-scene-head { display: flex; align-items: center; gap: 14px; margin-bottom: 4px; }
  .ix-scene-icon {
    flex-shrink: 0; width: 44px; height: 44px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    color: var(--gold-light);
    background: linear-gradient(180deg, rgba(232,201,122,0.16), rgba(201,168,76,0.04));
    border: 1px solid var(--gold-border);
  }
  .ix-scene-num {
    display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.16em;
    color: var(--gold); font-variant-numeric: tabular-nums; margin-bottom: 3px;
  }
  .ix-scene-title { font-size: clamp(1.2rem, 2.4vw, 1.45rem); font-weight: 700; letter-spacing: -0.02em; color: var(--text); margin: 0; line-height: 1.15; }

  .ix-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .ix-row-13 { grid-template-columns: 1fr 2fr; }

  .ix-chip {
    padding: 8px 14px; border-radius: 999px; border: 1px solid;
    cursor: pointer; font-size: 13px; font-family: inherit;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }

  /* Recapitulatif */
  .ix-recap {
    display: flex; flex-direction: column; gap: 10px;
    padding: 16px 18px; background: rgba(255,255,255,0.03);
    border: 1px solid var(--glass-border); border-radius: 13px;
  }
  .ix-recap-title { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); margin: 0; }
  .ix-recap-row { display: flex; align-items: baseline; gap: 10px; justify-content: space-between; }
  .ix-recap-label { font-size: 13px; color: var(--text-subtle); flex-shrink: 0; min-width: 92px; }
  .ix-recap-value { font-size: 13.5px; color: var(--text); text-align: right; flex: 1; line-height: 1.5; }
  .ix-recap-edit { background: none; border: none; padding: 0; cursor: pointer; color: var(--gold); font-size: 12.5px; font-family: inherit; flex-shrink: 0; }

  .ix-send-error {
    font-size: 14px; color: #e0a05c; background: rgba(224,160,92,0.08);
    border: 1px solid rgba(224,160,92,0.25); border-radius: 8px; padding: 12px 16px; margin: 0;
  }

  /* Navigation de scene */
  .ix-nav, .ix-submit-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 6px; }
  .ix-next { display: inline-flex; align-items: center; gap: 8px; padding: 13px 26px; font-size: 15px; }
  .ix-submit { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; font-size: 15px; }
  .ix-back {
    display: inline-flex; align-items: center; gap: 6px; background: none; border: none;
    font-family: inherit; font-size: 14px; color: var(--text-muted); cursor: pointer; padding: 8px 4px;
  }
  .ix-back:hover { color: var(--gold-light); }

  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
  }

  /* ── Mode simple : vertical empile (SSR, sans JS, reduced-motion) ───── */
  .ix-mode-simple .ix-track { transform: none !important; display: flex; flex-direction: column; gap: 20px; }
  .ix-mode-simple .ix-scene {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--glass-border);
    border-radius: 18px; padding: 26px 24px;
  }
  .ix-mode-simple .ix-thread .ix-constellation { display: none; }

  /* ── Mode slider : cartes horizontales ─────────────────────────────── */
  .ix-mode-slider .ix-stage {
    overflow-x: clip; overflow-y: visible; touch-action: pan-y;
    border: 1px solid var(--glass-border); border-radius: 20px;
    background: rgba(255,255,255,0.02);
  }
  .ix-mode-slider .ix-track { display: flex; align-items: flex-start; width: calc(var(--ix-n) * 100%); }
  /* Chaque scene epouse la hauteur de SON contenu (align-self: flex-start =
     jamais etiree sur la scene la plus haute), contenu aligne en haut, pas de
     hauteur fixe. La hauteur de la carte est ensuite animee vers celle de la
     scene active (JS). Le padding (32/20) absorbe les focus rings, donc jamais
     de scroll interne ni de ring coupe. */
  .ix-mode-slider .ix-scene {
    flex: 0 0 calc(100% / var(--ix-n));
    align-self: flex-start;
    padding: 32px;
  }
  .ix-mode-slider .ix-scene-inner { width: 100%; }

  @media (max-width: 640px) {
    .ix-row, .ix-row-13 { grid-template-columns: 1fr !important; }
    .ix-mode-slider .ix-scene { padding: 20px; }
    .ix-mode-simple .ix-scene { padding: 22px 18px; }
    .ix-next, .ix-submit { flex: 1; justify-content: center; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ix-globe-orbit { animation: none; }
    .ix-cs { transition: none; }
  }

  /* ── Ecran de remerciement ─────────────────────────────────────────── */
  .ix-reward { padding: 120px 0 120px; }
  .ix-reward-inner { position: relative; z-index: 1; max-width: 660px; margin: 0 auto; padding: 0 24px; text-align: center; }
  .ix-reward-globe { position: relative; width: clamp(200px, 44vw, 280px); margin: 0 auto 30px; }
  .ix-reward-globe .ix-globe-svg { opacity: 0.95; }
  .ix-reward-check {
    position: absolute; top: 50%; left: 50%;
    width: 62px; height: 62px; margin: -31px 0 0 -31px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; color: #0A0A0A;
    background: linear-gradient(180deg, #E8C97A, #C9A84C);
    box-shadow: 0 8px 30px rgba(201,168,76,0.5);
  }
  .ix-pulse {
    position: absolute; top: 50%; left: 50%; width: 62px; height: 62px;
    margin: -31px 0 0 -31px; border-radius: 50%;
    border: 1px solid var(--gold-light); opacity: 0;
  }
  .ix-pulse-run { animation: ix-pulse 2.6s var(--ease-out) 0.3s 2; }
  .ix-pulse-2.ix-pulse-run { animation-delay: 0.9s; }
  @keyframes ix-pulse {
    0% { opacity: 0.6; transform: scale(0.6); }
    70% { opacity: 0; transform: scale(3.6); }
    100% { opacity: 0; transform: scale(3.6); }
  }
  .ix-reward-eyebrow {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 11.5px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--gold); margin: 0 0 12px;
  }
  .ix-reward-title { font-size: clamp(1.6rem, 4vw, 2.2rem); font-weight: 700; letter-spacing: -0.03em; color: var(--text); margin: 0 0 14px; }
  .ix-reward-text { font-size: 16px; color: var(--text-muted); line-height: 1.7; margin: 0 auto 26px; max-width: 500px; }
  .ix-delai {
    display: flex; align-items: flex-start; gap: 14px; text-align: left;
    max-width: 520px; margin: 0 auto 26px; padding: 20px 22px;
    background: linear-gradient(180deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 100%);
    border: 1px solid var(--gold-strong); border-radius: 16px;
  }
  .ix-delai svg { color: var(--gold-light); flex-shrink: 0; margin-top: 2px; }
  .ix-delai-big { font-size: 16.5px; color: var(--text); line-height: 1.5; margin: 0 0 6px; }
  .ix-delai-big strong { color: var(--gold-light); font-weight: 700; }
  .ix-delai-sub { font-size: 13.5px; color: var(--text-muted); line-height: 1.6; margin: 0; }
  .ix-reward-band { list-style: none; margin: 0 auto 28px; padding: 0; max-width: 520px; text-align: left; }
  .ix-reward-band li { display: flex; align-items: flex-start; gap: 11px; margin-bottom: 12px; font-size: 14px; color: var(--text-muted); line-height: 1.55; }
  .ix-reward-band li svg { flex-shrink: 0; margin-top: 2px; }
  .ix-reward-links { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
  .ix-reward-link {
    display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px;
    background: var(--gold-glow); border: 1px solid var(--gold-border); border-radius: 10px;
    font-size: 13.5px; font-weight: 500; color: var(--gold-light); text-decoration: none;
    transition: border-color 0.2s var(--ease-out), transform 0.2s var(--ease-out);
  }
  .ix-reward-link:hover { border-color: var(--gold-strong); transform: translateY(-1px); }

  @media (prefers-reduced-motion: reduce) {
    .ix-pulse-run { animation: none; }
  }
`;

function AssuranceInternationale() {
  const [pillsRef, pillsInView] = useScrollReveal();
  const [stepsRef, stepsInView] = useScrollReveal();
  const [searchParams] = useSearchParams();
  const reduce = useReducedMotion();
  const formSectionRef = useRef(null);

  /* Présélection via ?pays={slug} depuis la carte Europe */
  const slugParam = searchParams.get('pays');
  const paysFromUrl = PAYS.find((p) => p.slug === slugParam) ?? null;

  useEffect(() => {
    if (!paysFromUrl) return undefined;
    const t = setTimeout(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 300);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet>
        <title>Assurance Temporaire Maroc, Turquie, Tunisie | AssuTempo</title>
        <meta name="description" content="Assurance auto temporaire pour le Maroc, la Turquie, la Tunisie, l'Albanie et plus. Devis personnalisé en 4h en journée, 8h la nuit. Voitures et poids lourds." />
        <link rel="canonical" href="https://assutempo.fr/assurance-internationale" />
        <meta property="og:title" content="Assurance Temporaire Maroc, Turquie, Tunisie | AssuTempo" />
        <meta property="og:description" content="Assurance auto temporaire pour le Maroc, la Turquie, la Tunisie, l'Albanie et plus. Devis personnalisé rapide, accompagnement dédié." />
        <meta property="og:url" content="https://assutempo.fr/assurance-internationale" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AssuTempo" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Assurance Temporaire Maroc, Turquie, Tunisie | AssuTempo" />
        <meta name="twitter:description" content="Assurance auto temporaire pour le Maroc, la Turquie, la Tunisie, l'Albanie et plus. Devis personnalisé rapide, accompagnement dédié." />
      </Helmet>

      {/* Hero */}
      <section style={{
        paddingTop: 160,
        paddingBottom: 104,
        textAlign: 'center',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <GlobeInternational />
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)',
        }} />
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', zIndex: 2, padding: '0 24px' }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            COUVERTURE INTERNATIONALE
          </p>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 60px)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: 20,
            letterSpacing: '-0.03em',
          }}>
            Destinations sur demande
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: 580,
            margin: '0 auto',
            lineHeight: 1.75,
          }}>
            Au-delà de la zone carte verte européenne, notre équipe établit votre devis sur mesure
            et vous accompagne personnellement jusqu&apos;à la souscription. Vous recevez votre
            proposition en 4h en journée, 8h la nuit, prête à souscrire. Offre réservée aux voitures et aux poids lourds.
          </p>

          {/* Liste des pays : dans le hero pour que le globe l'englobe aussi. */}
          <div
            ref={pillsRef}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              justifyContent: 'center',
              maxWidth: 640,
              margin: '36px auto 0',
            }}
          >
            {PAYS.map((p, i) => (
              <m.span
                key={p.nom}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={pillsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: 'var(--glass)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 999,
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.flag} {p.nom}
              </m.span>
            ))}
          </div>
        </m.div>
      </section>

      {/* Comment ça marche : compact, pour atteindre vite la zone de devis. */}
      <section style={{ background: 'var(--bg-2)', padding: '40px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: 30 }}
          >
            <h2 style={{
              fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: 0,
            }}>
              Comment ça marche ?{' '}
              <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.7em' }}>
                Simple, rapide, personnalisé.
              </span>
            </h2>
          </m.div>

          <div ref={stepsRef} className="intl-steps" style={{ display: 'flex', alignItems: 'flex-start' }}>
            {STEPS.map((step, i) => (
              <m.div
                key={step.num}
                className="intl-step"
                initial={{ opacity: 0, y: 12 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px' }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.15em', marginBottom: 8 }}>
                  {step.num}
                </div>
                <p style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text)', margin: '0 0 5px', lineHeight: 1.35, maxWidth: 260 }}>
                  {step.title}
                </p>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.55, maxWidth: 240 }}>
                  {step.body}
                </p>
              </m.div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .intl-steps { flex-direction: column !important; align-items: center !important; }
            .intl-step { width: 100% !important; max-width: 340px !important; margin-bottom: 22px !important; padding: 0 8px !important; }
            .intl-step:last-child { margin-bottom: 0 !important; }
          }
        `}</style>
      </section>

      {/* Formulaire : l'experience de devis (globe + parcours horizontal) */}
      <section ref={formSectionRef} style={{ background: 'var(--bg)' }}>
        <DevisForm initialPays={paysFromUrl?.nom} />
      </section>

      <Footer />
    </>
  );
}

export default AssuranceInternationale;
