/**
 * Articles.jsx — Page SEO articles d'AssuTempo
 *
 * Pour ajouter un article futur :
 * 1. Ajouter un objet dans le tableau `articles` ci-dessous
 * 2. Créer src/pages/articles/<slug>.jsx avec le contenu
 * 3. Ajouter la route dans App.jsx : /articles/<slug>
 * 4. Penser à compléter : titre H1, meta description, og:image
 */

import { motion } from 'framer-motion';
import { Car, FileText, Users, Truck, Clock, ShoppingCart } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Footer from '../components/Footer';

// ── Données articles (ajouter ici pour la croissance SEO) ──
const articles = [
  {
    slug: 'assurer-vehicule-achete-particulier',
    titre: 'Assurer un véhicule acheté chez un particulier',
    extrait: 'Vous venez d’acheter un véhicule entre particuliers ? Voici comment rouler assuré dès le premier trajet, sans attendre la carte grise.',
    icone: ShoppingCart,
    categorie: 'Achat véhicule',
  },
  {
    slug: 'assurance-temporaire-retour-etranger',
    titre: 'Assurance temporaire pour un retour de l’étranger',
    extrait: 'Permis ou véhicule d’origine étrangère ? Découvrez comment couvrir votre véhicule le temps de régulariser votre situation en France.',
    icone: Car,
    categorie: 'International',
  },
  {
    slug: 'preter-emprunter-vehicule',
    titre: 'Prêter ou emprunter un véhicule en toute sécurité',
    extrait: 'Un ami vous prête sa voiture ou vous lui prêtez la vôtre ? L’assurance temporaire protège le conducteur désigné sans toucher à votre contrat annuel.',
    icone: Users,
    categorie: 'Prêt de véhicule',
  },
  {
    slug: 'convoyage-professionnel-assurance',
    titre: 'Convoyage professionnel : quelle assurance ?',
    extrait: 'Mandataires, négociants, transporteurs : l’assurance temporaire est la solution pour couvrir chaque véhicule convoyé, sans contrat annuel inutile.',
    icone: Truck,
    categorie: 'Pro & convoyage',
  },
  {
    slug: 'rouler-en-attendant-carte-grise',
    titre: 'Rouler en attendant sa carte grise définitive',
    extrait: 'Les délais de carte grise s’étirent ? Couvrez-vous pendant la période de transition avec une attestation immédiate, valable dès la souscription.',
    icone: Clock,
    categorie: 'Carte grise',
  },
  {
    slug: 'essayer-vehicule-avant-achat',
    titre: 'Essayer un véhicule avant achat, bien assuré',
    extrait: 'Avant de signer, vous voulez l’essayer sur route ? Une assurance d’un jour suffit pour couvrir le test dans les règles.',
    icone: FileText,
    categorie: 'Essai & achat',
  },
];

function ArticleCard({ article, index, inView }) {
  const Icon = article.icone;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        borderRadius: 16,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        cursor: 'default',
        transition: 'border-color 0.3s, transform 0.3s var(--ease-out)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold-border)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--glass-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* En-tête : catégorie + pill "Bientôt disponible" */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--gold-glow)',
              border: '1px solid var(--gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} color="var(--gold)" strokeWidth={1.5} />
          </div>
          <span
            style={{
              fontSize: 11,
              color: 'var(--gold)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {article.categorie}
          </span>
        </div>

        {/* Pill placeholder */}
        <div
          style={{
            padding: '4px 10px',
            background: 'var(--glass)',
            border: '1px solid var(--glass-border)',
            borderRadius: 999,
            fontSize: 11,
            color: 'var(--text-subtle)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Bientôt disponible
        </div>
      </div>

      {/* Titre */}
      <h2
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--text)',
          margin: 0,
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
        }}
      >
        {article.titre}
      </h2>

      {/* Extrait */}
      <p
        style={{
          fontSize: 14,
          color: 'var(--text-muted)',
          margin: 0,
          lineHeight: 1.65,
          flexGrow: 1,
        }}
      >
        {article.extrait}
      </p>
    </motion.div>
  );
}

function Articles() {
  const [headRef, headInView] = useScrollReveal();
  const [gridRef, gridInView] = useScrollReveal();

  return (
    <>
      {/* Hero sobre */}
      <section
        style={{
          paddingTop: 140,
          paddingBottom: 72,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)',
          }}
        />
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
            ASSURANCE TEMPORAIRE
          </p>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: 'var(--text)',
              marginBottom: 20,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Articles &amp; conseils
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
            Tout ce qu&apos;il faut savoir sur l&apos;assurance temporaire,
            situation par situation.
          </p>
        </motion.div>
      </section>

      {/* Grille d'articles */}
      <section style={{ background: 'var(--bg)', padding: '0 0 120px' }}>
        <div
          ref={gridRef}
          style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="articles-grid">
            {articles.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} inView={gridInView} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .articles-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .articles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

export default Articles;
