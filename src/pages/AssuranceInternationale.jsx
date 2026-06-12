import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { m, useReducedMotion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import TempoDial from '../components/TempoDial';
import { fadeUp } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';

const PAYS = [
  { slug: 'albanie',           nom: 'Albanie',            flag: '🇦🇱' },
  { slug: 'azerbaidjan',       nom: 'Azerbaïdjan',        flag: '🇦🇿' },
  { slug: 'macedoine-du-nord', nom: 'Macédoine du Nord',  flag: '🇲🇰' },
  { slug: 'maroc',             nom: 'Maroc',              flag: '🇲🇦' },
  { slug: 'moldavie',          nom: 'Moldavie',           flag: '🇲🇩' },
  { slug: 'tunisie',           nom: 'Tunisie',            flag: '🇹🇳' },
  { slug: 'turquie',           nom: 'Turquie',            flag: '🇹🇷' },
];

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</label>
      )}
      {children}
      {hint && (
        <span style={{ fontSize: 12, color: 'var(--text-subtle)', lineHeight: 1.5 }}>{hint}</span>
      )}
      {error && <span style={{ fontSize: 12, color: '#e05c5c' }}>{error}</span>}
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        margin: 0,
        paddingBottom: 12,
        borderBottom: '1px solid var(--glass-border)',
      }}>
        {title}
      </p>
      {children}
    </div>
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
  const paysRef = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function togglePays(nom) {
    setPays((prev) =>
      prev.includes(nom) ? prev.filter((p) => p !== nom) : [...prev, nom]
    );
  }

  function validate() {
    const errs = {};
    if (pays.length === 0) errs.pays = 'Sélectionnez au moins un pays de destination.';
    if (!form.dateEffet) errs.dateEffet = 'Champ requis.';
    if (!form.duree) errs.duree = 'Champ requis.';
    if (!form.genre) errs.genre = 'Champ requis.';
    if (!form.marque.trim()) errs.marque = 'Champ requis.';
    if (!form.modele.trim()) errs.modele = 'Champ requis.';
    if (!form.immat.trim()) errs.immat = 'Champ requis.';
    if (!form.puissance) errs.puissance = 'Champ requis.';
    if (!form.usage) errs.usage = 'Champ requis.';
    if (!form.nom.trim()) errs.nom = 'Champ requis.';
    if (!form.prenom.trim()) errs.prenom = 'Champ requis.';
    if (!form.dateNaissance) errs.dateNaissance = 'Champ requis.';
    if (!form.datePermis) errs.datePermis = 'Champ requis.';
    if (!form.numPermis.trim()) errs.numPermis = 'Champ requis.';
    if (!form.ville.trim()) errs.ville = 'Champ requis.';
    if (!form.condamnation) errs.condamnation = 'Répondez à cette question.';
    if (!form.email.trim()) {
      errs.email = 'Champ requis.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Adresse email invalide.';
    }
    if (!form.telephone.trim()) errs.telephone = 'Champ requis.';
    if (!form.consentement) errs.consentement = 'Votre accord est requis.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    if (paysRef.current) paysRef.current.value = pays.join(', ');
    setStatus('envoi');
    try {
      const formData = new FormData(e.target);
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) setStatus('succes');
      else setStatus('erreur');
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

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <input type="hidden" name="access_key" value="7a4b9f4a-f77e-4f9b-8a16-7635bff791ed" />
      <input type="hidden" name="subject" value="Demande de devis international AssuTempo" />
      <input type="hidden" name="from_name" value="Formulaire international AssuTempo" />
      <input type="hidden" name="Pays de destination" ref={paysRef} />
      <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      {/* Destination et durée */}
      <FormSection title="Destination et durée">
        <Field label="Pays de destination *" error={errors.pays}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
            {PAYS.map(({ nom, flag }) => {
              const checked = pays.includes(nom);
              return (
                <button
                  key={nom}
                  type="button"
                  onClick={() => togglePays(nom)}
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
                    transition: 'all 0.2s',
                  }}
                >
                  {flag} {nom}
                </button>
              );
            })}
          </div>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
          <Field label="Date et heure d'effet souhaitées *" error={errors.dateEffet}>
            <input
              type="datetime-local"
              name="Date et heure d'effet"
              value={form.dateEffet}
              onChange={set('dateEffet')}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{ ...inputBase, colorScheme: 'dark' }}
            />
          </Field>
          <Field label="Durée souhaitée (jours) *" error={errors.duree}>
            <input
              type="number"
              name="Durée (jours)"
              min="1"
              max="90"
              placeholder="Ex. : 7"
              value={form.duree}
              onChange={set('duree')}
              onFocus={onFocus}
              onBlur={onBlur}
              style={inputBase}
            />
          </Field>
        </div>
      </FormSection>

      {/* Le véhicule */}
      <FormSection title="Le véhicule">
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
            <input type="text" name="Marque" placeholder="Ex. : Renault" value={form.marque} onChange={set('marque')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
          </Field>
          <Field label="Modèle *" error={errors.modele}>
            <input type="text" name="Modèle" placeholder="Ex. : Clio" value={form.modele} onChange={set('modele')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
          <Field label="Immatriculation *" error={errors.immat}>
            <input type="text" name="Immatriculation" placeholder="AB-123-CD" value={form.immat} onChange={set('immat')} onFocus={onFocus} onBlur={onBlur} style={{ ...inputBase, textTransform: 'uppercase' }} />
          </Field>
          <Field label="Puissance fiscale (CV) *" error={errors.puissance}>
            <input type="number" name="Puissance fiscale (CV)" placeholder="Ex. : 6" min="1" value={form.puissance} onChange={set('puissance')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
          </Field>
        </div>

        <Field label="Pays d'immatriculation *">
          <input type="text" name="Pays d'immatriculation" value={form.paysImmat} onChange={set('paysImmat')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
        </Field>
      </FormSection>

      {/* Le conducteur */}
      <FormSection title="Le conducteur">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
          <Field label="Nom *" error={errors.nom}>
            <input type="text" name="Nom" value={form.nom} onChange={set('nom')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
          </Field>
          <Field label="Prénom *" error={errors.prenom}>
            <input type="text" name="Prénom" value={form.prenom} onChange={set('prenom')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
          <Field label="Date de naissance *" error={errors.dateNaissance}>
            <input type="date" name="Date de naissance" value={form.dateNaissance} onChange={set('dateNaissance')} onFocus={onFocus} onBlur={onBlur} style={{ ...inputBase, colorScheme: 'dark' }} />
          </Field>
          <Field label="Date d'obtention du permis de conduire *" error={errors.datePermis}>
            <input type="date" name="Date d'obtention du permis" value={form.datePermis} onChange={set('datePermis')} onFocus={onFocus} onBlur={onBlur} style={{ ...inputBase, colorScheme: 'dark' }} />
          </Field>
        </div>

        <Field label="Numéro du permis de conduire *" error={errors.numPermis}>
          <input type="text" name="Numéro du permis" value={form.numPermis} onChange={set('numPermis')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
          <Field label="Pays de résidence *">
            <input type="text" name="Pays de résidence" value={form.paysResidence} onChange={set('paysResidence')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
          </Field>
          <Field
            label="Ville de résidence *"
            error={errors.ville}
            hint="La souscription n'est pas possible si le conducteur réside en Corse, à Monaco ou en France d'Outre-mer."
          >
            <input type="text" name="Ville de résidence" value={form.ville} onChange={set('ville')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
          </Field>
        </div>
      </FormSection>

      {/* Éligibilité */}
      <FormSection title="Éligibilité">
        <Field
          label="Avez-vous fait l'objet d'une condamnation pour délit de fuite, d'une suspension ou d'une annulation de permis de conduire au cours des 24 derniers mois ? *"
          error={errors.condamnation}
        >
          <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
            {['Oui', 'Non'].map((opt) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="Condamnation ou suspension de permis (24 mois)"
                  value={opt}
                  checked={form.condamnation === opt}
                  onChange={() => setForm((f) => ({ ...f, condamnation: opt }))}
                  style={{ accentColor: 'var(--gold)', width: 16, height: 16, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 15, color: 'var(--text-muted)' }}>{opt}</span>
              </label>
            ))}
          </div>
        </Field>
      </FormSection>

      {/* Vos coordonnées */}
      <FormSection title="Vos coordonnées">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="intl-row">
          <Field label="Email *" error={errors.email}>
            <input type="email" name="Email" placeholder="vous@exemple.fr" value={form.email} onChange={set('email')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
          </Field>
          <Field label="Téléphone *" error={errors.telephone}>
            <input type="tel" name="Téléphone" placeholder="06 00 00 00 00" value={form.telephone} onChange={set('telephone')} onFocus={onFocus} onBlur={onBlur} style={inputBase} />
          </Field>
        </div>
      </FormSection>

      {/* Précisions */}
      <FormSection title="Précisions">
        <Field label="Message (facultatif)">
          <textarea
            name="Message"
            placeholder="Une précision sur votre situation ? (facultatif)"
            value={form.message}
            onChange={set('message')}
            onFocus={onFocus}
            onBlur={onBlur}
            rows={4}
            style={{ ...inputBase, resize: 'vertical', minHeight: 100 }}
          />
        </Field>
      </FormSection>

      {/* Consentement */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            name="Consentement"
            checked={form.consentement}
            onChange={(e) => setForm((f) => ({ ...f, consentement: e.target.checked }))}
            style={{ accentColor: 'var(--gold)', width: 16, height: 16, marginTop: 3, flexShrink: 0, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            J&apos;accepte que mes informations soient utilisées pour établir mon devis et être recontacté par AssuTempo.
          </span>
        </label>
        {errors.consentement && (
          <span style={{ fontSize: 12, color: '#e05c5c' }}>{errors.consentement}</span>
        )}
      </div>

      {/* Erreur globale */}
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
            Une erreur est survenue. Réessayez ou appelez-nous au 09 74 19 78 20.
          </p>
        )}
      </div>

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
        <p style={{ fontSize: 13, color: 'var(--text-subtle)', marginTop: 10, marginBottom: 0 }}>
          Réponse sous 12h. Sans engagement.
        </p>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .intl-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}

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

      {/* Formulaire */}
      <section ref={formSectionRef} style={{ background: 'var(--bg)', padding: '100px 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px' }}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 40 }}
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
              Demandez votre devis
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
              Remplissez le formulaire ci-dessous. Notre équipe vous envoie votre proposition personnalisée sous 12h.
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 20,
              padding: '40px 40px',
            }}
            className="intl-form-wrap"
          >
            <DevisForm initialPays={paysFromUrl?.nom} />
          </m.div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .intl-form-wrap { padding: 28px 20px !important; }
          }
        `}</style>
      </section>

      <Footer />
    </>
  );
}

export default AssuranceInternationale;
