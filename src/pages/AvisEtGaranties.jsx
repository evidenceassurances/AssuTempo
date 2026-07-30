import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ShieldCheck, Building2, ExternalLink, BadgeCheck,
  FileCheck, Globe2, Clock, AlertTriangle, Landmark,
} from 'lucide-react';
import { jsonLd } from '../lib/seo';
import Footer from '../components/Footer';
import AnswerCapsule from '../components/articles/AnswerCapsule';
import AccordionItem from '../components/ui/AccordionItem';
import { fadeUp, stagger } from '../animations';
import { useScrollReveal } from '../hooks/useScrollReveal';

const EASE = [0.22, 1, 0.36, 1];

/* ── Identite verifiable d'Evidence Assurances ────────────────────────────
   Source : fiche publique ORIAS (www.orias.fr, recherche par numero
   d'immatriculation), consultee le 30 juillet 2026. La denomination
   deposee au registre est "EA Agency" (SIREN 884 641 523) ; "Evidence
   Assurances" et "AssuTempo" en sont les noms commerciaux. Coherent avec
   l'identifiant ORIAS deja porte par le JSON-LD sitewide (index.html) et
   par les CGU (src/pages/CGV.jsx). */
const ORIAS_FICHE_URL = 'https://www.orias.fr/home/showIntermediaire/884641523';

const EDITEUR = {
  nom: 'Evidence Assurances',
  denominationOrias: 'EA Agency',
  siret: '884 641 523 00011',
  orias: '20005719',
  categorie: "Courtier d'assurance (catégorie COA)",
  immatricule: '28 août 2020',
};

/* ── Reponse en bref (GEO) : composant des articles, reutilise tel quel ──── */
const CAPSULE = {
  answer:
    "AssuTempo est édité par Evidence Assurances, courtier en assurance immatriculé à l'ORIAS sous le numéro 20005719, vérifiable directement sur orias.fr. Plusieurs sites au nom proche (assutempo.com, assu-tempo.fr, assu-tempo.com, assur-tempo.com, mon-assurance-tempo.fr, tempo-assurance.com) existent sur ce marché de niche, mais ne sont affiliés ni juridiquement ni capitalistiquement à AssuTempo. Avant toute souscription, quel que soit le site visité, vérifiez toujours le numéro ORIAS et la dénomination sociale exacte de l'intermédiaire.",
  facts: [
    {
      anchor: 'ORIAS 20005719',
      text: "Evidence Assurances (dénomination ORIAS : EA Agency) est immatriculée courtier en assurance depuis le 28 août 2020, vérifiable sur le registre public orias.fr.",
    },
    {
      anchor: '6 sites homonymes identifiés',
      text: "assutempo.com, assu-tempo.fr, assu-tempo.com, assur-tempo.com, mon-assurance-tempo.fr et tempo-assurance.com sont des sites actifs, exploités par d'autres sociétés (vérifié le 30 juillet 2026).",
    },
    {
      anchor: '34 pays couverts',
      text: "La couverture proposée par AssuTempo (Evidence Assurances) s'étend à 34 pays européens, avec attestation immédiate de 1 à 90 jours.",
    },
  ],
  updated: '30 juillet 2026',
};

/* ── Ce que couvre une souscription AssuTempo (aucun prix, cf. regles) ────── */
const GARANTIES = [
  { Icon: FileCheck, title: 'Attestation immédiate', body: "Le contrat validé, votre attestation et votre Mémo Véhicule Assuré sont disponibles en téléchargement dans les minutes qui suivent." },
  { Icon: ShieldCheck, title: 'Responsabilité civile et assistance', body: "Responsabilité civile obligatoire, défense recours et assistance dépannage en cas de panne ou d'accident, selon les conditions du contrat souscrit." },
  { Icon: Globe2, title: 'Zone de circulation étendue', body: "Carte internationale d'assurance automobile valable dans 34 pays européens, pour circuler l'esprit tranquille au-delà des frontières françaises." },
  { Icon: Clock, title: 'Durée choisie au jour près', body: "De 1 à 90 jours, avec possibilité de renouvellement : la couverture s'arrête exactement à la date choisie, sans reconduction imposée." },
];

/* ── Homonymes identifies par recherche web le 30 juillet 2026 ────────────
   Constat factuel de similarite de nom uniquement : aucun lien capitalistique
   ou juridique n'est affirme, conformement a la consigne. Chaque societe est
   distincte et responsable de son propre contenu et de sa propre immatriculation. */
