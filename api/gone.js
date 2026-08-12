/**
 * Reponse 410 Gone pour les URL de l'ancien WordPress qui n'ont pas
 * d'equivalent sur le site actuel.
 *
 * Pourquoi une fonction et pas vercel.json : le champ `redirects` ne produit
 * que des 3xx, et `rewrites` conserve le statut de la cible (200). Le seul
 * moyen de renvoyer un vrai 410 est de le poser dans une reponse. Les URL
 * concernees sont donc reecrites (rewrite) vers cet endpoint, qui repond 410.
 *
 * 410 plutot que 404 : la page a existe et ne reviendra pas. Google retire
 * une URL en 410 nettement plus vite qu'en 404, et cesse de la recrawler.
 * A ne PAS utiliser pour une URL qui a un equivalent : dans ce cas, 301.
 */

const HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<title>Page supprimee | AssuTempo</title>
<style>
  :root { color-scheme: dark; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center;
    justify-content: center; background: #0A0A0A; color: #F5F5F5;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    text-align: center; padding: 24px;
  }
  main { max-width: 520px; }
  .code { font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: #C9A84C; margin: 0 0 18px; }
  h1 { font-size: clamp(26px, 5vw, 38px); font-weight: 800; letter-spacing: -0.02em; margin: 0 0 14px; }
  p { font-size: 15px; line-height: 1.75; color: #A0A0A0; margin: 0 0 28px; }
  .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  a {
    display: inline-block; padding: 13px 24px; border-radius: 999px;
    font-size: 15px; font-weight: 600; text-decoration: none;
  }
  .gold { background: linear-gradient(135deg, #E8C97A, #C9A84C); color: #0A0A0A; }
  .glass { border: 1px solid rgba(201,168,76,0.35); color: #E8C97A; }
</style>
</head>
<body>
<main>
  <p class="code">Erreur 410</p>
  <h1>Cette page a ete supprimee</h1>
  <p>
    Elle appartenait a l'ancien site et n'a pas d'equivalent aujourd'hui.
    Le devis d'assurance temporaire et les reponses aux questions frequentes
    se trouvent ci-dessous.
  </p>
  <div class="actions">
    <a class="gold" href="/tarification">Obtenir mon devis</a>
    <a class="glass" href="/faq">Questions frequentes</a>
  </div>
</main>
</body>
</html>
`;

module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex');
  /* Pas de cache long : si une de ces URL redevenait utile, un 410 fige dans
     les CDN serait penible a rattraper. */
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
  res.statusCode = 410;
  res.end(HTML);
};
