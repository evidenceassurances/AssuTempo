import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Users, Clock, FileCheck, Wallet } from 'lucide-react';
import { fadeUp, stagger, slideLeft } from '../animations';
import Footer from '../components/Footer';

const values = [
  { title: 'Efficace', description: 'Processus fluide, prise en charge rapide, réponse sous 24h.', icon: ShieldCheck },
  { title: 'Disponible', description: 'Accompagnement client dédié du lundi au samedi.', icon: Users },
  { title: 'Engagé RSE', description: "Parité, égalité salariale et réduction de l'empreinte carbone.", icon: Sparkles },
];

const aboutStats = [
  { value: '6', suffix: ' ans', label: "d'expertise" },
  { value: '24h', suffix: '', label: 'Réponse max' },
  { value: '34', suffix: '', label: 'pays couverts' },
];

const partnerPerks = [
  { icon: Clock,       title: 'Devis en 3 minutes',    label: 'Un parcours adapté à votre métier' },
  { icon: FileCheck,   title: 'Attestation immédiate',  label: 'Votre client repart couvert' },
  { icon: Wallet,      title: 'Commission chaque mois', label: 'Virement instantané le mois suivant' },
];

const typeOptions = [
  'Agence carte grise',
  'Garage / réparateur',
  'Concessionnaire',
  'Mandataire auto',
  'Loueur de véhicules',
  'Négociant / import-export',
  'Contrôle technique',
  'Auto-école',
  'Autre',
];

const EMPTY_FORM = {
  type: '',
  societe: '',
  contact: '',
  email: '',
  telephone: '',
  message: '',
};

/* Styles réutilisables pour les champs */
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

function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</label>
      {children}
      {error && (
        <span style={{ fontSize: 12, color: '#e05c5c' }}>{error}</span>
      )}
    </div>
  );
}

function PartnerForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'envoi' | 'succes' | 'erreur'

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const focusStyle = (e) => {
    e.target.style.borderColor = 'var(--gold-border)';
    e.target.style.boxShadow = '0 0 0 3px var(--gold-glow)';
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = 'var(--glass-border)';
    e.target.style.boxShadow = 'none';
  };

  function validate() {
    const errs = {};
    if (!form.type) errs.type = 'Veuillez choisir un type de structure.';
    if (!form.societe.trim()) errs.societe = 'Champ requis.';
    if (!form.contact.trim()) errs.contact = 'Champ requis.';
    if (!form.email.trim()) {
      errs.email = 'Champ requis.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Adresse email invalide.';
    }
    if (!form.telephone.trim()) errs.telephone = 'Champ requis.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setStatus('envoi');

    try {
      const formData = new FormData(e.target);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setStatus('succes');
        setForm(EMPTY_FORM);
      } else {
        setStatus('erreur');
      }
    } catch {
      setStatus('erreur');
    }
  }

  if (status === 'succes') {
    return (
      <motion.div
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
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✓</div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          Demande envoyée !
        </h3>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
          Merci, votre demande a bien été envoyée. Nous vous recontactons sous 24h.
        </p>
        <button
          onClick={() => setStatus('idle')}
          style={{
            background: 'none',
            border: '1px solid var(--gold-border)',
            borderRadius: 8,
            padding: '8px 20px',
            color: 'var(--text-muted)',
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--gold-border)'; }}
        >
          Nouvelle demande
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Champs cachés Web3Forms */}
      <input type="hidden" name="access_key" value="7a4b9f4a-f77e-4f9b-8a16-7635bff791ed" />
      <input type="hidden" name="subject" value="Nouvelle demande de partenariat - AssuTempo" />
      <input type="hidden" name="from_name" value="Formulaire partenaires AssuTempo" />
      {/* Honeypot anti-spam : rejeté silencieusement par Web3Forms si coché par un bot */}
      <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      {/* Type de structure */}
      <Field label="Type de structure *" error={errors.type}>
        <select
          name="type_structure"
          value={form.type}
          onChange={set('type')}
          onFocus={focusStyle}
          onBlur={blurStyle}
          style={{ ...inputBase, appearance: 'none', cursor: 'pointer', color: form.type ? 'var(--text)' : 'var(--text-muted)' }}
        >
          <option value="" disabled>Sélectionnez...</option>
          {typeOptions.map((o) => (
            <option key={o} value={o} style={{ background: '#0C0A08', color: 'var(--text)' }}>{o}</option>
          ))}
        </select>
      </Field>

      {/* 2 colonnes sur desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
        <Field label="Nom de la société *" error={errors.societe}>
          <input
            type="text"
            name="societe"
            placeholder="Garage Dupont SAS"
            value={form.societe}
            onChange={set('societe')}
            onFocus={focusStyle}
            onBlur={blurStyle}
            style={inputBase}
          />
        </Field>
        <Field label="Nom et prénom du contact *" error={errors.contact}>
          <input
            type="text"
            name="contact"
            placeholder="Jean Dupont"
            value={form.contact}
            onChange={set('contact')}
            onFocus={focusStyle}
            onBlur={blurStyle}
            style={inputBase}
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
        <Field label="Email professionnel *" error={errors.email}>
          <input
            type="email"
            name="email"
            placeholder="contact@societe.fr"
            value={form.email}
            onChange={set('email')}
            onFocus={focusStyle}
            onBlur={blurStyle}
            style={inputBase}
          />
        </Field>
        <Field label="Téléphone *" error={errors.telephone}>
          <input
            type="tel"
            name="telephone"
            placeholder="06 00 00 00 00"
            value={form.telephone}
            onChange={set('telephone')}
            onFocus={focusStyle}
            onBlur={blurStyle}
            style={inputBase}
          />
        </Field>
      </div>

      {/* Message */}
      <Field label="Message / votre besoin">
        <textarea
          name="message"
          placeholder="Décrivez votre activité et comment vous souhaitez proposer AssuTempo à vos clients..."
          value={form.message}
          onChange={set('message')}
          onFocus={focusStyle}
          onBlur={blurStyle}
          rows={5}
          style={{ ...inputBase, resize: 'vertical', minHeight: 120 }}
        />
      </Field>

      {/* Zone de statut accessible */}
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

      <button
        type="submit"
        className="btn-gold"
        disabled={status === 'envoi'}
        style={{
          padding: '14px 28px',
          fontSize: 15,
          alignSelf: 'flex-start',
          opacity: status === 'envoi' ? 0.7 : 1,
          cursor: status === 'envoi' ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => { if (status !== 'envoi') { e.currentTarget.style.boxShadow = '0 0 28px var(--gold-strong)'; e.currentTarget.style.transform = 'scale(1.02)'; } }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {status === 'envoi' ? 'Envoi en cours…' : 'Envoyer ma demande'}
      </button>

      <style>{`
        @media (max-width: 640px) {
          .form-row { grid-template-columns: 1fr !important; }
          .btn-gold { align-self: stretch !important; }
        }
      `}</style>
    </form>
  );
}

function About() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          paddingTop: 160,
          paddingBottom: 80,
          textAlign: 'center',
          background: 'var(--bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.10) 0%, transparent 60%)',
          }}
        />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', padding: '0 24px' }}
        >
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 16,
            }}
          >
            EVIDENCE ASSURANCES
          </p>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 60px)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 20,
              letterSpacing: '-0.03em',
            }}
          >
            Qui sommes-nous ?
          </h1>
          <p
            style={{
              fontSize: 16,
              color: 'var(--text-muted)',
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Evidence Assurances, 6 ans d&apos;expertise au service d&apos;une assurance temporaire moderne.
          </p>
        </motion.div>
      </section>

      {/* Contenu principal */}
      <section style={{ background: 'var(--bg)', padding: '20px 24px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}
            className="about-grid"
          >
            {/* Colonne gauche - Notre histoire */}
            <motion.div
              variants={slideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              <div
                style={{
                  background: 'rgba(201,168,76,0.03)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 20,
                  padding: 40,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: 20,
                  }}
                >
                  Notre histoire
                </p>
                <h2
                  style={{
                    fontSize: 'clamp(20px, 2.5vw, 28px)',
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.35,
                    marginBottom: 20,
                  }}
                >
                  Evidence Assurances combine expertise et innovation pour l&apos;assurance temporaire.
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  Depuis 2020, notre mission est de simplifier l&apos;accès à une couverture temporaire
                  fiable pour tous les conducteurs. Nous concevons des parcours digitaux clairs et
                  un support humain pour chaque dossier.
                </p>

                {/* Mini-stats */}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 32 }}
                >
                  {aboutStats.map(({ value, suffix, label }) => (
                    <div
                      key={label}
                      style={{
                        background: 'rgba(201,168,76,0.05)',
                        border: '1px solid rgba(201,168,76,0.15)',
                        borderRadius: 12,
                        padding: '20px 12px',
                        textAlign: 'center',
                      }}
                    >
                      <p
                        style={{
                          fontSize: 'clamp(22px, 2.5vw, 32px)',
                          fontWeight: 800,
                          color: '#fff',
                          letterSpacing: '-0.03em',
                          lineHeight: 1,
                        }}
                      >
                        {value}
                        <span style={{ color: 'var(--gold)', fontSize: '0.65em' }}>{suffix}</span>
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Colonne droite - Valeurs */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {values.map(({ title, description, icon: Icon }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="card-glass"
                  style={{ padding: '28px 32px', display: 'flex', gap: 20, alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'rgba(201,168,76,0.08)',
                      border: '1px solid var(--gold-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .about-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </section>

      {/* ─── Section Devenir partenaire ─── */}
      <section style={{ background: 'var(--bg-2)', padding: '100px 0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 32px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 48 }}
          >
            <p
              style={{
                fontSize: 12,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: 14,
              }}
            >
              PARTENARIAT PROFESSIONNEL
            </p>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--text)',
                margin: '0 0 16px',
                lineHeight: 1.15,
              }}
            >
              Vous êtes un professionnel ?
            </h2>
            <p
              style={{
                fontSize: 16,
                color: 'var(--text-muted)',
                margin: 0,
                lineHeight: 1.7,
                maxWidth: 680,
              }}
            >
              Agences de cartes grises, garages, concessionnaires, mandataires auto, loueurs,
              négociants, professionnels de l&apos;import-export automobile, centres de contrôle
              technique, auto-écoles… proposez l&apos;assurance temporaire AssuTempo à vos clients.
              Devenons partenaires.
            </p>
          </motion.div>

          {/* ─── Proposition de valeur ─── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            style={{ marginBottom: 48 }}
          >
            <h3
              style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 1.65rem)',
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.25,
                marginBottom: 16,
                letterSpacing: '-0.025em',
              }}
            >
              Proposez une assurance temporaire à vos clients en 3 minutes.{' '}
              <span style={{ color: 'var(--gold)' }}>Encaissez dès le mois suivant.</span>
            </h3>
            <p
              style={{
                fontSize: 15,
                color: 'var(--text-muted)',
                lineHeight: 1.75,
                marginBottom: 32,
                maxWidth: 640,
              }}
            >
              Nous adaptons notre système à chaque métier — durée, option assistance, tarif.
              Votre client repart avec son attestation immédiatement. Vous recevez votre commission
              par virement instantané, chaque mois.
            </p>

            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
              className="partner-perks-grid"
            >
              {partnerPerks.map(({ icon: Icon, title, label }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="card-glass"
                  style={{
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'rgba(201,168,76,0.08)',
                      border: '1px solid var(--gold-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                        marginBottom: 6,
                        fontWeight: 600,
                      }}
                    >
                      {title}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>
                      {label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 20,
              padding: '40px 40px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
            className="partner-form-wrap"
          >
            <p
              style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginBottom: 28,
                letterSpacing: '0.01em',
              }}
            >
              <strong style={{ color: 'var(--text)' }}>Aucune gestion administrative.</strong>
              {' '}
              <strong style={{ color: 'var(--text)' }}>Aucun engagement.</strong>
            </p>
            <PartnerForm />
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 700px) {
            .partner-perks-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 640px) {
            .partner-form-wrap { padding: 28px 20px !important; }
          }
        `}</style>
      </section>

      <Footer />
    </>
  );
}

export default About;
