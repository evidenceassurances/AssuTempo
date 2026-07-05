import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { ArrowRight, Home, Map } from 'lucide-react';
import { fadeUp } from '../animations';
import Footer from '../components/Footer';

/* Page 404. Prerendue en dist/404.html (hors sitemap, noindex) et servie par
   Vercel avec un vrai statut 404 pour toute URL inconnue. Cote client, la
   route catch-all "*" du routeur affiche la meme page : l'arbre est identique
   des deux cotes, quelle que soit l'URL demandee. */
function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page introuvable | AssuTempo</title>
        <meta
          name="description"
          content="Cette page n'existe pas ou n'existe plus. Retrouvez l'assurance auto temporaire AssuTempo depuis l'accueil ou obtenez votre devis en 2 minutes."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section
        style={{
          minHeight: '78vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: 'var(--bg)',
          position: 'relative',
          overflow: 'hidden',
          padding: '160px 24px 80px',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(201,168,76,0.10) 0%, transparent 60%)',
          }}
        />

        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{ position: 'relative', maxWidth: 640 }}
        >
          <p
            style={{
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 20,
            }}
          >
            ERREUR 404
          </p>

          <div
            aria-hidden="true"
            style={{
              fontSize: 'clamp(96px, 20vw, 180px)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              marginBottom: 24,
              background: 'linear-gradient(135deg, #C9A84C 20%, #E8C97A 60%, #C9A84C 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            404
          </div>

          <h1
            style={{
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: 16,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}
          >
            Cette page a expiré
          </h1>

          <p
            style={{
              fontSize: 16,
              color: 'var(--text-muted)',
              maxWidth: 480,
              margin: '0 auto 36px',
              lineHeight: 1.7,
            }}
          >
            Chez nous, tout est temporaire : nos contrats durent de 1 à 90 jours,
            cette adresse a duré un peu moins. Votre attestation, elle, reste à
            5 minutes d'ici.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link to="/tarification" className="btn-gold">
              Obtenir mon devis
              <ArrowRight size={17} style={{ marginLeft: 8 }} />
            </Link>
            <Link to="/" className="btn-glass">
              <Home size={16} style={{ marginRight: 8 }} />
              Retour à l'accueil
            </Link>
          </div>

          <p
            style={{
              marginTop: 32,
              fontSize: 14,
              color: 'var(--text-muted)',
            }}
          >
            Vous cherchiez un pays ?{' '}
            <Link
              to="/carte"
              style={{
                color: 'var(--gold)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Map size={14} />
              Voir les 34 pays couverts
            </Link>
          </p>
        </m.div>
      </section>

      <Footer />
    </>
  );
}

export default NotFound;
