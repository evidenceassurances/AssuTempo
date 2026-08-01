/**
 * Reponse 410 Gone pour les URLs definitivement supprimees de l'ancien
 * site WordPress (/sample-page, /helpie_faq/*). Le 410, contrairement au
 * 404, dit aux moteurs que la suppression est volontaire et definitive :
 * l'URL sort de l'index plus vite et n'est plus recrawlee.
 * Routees ici par les rewrites de vercel.json.
 */
module.exports = function handler(req, res) {
  res.status(410);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.send(
    '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">'
    + '<title>410 - Page supprimée | AssuTempo</title>'
    + '<meta name="robots" content="noindex"></head>'
    + '<body style="background:#0A0A0A;color:#EDEDED;font-family:system-ui,sans-serif;'
    + 'display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center">'
    + '<div><p style="color:#C9A84C;font-size:14px;letter-spacing:.2em;margin:0 0 12px">410</p>'
    + '<h1 style="font-size:22px;margin:0 0 12px">Cette page a été définitivement supprimée.</h1>'
    + '<p style="margin:0"><a href="https://assutempo.fr/" style="color:#C9A84C">Retour à l\'accueil AssuTempo</a></p>'
    + '</div></body></html>',
  );
};