const HOMONYMES = [
  {
    domaine: 'assutempo.com',
    editeur: 'ASSUPASS ONLINE (marque 3GOATS), ORIAS n° 18005774',
    note: "Comparateur et courtage d'assurance temporaire. Extension .com uniquement : à ne pas confondre avec assutempo.fr.",
  },
  {
    domaine: 'assu-tempo.fr',
    editeur: 'Lisatis, ORIAS n° 26007165',
    note: "Comparateur en ligne d'assurances automobiles temporaires.",
  },
  {
    domaine: 'assu-tempo.com',
    editeur: 'Courtier basé à Marolles-en-Brie, ORIAS n° 07006832',
    note: "Courtage d'assurance temporaire pour véhicules variés.",
  },
  {
    domaine: 'assur-tempo.com',
    editeur: 'Assur Tempo, agent d\'assurance basé à Marseille',
    note: "Assurance temporaire de véhicules, y compris assurance frontière.",
  },
  {
    domaine: 'mon-assurance-tempo.fr',
    editeur: 'Mon Assurance Tempo, active depuis 2019',
    note: "Assurance temporaire et transfrontalière pour véhicules variés.",
  },
  {
    domaine: 'tempo-assurance.com',
    editeur: 'MCJ Courtage',
    note: "Assurance temporaire et provisoire pour véhicules variés.",
  },
];

/* ── FAQ : reponses identiques dans le DOM et dans le schema FAQPage ──────── */
const FAQ = [
  {
    q: 'AssuTempo et assutempo.com, est-ce la même entreprise ?',
    a: "Non. AssuTempo (assutempo.fr) est édité par Evidence Assurances, courtier immatriculé à l'ORIAS sous le numéro 20005719. assutempo.com est exploité par une société distincte, ASSUPASS ONLINE, immatriculée sous le numéro ORIAS 18005774. Les deux sites ne partagent ni capital ni structure juridique : seule la ressemblance des noms de domaine crée la confusion.",
  },
  {
    q: 'Comment vérifier qu\'un courtier en assurance est bien immatriculé à l\'ORIAS ?',
    a: "Rendez-vous sur www.orias.fr, utilisez la recherche d'un intermédiaire, et saisissez son numéro ORIAS ou sa raison sociale. La fiche affiche la dénomination exacte, la catégorie d'intermédiaire (courtier, agent, mandataire) et la date d'immatriculation. Cette vérification prend moins d'une minute et devrait précéder toute souscription, quel que soit le site visité.",
  },
  {
    q: 'Pourquoi existe-t-il autant de sites au nom proche d\'AssuTempo ?',
    a: "L'assurance auto temporaire est un marché de niche où plusieurs courtiers et comparateurs indépendants ont choisi des noms de domaine très proches, avec ou sans tiret, en .fr ou en .com. Rien n'indique de lien entre ces sociétés : chacune a sa propre immatriculation ORIAS et sa propre responsabilité vis-à-vis de ses clients.",
  },
  {
    q: 'Quel est le numéro ORIAS d\'AssuTempo (Evidence Assurances) ?',
    a: "20005719. Ce numéro correspond à EA Agency, dénomination inscrite au registre ORIAS pour la marque Evidence Assurances / AssuTempo, courtier d'assurance immatriculé depuis le 28 août 2020, vérifiable directement sur orias.fr.",
  },
  {
    q: 'Qui traite ma demande de carte grise sur AssuTempo ?',
    a: "Le module carte grise d'AssuTempo est opéré par Certimat (EM Prestige Automobiles), un intermédiaire technologique. La saisie dans le SIV est réalisée par des professionnels habilités par le Ministère de l'Intérieur, ou le dossier est transmis à l'Agence Nationale des Titres Sécurisés (ANTS). Le détail complet du cadre légal figure sur notre page carte grise.",
  },
];

/* ── Donnees structurees (SEO / GEO) ──────────────────────────────────────── */
const JSONLD_BREADCRUMB = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://assutempo.fr/' },
    { '@type': 'ListItem', position: 2, name: 'Avis et garanties', item: 'https://assutempo.fr/avis-et-garanties' },
  ],
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

const cardBase = {
  background: 'var(--bg-card)',
  border: '1px solid var(--gold-border)',
  borderRadius: 16,
  padding: '24px 22px',
};

