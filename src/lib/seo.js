/* Serialisation sure d'un objet vers un <script type="application/ld+json">.
   JSON.stringify n'echappe pas "<" : un "</script>" present dans une donnee
   fermerait le script inline et casserait la page. < est du JSON valide,
   lu a l'identique par Google et tous les parseurs. */
export function jsonLd(schema) {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
