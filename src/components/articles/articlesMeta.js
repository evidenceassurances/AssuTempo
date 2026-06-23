/* Modele de meta et utilitaires partages par les sous-composants de /articles.
   Additif uniquement : ne modifie pas la source de donnees des articles. */
import {
  AlertTriangle, ShoppingCart, Globe, FileText, Briefcase, Users, Gauge,
  ShieldAlert, Truck, ScrollText,
} from 'lucide-react';

export const EASE = [0.22, 1, 0.36, 1];

/* Variants reutilisables (cf. brief). On respecte prefers-reduced-motion en
   passant reduce : l'axe y est neutralise, l'opacite reste pour rester fluide. */
export function fadeUpVariants(reduce) {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  };
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/* Palette desaturee par categorie. L'or de marque (#C9A84C) reste reserve a la
   structure, aux liens et aux etats actifs. Les accents ci-dessous ne teintent
   que le tag et l'icone de categorie.
   Les cles "urgence", "achat", "international", "carte-grise" et "pro" viennent
   du brief. "pret" et "essai" sont ajoutes pour couvrir les 2 categories reelles
   supplementaires presentes dans les donnees, sans orpheliner d'article. */
export const CATEGORY_META = {
  urgence:       { key: 'urgence',       label: 'Urgence',       accent: '#D08A5E', Icon: AlertTriangle, subtitle: 'Fourrière, contrôle, immobilisation' },
  achat:         { key: 'achat',         label: 'Achat',         accent: '#CBA24E', Icon: ShoppingCart,  subtitle: "Véhicule d'occasion, particulier" },
  international:  { key: 'international',  label: 'International',  accent: '#5FA08C', Icon: Globe,         subtitle: 'Étranger, hors Europe' },
  'carte-grise': { key: 'carte-grise',    label: 'Carte grise',    accent: '#9E97B5', Icon: FileText,      subtitle: "En attente d'immatriculation" },
  pro:           { key: 'pro',            label: 'Pro',            accent: '#7E9AB8', Icon: Briefcase,     subtitle: 'Partenariat professionnel' },
  pret:          { key: 'pret',           label: 'Prêt',           accent: '#7E9B79', Icon: Users,         subtitle: 'Prêt entre proches, conducteur désigné' },
  essai:         { key: 'essai',          label: 'Essai',          accent: '#A88FB0', Icon: Gauge,         subtitle: 'Essai avant achat' },
  resiliation:   { key: 'resiliation',   label: 'Résiliation',   accent: '#C2705A', Icon: ShieldAlert,   subtitle: 'Résilié, réassurance, BCT' },
  utilitaire:    { key: 'utilitaire',    label: 'Utilitaire',    accent: '#6E92A8', Icon: Truck,         subtitle: 'Déménagement, camionnette' },
  succession:    { key: 'succession',    label: 'Succession',    accent: '#8E86A6', Icon: ScrollText,    subtitle: "Véhicule d'un proche décédé" },
};

export const FALLBACK_META = {
  key: 'autre', label: 'Conseils', accent: '#C9A84C', Icon: FileText, subtitle: 'Bon à savoir',
};

/* Normalisation insensible aux accents et a la casse (NFD + suppression des
   diacritiques) pour la recherche et le mapping de categorie. */
export function normalizeText(value = '') {
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/* Mappe le libelle de categorie reel des donnees vers une cle de CATEGORY_META. */
export function catKey(categorie = '') {
  const n = normalizeText(categorie);
  if (n.includes('urgence')) return 'urgence';
  if (n.includes('carte grise')) return 'carte-grise';
  if (n.includes('international')) return 'international';
  if (n.includes('convoyage') || n === 'pro' || n.startsWith('pro ')) return 'pro';
  if (n.includes('pret')) return 'pret';
  if (n.includes('essai')) return 'essai';
  if (n.includes('achat')) return 'achat';
  if (n.includes('resiliation') || n.includes('resilie')) return 'resiliation';
  if (n.includes('utilitaire')) return 'utilitaire';
  if (n.includes('succession') || n.includes('decede')) return 'succession';
  return 'autre';
}

export function getMeta(categorie) {
  return CATEGORY_META[catKey(categorie)] ?? FALLBACK_META;
}

/* Temps de lecture (~200 mots/min). On privilegie le readTime existant des
   donnees ; a defaut on calcule depuis le contenu, puis depuis l'extrait,
   avec un minimum de 1 min. */
export function getReadMinutes(article) {
  if (article.readTime) {
    const parsed = parseInt(article.readTime, 10);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }
  const text = article.contenu || article.extrait || '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/* Reponse encadree : champ reponseRapide s'il existe, sinon 1re phrase de l'extrait. */
export function getReponseRapide(article) {
  if (article.reponseRapide) return article.reponseRapide;
  const extrait = article.extrait || '';
  const match = extrait.match(/[^.!?]*[.!?]/);
  return (match ? match[0] : extrait).trim();
}

/* Liste ordonnee et unique des cles de categorie reellement presentes. */
export function presentCategoryKeys(articles) {
  const seen = [];
  for (const a of articles) {
    const k = catKey(a.categorie);
    if (!seen.includes(k)) seen.push(k);
  }
  return seen;
}
