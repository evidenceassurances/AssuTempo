import { useState, useRef, useEffect, cloneElement, isValidElement } from 'react';
import { useSearchParams } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Footer from '../components/Footer';
import TempoDial from '../components/TempoDial';
import { fadeUp } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { trackEvent } from '../lib/analytics';

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
    body: 'Sous 12h, prête à souscrire, directement par email.',
  },
];

/* Les 4 scenes du formulaire scrollytelling : une seule idee par ecran. */
const SCENES = [
  { num: '01', title: 'Votre trajet' },
  { num: '02', title: 'Votre véhicule' },
  { num: '03', title: 'Le conducteur' },
  { num: '04', title: 'Vos coordonnées' },
];

/* Cle des erreurs rattachees a chaque scene : sert a la validation par etape
   (le bouton "Continuer" ne verifie que les champs de sa scene). */
const STEP_KEYS = [
  ['pays', 'dateEffet', 'duree'],
  ['genre', 'usage', 'marque', 'modele', 'immat', 'puissance', 'paysImmat'],
  ['nom', 'prenom', 'dateNaissance', 'datePermis', 'numPermis', 'paysResidence', 'adresse', 'codePostal', 'ville', 'condamnation'],
  ['email', 'telephone', 'consentement'],
];

const inputBase = {
  width: '100%',
  background: 'var(--bg-card)',
  border: '1px solid var(--glass-border)',
  borderRadius: 10,
  padding: '12px 16px',
  fontSize: 15,
  color: 'var(--text)',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const onFocus = (e) => {
  e.target.style.borderColor = 'var(--gold-border)';
  e.target.style.boxShadow = '0 0 0 3px var(--gold-glow)';
};
const onBlur = (e) => {
  e.target.style.borderColor = 'var(--glass-border)';
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
      {error && <span className="field-error-msg" role="alert" style={{ fontSize: 12, color: '#e05c5c' }}>{error}</span>}
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

/* En tete numerote d'une scene (01 .. 04). */
function SceneHeader({ num, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 22 }}>
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.14em',
        color: 'var(--gold)',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {num}
      </span>
      <h3 style={{
        fontSize: 'clamp(1.15rem, 2.4vw, 1.4rem)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color: 'var(--text)',
        margin: 0,
        lineHeight: 1.2,
      }}>
        {title}
      </h3>
    </div>
  );
}

const sceneCard = {
  background: 'var(--glass)',
  border: '1px solid var(--glass-border)',
  borderRadius: 20,
  padding: '32px 32px',
  scrollMarginTop: 150,
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
};

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

