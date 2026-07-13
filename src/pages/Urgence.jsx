import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* /urgence redirige vers /guichet-de-nuit. La redirection est client-side
   (navigate en useEffect, jamais pendant le rendu : le HTML prerendu doit
   rester identique a l'arbre d'hydratation). Pour les moteurs : noindex,
   canonical vers la destination, et la page est exclue du sitemap. Un vrai
   statut 301 exigerait vercel.json, qui est une zone protegee. */
function Urgence() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/guichet-de-nuit', { replace: true });
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Le Guichet de Nuit | AssuTempo</title>
        <meta
          name="description"
          content="Cette adresse a changé : l'assurance temporaire en urgence, la nuit et le dimanche, se trouve désormais au Guichet de Nuit AssuTempo."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://assutempo.fr/guichet-de-nuit" />
      </Helmet>

      <section
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '160px 24px 80px',
          background: 'linear-gradient(180deg, #05060F 0%, #0A0A0A 100%)',
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 18 }}>
            LE GUICHET DE NUIT
          </p>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 14 }}>
            Cette adresse a changé
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
            Les demandes en urgence, la nuit et le dimanche, passent désormais par
            le Guichet de Nuit. Vous y êtes conduit automatiquement.
          </p>
          <Link to="/guichet-de-nuit" className="btn-gold">
            Accéder au Guichet de Nuit
            <ArrowRight size={16} style={{ marginLeft: 8 }} />
          </Link>
        </div>
      </section>
    </>
  );
}

export default Urgence;