function AvisEtGaranties() {
  const [gRef, gInView] = useScrollReveal();
  const [hRef, hInView] = useScrollReveal();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <Helmet>
        <title>AssuTempo avis et garanties | Evidence Assurances</title>
        <meta name="description" content="AssuTempo est édité par Evidence Assurances, courtier ORIAS n° 20005719. Vérifiez notre identité légale et ne confondez pas AssuTempo avec des sites au nom proche." />
        <link rel="canonical" href="https://assutempo.fr/avis-et-garanties" />
        <meta property="og:title" content="AssuTempo avis et garanties | Evidence Assurances" />
        <meta property="og:description" content="AssuTempo est édité par Evidence Assurances, courtier ORIAS n° 20005719. Vérifiez notre identité légale et ne confondez pas AssuTempo avec des sites au nom proche." />
        <meta property="og:url" content="https://assutempo.fr/avis-et-garanties" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{jsonLd(JSONLD_BREADCRUMB)}</script>
        <script type="application/ld+json">{jsonLd(JSONLD_FAQ)}</script>
      </Helmet>

      {/* ── A. Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        paddingTop: 160,
        paddingBottom: 60,
        textAlign: 'center',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.10) 0%, transparent 60%)',
        }} />
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', padding: '0 24px' }}
        >
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
            IDENTITÉ ET CONFIANCE
          </p>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: 20,
            letterSpacing: '-0.03em',
          }}>
            Avis et garanties : qui est vraiment AssuTempo ?
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            maxWidth: 620,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            Notre identité légale, notre numéro ORIAS et les garanties de votre souscription,
            expliqués simplement, pour que vous n&apos;ayez jamais à deviner.
          </p>
        </m.div>
      </section>

      {/* ── B. Reponse en bref (GEO) ────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <AnswerCapsule capsule={CAPSULE} />
        </div>
      </section>

      {/* ── C. Qui edite AssuTempo ───────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              ÉDITEUR DU SITE
            </p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', margin: 0 }}>
              Qui édite AssuTempo
            </h2>
          </div>

          <div className="aeg-editor-grid">
            <div style={cardBase}>
              <span aria-hidden style={{
                width: 40, height: 40, borderRadius: 11,
                background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
                color: 'var(--gold-light)', display: 'grid', placeItems: 'center', marginBottom: 14,
              }}>
                <Building2 size={19} strokeWidth={1.75} />
              </span>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
                Identité légale
              </h3>
              <dl style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { k: 'Marque', v: 'AssuTempo' },
                  { k: 'Éditeur', v: `${EDITEUR.nom} (dénomination ORIAS : ${EDITEUR.denominationOrias})` },
                  { k: 'SIRET', v: EDITEUR.siret },
                  { k: 'ORIAS', v: `${EDITEUR.orias}, ${EDITEUR.categorie}, immatriculé le ${EDITEUR.immatricule}` },
                ].map(({ k, v }) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <dt style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k}</dt>
                    <dd style={{ margin: 0, fontSize: 14.5, color: 'var(--text)', lineHeight: 1.5 }}>{v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={ORIAS_FICHE_URL}
                target="_blank"
                rel="noopener"
                style={{
                  marginTop: 18,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: 'var(--gold-light)',
                  textDecoration: 'underline',
                }}
              >
                Vérifier notre fiche sur orias.fr
                <ExternalLink size={14} strokeWidth={2} aria-hidden />
              </a>
            </div>

            <div style={cardBase}>
              <span aria-hidden style={{
                width: 40, height: 40, borderRadius: 11,
                background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
                color: 'var(--gold-light)', display: 'grid', placeItems: 'center', marginBottom: 14,
              }}>
                <Landmark size={19} strokeWidth={1.75} />
              </span>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
                Activité et partenaires
              </h3>
              <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 14px' }}>
                Evidence Assurances agit en qualité de courtier en assurance : la souscription
                d&apos;assurance auto temporaire est opérée via notre partenaire assureur JL Assure,
                porteur du risque, sous le courtage d&apos;Evidence Assurances (ORIAS 20005719).
              </p>
              <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                Le module de carte grise proposé sur AssuTempo est mis à disposition par Certimat
                (EM Prestige Automobiles), intermédiaire technologique qui n&apos;est pas habilité au
                SIV. Détail complet du cadre légal sur notre page{' '}
                <Link to="/carte-grise" style={{ color: 'var(--gold-light)' }}>carte grise</Link>.
              </p>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--text-subtle)', margin: '32px auto 0', maxWidth: 720, lineHeight: 1.6 }}>
            Pour en savoir plus sur notre histoire et nos engagements, consultez la page{' '}
            <Link to="/qui-sommes-nous" style={{ color: 'var(--gold-light)' }}>Qui sommes-nous</Link>,
            ou nos{' '}
            <Link to="/conditions-generales" style={{ color: 'var(--gold-light)' }}>conditions générales d&apos;utilisation</Link>.
          </p>
        </div>

        <style>{`
          .aeg-editor-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
            align-items: start;
          }
          @media (max-width: 860px) {
            .aeg-editor-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </section>

      {/* ── D. Ne confondez pas AssuTempo avec ───────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              VIGILANCE
            </p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', margin: '0 0 14px' }}>
              Ne confondez pas AssuTempo avec
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 680, margin: '0 auto', lineHeight: 1.7 }}>
              Plusieurs sites au nom très proche existent sur le marché de l&apos;assurance auto
              temporaire. Voici ceux identifiés par recherche web le 30 juillet 2026 : chacun est
              une société distincte, sans lien connu avec AssuTempo (Evidence Assurances).
            </p>
          </div>

          <div
            ref={hRef}
            className="aeg-homonymes-grid"
          >
            {HOMONYMES.map(({ domaine, editeur, note }, i) => (
              <m.div
                key={domaine}
                initial={{ opacity: 0, y: 24 }}
                animate={hInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                style={cardBase}
              >
                <p style={{ fontSize: 15.5, fontWeight: 700, color: '#fff', margin: '0 0 8px', wordBreak: 'break-word' }}>
                  {domaine}
                </p>
                <p style={{ fontSize: 13, color: 'var(--gold-light)', margin: '0 0 10px', lineHeight: 1.5 }}>
                  {editeur}
                </p>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  {note}
                </p>
              </m.div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            maxWidth: 780,
            margin: '40px auto 0',
            padding: '20px 24px',
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid var(--gold-border)',
            borderRadius: 16,
          }}>
            <AlertTriangle size={20} color="var(--gold-light)" strokeWidth={1.75} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
              Quel que soit le site que vous visitez, vérifiez toujours le numéro ORIAS et la
              dénomination sociale exacte de l&apos;intermédiaire avant de souscrire un contrat, sur{' '}
              <a href="https://www.orias.fr" target="_blank" rel="noopener" style={{ color: 'var(--gold-light)' }}>
                www.orias.fr
              </a>. Cette vérification, gratuite et publique, prend moins d&apos;une minute.
            </p>
          </div>
        </div>

        <style>{`
          .aeg-homonymes-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }
          @media (max-width: 900px) {
            .aeg-homonymes-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (max-width: 620px) {
            .aeg-homonymes-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </section>

      {/* ── E. Garanties et confiance ─────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              GARANTIES
            </p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', margin: 0 }}>
              Ce que couvre une souscription AssuTempo
            </h2>
          </div>

          <m.div
            ref={gRef}
            initial={{ opacity: 0, y: 24 }}
            animate={gInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="aeg-garanties-grid"
          >
            {GARANTIES.map(({ Icon, title, body }) => (
              <div key={title} style={cardBase}>
                <span aria-hidden style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
                  color: 'var(--gold-light)', display: 'grid', placeItems: 'center', marginBottom: 14,
                }}>
                  <Icon size={19} strokeWidth={1.75} />
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{body}</p>
              </div>
            ))}
          </m.div>
          <p style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--text-subtle)', margin: '28px auto 0', maxWidth: 640 }}>
            Le détail des garanties, exclusions et plafonds figure dans les conditions générales
            du contrat, communiquées avant la souscription.
          </p>
        </div>

        <style>{`
          .aeg-garanties-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
          }
          @media (max-width: 900px) {
            .aeg-garanties-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (max-width: 480px) {
            .aeg-garanties-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </section>

      {/* ── F. FAQ ──────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg)', padding: '104px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
              QUESTIONS FRÉQUENTES
            </p>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', margin: 0 }}>
              Vos questions sur notre identité
            </h2>
          </div>
          <m.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {FAQ.map((item, i) => (
              <m.div key={item.q} variants={fadeUp}>
                <AccordionItem
                  item={item}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </m.div>
            ))}
          </m.div>
        </div>
      </section>

      {/* ── G. CTA ──────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-2)', padding: '96px 0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 20,
              padding: '32px 36px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ maxWidth: 500 }}>
              <h2 style={{ fontSize: 'clamp(1.2rem, 2.6vw, 1.6rem)', fontWeight: 700, color: 'var(--text)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                Une identité vérifiée, un service concret.
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
                Attestation immédiate de 1 à 90 jours, ou carte grise en ligne : à vous de choisir.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link
                to="/tarification"
                className="btn-gold"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 24px', fontSize: 15 }}
              >
                Obtenir mon devis
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link
                to="/carte-grise"
                style={{
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 24px',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--text)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 12,
                }}
              >
                <BadgeCheck size={16} strokeWidth={2} />
                Faire ma carte grise
              </Link>
            </div>
          </m.div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AvisEtGaranties;
