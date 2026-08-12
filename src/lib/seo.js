/* Serialisation sure d'un objet vers un <script type="application/ld+json">.
   JSON.stringify n'echappe pas "<" : un "</script>" present dans une donnee
   fermerait le script inline et casserait la page. < est du JSON valide,
   lu a l'identique par Google et tous les parseurs. */
export function jsonLd(schema) {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}

/* BreadcrumbList a partir d'une liste d'etapes { name, path }. `path` est
   relatif (ex. '/carte/espagne') ; l'URL absolue est reconstruite ici pour
   que chaque page appelante n'ait plus a la recopier a la main. */
const SITE_ORIGIN = 'https://assutempo.fr';

export function breadcrumbJsonLd(steps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: steps.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: `${SITE_ORIGIN}${step.path === '/' ? '/' : step.path}`,
    })),
  };
}