function DevisForm({ initialPays }) {
  const [form, setForm] = useState(EMPTY);
  const [pays, setPays] = useState(() => (initialPays ? [initialPays] : []));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [active, setActive] = useState(0);
  const paysRef = useRef(null);
  const sceneRefs = useRef([]);
  const reduce = useReducedMotion();

  /* Bornes des champs date, posees apres montage (le prerendu statique ne doit pas
     contenir de valeur dependante de l'horloge : risque de mismatch d'hydratation) */
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

  /* Scroll spy : la scene qui traverse une fine bande au centre de l'ecran
     devient l'etape active (barre de progression). Transform/opacity seulement,
     rien qui provoque de reflow. */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const els = sceneRefs.current.filter(Boolean);
    if (els.length === 0) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute('data-step'));
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goToStep = (i) => {
    const el = sceneRefs.current[i];
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

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

  /* Immatriculation : forcee en majuscules dans la valeur envoyee, pas seulement a l'ecran */
  const setImmat = (e) => {
    const value = e.target.value.toUpperCase();
    setForm((f) => ({ ...f, immat: value }));
    setErrors((errs) => (errs.immat ? { ...errs, immat: undefined } : errs));
  };

  function togglePays(nom) {
    setPays((prev) =>
      prev.includes(nom) ? prev.filter((p) => p !== nom) : [...prev, nom]
    );
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

  /* Bouton "Continuer" : ne valide que les champs de la scene courante, affiche
     les erreurs sous les champs, et n'avance que si la scene est complete. */
  function handleContinue(i) {
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
      return;
    }
    goToStep(i + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      /* Ramene vers la premiere scene contenant une erreur, puis vers le champ */
      const firstBad = STEP_KEYS.findIndex((keys) => keys.some((k) => errs[k]));
      if (firstBad >= 0) goToStep(firstBad);
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
        trackEvent('generate_lead', { "form_type": 'international' });
      } else setStatus('erreur');
    } catch {
      setStatus('erreur');
    }
  }

  if (status === 'succes') {
    return (
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        role="status"
        aria-live="polite"
        style={{
          padding: '48px 32px',
          textAlign: 'center',
          background: 'var(--gold-glow)',
          border: '1px solid var(--gold-border)',
          borderRadius: 20,
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>&#10003;</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          Demande reçue.
        </h3>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
          Notre équipe vous envoie votre devis personnalisé sous 12h.
          Pensez à vérifier vos spams.
        </p>
      </m.div>
    );
  }

  /* Props de reveal d'une scene : transform + opacity, une seule fois. */
  const reveal = (reduce
    ? {}
    : {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      });

  const recapDestination = pays.length ? pays.join(', ') : 'À compléter';
  const recapDates = form.dateEffet
    ? `${formatEffet(form.dateEffet)}${form.duree ? ` · ${form.duree} j` : ''}`
    : 'À compléter';
  const recapVehicule = [form.marque.trim(), form.modele.trim()].filter(Boolean).join(' ')
    || (form.genre || 'À compléter');

  return (
    <>
      {/* Barre de progression sticky discrete : Etape X sur 4 + trait scaleX.
          Regle de Chanel : le titre de scene, redondant avec l'en tete affiche
          a l'ecran, a ete retire pour garder la barre sobre. */}
      <div className="intl-progress" aria-hidden="true">
        <div className="intl-progress-row">
          <span className="intl-progress-step">Étape {active + 1} sur 4</span>
        </div>
        <div className="intl-progress-track">
          <div
            className="intl-progress-fill"
            style={{ transform: `scaleX(${(active + 1) / SCENES.length})` }}
          />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        Étape {active + 1} sur 4 : {SCENES[active].title}
      </p>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input type="hidden" name="access_key" value="7a4b9f4a-f77e-4f9b-8a16-7635bff791ed" />
        <input type="hidden" name="subject" value="Demande de devis international AssuTempo" />
        <input type="hidden" name="from_name" value="Formulaire international AssuTempo" />
        <input type="hidden" name="Pays de destination" ref={paysRef} />
        <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

        {/* ── 01 Votre trajet ─────────────────────────────────────────────── */}
        <m.section
          {...reveal}
          data-step="0"
          ref={(el) => { sceneRefs.current[0] = el; }}
          className="intl-scene"
          style={sceneCard}
        >
          <SceneHeader num="01" title="Votre trajet" />

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
                    style={{
                      padding: '8px 14px',
                      borderRadius: 999,
                      border: `1px solid ${checked ? 'var(--gold)' : 'var(--glass-border)'}`,
                      background: checked ? 'var(--gold-glow)' : 'var(--glass)',
                      color: checked ? 'var(--text)' : 'var(--text-muted)',
                      fontWeight: checked ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                    }}
                  >
                    {flag} {nom}
                  </button>
                );
              })}
            </div>
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
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

          <div className="intl-scene-nav">
            <button type="button" className="btn-gold intl-next" onClick={() => handleContinue(0)}>
              Continuer
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </m.section>

        {/* ── 02 Votre véhicule ───────────────────────────────────────────── */}
        <m.section
          {...reveal}
          data-step="1"
          ref={(el) => { sceneRefs.current[1] = el; }}
          className="intl-scene"
          style={sceneCard}
        >
          <SceneHeader num="02" title="Votre véhicule" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
            <Field label="Marque *" error={errors.marque}>
              <input type="text" name="Marque" placeholder="Ex. : Renault" value={form.marque} onChange={set('marque')} onFocus={onFocus} onBlur={onBlur} maxLength={60} required style={inputBase} />
            </Field>
            <Field label="Modèle *" error={errors.modele}>
              <input type="text" name="Modèle" placeholder="Ex. : Clio" value={form.modele} onChange={set('modele')} onFocus={onFocus} onBlur={onBlur} maxLength={60} required style={inputBase} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
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

          <div className="intl-scene-nav">
            <button type="button" className="btn-gold intl-next" onClick={() => handleContinue(1)}>
              Continuer
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </m.section>

        {/* ── 03 Le conducteur ────────────────────────────────────────────── */}
        <m.section
          {...reveal}
          data-step="2"
          ref={(el) => { sceneRefs.current[2] = el; }}
          className="intl-scene"
          style={sceneCard}
        >
          <SceneHeader num="03" title="Le conducteur" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
            <Field label="Nom *" error={errors.nom}>
              <input type="text" name="Nom" value={form.nom} onChange={set('nom')} onFocus={onFocus} onBlur={onBlur} autoComplete="family-name" maxLength={80} required style={inputBase} />
            </Field>
            <Field label="Prénom *" error={errors.prenom}>
              <input type="text" name="Prénom" value={form.prenom} onChange={set('prenom')} onFocus={onFocus} onBlur={onBlur} autoComplete="given-name" maxLength={80} required style={inputBase} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
            <Field label="Date de naissance *" error={errors.dateNaissance}>
              <input type="date" name="Date de naissance" value={form.dateNaissance} max={dateBounds.maxNaissance || undefined} onChange={set('dateNaissance')} onFocus={onFocus} onBlur={onBlur} autoComplete="bday" required style={{ ...inputBase, colorScheme: 'dark' }} />
            </Field>
            <Field label="Date d'obtention du permis de conduire *" error={errors.datePermis}>
              <input type="date" name="Date d'obtention du permis" value={form.datePermis} max={dateBounds.maxPermis || undefined} onChange={set('datePermis')} onFocus={onFocus} onBlur={onBlur} required style={{ ...inputBase, colorScheme: 'dark' }} />
            </Field>
          </div>

          <Field label="Numéro du permis de conduire *" error={errors.numPermis}>
            <input type="text" name="Numéro du permis" value={form.numPermis} onChange={set('numPermis')} onFocus={onFocus} onBlur={onBlur} maxLength={30} required style={inputBase} />
          </Field>

          <Field label="Pays de résidence *" error={errors.paysResidence}>
            <input type="text" name="Pays de résidence" value={form.paysResidence} onChange={set('paysResidence')} onFocus={onFocus} onBlur={onBlur} maxLength={60} required style={inputBase} />
          </Field>

          {/* Adresse de residence (remplace le champ ville seul) */}
          <Field
            label="Adresse de résidence (rue et numéro) *"
            error={errors.adresse}
            hint="Nécessaire à l'assureur pour établir le contrat, jamais utilisée à des fins commerciales."
          >
            <input type="text" name="Adresse (rue et numéro)" placeholder="12 rue des Lilas" value={form.adresse} onChange={set('adresse')} onFocus={onFocus} onBlur={onBlur} autoComplete="street-address" maxLength={120} required style={inputBase} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }} className="intl-row">
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
            label="Avez-vous fait l'objet d'une condamnation pour délit de fuite, d'une suspension ou d'une annulation de permis de conduire au cours des 24 derniers mois ? *"
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

          <div className="intl-scene-nav">
            <button type="button" className="btn-gold intl-next" onClick={() => handleContinue(2)}>
              Continuer
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </m.section>

        {/* ── 04 Vos coordonnées ──────────────────────────────────────────── */}
        <m.section
          {...reveal}
          data-step="3"
          ref={(el) => { sceneRefs.current[3] = el; }}
          className="intl-scene"
          style={sceneCard}
        >
          <SceneHeader num="04" title="Vos coordonnées" />

          {/* Recapitulatif compact, modifiable par ancre vers l'etape concernee */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: '16px 18px',
            background: 'var(--bg-card)',
            border: '1px solid var(--glass-border)',
            borderRadius: 12,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', margin: 0 }}>
              Récapitulatif
            </p>
            {[
              { label: 'Destination', value: recapDestination, step: 0 },
              { label: 'Dates', value: recapDates, step: 0 },
              { label: 'Véhicule', value: recapVehicule, step: 1 },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'baseline', gap: 10, justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-subtle)', flexShrink: 0, minWidth: 92 }}>{row.label}</span>
                <span style={{ fontSize: 13.5, color: 'var(--text)', textAlign: 'right', flex: 1, lineHeight: 1.5 }}>{row.value}</span>
                <button
                  type="button"
                  onClick={() => goToStep(row.step)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--gold)', fontSize: 12.5, fontFamily: 'inherit', flexShrink: 0 }}
                >
                  Modifier
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
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
              rows={4}
              style={{ ...inputBase, resize: 'vertical', minHeight: 100 }}
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
              <span className="field-error-msg" role="alert" style={{ fontSize: 12, color: '#e05c5c' }}>{errors.consentement}</span>
            )}
            <span style={{ fontSize: 12, color: 'var(--text-subtle)', lineHeight: 1.5, marginLeft: 28 }}>
              Vos données sont utilisées uniquement pour établir votre devis.
            </span>
          </div>

          {/* Erreur globale d'envoi */}
          <div aria-live="polite">
            {status === 'erreur' && (
              <p style={{
                fontSize: 14,
                color: '#e05c5c',
                background: 'rgba(224,92,92,0.08)',
                border: '1px solid rgba(224,92,92,0.25)',
                borderRadius: 8,
                padding: '12px 16px',
                margin: 0,
              }}>
                Une erreur est survenue. Merci de réessayer dans un instant.
              </p>
            )}
          </div>

          {/* Rassurance juste avant l'envoi */}
          <p style={{ fontSize: 13, color: 'var(--text-subtle)', margin: 0, lineHeight: 1.5 }}>
            Réponse sous 12h, sans engagement, aucun paiement demandé à cette étape.
          </p>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="btn-gold"
              disabled={status === 'envoi'}
              style={{
                padding: '14px 28px',
                fontSize: 15,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                opacity: status === 'envoi' ? 0.7 : 1,
                cursor: status === 'envoi' ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => { if (status !== 'envoi') { e.currentTarget.style.boxShadow = '0 0 28px var(--gold-strong)'; e.currentTarget.style.transform = 'scale(1.02)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {status === 'envoi' ? 'Envoi en cours...' : 'Recevoir mon devis sous 12h'}
              {status !== 'envoi' && <ArrowRight size={16} strokeWidth={2} />}
            </button>
          </div>
        </m.section>

        <style>{`
          .intl-progress {
            position: sticky;
            top: 76px;
            z-index: 20;
            margin-bottom: 4px;
            padding: 12px 16px;
            background: rgba(10,10,10,0.97);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
          }
          .intl-progress-row {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
          }
          .intl-progress-step {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.06em;
            color: var(--gold);
            font-variant-numeric: tabular-nums;
          }
          .intl-progress-track {
            height: 3px;
            border-radius: 3px;
            background: var(--glass-border);
            overflow: hidden;
          }
          .intl-progress-fill {
            height: 100%;
            border-radius: 3px;
            background: linear-gradient(to right, var(--gold-deep), var(--gold-light));
            transform-origin: left;
            transition: transform 0.5s var(--ease-out);
          }
          .intl-scene-nav {
            display: flex;
            justify-content: flex-end;
            margin-top: 4px;
          }
          .intl-next {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            font-size: 15px;
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
          @media (max-width: 640px) {
            .intl-row { grid-template-columns: 1fr !important; }
            .intl-scene { padding: 24px 20px !important; }
            .intl-next { width: 100%; justify-content: center; }
          }
        `}</style>
      </form>
    </>
  );
}

function AssuranceInternationale() {
  const [pillsRef, pillsInView] = useScrollReveal();
  const [stepsRef, stepsInView] = useScrollReveal();
  const [introRef, introInView] = useScrollReveal();
  const [searchParams] = useSearchParams();
  const reduce = useReducedMotion();
  const formSectionRef = useRef(null);

  /* Présélection via ?pays={slug} depuis la carte Europe */
  const slugParam = searchParams.get('pays');
  const paysFromUrl = PAYS.find((p) => p.slug === slugParam) ?? null;

  useEffect(() => {
    if (!paysFromUrl) return;
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
        <meta name="description" content="Assurance auto temporaire pour le Maroc, la Turquie, la Tunisie, l'Albanie et plus. Devis personnalisé sous 12h, accompagnement dédié. Voitures et poids lourds." />
        <link rel="canonical" href="https://assutempo.fr/assurance-internationale" />
        <meta property="og:title" content="Assurance Temporaire Maroc, Turquie, Tunisie | AssuTempo" />
        <meta property="og:description" content="Assurance auto temporaire pour le Maroc, la Turquie, la Tunisie, l'Albanie et plus. Devis personnalisé sous 12h, accompagnement dédié." />
        <meta property="og:url" content="https://assutempo.fr/assurance-internationale" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AssuTempo" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Assurance Temporaire Maroc, Turquie, Tunisie | AssuTempo" />
        <meta name="twitter:description" content="Assurance auto temporaire pour le Maroc, la Turquie, la Tunisie, l'Albanie et plus. Devis personnalisé sous 12h, accompagnement dédié." />
      </Helmet>

      {/* Hero */}
      <section style={{
        paddingTop: 160,
        paddingBottom: 80,
        textAlign: 'center',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <TempoDial />
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
            proposition sous 12h, prête à souscrire. Offre réservée aux voitures et aux poids lourds.
          </p>
        </m.div>
      </section>

      {/* Pills */}
      <section style={{ background: 'var(--bg)', paddingBottom: 80 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 32px' }}>
          <div
            ref={pillsRef}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
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
        </div>
      </section>

      {/* Comment ça marche */}
      <section style={{ background: 'var(--bg-2)', padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 14px',
            }}>
              Comment ça marche ?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
              Simple, rapide, personnalisé.
            </p>
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
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.15em', marginBottom: 20 }}>
                  {step.num}
                </div>
                <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.4, maxWidth: 260 }}>
                  {step.title}
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.65, maxWidth: 240 }}>
                  {step.body}
                </p>
              </m.div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .intl-steps { flex-direction: column !important; align-items: center !important; }
            .intl-step { width: 100% !important; max-width: 340px !important; margin-bottom: 48px !important; padding: 0 8px !important; }
            .intl-step:last-child { margin-bottom: 0 !important; }
          }
        `}</style>
      </section>

      {/* Formulaire scrollytelling en 4 etapes */}
      <section ref={formSectionRef} style={{ background: 'var(--bg)', padding: '80px 0 100px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px' }}>
          <m.div
            ref={introRef}
            initial={{ opacity: 0, y: 20 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 36 }}
          >
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              DEVIS PERSONNALISÉ
            </p>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 16px',
              lineHeight: 1.15,
            }}>
              Demandez votre devis en 4 étapes
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: '0 0 18px', lineHeight: 1.7, maxWidth: 600 }}>
              Un parcours court et guidé. Notre équipe vous envoie votre proposition personnalisée sous 12h.
            </p>
            <p style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--text-subtle)',
              margin: 0,
              lineHeight: 1.5,
            }}>
              <ShieldCheck size={15} strokeWidth={1.75} style={{ color: 'var(--gold)', flexShrink: 0 }} aria-hidden />
              Evidence Assurances, courtier immatriculé à l&apos;ORIAS sous le n&deg; 20005719.
            </p>
          </m.div>

          <DevisForm initialPays={paysFromUrl?.nom} />
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AssuranceInternationale;
