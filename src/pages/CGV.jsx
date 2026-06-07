import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Building2, ShieldCheck, Scale, FileText, Lock,
  AlertCircle, Clock, Phone, Mail, Gavel,
} from 'lucide-react';
import { fadeUp } from '../animations';
import Footer from '../components/Footer';

const EASE = [0.22, 1, 0.36, 1];
const LAST_UPDATE = '5 juin 2026';

/* ─── Utilitaires ───────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function IconBox({ icon: Icon }) {
  return (
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
  );
}

function Card({ icon, eyebrow, title, children }) {
  return (
    <div
      style={{
        background: 'rgba(201,168,76,0.025)',
        border: '1px solid var(--gold-border)',
        borderRadius: 20,
        padding: '28px 32px',
      }}
    >
      {icon && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <IconBox icon={icon} />
          <div>
            {eyebrow && (
              <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', margin: '0 0 2px' }}>
                {eyebrow}
              </p>
            )}
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{title}</h2>
          </div>
        </div>
      )}
      {!icon && title && (
        <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px', letterSpacing: '-0.01em' }}>{title}</h2>
      )}
      {children}
    </div>
  );
}

function P({ children, last = false }) {
  return (
    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.85, margin: last ? 0 : '0 0 12px' }}>
      {children}
    </p>
  );
}

function Strong({ children }) {
  return <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{children}</strong>;
}

function GoldLink({ href, children }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      style={{ color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold-border)' }}
    >
      {children}
    </a>
  );
}

/* ─── Email avec honeypot anti-scraping ─────────────────────────────────── */
function ObfuscatedEmail() {
  const u = 'evidence.assurances';
  const d = 'gmail.com';
  return (
    <a
      href={`mailto:${u}@${d}`}
      style={{ color: 'var(--gold)', textDecoration: 'none', borderBottom: '1px solid var(--gold-border)' }}
    >
      {u}
      {/* Honeypot : invisible pour les utilisateurs (aria-hidden + hors écran),
          perturbe les scrapers qui lisent le DOM brut */}
      <span
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', fontSize: 0, userSelect: 'none' }}
      >
        NO-SPAM
      </span>
      @{d}
    </a>
  );
}

/* ─── Données structurées ───────────────────────────────────────────────── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: "Conditions Générales d'Utilisation — AssuTempo",
  description:
    "Conditions générales d'utilisation du service AssuTempo, édité par Evidence Assurances, " +
    "intermédiaire en assurance immatriculé à l'ORIAS sous le numéro 20005719.",
  url: 'https://assutempo.fr/conditions-generales',
  dateModified: '2026-06-05',
  publisher: {
    '@type': 'Organization',
    name: 'AssuTempo — Evidence Assurances',
    url: 'https://assutempo.fr',
    telephone: '+33974197820',
  },
  inLanguage: 'fr-FR',
};

/* ─── Page ──────────────────────────────────────────────────────────────── */
function CGV() {
  return (
    <>
      <Helmet>
        <title>Conditions Générales d'Utilisation | AssuTempo — Evidence Assurances</title>
        <meta
          name="description"
          content="Conditions générales d'utilisation d'AssuTempo. Mentions légales, SIRET 88464152300011, ORIAS 20005719, modalités de souscription, droit de rétractation et médiation."
        />
        <link rel="canonical" href="https://assutempo.fr/conditions-generales" />
        <meta name="robots" content="noindex, follow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: 160,
          paddingBottom: 60,
          textAlign: 'center',
          background: 'var(--bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.10) 0%, transparent 60%)',
          }}
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', padding: '0 24px' }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            MENTIONS LÉGALES &amp; CGU
          </p>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 60px)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 20,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Conditions Générales
          </h1>

          <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Tout ce que vous devez savoir sur l&apos;utilisation du service AssuTempo et vos droits en tant qu&apos;assuré.
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--gold-glow)',
              border: '1px solid var(--gold-border)',
              borderRadius: 999,
              padding: '6px 18px',
              fontSize: 13,
              color: 'var(--text-muted)',
            }}
          >
            <Clock size={13} style={{ color: 'var(--gold)' }} />
            Dernière mise à jour : {LAST_UPDATE}
          </div>
        </motion.div>
      </section>

      {/* ── Contenu ───────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* 1. Mentions légales ─── */}
          <Reveal>
            <Card icon={Building2} eyebrow="ARTICLE 1" title="Mentions légales">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  marginBottom: 20,
                }}
                className="cgv-mentions-grid"
              >
                {[
                  { label: 'Raison sociale', value: 'Evidence Assurances' },
                  { label: 'Activité', value: 'Intermédiaire en assurance' },
                  { label: 'SIRET', value: '88464152300011' },
                  { label: 'ORIAS', value: '20005719' },
                  { label: 'Téléphone', value: '09 74 19 78 20' },
                  { label: 'Site web', value: 'assutempo.fr' },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 12,
                      padding: '14px 18px',
                    }}
                  >
                    <p style={{ fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px', fontWeight: 600 }}>
                      {label}
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600, margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
              <P last>
                Evidence Assurances est immatriculée en tant qu&apos;intermédiaire en assurance à l&apos;
                <Strong>ORIAS</Strong> (Organisme pour le Registre des Intermédiaires en Assurance) sous le
                numéro <Strong>20005719</Strong>, vérifiable sur{' '}
                <GoldLink href="https://www.orias.fr">www.orias.fr</GoldLink>.
                L&apos;inscription à l&apos;ORIAS atteste du respect des conditions de capacité professionnelle et
                d&apos;honorabilité requises par le Code des assurances.
              </P>
            </Card>
          </Reveal>

          {/* 2. Objet ─── */}
          <Reveal>
            <Card icon={FileText} eyebrow="ARTICLE 2" title="Objet des conditions générales">
              <P>
                Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation
                du site <Strong>assutempo.fr</Strong> ainsi que la souscription aux produits d&apos;assurance
                temporaire proposés par Evidence Assurances, en sa qualité d&apos;intermédiaire en assurance.
              </P>
              <P last>
                Toute utilisation du site implique l&apos;acceptation pleine et entière des présentes CGU.
                Evidence Assurances se réserve le droit de les modifier à tout moment ; les modifications
                entrent en vigueur dès leur publication sur le site, avec mise à jour de la date figurant en
                haut de cette page.
              </P>
            </Card>
          </Reveal>

          {/* 3. Service & éligibilité ─── */}
          <Reveal>
            <Card icon={ShieldCheck} eyebrow="ARTICLE 3" title="Description du service et conditions d'éligibilité">
              <P>
                AssuTempo est un service d&apos;assurance automobile temporaire 100 % en ligne, permettant
                de souscrire une couverture de <Strong>1 à 90 jours</Strong>, avec délivrance d&apos;une
                attestation d&apos;assurance en moins de 5 minutes.
              </P>
              <P>Les garanties incluses sont :</P>
              <ul style={{ margin: '0 0 12px 20px', padding: 0, fontSize: 14, color: 'var(--text-muted)', lineHeight: 2 }}>
                <li>Responsabilité civile obligatoire</li>
                <li>Défense et recours</li>
                <li>Assistance dépannage, dès le 1<sup>er</sup> jour</li>
              </ul>
              <P>
                <Strong>Exclusions :</Strong> le vol et le bris de glace ne sont pas couverts.
              </P>
              <P>
                <Strong>Conditions d&apos;éligibilité :</Strong> être âgé d&apos;au moins 20 ans, être titulaire
                d&apos;un permis de conduire depuis plus de 2 ans, et régler par carte bancaire.
                La couverture est valable dans <Strong>34 pays européens</Strong> signataires de
                la carte verte internationale.
              </P>
              <P last>
                Evidence Assurances agit en qualité d&apos;intermédiaire. Le contrat d&apos;assurance est conclu
                entre le souscripteur et la compagnie d&apos;assurance partenaire ; les conditions particulières
                de chaque contrat prévalent sur les présentes CGU.
              </P>
            </Card>
          </Reveal>

          {/* 4. Souscription & paiement ─── */}
          <Reveal>
            <Card icon={Clock} eyebrow="ARTICLE 4" title="Souscription et paiement">
              <P>
                La souscription s&apos;effectue intégralement en ligne sur assutempo.fr, 24h/24 et 7j/7.
                Le souscripteur saisit les informations relatives au véhicule et au conducteur, choisit
                la durée de couverture et procède au paiement. L&apos;attestation d&apos;assurance est délivrée
                immédiatement après confirmation du paiement.
              </P>
              <P>
                <Strong>Tarification :</Strong> les tarifs varient selon le type de véhicule, la durée
                choisie et les options retenues. Le montant définitif est affiché avant toute validation.
              </P>
              <P last>
                <Strong>Paiement :</Strong> uniquement par carte bancaire. Aucun prélèvement
                ultérieur n&apos;est effectué ; le contrat n&apos;est pas reconductible tacitement.
              </P>
            </Card>
          </Reveal>

          {/* 5. Absence de droit de rétractation ─── */}
          <Reveal>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--glass-border)',
                borderLeft: '3px solid var(--gold)',
                borderRadius: '0 14px 14px 0',
                padding: '24px 28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <AlertCircle size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>
                  Article 5 - Absence de droit de rétractation
                </h2>
              </div>
              <P>
                L&apos;assurance automobile temporaire proposée sur assutempo.fr n&apos;ouvre pas droit
                à la faculté de renonciation de 14 jours prévue pour les contrats conclus à distance.
              </P>
              <P>
                Cette exclusion résulte de l&apos;article <Strong>L.112-2-1, II, 3° du Code des assurances</Strong>,
                qui écarte expressément le droit de renonciation :
              </P>
              <ul style={{ margin: '0 0 12px 20px', padding: 0, fontSize: 14, color: 'var(--text-muted)', lineHeight: 2 }}>
                <li>
                  pour les contrats d&apos;assurance automobile relevant de l&apos;article <Strong>L.211-1</Strong> du
                  même code (responsabilité civile obligatoire des véhicules terrestres à moteur), sans condition
                  de durée ;
                </li>
                <li>
                  pour les polices d&apos;assurance à court terme d&apos;une durée inférieure à un mois.
                </li>
              </ul>
              <P>
                En souscrivant, le souscripteur demande expressément l&apos;exécution immédiate du contrat :
                la garantie prend effet et l&apos;attestation est délivrée dès la confirmation du paiement.
              </P>
              <P>
                En conséquence, la prime est intégralement acquise à l&apos;assureur dès le paiement.
                Aucun remboursement, total ou partiel, ne peut être demandé, et le contrat ne peut faire
                l&apos;objet d&apos;aucune résiliation à l&apos;initiative du souscripteur. La couverture se poursuit
                jusqu&apos;au terme de la durée choisie lors de la souscription.
              </P>
              <P last>
                Les situations particulières éventuellement prévues par la loi ou par les conditions
                particulières du contrat d&apos;assurance demeurent régies par ces dernières, qui prévalent
                sur les présentes CGU.
              </P>
            </div>
          </Reveal>

          {/* 6. Protection des données ─── */}
          <Reveal>
            <Card icon={Lock} eyebrow="ARTICLE 6" title="Protection des données personnelles">
              <P>
                Evidence Assurances traite vos données personnelles en qualité de responsable du
                traitement, conformément au <Strong>Règlement Général sur la Protection des Données
                (RGPD)</Strong> et à la loi Informatique et Libertés.
              </P>
              <P>
                Les données collectées lors de la souscription (identité, permis, immatriculation,
                coordonnées bancaires chiffrées) sont utilisées exclusivement aux fins de gestion du
                contrat d&apos;assurance. Elles ne sont ni revendues ni cédées à des tiers à des fins
                commerciales.
              </P>
              <P>
                Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et de portabilité
                de vos données. Pour exercer ces droits, contactez-nous à l&apos;adresse :&nbsp;
                <ObfuscatedEmail />.
              </P>
              <P last>
                Pour en savoir plus sur les cookies déposés sur ce site, consultez notre{' '}
                <GoldLink href="/cookies">Politique de cookies</GoldLink>.
              </P>
            </Card>
          </Reveal>

          {/* 7. Propriété intellectuelle ─── */}
          <Reveal>
            <Card icon={FileText} eyebrow="ARTICLE 7" title="Propriété intellectuelle">
              <P last>
                L&apos;ensemble des éléments composant le site assutempo.fr (textes, graphismes, logotypes,
                icônes, images, code source) est la propriété exclusive d&apos;Evidence Assurances ou fait
                l&apos;objet d&apos;une licence d&apos;utilisation en sa faveur. Toute reproduction, représentation
                ou exploitation, totale ou partielle, sans autorisation écrite préalable, est strictement
                interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
              </P>
            </Card>
          </Reveal>

          {/* 8. Responsabilité ─── */}
          <Reveal>
            <Card icon={Gavel} eyebrow="ARTICLE 8" title="Limitation de responsabilité">
              <P>
                Evidence Assurances agit en qualité d&apos;intermédiaire et non d&apos;assureur direct.
                La responsabilité contractuelle relative aux garanties souscrites incombe à la
                compagnie d&apos;assurance avec laquelle le contrat est conclu.
              </P>
              <P last>
                Evidence Assurances met en œuvre tous les moyens raisonnables pour assurer la
                disponibilité et la sécurité du service. Sa responsabilité ne saurait être engagée
                en cas d&apos;interruption liée à des causes extérieures (maintenance, force majeure,
                défaillance réseau).
              </P>
            </Card>
          </Reveal>

          {/* 9. Réclamations & médiation ─── */}
          <Reveal>
            <Card icon={Scale} eyebrow="ARTICLE 9" title="Réclamations et médiation">
              <P>
                Pour toute réclamation relative à nos services, contactez Evidence Assurances en
                priorité :
              </P>
              <div
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginBottom: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Mail size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                    Email : <ObfuscatedEmail />
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Phone size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                    Téléphone :{' '}
                    <a href="tel:0974197820" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 600 }}>
                      09 74 19 78 20
                    </a>
                    {' '}— Lun-Ven 9h–21h · Sam 9h–20h
                  </span>
                </div>
              </div>
              <P>
                En l&apos;absence de réponse satisfaisante dans un délai de <Strong>2 mois</Strong>, vous
                pouvez saisir gratuitement le <Strong>Médiateur de l&apos;Assurance</Strong> :
              </P>
              <div
                style={{
                  background: 'rgba(201,168,76,0.04)',
                  border: '1px solid var(--gold-border)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  marginBottom: 16,
                }}
              >
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                  <Strong>Médiateur de l&apos;Assurance</Strong><br />
                  TSA 50110 — 75441 Paris Cedex 09<br />
                  <GoldLink href="https://www.mediation-assurance.org">www.mediation-assurance.org</GoldLink>
                </p>
              </div>
              <P last>
                Vous pouvez également recourir à la plateforme européenne de règlement des litiges
                en ligne :{' '}
                <GoldLink href="https://ec.europa.eu/consumers/odr">ec.europa.eu/consumers/odr</GoldLink>.
              </P>
            </Card>
          </Reveal>

          {/* 10. Loi applicable ─── */}
          <Reveal>
            <Card icon={Gavel} eyebrow="ARTICLE 10" title="Loi applicable et juridiction">
              <P last>
                Les présentes CGU sont soumises au <Strong>droit français</Strong>, notamment au Code
                des assurances, au Code de la consommation et au RGPD. En cas de litige non résolu
                amiablement ni par voie de médiation, les tribunaux français compétents auront
                seule juridiction.
              </P>
            </Card>
          </Reveal>

          {/* Contact ─── */}
          <Reveal>
            <div
              style={{
                background: 'var(--gold-glow)',
                border: '1px solid var(--gold-border)',
                borderRadius: 20,
                padding: '36px 32px',
                textAlign: 'center',
              }}
            >
              <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 700, color: 'var(--text)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                Une question sur ces conditions ?
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 auto 24px', lineHeight: 1.7, maxWidth: 480 }}>
                Notre équipe est disponible du lundi au samedi pour répondre à vos questions.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 16 }}>
                <a
                  href="tel:0974197820"
                  className="btn-gold"
                  style={{ padding: '13px 24px', fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  <Phone size={15} />
                  09 74 19 78 20
                </a>
                <a
                  href="mailto:evidence.assurances@gmail.com"
                  style={{
                    padding: '13px 24px',
                    fontSize: 15,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--text-muted)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 12,
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderColor = 'var(--gold-border)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                >
                  <Mail size={15} />
                  Nous écrire
                </a>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      <style>{`
        @media (max-width: 560px) {
          .cgv-mentions-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}

export default CGV;
